"use server";

import { createClient } from "@/app/utils/supabase/server";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { Cart, Menu } from "@/types";
import { redirect } from "next/navigation";

type addToCartActionResponse = {
  type: "new";
  cart: Cart;
} | {
  type: "update";
  id: number;
};

export async function addToCartAction(
  selectedItem: Menu,
  quantity: number,
  restaurantId: string
): Promise<addToCartActionResponse> {
  const supabase = await createClient();
  const bucket = supabase.storage.from("menus");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: existingCart, error: existingCartError } = await supabase
    .from("carts")
    .select("id")
    .match({ user_id: user.id, restaurant_id: restaurantId })
    .maybeSingle();

  if (existingCartError) {
    console.error("カート情報の取得に失敗しました。", existingCartError);
    throw new Error("カート情報の取得に失敗しました。");
  }

  // 既存のカートが存在しない場合、新規でカートを作成してアイテムを追加
  if (!existingCart) {
    const { data: newCart, error: newCartError } = await supabase
      .from("carts")
      .insert({ restaurant_id: restaurantId, user_id: user.id })
      .select("id")
      .single();

    if (newCartError) {
      console.error("カートの作成に失敗しました。", newCartError);
      throw new Error("カートの作成に失敗しました。");
    }

    //　カートの中にアイテムを追加
    const { error: insertError } = await supabase.from("cart_items").insert({
      quantity: quantity,
      cart_id: newCart.id,
      menu_id: selectedItem.id,
    });

    if (insertError) {
      console.error("カートアイテムの追加に失敗しました。", insertError);
      throw new Error("カートアイテムの追加に失敗しました。");
    }

    const { data: insertedCart, error: insertedCartsError } = await supabase
      .from("carts")
      .select(
        `
        id,
        restaurant_id,
        cart_items (
          id,
          quantity,
          menus (
            id,
            name,
            price,
            image_path
          )
        )
      `
      )
      .match({ user_id: user.id, id: newCart.id })
      .single();

    if (insertedCartsError) {
      console.error("カートデータの取得に失敗しました。", insertedCartsError);
      throw new Error("カートデータの取得に失敗しました。");
    }

    const { data: restaurantData, error } = await getPlaceDetails(
      restaurantId,
      ["displayName", "photos"]
    );

    if (!restaurantData || error) {
      throw new Error(`レストランデータの取得に失敗しました。${error}`);
    }

    const updsatedCart = {
      ...insertedCart,
      cart_items: insertedCart.cart_items.map((item) => {
        const { image_path, ...restMenus } = item.menus;
        const publicUrl = bucket.getPublicUrl(item.menus.image_path).data
          .publicUrl;
        return {
          ...item,
          menus: {
            ...restMenus,
            photoUrl: publicUrl,
          },
        };
      }),
      restaurantName: restaurantData.displayName,
      photoUrl: restaurantData.photoUrl!,
    };

    return { type: "new", cart: updsatedCart };
  }

  // 既存のカートが存在する場合、アイテムを追加または数量を更新
  const { data, error: upsertError } = await supabase
    .from("cart_items")
    .upsert(
      {
        quantity: quantity,
        cart_id: existingCart.id,
        menu_id: selectedItem.id,
      },
      { onConflict: "menu_id,cart_id" }
    )
    .select("id")
    .single();

  if (upsertError) {
    console.error("カートアイテム追加・更新に失敗しました。", upsertError);
    throw new Error("カートアイテム追加・更新に失敗しました。");
  }

  return { type: "update", id: data.id };
}

// カート内のアイテムの数を更新
export async function updateCartItemAction(
  quantity: number,
  cartItemId: number,
  cartId: number
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }
  if (quantity === 0) {
    //　削除処理
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("id", cartItemId)
      .eq("cart_id", cartId);
    if (error) {
      console.error("カートアイテムの取得に失敗しました。", error);
      throw new Error("カートアイテムの取得に失敗しました。");
    }
    // カート自体を削除
    if (count === 1) {
      const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .match({ user_id: user.id, id: cartId });
      if (deleteCartError) {
        console.error("カートの削除に失敗しました。", deleteCartError);
        throw new Error("カートの削除に失敗しました。");
      }
      return;
    }

    // カートアイテムを削除
    const { error: deleteCartItemError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (deleteCartItemError) {
      console.error(
        "カートアイテムの削除に失敗しました。",
        deleteCartItemError
      );
      throw new Error("カートアイテムの削除に失敗しました。");
    }
    return;
  }

  // 数量更新処理
  const { error: updateCartItemError } = await supabase
    .from("cart_items")
    .update({ quantity: quantity })
    .eq("id", cartItemId);

  if (updateCartItemError) {
    console.error("カートアイテムの更新に失敗しました。", updateCartItemError);
    throw new Error("カートアイテムの更新に失敗しました。");
  }
}
