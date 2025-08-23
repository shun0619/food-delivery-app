'use client'
import { Cart } from "@/types";
import useSWR from "swr";

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  };

export function useCart(restaurantId?:string, enableSWR = true){

    const {
        data:carts,
        error:cartsError,
        isLoading,
        mutate:mutateCart,
    } = useSWR<Cart[]>(`/api/cart`,fetcher,
      {
        isPaused: () => !enableSWR,
      }
    )

    const targetCart =  restaurantId ? carts?.find((cart) => cart.restaurant_id === restaurantId) ?? null : null;

    return {carts,cartsError,isLoading,mutateCart,targetCart}
}