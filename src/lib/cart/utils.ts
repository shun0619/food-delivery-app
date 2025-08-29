import { Cart, CartItem } from "@/types";

export const sumItems = (cart_items: CartItem[]) =>
  cart_items.reduce((sum, item) => sum + item.quantity, 0);

 export const calculateItemTotal = (item: CartItem): number =>
    item.quantity * item.menus.price;

 export const calculateSubTotal = (items: CartItem[]) =>
    items.reduce((sum, item): number => sum + calculateItemTotal(item), 0);

export function computeCartDisplayLogic(
  carts: Cart[] | undefined,
  selectedCart: Cart | null,
  targetCart: Cart | null
) {
  // console.log("1", carts);
  // console.log(!carts);
  // console.log(carts?.length);
  //カートなし
  if (!carts || carts.length === 0) {
    return { displayMode: "cartSheet", sheetCart: null, cartCount: 0};
  }

  //カートが1つしかない場合
  if (carts.length === 1) {
    const only = carts[0];
    return {
      displayMode: "cartSheet",
      sheetCart: only,
      cartCount: sumItems(only.cart_items),
    };
  }

  // 選択されたカードがある場合
  if (selectedCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: selectedCart,
      cartCount: sumItems(selectedCart.cart_items),
    };
  }

  // targetがある場合
  if (targetCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: targetCart,
      cartCount: sumItems(targetCart.cart_items),
    };
  }

  return { displayMode: "cartDropDown", sheetCart: null, cartCount: 0 };
}
