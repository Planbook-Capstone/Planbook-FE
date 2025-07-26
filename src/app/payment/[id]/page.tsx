"use client";

import React from "react";
import { useParams } from "next/navigation";
import PaymentTemplate from "@/components/templates/payment-template";
import { useOrderDetailService } from "@/services/orderServices";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useOrderDetailService(id);

  console.log(data?.data, "data");

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Use real data from API
  const paymentData = data?.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PaymentTemplate paymentData={paymentData} />
    </div>
  );
};

export default PaymentDetailPage;
