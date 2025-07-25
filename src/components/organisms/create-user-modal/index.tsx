"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

function CreateUserModal({
  open,
  onClose,
  onSubmit = () => {},
}: CreateUserModalProps) {
  const handleSubmit = (data: any) => {
    console.log("Modal received data:", data);
    onSubmit?.(data);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-calsans">Tạo người dùng mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Họ và tên"
              htmlFor="fullName"
              error={formErrors.fullName}
            >
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                placeholder="Nhập họ và tên"
              />
            </FormField>

            <FormField label="Email" htmlFor="email" error={formErrors.email}>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Nhập địa chỉ email"
              />
            </FormField>

            <FormField
              label="Username"
              htmlFor="username"
              error={formErrors.username}
            >
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                placeholder="Nhập username"
              />
            </FormField>

            <FormField
              label="Mật khẩu"
              htmlFor="password"
              error={formErrors.password}
            >
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Nhập mật khẩu"
              />
            </FormField>

            <FormField label="Vai trò" htmlFor="role" error={formErrors.role}>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>Tạo mới</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateUserModal;
