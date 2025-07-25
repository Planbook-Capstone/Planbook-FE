import React from "react";
import QRCodeComponent from "@/components/ui/qr-code";
import { Badge } from "@/components/ui/badge";

interface PaymentData {
  id: string;
  userId: string;
  amount: number;
  status: string;
  checkoutUrl: string;
  qrCode: string;
  createdAt: string | null;
  updatedAt: string | null;
  subscriptionPackage: {
    id: string;
    name: string;
    tokenAmount: number;
    price: number;
    description: string;
    highlight: boolean;
    priority: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    features: Record<string, string>;
  };
  orderHistories: Array<{
    id: string;
    orderId: string;
    fromStatus: string | null;
    toStatus: string;
    note: string;
    createdAt: string | null;
    updatedAt: string | null;
  }>;
  transactions: Array<{
    id: string;
    orderId: string;
    amount: number;
    status: string;
    parentTransactionId: string | null;
    payosOrderCode: number;
    gateway: string;
    checkoutUrl: string;
    qrCode: string;
    payosTransactionId: string;
    description: string;
    failureReason: string | null;
    webhookPayload: string | null;
    expiredAt: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface PaymentTemplateProps {
  paymentData: PaymentData;
}

function PaymentTemplate({ paymentData }: PaymentTemplateProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  console.log(paymentData, "paymentData");
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Thông tin đơn hàng
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="warning">Chưa thanh toán</Badge>
            </div>
          </div>

          {/* Section: Thông tin khách hàng */}
          <div className="mb-5 space-y-1 ">
            <p className="text-sm text-gray-500 font-medium">Khách hàng:</p>
            <p className="text-base font-bold">Nguyễn Văn A</p>
            <p className="text-sm text-gray-700">nguyenvana@gmail.com</p>
          </div>

          {/* Section: Thông tin đơn hàng */}
          <div className="mb-5 space-y-1">
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-500 font-medium">Gói dịch vụ:</p>
              <p className="text-base font-bold">
                {paymentData?.subscriptionPackage?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="text-sm text-gray-500 font-medium">Mô tả:</p>
              <p className="text-sm font-semibold">Thanh toán PlanBookAI</p>
            </div>
            <p className="text-sm text-gray-500 font-medium">Mã đơn hàng:</p>
            <p className="text-sm font-mono">{paymentData?.id}</p>
            <p className="text-sm text-gray-500 font-medium">Ngày tạo đơn:</p>
            <p className="text-sm">{formatDateTime(paymentData?.createdAt)}</p>
          </div>

          {/* Section: Hướng dẫn */}
          <div className="mt-6 text-sm text-gray-600 italic">
            Vui lòng mở ứng dụng ngân hàng và quét mã QR bên phải để thanh toán.
            Sau khi hoàn tất, hệ thống sẽ tự động xác nhận đơn hàng.
          </div>
        </div>

        {/* Right Column - QR Code */}
        <div className="col-span-1 flex justify-center items-start">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg mb-4 bg-white">
              {paymentData?.qrCode && (
                <QRCodeComponent
                  value={paymentData?.qrCode}
                  size={200}
                  className="shadow-sm"
                />
              )}
              <p className="text-sm text-gray-500">Số tiền cần thanh toán:</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(paymentData?.amount)}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Hết hạn: {formatDateTime(paymentData?.transactions[0]?.expiredAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentTemplate;
