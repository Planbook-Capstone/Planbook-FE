"use client";
import { UserWithWalletResponse } from "@/types";
import { DataTable } from "../data-table";
import { createUserColumns } from "./columns";
import { Row } from "@tanstack/react-table";

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
  const columns = createUserColumns({
    onViewUser,
    onToggleUserStatus,
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
