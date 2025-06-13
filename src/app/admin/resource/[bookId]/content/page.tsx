"use client";
import CreateChapterForm from "@/components/molecules/create-chapter-form";
import BookContent from "@/components/organisms/book-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book } from "lucide-react";
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

        <TabsContent value="description">
          Thông tin chung:
          <BookContent bookId={bookId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CreateBookDetails;
