"use client";

import CreateBookModal from "@/components/organisms/create-book-modal";
import { ViewToggle } from "@/components/molecules/view-toggle";
import BookTable from "@/components/organisms/book-list";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Book } from "@/components/organisms/book-list/columns";
import { Button } from "@/components/ui/Button";

const ResourceManagementPage = () => {
  const [selected, setSelected] = useState<Row<Book>[]>([]);
  console.log(selected);

 

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <ViewToggle />

        {selected.length > 0 ? (
          <div className="flex gap-1.5 items-center">
            <p className="text-sm text-muted-foreground pr-2.5">
              Đã chọn {selected.length}
            </p>
            <Button>Xóa</Button>
            <Button variant={"outline"}>Chỉnh sửa</Button>
          </div>
        ) : (
          <CreateBookModal />
        )}
      </div>
      <BookTable
        onSelectionChange={(rows) => {
          setSelected(rows);
          console.log(
            "Selected books:",
            rows.map((r) => r.original)
          ); // Optional: xem dữ liệu gốc
        }}
      />
    </div>
  );
};

export default ResourceManagementPage;
