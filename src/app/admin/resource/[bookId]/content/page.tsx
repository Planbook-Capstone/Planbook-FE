"use client";
import CreateChapterForm from "@/components/molecules/create-chapter-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
function CreateBookDetails() {
  return (
    <div>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Chi tiết chương</TabsTrigger>
          <TabsTrigger value="description">Mô tả</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <CreateChapterForm />
        </TabsContent>
        <TabsContent value="description">Thông tin chung:</TabsContent>
      </Tabs>
    </div>
  );
}

export default CreateBookDetails;
