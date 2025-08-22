"use client";

import {
  useWalletService,
  useWalletTransactionsService,
} from "@/services/walletServices";
import TableMyWallet from "@/components/organisms/table-my-wallet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { WalletTransaction } from "@/types";
import { useState } from "react";
const ranges = [
  { value: "TODAY", label: "Hôm nay" },
  { value: "YESTERDAY", label: "Hôm qua" },
  { value: "LAST_7_DAYS", label: "7 ngày qua" },
  { value: "LAST_30_DAYS", label: "30 ngày qua" },
  { value: "THIS_WEEK", label: "Tuần này" },
  { value: "LAST_WEEK", label: "Tuần trước" },
  { value: "THIS_MONTH", label: "Tháng này" },
  { value: "LAST_MONTH", label: "Tháng trước" },
  { value: "THIS_YEAR", label: "Năm nay" },
];
function WalletPage() {
  const { data: walletData } = useWalletService();
  const [value, setValue] = useState("TODAY");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const { data: walletTransaction } = useWalletTransactionsService(
    [value, currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      // userId: user?.id,
      page: currentPage, // API expects 1-based page numbering
      size: pageSize,
      timeRange: value,
      sortBy: "createdAt",
      sortDir: "desc",
    } // pagination params
  );

  const handlePageChange = (page: number) => {
    // Update current page state - this will trigger refetch automatically
    setCurrentPage(page);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Select
        value={value}
        onValueChange={(val) => {
          setValue(val);
          setCurrentPage(1); // reset lại page khi đổi range
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Chọn khoảng thời gian" />
        </SelectTrigger>
        <SelectContent>
          {ranges.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <TableMyWallet transactions={walletTransaction?.data || []} />

      {walletTransaction?.data && walletTransaction.data.totalPages > 1 && (
        <div data-tour="pagination" className="float-end mt-5 space-y-4">
          {/* Info text */}
          {/* <div className="text-center">
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">
                {walletTransaction.data.numberOfElements > 0
                  ? (walletTransaction.data.number * walletTransaction.data.size) + 1
                  : 0}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {Math.min(
                  (walletTransaction.data.number + 1) * walletTransaction.data.size,
                  walletTransaction.data.totalElements
                )}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium">{walletTransaction.data.totalElements}</span>{" "}
              kết quả
            </p>
          </div> */}

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {(() => {
                const totalPages = walletTransaction.data.totalPages;
                const pages = [];

                // Show first page
                if (totalPages > 0) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== 1) {
                            handlePageChange(1);
                          }
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Show ellipsis if needed
                if (currentPage > 3) {
                  pages.push(
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show pages around current page
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  if (i !== 1 && i !== totalPages) {
                    pages.push(
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i}
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== i) {
                              handlePageChange(i);
                            }
                          }}
                        >
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                }

                // Show ellipsis if needed
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show last page (if different from first)
                if (totalPages > 1) {
                  pages.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== totalPages) {
                            handlePageChange(totalPages);
                          }
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return pages;
              })()}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < walletTransaction.data.totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= walletTransaction.data.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default WalletPage;
