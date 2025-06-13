"use client";
import { useState } from "react";

import CreateBookModal from "@/components/organisms/create-book-modal";
import BookTable from "@/components/organisms/book-list";
import GradeTable from "@/components/organisms/grade-list";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { BookResponse, GradeResponse, SubjectResponse } from "@/types";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubjectTable from "@/components/organisms/subject-list";
import CreateGradeModal from "@/components/organisms/create-grade-modal";
import CreateSubjectModal from "@/components/organisms/create-subject-modal";

const ResourceManagementPage = () => {
  const [selected, setSelected] = useState<Row<BookResponse>[]>([]);

  const router = useRouter();
  const handleDelete = () => {
    if (selected.length > 1) {
      toast.error("Vui lòng chỉ chọn 1 sách");
    } else {
      toast.success(`Đã xóa thành công sách ${selected[0].original.name}`);
    }
  };

  const handleEdit = () => {
    if (selected.length > 1) {
      toast.error("Vui lòng chỉ chọn 1 sách");
    } else {
      router.push(`/admin/resource/${selected[0].original.id}/content`);
    }
  };

  const tabs = [
    {
      value: "grade",
      label: "Quản lí khối",
      content: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-calsans text-base">Danh sách khối</h1>
            <CreateGradeModal />
          </div>
          <GradeTable />
        </div>
      ),
    },
    {
      value: "subject",
      label: "Quản lí môn",
      content: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-calsans text-base">Danh sách môn</h1>
            <CreateSubjectModal/>
          </div>
          <SubjectTable />
        </div>
      ),
    },
    {
      value: "book",
      label: "Quản lí sách",
      content: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-calsans text-base">Danh sách sách</h1>
            {selected.length > 0 ? (
              <div className="flex gap-1.5 items-center">
                <p className="text-sm text-muted-foreground pr-2.5">
                  Đã chọn {selected.length}
                </p>
                <Button onClick={handleDelete}>Xóa</Button>
                <Button onClick={handleEdit} variant={"outline"}>
                  Chỉnh sửa
                </Button>
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
      ),
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <div className="flex justify-between w-full">
        <Tabs defaultValue="grade" className="w-full">
          <div className="space-y-5 w-full">
            <div className="flex justify-between w-full">
              <Tabs defaultValue="grade" className="w-full">
                <TabsList>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ResourceManagementPage;
