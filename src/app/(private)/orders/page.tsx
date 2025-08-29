import OrderCard from "@/components/order-card";
import { fetchOrders } from "@/lib/orders/api";
import React from "react";

export default async function OrdersPage() {
  const orders = await fetchOrders();
  if(orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-muted-foreground">注文履歴はありません</div>
      </div>
    );
  }
  return (
    <>
      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </>
  );
}
