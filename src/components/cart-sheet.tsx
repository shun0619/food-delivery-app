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
import { calculateItemTotal, calculateSubTotal } from "@/lib/cart/utils";

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
  // const calculateItemTotal = (item: CartItem): number =>
  //   item.quantity * item.menus.price;

  // const calculateSubTotal = (items: CartItem[]) =>
  //   items.reduce((sum, item): number => sum + calculateItemTotal(item), 0);

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
      <SheetTrigger className="relative cursor-pointer group">
        <div className="p-3 rounded-full glass hover:shadow-modern transition-all duration-300 hover:scale-110">
          <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-200" />
        </div>
        <span className="absolute -top-1 -right-1 bg-gradient-primary rounded-full min-w-[20px] h-5 text-xs text-white flex items-center justify-center font-semibold shadow-modern animate-pulse">
          {count}
        </span>
      </SheetTrigger>

      <SheetContent className="p-0 glass border-0 shadow-modern-xl">
        <SheetHeader className="sr-only">
          <SheetTitle>カート</SheetTitle>
          <SheetDescription>
            カート内の商品を確認・編集できます。購入手続きに進むには「お会計に進む」へ。
          </SheetDescription>
        </SheetHeader>

        {cart ? (
          <>
            <div className="p-6 border-b border-border/50">
              <div className="flex justify-between items-center">
                <SheetClose asChild>
                  <Link
                    className="font-bold text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent hover:from-primary hover:to-primary/80 transition-all duration-300"
                    href={`/restaurant/${cart.restaurant_id}`}
                  >
                    {cart.restaurantName}
                  </Link>
                </SheetClose>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size={"icon"} className="hover:bg-destructive/10 hover:scale-110 transition-all duration-200">
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>ゴミ箱を空にする</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {/* メニューエリア */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.cart_items.map((item, index) => (
                <div key={item.id} className="glass rounded-xl p-4 hover:shadow-modern transition-all duration-300 animate-in slide-in-from-right-4" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.menus.photoUrl}
                        alt={item.menus.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate mb-1">{item.menus.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">￥{item.menus.price}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`quantity-${item.id}`} className="text-xs text-muted-foreground">
                            数量:
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            name="quantity"
                            className="glass border-0 rounded-lg px-3 py-1 text-sm font-medium hover:shadow-modern transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateCartItem(e.target.value, item.id)
                            }
                          >
                            <option value="0">削除</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">￥{calculateItemTotal(item).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-border/50 space-y-4">
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">小計</span>
                  <span className="text-2xl font-bold text-primary">￥{calculateSubTotal(cart.cart_items).toLocaleString()}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>配送料・税込み</span>
                </div>
              </div>
              <SheetClose asChild>
                <Button asChild className="w-full h-12 bg-gradient-primary hover:bg-gradient-primary text-white font-semibold text-lg shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:scale-[1.02] rounded-xl">
                  <Link href={`/restaurant/${cart.restaurant_id}/checkout`}>
                    <div className="flex items-center justify-center space-x-2">
                      <span>お会計に進む</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
            <div className="animate-float">
              <Image src={"/trolley.png"} width={192} height={192} alt="カート" className="opacity-60" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">商品をカートに追加しよう</h2>
              <p className="text-muted-foreground">美味しい料理を選んでカートに入れてください</p>
            </div>
            <SheetClose asChild>
              <Button className="bg-gradient-primary hover:bg-gradient-primary text-white font-semibold px-8 py-3 rounded-full shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>お買い物を開始する</span>
                </div>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
