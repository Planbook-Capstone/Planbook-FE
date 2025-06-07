// BookTable.tsx
import { useState } from "react";
import { DataTable } from "../data-table";
import { Book, bookColumns } from "./columns";
import { Row } from "@tanstack/react-table";

interface BookTableProps {
  onSelectionChange?: (selectedRows: Row<Book>[]) => void;
}

export default function BookTable({ onSelectionChange }: BookTableProps) {
  const data: Book[] = [
    {
      id: 1,
      gradeId: "10",
      subjectId: "Toán",
      name: "Toán nâng cao",
      description: "Tài liệu nâng cao cho khối 1.",
    },
    {
      id: 2,
      gradeId: "11",
      subjectId: "Tiếng Việt",
      name: "Luyện từ và câu",
      description: "Bài học về từ loại và cấu trúc câu.",
    },
    {
      id: 3,
      gradeId: "12",
      subjectId: "Khoa học",
      name: "Thế giới tự nhiên",
      description:
        "Tài liệu mô tả các hiện tượng tự nhiên dành cho học sinh khối 3.",
    },
  ];

  return (
    <DataTable
      columns={bookColumns}
      data={data}
      onSelectionChange={onSelectionChange}
    />
  );
}
