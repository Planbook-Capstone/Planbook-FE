import { useMemo } from "react";
import { Order } from "@/types/order";

interface UserStats {
  userId: string;
  totalOrders: number;
  paidOrders: number;
  totalSpent: number;
}

export function useOrderStats(orders: Order[]) {
  return useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        paidOrders: 0,
        totalRevenue: 0,
        conversionRate: 0,
        averageOrderValue: 0,
      };
    }

    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.status === "PAID").length;
    const totalRevenue = orders
      .filter((o) => o.status === "PAID")
      .reduce((sum, o) => sum + o.amount, 0);

    return {
      totalOrders,
      paidOrders,
      totalRevenue,
      conversionRate: totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0,
      averageOrderValue: paidOrders > 0 ? totalRevenue / paidOrders : 0,
    };
  }, [orders]);
}

export function useUserStats(orders: Order[]): UserStats[] {
  return useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    const userMap = new Map<string, UserStats>();

    orders.forEach((order) => {
      const userId = order.userId;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId,
          totalOrders: 0,
          paidOrders: 0,
          totalSpent: 0,
        });
      }

      const userData = userMap.get(userId)!;
      userData.totalOrders++;

      if (order.status === "PAID") {
        userData.paidOrders++;
        userData.totalSpent += order.amount;
      }
    });

    return Array.from(userMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );
  }, [orders]);
}
