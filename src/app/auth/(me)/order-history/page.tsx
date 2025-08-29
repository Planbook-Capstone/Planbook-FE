"use client";

import {
  useOrderByUserIdService,
  useOrdersWithParamsService,
  useUpdateOrderStatus,
} from "@/services/orderServices";
import { useAuth } from "@/hooks/useAuth";
import OrderTable from "@/components/organisms/table-order-history";
import { Order } from "@/types";
import { useState, useEffect } from "react";
import OrderDetail from "@/components/molecules/order-detail";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
function OrderHistoryPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Order>();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { mutate: changeStatusMutation } = useUpdateOrderStatus();

  const handleViewDetail = (order: Order) => {
    // You can implement modal/drawer logic here
    setOpen(true);
    setSelected(order);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const {
    data: ordersData,
    refetch,
    isLoading,
    error,
  } = useOrdersWithParamsService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      userId: user?.id,
      offset: currentPage,
      pageSize: pageSize,
      sort: "createdAt,desc",
    } // pagination params
  );

  // Use API data if available
  const orders = ordersData?.data?.content || [];

  // Tự động mở chi tiết đơn hàng khi có orderId trong URL
  useEffect(() => {
    if (orderId && orders.length > 0) {
      const targetOrder = orders.find((order: Order) => order.id === orderId);
      if (targetOrder) {
        setSelected(targetOrder);
        setOpen(true);
        // Xóa orderId khỏi URL sau khi đã mở
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("orderId");
        window.history.replaceState({}, "", newUrl.toString());
      }
    }
  }, [orderId, orders]);

  const handleRetry = () => {
    changeStatusMutation(
      {
        id: String(selected?.id),
        field: "status",
        queryParams: { status: "RETRY" },
        body: {
          status: "RETRY",
          note: "Thanh toán lại",
        },
      },
      {
        onSuccess: (res) => {
          router.push(`${res?.data?.data?.checkoutUrl}`);

          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data || "Có lỗi xảy ra");
        },
      }
    );
  };

  const handleCancelOrder = (reason: string, customReason?: string) => {
    const cancelNote = customReason ? `${reason}. ${customReason}` : reason;

    changeStatusMutation(
      {
        id: String(selected?.id),
        field: "status",
        queryParams: { status: "CANCELLED" },
        body: {
          status: "CANCELLED",
          note: cancelNote,
        },
      },
      {
        onSuccess: (res) => {
          toast.success("Đã hủy đơn hàng thành công");
          setOpen(false);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Có lỗi xảy ra khi hủy đơn hàng"
          );
        },
      }
    );
  };

  if (selected && open) {
    return (
      <OrderDetail
        order={selected}
        open={open}
        onClose={() => setOpen(!open)}
        onRetry={handleRetry}
        onCancel={handleCancelOrder}
      />
    );
  }

  return (
    <div className="min-h-screen p-3">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-calsans text-gray-900">
          Lịch sử đơn hàng
        </h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      )}

      {/* Order Cards */}
      {!isLoading && !error && (
        <div>
          <OrderTable
            orders={orders}
            onViewDetail={handleViewDetail}
            mode="user"
          />
        </div>
      )}
      {ordersData?.data && ordersData.data.totalPages > 1 && (
        <div className="float-end mt-5 space-y-4">
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
                const totalPages = ordersData.data.totalPages;
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
                    if (currentPage < ordersData.data.totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= ordersData.data.totalPages
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

export default OrderHistoryPage;
