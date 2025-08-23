"use client";

import { useCart } from "@/hooks/cart/useCart";
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import React, { useEffect, useState } from "react";
import CartSheet from "./cart-sheet";
import CartDropDown from "./cart-dropdown";
import type { Cart } from "@/types";
import { useCartVisibility } from "@/app/context/cartContext";
import { useParams } from "next/navigation";

export default function Cart() {
  const { restaurantId } = useParams<{ restaurantId?: string }>();
  const { carts, cartsError, isLoading, mutateCart, targetCart } =
    useCart(restaurantId);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(
    carts,
    selectedCart,
    targetCart
  );
  const { isOpen, openCart, closeCart } = useCartVisibility();

  useEffect(() => {
    if (!carts || !selectedCart) return;
    const updatedCard =
      carts.find((cart) => cart.id === selectedCart.id) ?? null;

    setSelectedCart(updatedCard);
  }, [carts]);

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => setSelectedCart(null), 200);
  }, [isOpen]);

  if (cartsError) {
    return <div>{cartsError.message}</div>;
  }
  if (isLoading || !carts) {
    return <div>loading...</div>;
  }
  return displayMode === "cartSheet" ? (
    <CartSheet
      cart={sheetCart}
      count={cartCount}
      isOpen={isOpen}
      closeCart={closeCart}
      openCart={openCart}
      mutateCart={mutateCart}
    />
  ) : (
    <CartDropDown
      carts={carts}
      setSelectedCart={setSelectedCart}
      openCart={openCart}
    />
  );
}
