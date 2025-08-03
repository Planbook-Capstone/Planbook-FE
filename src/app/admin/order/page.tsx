"use client";
import OrderTable from "@/components/organisms/table-order-history";
import { useOrdersWithParamsService } from "@/services/orderServices";
import { useState } from "react";

function OrderManagementPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { data: ordersData, refetch } = useOrdersWithParamsService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      offset: currentPage +1,
      pageSize: pageSize,
      sort: "createdAt,desc",
    } // pagination params
  );

  console.log(ordersData);
  return (
    <div>
      <OrderTable
        orders={ordersData?.data?.content || []}
        onViewDetail={() => {}}
        mode="admin"
      />
    </div>
  );
}

export default OrderManagementPage;
