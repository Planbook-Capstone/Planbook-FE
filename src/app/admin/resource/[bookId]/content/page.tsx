"use client";
import CreateChapterForm from "@/components/molecules/create-chapter-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use } from "react";

function CreateBookDetails({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = use(params); // ✅ unwrap promise

  return (
    <div>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Chi tiết chương</TabsTrigger>
          <TabsTrigger value="description">Mô tả</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <CreateChapterForm bookId={bookId} />
        </TabsContent>

        <TabsContent value="description">Thông tin chung:</TabsContent>
      </Tabs>
    </div>
  );
}

export default CreateBookDetails;
