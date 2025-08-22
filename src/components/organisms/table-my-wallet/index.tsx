"use client";

import { WalletTransaction } from "@/types";
import { DataTable } from "../data-table";
import { walletColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface TableMyWalletProps {
  transactions: WalletTransaction[];
  onSelectionChange?: (selectedRows: Row<WalletTransaction>[]) => void;
}

export default function TableMyWallet({
  transactions,
  onSelectionChange,
}: TableMyWalletProps) {
  const handleExportData = () => {
    if (!transactions || transactions.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    // Create CSV content
    const headers = [
      "Thời gian",
      "Loại giao dịch",
      "Mô tả",
      "Token trước",
      "Thay đổi",
      "Token sau",
      "Mã đơn hàng",
    ];

    const csvContent = [
      headers.join(","),
      ...transactions.map((transaction) =>
        [
          `"${new Date(transaction.createdAt).toLocaleString("vi-VN")}"`,
          `"${transaction.type === "RECHARGE" ? "Nạp token" : "Sử dụng tool"}"`,
          `"${transaction.description}"`,
          transaction.tokenBefore,
          transaction.tokenChange,
          transaction.tokenBefore + transaction.tokenChange,
          `"${transaction.orderId}"`,
        ].join(",")
      ),
    ].join("\n");

    // Download CSV with UTF-8 BOM for proper Vietnamese character encoding
    const BOM = "\uFEFF"; // UTF-8 BOM
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `wallet-transactions-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log(transactions,"thy")
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Lịch sử ví</h2>
          <p className="text-sm text-gray-500">
            Tổng cộng {transactions?.totalElements || "0"} giao dịch
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportData}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Xuất CSV
        </Button>
      </div>

      <DataTable
        columns={walletColumns}
        data={transactions?.content || []}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}
