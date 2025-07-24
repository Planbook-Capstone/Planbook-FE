import { Button } from "@/components/ui/Button";
import { OrderHistoryResponse } from "@/types";

interface OrderCardProps {
  orderStatus: OrderHistoryResponse;
}

function OrderCard({ orderStatus }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
            {orderStatus.orderId.slice(0, 2).toUpperCase()}
          </div> */}
          <div>
            <h3 className="font-semibold text-gray-900">
              Order #{orderStatus?.orderId}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(orderStatus.createdAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              orderStatus.toStatus
            )}`}
          >
            {orderStatus.toStatus.replace("_", " ")}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            {formatTime(orderStatus.createdAt)}
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="mb-4">
        <p className="text-gray-700">
          <span className="font-bold">Ghi chú:</span>
          {" " + orderStatus.note}
        </p>
      </div>

      {/* Status Transition */}
      {orderStatus.fromStatus && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Status changed from{" "}
            <span className="font-medium">{orderStatus.fromStatus}</span> to{" "}
            <span className="font-medium">{orderStatus.toStatus}</span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end items-center gap-2 w-full">
        <Button variant={"outline"}>Chi tiết</Button>
        <Button>Theo dõi đơn hàng</Button>
      </div>
    </div>
  );
}

export default OrderCard;
