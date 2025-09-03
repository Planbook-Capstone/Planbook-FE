"use client";

import React, { useMemo } from "react";
import { Order } from "@/types/order";
import { UserWithWalletResponse } from "@/types";
import { useAllUsersService } from "@/services/userService";
import { PackageStatsTable } from "./PackageStatsTable";
import { UserStatsTable } from "./UserStatsTable";

interface OrderStatsTableProps {
  orders: Order[];
}

interface PackageStats {
  packageName: string;
  packageId: string;
  totalOrders: number;
  paidOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
}

interface UserStats {
  userId: string;
  user?: UserWithWalletResponse;
  totalOrders: number;
  paidOrders: number;
  totalSpent: number;
}

export function OrderStatsTable({ orders }: OrderStatsTableProps) {
  // Fetch all users for user information
  const { data: allUsersData } = useAllUsersService();

  const { packageStats, userStats, overallStats } = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { packageStats: [], userStats: [], overallStats: null };
    }

    // Create user lookup map
    const usersMap = new Map<string, UserWithWalletResponse>();
    if (allUsersData?.data?.content) {
      allUsersData.data.content.forEach((user: UserWithWalletResponse) => {
        usersMap.set(user.id, user);
      });
    }

    // Package statistics
    const packageMap = new Map<string, PackageStats>();
    const userMap = new Map<string, UserStats>();

    orders.forEach((order) => {
      const packageId = order.subscriptionPackage.id;
      const packageName = order.subscriptionPackage.name;
      const userId = order.userId;

      // Package stats
      if (!packageMap.has(packageId)) {
        packageMap.set(packageId, {
          packageName,
          packageId,
          totalOrders: 0,
          paidOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          conversionRate: 0,
          averageOrderValue: 0,
        });
      }

      const packageData = packageMap.get(packageId)!;
      packageData.totalOrders++;

      if (order.status === "PAID") {
        packageData.paidOrders++;
        packageData.totalRevenue += order.amount;
      } else if (["CANCELLED", "EXPIRED", "FAILED"].includes(order.status)) {
        packageData.cancelledOrders++;
      }

      // User stats
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId,
          user: usersMap.get(userId),
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

    // Calculate conversion rates and averages
    const packageStats = Array.from(packageMap.values())
      .map((pkg) => ({
        ...pkg,
        conversionRate:
          pkg.totalOrders > 0 ? (pkg.paidOrders / pkg.totalOrders) * 100 : 0,
        averageOrderValue:
          pkg.paidOrders > 0 ? pkg.totalRevenue / pkg.paidOrders : 0,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    const userStats = Array.from(userMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    // Overall statistics
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.status === "PAID").length;
    const totalRevenue = orders
      .filter((o) => o.status === "PAID")
      .reduce((sum, o) => sum + o.amount, 0);

    const overallStats = {
      totalOrders,
      paidOrders,
      totalRevenue,
      conversionRate: totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0,
      averageOrderValue: paidOrders > 0 ? totalRevenue / paidOrders : 0,
    };

    return { packageStats, userStats, overallStats };
  }, [orders, allUsersData]);

  if (!overallStats) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Không có dữ liệu để hiển thị thống kê
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Package Statistics Table */}
      <PackageStatsTable packageStats={packageStats} />
    </div>
  );
}
