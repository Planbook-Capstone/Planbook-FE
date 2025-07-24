import React from "react";
import { Package, CreditCard } from "lucide-react";
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Left Column - Order Details */}
        <div className="col-span-2 lg:col-span-3 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-calsans mb-4">Thông tin đơn hàng</h2>
            <div className="flex justify-between items-center gap-2">
              <p className="text-sm font-bold">Trạng thái đơn hàng</p>
              <Badge variant={"warning"}>Chưa thanh toán</Badge>
            </div>
          </div>

          <div className="space-y-4 ">
            {/* Main subscription package */}
            <div className="flex flex-col items-start gap-3  bg-gray-50 rounded-lg">
              <div>
                <p>
                  Số tiền thanh toán: <span className="font-bold">5000</span>
                </p>
              </div>
              <div>
                <p>
                  Mã đơn hàng:{" "}
                  <span className="font-bold">
                    5e38350d-e7c9-4f1c-af57-8f2902b235ef
                  </span>
                </p>
              </div>
              <div>
                <p>
                  Mô tả:{" "}
                  <span className="font-bold">Thanh toán PlanBookAI</span>
                </p>
              </div>
              {/* <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(paymentData.subscriptionPackage.price)}
                </div>
                <div className="text-sm text-gray-500 line-through">
                  {formatCurrency(paymentData.subscriptionPackage.price * 1.2)}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Column - QR Code */}
        <div className="flex justify-center items-center">
          <div className="text-center">
            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <QRCodeComponent
                  value={paymentData.qrCode}
                  size={200}
                  className="shadow-sm"
                />
              </div>
            </div>

            {/* Expiry Info */}
            <p className="text-xs text-gray-500">
              Hết hạn: {formatDateTime(paymentData.transactions[0]?.expiredAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentTemplate;
