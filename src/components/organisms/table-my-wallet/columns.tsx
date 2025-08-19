"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WalletTransaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export const walletColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Thời gian",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          <div className="font-medium">{date.toLocaleDateString("vi-VN")}</div>
          <div className="text-gray-500">
            {date.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại giao dịch",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const isRecharge = type === "RECHARGE";

      return <p>{isRecharge ? "Nạp token" : "Sử dụng tool"}</p>;
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[250px]" title={description}>
          <span className="block font-medium whitespace-normal break-words line-clamp-2">
            {description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "tokenBefore",
    header: "Token trước",
    cell: ({ row }) => {
      const tokenBefore = row.getValue("tokenBefore") as number;
      return (
        <div className="text-right font-mono text-sm">
          {tokenBefore.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "tokenChange",
    header: "Thay đổi",
    cell: ({ row }) => {
      const tokenChange = row.getValue("tokenChange") as number;
      const type = row.getValue("type") as string;
      const isToolUsage = type !== "RECHARGE"; // "Sử dụng tool"

      // For tool usage, always show negative and red
      // For recharge, show positive and green
      const displayValue = isToolUsage
        ? -Math.abs(tokenChange)
        : Math.abs(tokenChange);
      const isPositive = !isToolUsage && tokenChange > 0;

      return (
        <div
          className={`text-right font-mono text-sm font-semibold ${
            isToolUsage
              ? "text-red-600"
              : isPositive
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {isToolUsage ? "-" : isPositive ? "+" : ""}
          {Math.abs(displayValue).toLocaleString()}
        </div>
      );
    },
  },
  {
    id: "tokenAfter",
    header: "Token sau",
    cell: ({ row }) => {
      const tokenBefore = row.getValue("tokenBefore") as number;
      const tokenChange = row.getValue("tokenChange") as number;
      const type = row.getValue("type") as string;
      const isToolUsage = type !== "RECHARGE"; // "Sử dụng tool"

      // For tool usage, subtract the token change; for recharge, add it
      const tokenAfter = isToolUsage
        ? tokenBefore - Math.abs(tokenChange)
        : tokenBefore + Math.abs(tokenChange);

      return (
        <div className="text-right font-mono text-sm font-bold">
          {tokenAfter.toLocaleString()}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "id",
  //   header: "Mã đơn hàng",
  //   cell: ({ row }) => {
  //     const orderId = row.getValue("id") as string;
  //     const shortId = orderId.slice(0, 8) + "...";

  //     return (
  //       <div className="font-mono text-xs text-gray-500" title={orderId}>
  //         {shortId}
  //       </div>
  //     );
  //   },
  // },
];
