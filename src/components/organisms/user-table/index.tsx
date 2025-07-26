import { UserWithWalletResponse } from "@/types";
import { DataTable } from "../data-table";
import { userColumns } from "./columns";
import { Row } from "@tanstack/react-table";

interface UserTableProps {
  users: UserWithWalletResponse[];
  onSelectionChange?: (selectedRows: Row<UserWithWalletResponse>[]) => void;
}

export default function UserTable({
  users,
  onSelectionChange,
}: UserTableProps) {
  return (
    <>
      <DataTable
        columns={userColumns}
        data={users}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
