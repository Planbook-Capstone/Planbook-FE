"use client";

import CreateBookModal from "@/components/organisms/create-book-modal";
import { ViewToggle } from "@/components/molecules/view-toggle";
import BookTable from "@/components/organisms/book-list";
import { useState } from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { BookResponse } from "@/types";

const ResourceManagementPage = () => {
  const [selected, setSelected] = useState<Row<BookResponse>[]>([]);

  const handleDelete = () => {
    if (selected.length > 1) {
      toast.error("Vui lòng chỉ chọn 1 sách");
    } else {
      toast.success(`Đã xóa thành công sách ${selected[0].original.name}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <ViewToggle />

        {selected.length > 0 ? (
          <div className="flex gap-1.5 items-center">
            <p className="text-sm text-muted-foreground pr-2.5">
              Đã chọn {selected.length}
            </p>
            <Button onClick={handleDelete}>Xóa</Button>
            <Button variant={"outline"}>Chỉnh sửa</Button>
          </div>
        ) : (
          <CreateBookModal />
        )}
      </div>
      <BookTable
        onSelectionChange={(rows) => {
          setSelected(rows);
        }}
      />
    </div>
  );
};

export default ResourceManagementPage;
