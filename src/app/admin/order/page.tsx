"use client";
import OrderTable from "@/components/organisms/table-order-history";
import { useOrdersWithParamsService } from "@/services/orderServices";
import { useState } from "react";
import OrderDetailModal from "@/components/molecules/order-detail-modal";
import { Order } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
function OrderManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const { data: ordersData, refetch } = useOrdersWithParamsService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      offset: currentPage,
      pageSize: pageSize,
      sort: "createdAt,desc",
    } // pagination params
  );


  return (
    <div>
      <OrderTable
        orders={ordersData?.data?.content || []}
        onViewDetail={handleViewDetail}
        mode="admin"
      />
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default OrderManagementPage;
