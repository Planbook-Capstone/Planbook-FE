"use client";

import { useState, useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Search } from "lucide-react";
import CreateUserModal from "@/components/organisms/create-user-modal";
import { roleOptions, type CreateUserFormData } from "@/schemas";
import UserTable from "@/components/organisms/user-table";
import {
  useAllUsersService,
  useCreateUserService,
  useUpdateUserStatusService,
} from "@/services/userService";
import { toast } from "sonner";
import { UserWithWalletResponse } from "@/types";
import UserDetailModal from "@/components/molecules/user-detail-modal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// Filter options for role
const filterOptions = [
  { value: "all", label: "Tất cả vai trò" },
  ...roleOptions,
];

export default function StaffUsersManagementPage() {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<UserWithWalletResponse | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Use the paginated service
  const { data: allUsers, refetch } = useAllUsersService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      offset: currentPage, // Convert 1-based to 0-based for API
      pageSize: pageSize,
      sort: "createdAt,desc",
    } // pagination params
  );
  // API hooks
  const createUserMutation = useCreateUserService();
  const updateUserStatusMutation = useUpdateUserStatusService();

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

  const handleViewUser = (user: UserWithWalletResponse) => {
    // You can implement modal/drawer logic here
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleToggleUserStatus = (user: UserWithWalletResponse) => {
    const newStatus = user.status === "ACTIVE" ? "DELETED" : "ACTIVE";

    // Show loading toast
    const loadingToast = toast.loading(
      `${newStatus === "ACTIVE" ? "Kích hoạt" : "Vô hiệu hóa"} người dùng...`
    );
    updateUserStatusMutation.mutate(
      {
        id: String(user.id),
        field: "status",
        queryParams: { status: newStatus }, // ✅ dùng biến động },
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success(
            `${
              newStatus !== "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"
            } người dùng thành công!`
          );
        },
        onError: () => {
          toast.dismiss(loadingToast);
          toast.error("Cập nhật trạng thái thất bại");
        },
      }
    );
  };
  const handlePageChange = (page: number) => {
    // Update current page state - this will trigger refetch automatically
    setCurrentPage(page);
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
        <UserTable
          users={allUsers?.data?.content || []}
          onViewUser={handleViewUser}
          onToggleUserStatus={handleToggleUserStatus}
        />
      </div>
      {allUsers?.data && allUsers.data.totalPages > 1 && (
        <div className="float-end mt-5 space-y-4">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {(() => {
                const totalPages = allUsers.data.totalPages;
                const pages = [];

                // Show first page
                if (totalPages > 0) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== 1) {
                            handlePageChange(1);
                          }
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Show ellipsis if needed
                if (currentPage > 3) {
                  pages.push(
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show pages around current page
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  if (i !== 1 && i !== totalPages) {
                    pages.push(
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i}
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== i) {
                              handlePageChange(i);
                            }
                          }}
                        >
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                }

                // Show ellipsis if needed
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show last page (if different from first)
                if (totalPages > 1) {
                  pages.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== totalPages) {
                            handlePageChange(totalPages);
                          }
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return pages;
              })()}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < allUsers.data.totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= allUsers.data.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
      {selectedUser && (
        <UserDetailModal
          open={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
}
