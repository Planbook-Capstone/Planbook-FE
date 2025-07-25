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

import { User, mockUsers, roleLabels } from "@/data/users";
import { Plus, Eye, UserX, UserCheck, Search } from "lucide-react";
import CreateUserModal from "@/components/organisms/create-user-modal";
import { roleOptions } from "@/schemas";
import UserTable from "@/components/organisms/user-table";

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

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter (email, username, or fullName)
      const searchMatch =
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchValue.toLowerCase());

      // Role filter
      const roleMatch =
        filterValue === "all" || user.role === filterValue.toLowerCase();

      return searchMatch && roleMatch;
    });
  }, [users, searchValue, filterValue]);

  // Handlers
  const handleCreateUser = () => {};

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
                  onChange={(e: any) => setSearchValue(e.target.value)}
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
        <UserTable users={filteredUsers} />
      </div>
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {/* View User Modal */}
      {/* <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
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
      </Dialog> */}
    </div>
  );
}
