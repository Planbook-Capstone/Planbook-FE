"use client";
import OrderTable from "@/components/organisms/table-order-history";
import { useOrdersWithParamsService } from "@/services/orderServices";
import { useState } from "react";
import OrderDetailModal from "@/components/molecules/order-detail-modal";
import { Order } from "@/types";

function OrderManagementPage() {
  const [currentPage, setCurrentPage] = useState(0);
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
      offset: currentPage + 1,
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
