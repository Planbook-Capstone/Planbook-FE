"use client";

import React, { useMemo } from "react";
import { UserWithWalletResponse } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllUsersService } from "@/services/userService";

interface UserStats {
  userId: string;
  user?: UserWithWalletResponse;
  totalOrders: number;
  paidOrders: number;
  totalSpent: number;
}

interface UserStatsTableProps {
  userStats: UserStats[];
}

export function UserStatsTable({ userStats }: UserStatsTableProps) {
  // Fetch all users for user information
  const { data: allUsersData } = useAllUsersService();

  // Map user stats with user data and only show top 5
  const topUsers = useMemo(() => {
    if (!allUsersData?.data?.content) {
      return userStats.slice(0, 5);
    }

    // Create user lookup map
    const usersMap = new Map<string, UserWithWalletResponse>();
    allUsersData.data.content.forEach((user: UserWithWalletResponse) => {
      usersMap.set(user.id, user);
    });

    // Map user stats with user data
    const enrichedUserStats = userStats.map((stat) => ({
      ...stat,
      user: usersMap.get(stat.userId),
    }));

    return enrichedUserStats.slice(0, 5);
  }, [userStats, allUsersData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-calsans text-gray-900">Top 5 Khách hàng</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn thành công
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng chi tiêu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topUsers.map((user, index) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mr-3">
                      {index + 1}
                    </span>
                    {user.user ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.user.avatar || "/images/avatarLogo.png"}
                            alt={user.user.fullName || user.user.username}
                          />
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                            {user.user.fullName
                              ? user.user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : user.user.username?.slice(0, 2).toUpperCase() ||
                                "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {user.user.fullName || user.user.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.user.email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {user.userId.slice(0, 8)}... (Không tìm thấy)
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.paidOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(user.totalSpent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
