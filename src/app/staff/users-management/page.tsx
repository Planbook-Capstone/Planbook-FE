"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/organisms/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/FormField";
import { User, mockUsers, roleOptions, roleLabels } from "@/data/users";
import { Plus, Users, Eye, UserX, UserCheck, Search } from "lucide-react";

const ITEMS_PER_PAGE = 10;

// Filter options for role
const filterOptions = [
  { value: "all", label: "Tất cả vai trò" },
  ...roleOptions,
];

export default function StaffUsersManagementPage() {
  // State management
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter (email, username, or fullName)
      const searchMatch =
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchValue.toLowerCase());

      // Role filter
      const roleMatch = filterValue === "all" || user.role === filterValue;

      return searchMatch && roleMatch;
    });
  }, [users, searchValue, filterValue]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Họ và tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      errors.email = "Email là bắt buộc";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Email không đúng định dạng";
    }

    if (!formData.username.trim()) {
      errors.username = "Username là bắt buộc";
    } else if (formData.username.length < 3) {
      errors.username = "Username phải có ít nhất 3 ký tự";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.role) {
      errors.role = "Vai trò là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleCreateUser = () => {
    if (!validateForm()) return;

    const newUser: User = {
      id: `uuid-${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
      role: formData.role as User["role"],
      isDisabled: false,
    };

    setUsers((prev) => [...prev, newUser]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleToggleUserStatus = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isDisabled: !u.isDisabled } : u
      )
    );
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      username: "",
      password: "",
      role: "",
    });
    setFormErrors({});
  };

  // Table columns definition
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "Họ và tên",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 font-questrial">
          {row.getValue("fullName")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-gray-600 font-questrial">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="text-gray-600 font-questrial">
          {row.getValue("username")}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => {
        const role = row.getValue("role") as keyof typeof roleLabels;
        const roleColors = {
          admin: "bg-orange-100 text-orange-800",
          staff: "bg-blue-100 text-blue-800",
          teacher: "bg-yellow-100 text-yellow-800",
          "tool-manager": "bg-purple-100 text-purple-800",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}
          >
            {roleLabels[role]}
          </span>
        );
      },
    },
    {
      accessorKey: "isDisabled",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isDisabled = row.getValue("isDisabled");
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isDisabled
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {isDisabled ? "Đã vô hiệu hóa" : "Hoạt động"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewUser(user)}
              className="p-2 hover:bg-blue-50 hover:text-blue-600"
              title="Xem chi tiết"
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleUserStatus(user)}
              className={`p-2 ${
                user.isDisabled
                  ? "hover:bg-green-50 hover:text-green-600"
                  : "hover:bg-red-50 hover:text-red-600"
              }`}
              title={user.isDisabled ? "Kích hoạt" : "Vô hiệu hóa"}
            >
              {user.isDisabled ? <UserCheck size={16} /> : <UserX size={16} />}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-gray-200">
        <div className="mx-auto px-0 py-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc username..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 min-w-xs"
                />
              </div>

              {/* Filter Select */}
              <div className="w-full sm:w-48">
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Tạo người dùng mới
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-0 py-2">
        {/* Users Table */}

        <DataTable columns={columns} data={filteredUsers} />
      </div>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-calsans">
              Tạo người dùng mới
            </DialogTitle>
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
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreateUser}>Tạo mới</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-calsans">
              Chi tiết người dùng
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Họ và tên
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedUser.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <p className="font-questrial text-gray-900">
                    {selectedUser.username}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Vai trò
                  </label>
                  <p className="font-questrial text-gray-900">
                    {roleLabels[selectedUser.role]}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Trạng thái
                  </label>
                  <p
                    className={`font-questrial ${
                      selectedUser.isDisabled
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedUser.isDisabled ? "Đã vô hiệu hóa" : "Hoạt động"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
