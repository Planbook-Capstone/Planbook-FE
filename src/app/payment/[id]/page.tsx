"use client";

import React from 'react';
import PaymentTemplate from '@/components/templates/payment-template';

const PaymentDemoPage = () => {
  // Sample data based on your API response
  const samplePaymentData = {
    id: "10987341-3896-4ca1-9d01-748e7a9c7a02",
    userId: "b15c2276-ebd4-4ce2-b1ec-275b6cb536f0",
    amount: 5000.00,
    status: "PENDING",
    checkoutUrl: "https://pay.payos.vn/web/98a7a6a724e944c198fc8110ff488116",
    qrCode: "00020101021238590010A000000727012900069704180115V3CAS63603670280208QRIBFTTA5303704540450005802VN62370833CSBX9Y5GLS1 Thanh toan PlanBookAI63042BF2",
    createdAt: "2025-07-24T23:24:40.6422052",
    updatedAt: "2025-07-24T23:24:40.6422052",
    subscriptionPackage: {
      id: "6f7af286-2686-4043-8cac-dbe7bff95924",
      name: "Starter Pack",
      tokenAmount: 100,
      price: 5000.00,
      description: "Truy cập cơ bản cho người dùng mới",
      highlight: false,
      priority: 1,
      status: "ACTIVE",
      createdAt: "24-07-2025 14:40:38",
      updatedAt: "24-07-2025 14:40:38",
      features: {
        "1": "Truy cập ưu tiên vào AI",
        "2": "Hỗ trợ khách hàng qua email",
        "3": "Lịch sử trò chuyện giới hạn"
      }
    },
    orderHistories: [
      {
        id: "4df43fa1-e076-42de-97db-307db08325f3",
        orderId: "10987341-3896-4ca1-9d01-748e7a9c7a02",
        fromStatus: null,
        toStatus: "PENDING",
        note: "Tạo đơn hàng mới",
        createdAt: "2025-07-24T23:24:40.6422052",
        updatedAt: "2025-07-24T23:24:40.6422052"
      }
    ],
    transactions: [
      {
        id: "ed9c3f73-3071-4f20-8d5e-e2482d612edf",
        orderId: "10987341-3896-4ca1-9d01-748e7a9c7a02",
        amount: 5000.00,
        status: "PENDING",
        parentTransactionId: null,
        payosOrderCode: 1753374280380,
        gateway: "PAYOS",
        checkoutUrl: "https://pay.payos.vn/web/98a7a6a724e944c198fc8110ff488116",
        qrCode: "00020101021238590010A000000727012900069704180115V3CAS63603670280208QRIBFTTA5303704540450005802VN62370833CSBX9Y5GLS1 Thanh toan PlanBookAI63042BF2",
        payosTransactionId: "98a7a6a724e944c198fc8110ff488116",
        description: "Thanh toán PlanBookAI",
        failureReason: null,
        webhookPayload: null,
        expiredAt: "2025-07-24T23:39:40.6422052",
        createdAt: "2025-07-24T23:24:40.6422052",
        updatedAt: "2025-07-24T23:24:40.6422052"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PaymentTemplate paymentData={samplePaymentData} />
    </div>
  );
};

export default PaymentDemoPage;
