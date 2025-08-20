"use client";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROLE_LABELS } from "@/constants";
import { UserWithWalletResponse } from "@/types";
interface UserDetailModalProps {
  user: UserWithWalletResponse;
  open: boolean;
  onClose: () => void;
}

function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case "ACTIVE":
        return { text: "Hoạt động", color: "text-green-600" };
      case "INACTIVE":
        return { text: "Chưa xác thực tài khoản", color: "text-gray-600" };
      case "DELETED":
        return { text: "Đã bị vô hiệu hóa", color: "text-red-600" };
      default:
        return { text: "Không xác định", color: "text-gray-600" };
    }
  };

  const statusDisplay = getStatusDisplay(user.status);

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-calsans">
              Chi tiết người dùng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Họ và tên
                </label>
                <p className="font-questrial text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="font-questrial text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Username
                </label>
                <p className="font-questrial text-gray-900">{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Vai trò
                </label>
                <p className="font-questrial text-gray-900">
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Trạng thái
                </label>
                <p className={`font-questrial ${statusDisplay.color}`}>
                  {statusDisplay.text}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserDetailModal;
