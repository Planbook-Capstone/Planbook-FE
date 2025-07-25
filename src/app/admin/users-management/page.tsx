"use client";

import React, { useState, useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User, mockUsers } from "@/data/users";
import { Plus, Search } from "lucide-react";
import CreateUserModal from "@/components/organisms/create-user-modal";
import { roleOptions, type CreateUserFormData } from "@/schemas";
import UserTable from "@/components/organisms/user-table";
import {
  useAllUsersService,
  useCreateUserService,
} from "@/services/userService";
import { toast } from "sonner";

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
  const { data: allUsers } = useAllUsersService();

  console.log(allUsers?.data?.content, "all");

  // API hooks
  const createUserMutation = useCreateUserService();

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
  const handleCreateUser = async (data: CreateUserFormData) => {
    createUserMutation.mutate(data, {
      onSuccess: (response) => {
        setIsCreateModalOpen(false);
        toast.success("Tạo người dùng thành công!");
      },
      onError: (error) => {
        console.error("Error creating user:", error);
        toast.error("Có lỗi xảy ra khi tạo người dùng!");
      },
    });
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
        <UserTable users={allUsers?.data?.content || []} />
      </div>
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
