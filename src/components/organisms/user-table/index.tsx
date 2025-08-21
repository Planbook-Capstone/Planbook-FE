"use client";
import { UserWithWalletResponse } from "@/types";
import { DataTable } from "../data-table";
import { createUserColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { useAuth } from "@/hooks/useAuth";

interface UserTableProps {
  users: UserWithWalletResponse[];
  onSelectionChange?: (selectedRows: Row<UserWithWalletResponse>[]) => void;
  onViewUser: (user: UserWithWalletResponse) => void;
  onToggleUserStatus: (user: UserWithWalletResponse) => void;
}

export default function UserTable({
  users,
  onSelectionChange,
  onViewUser,
  onToggleUserStatus,
}: UserTableProps) {
  const { user: currentUser } = useAuth();

  const columns = createUserColumns({
    onViewUser,
    onToggleUserStatus,
    currentUserId: currentUser?.id, // Truyền currentUserId để so sánh
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
