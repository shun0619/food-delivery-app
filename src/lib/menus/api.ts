import { createClient } from "@/app/utils/supabase/server";
import { CategoryMenu, Menu } from "@/types";
import { redirect } from "next/navigation";

export async function fetchCategoryMenus(
  primaryTtpe: string,
  searchQuery?: string
) {
  const supabase = await createClient();
  const bucket = supabase.storage.from("menus");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  let query = supabase.from("menus").select("*").eq("genre", primaryTtpe);

  if (searchQuery) {
    query = query.like("name", `%${searchQuery}%`);
  }

  const { data: menus, error: menusError } = await query;

  if (menusError) {
    console.error("メニューの表示に失敗しました", menusError);
    return { error: "メニューの表示に失敗しました" };
  }

  if (menus.length === 0) {
    return { data: [] };
  }
  const categoryMenus: CategoryMenu[] = [];

  if (!searchQuery) {
    //注目商品の抽出
    const featuredItems = menus
      .filter((menu) => menu.is_featured)
      .map(
        (menu): Menu => ({
          id: menu.id,
          name: menu.name,
          price: menu.price,
          photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
        })
      );

    categoryMenus.push({
      id: "featured",
      categoryName: "注目商品",
      items: featuredItems,
    });
  }

  // カテゴリーごとの抽出
  const categories = Array.from(new Set(menus.map((menu) => menu.category)));

  for (const category of categories) {
    const Items = menus
      .filter((menu) => menu.category === category)
      .map(
        (menu): Menu => ({
          id: menu.id,
          name: menu.name,
          price: menu.price,
          photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
        })
      );

    categoryMenus.push({
      id: category,
      categoryName: category,
      items: Items,
    });
  }

  return { data: categoryMenus };
}
