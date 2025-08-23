import { ShoppingCart } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cart, CartItem } from "@/types";

interface CartsDropDownProps {
  carts: Cart[];
  setSelectedCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  openCart: () => void;
}

export default function CartDropDown({
  carts,
  setSelectedCart,
  openCart,
}: CartsDropDownProps) {
  const calculateItemTotal = (item: CartItem): number =>
    item.quantity * item.menus.price;

  const calculateSubTotal = (items: CartItem[]) =>
    items.reduce((sum, item): number => sum + calculateItemTotal(item), 0);

  const calculateTotalQuantity = (items: CartItem[]) =>
    items.reduce((sum, item): number => sum + item.quantity, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative cursor-pointer">
        <ShoppingCart />
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full size-4 text-xs text-primary-foreground flex items-center justify-center">
          {carts.length}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[420px]">
        {carts.map((cart) => (
          <DropdownMenuItem
            key={cart.id}
            className="flex items-center p-4 justify-between"
            onClick={() => {
              setSelectedCart(cart);
              openCart();
            }}
          >
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="w-[64px] h-[64px] relative overflow-hidden rounded-full flex-none">
                <Image
                  fill
                  src={cart.photoUrl}
                  alt={cart.restaurantName ?? "レストラン名"}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base ">{cart.restaurantName}</p>
                <p>
                  小計: ￥{calculateSubTotal(cart.cart_items).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center size-7 font-medium rounded-full bg-primary text-popover text-xs">
              {calculateTotalQuantity(cart.cart_items)}
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
