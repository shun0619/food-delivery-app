import { Cart, CartItem } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateCartItemAction } from "@/app/(private)/actions/cartActions";
import { KeyedMutator } from "swr";

interface cartSheetProps {
  cart: Cart | null;
  count: number;
  isOpen: boolean;
  closeCart: () => void;
  openCart: () => void;
  mutateCart: KeyedMutator<Cart[]>;
}

export default function CartSheet({
  cart,
  count,
  isOpen,
  closeCart,
  openCart,
  mutateCart,
}: cartSheetProps) {
  const calculateItemTotal = (item: CartItem): number =>
    item.quantity * item.menus.price;

  const calculateSubTotal = (items: CartItem[]) =>
    items.reduce((sum, item): number => sum + calculateItemTotal(item), 0);

  const handleUpdateCartItem = async (value: string, cartItemId: number) => {
    if (!cart) return;
    const quantity = Number(value);

    try {
      await updateCartItemAction(Number(quantity), cartItemId, cart.id);

      const copyCart = { ...cart };
      if (quantity === 0) {
        //削除処理
        if (cart.cart_items.length === 1) {
          closeCart();
          //カート自体を削除
          setTimeout(() => {
            mutateCart(
              (prevCarts) => prevCarts?.filter((c) => c.id !== cart.id),
              false
            );
          }, 200);
          return;
        }
        //カート内のアイテムを削除
        copyCart.cart_items = cart.cart_items.filter(
          (item) => item.id !== cartItemId
        );

        mutateCart(
          (prevCarts) =>
            prevCarts?.map((c) => (c.id === copyCart.id ? copyCart : c)),
          false
        );
        return;
      }

      // 数量更新
      copyCart.cart_items = copyCart.cart_items.map((item) =>
        item.id === cartItemId ? { ...item, quantity: quantity } : item
      );
      mutateCart(
        (prevCarts) =>
          prevCarts?.map((c) => (c.id === copyCart.id ? copyCart : c)),
        false
      );
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    }
  };
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openCart() : closeCart())}
    >
      <SheetTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          {count}
        </span>
      </SheetTrigger>

      <SheetContent className="p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>カート</SheetTitle>
          <SheetDescription>
            カート内の商品を確認・編集できます。購入手続きに進むには「お会計に進む」へ。
          </SheetDescription>
        </SheetHeader>

        {cart ? (
          <>
            <div className="flex justify-between items-center">
              <SheetClose asChild>
                <Link
                  className="font-bold text-2xl"
                  href={`/restaurant/${cart.restaurant_id}`}
                >
                  {cart.restaurantName}
                </Link>
              </SheetClose>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size={"icon"}>
                      <Trash2 color="red" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ゴミ箱を空にする</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* メニューエリア */}
            <ul className="flex-1 overflow-y-auto">
              {cart.cart_items.map((item) => (
                <li key={item.id} className="border-b py-5">
                  <div className="flex items-center justify-between">
                    <p>{item.menus.name}</p>
                    <div className="relative w-[72px] h-[72px]">
                      <Image
                        src={item.menus.photoUrl}
                        alt={item.menus.name}
                        fill
                        sizes="72px"
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`quantity-${item.id}`} className="sr-only">
                      数量
                    </label>
                    <select
                      id={`quantity-${item.id}`}
                      name="quantity"
                      className="border rounded-full pr-8 pl-4 bg-muted h-9"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateCartItem(e.target.value, item.id)
                      }
                    >
                      <option value="0">削除する</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <p>￥{calculateItemTotal(item).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center font-bold text-lg">
              <div>小計</div>
              <div>{calculateSubTotal(cart.cart_items).toLocaleString()}</div>
            </div>
            <SheetClose asChild>
              <Button asChild>
                <Link href={`/checkout/${cart.restaurant_id}`}>
                  お会計に進む
                </Link>
              </Button>
            </SheetClose>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Image src={"/trolley.png"} width={192} height={192} alt="カート" />
            <h2 className="text-xl font-bold">商品をカートに追加しよう</h2>
            <SheetClose asChild>
              <Button className="rounded-full">お買い物を開始する</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
