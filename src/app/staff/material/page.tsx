"use client";

import { CreateMaterialTagModal } from "@/components/organisms/create-material-tag-form";
import TagTable from "@/components/organisms/tag-list";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateMaterialModal from "@/components/organisms/create-material-modal";
import { MaterialFormData } from "@/schemas/material.schema";
import { useState } from "react";
import { Plus } from "lucide-react";
import MaterialContent from "@/components/templates/material-content";
import { useCreateMaterialService } from "@/services/materialServices";
import { toast } from "sonner";

export default function MaterialPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createMaterialMutation = useCreateMaterialService();

  const handleCreateMaterial = async (data: MaterialFormData) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file as File);
      formData.append(
        "metadataJson",
        JSON.stringify({
          type: "test",
          name: data.name,
          description: data.description,
          url: "null", // Will be set by backend after file upload
          tagIds: data.tags,
          lessonId: data.lessonId,
        })
      );

      await createMaterialMutation.mutateAsync(formData);

      toast.success("Material đã được tạo thành công!");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating material:", error);
      toast.error("Có lỗi xảy ra khi tạo material!");
    }
  };

  const tabs = [
    {
      value: "grade",
      label: "Loại học liệu",
      content: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-calsans text-base">Danh sách loại học liệu</h1>
            <CreateMaterialTagModal />
          </div>
          <TagTable />
        </div>
      ),
    },
    {
      value: "subject",
      label: "Học liệu",
      content: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-calsans text-base">Danh sách học liệu</h1>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo Material
            </Button>
          </div>

          {/* Material List Content */}
          <div className="space-y-4">
            <MaterialContent />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <div className="space-y-5 w-full">
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

      {/* Create Material Modal */}
      <CreateMaterialModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMaterial}
      />
    </div>
  );
}
