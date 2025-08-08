import AudioPreview from "@/components/molecules/audio-preview";
import MediaPreview from "@/components/molecules/media-preview";
import PreviewImage from "@/components/molecules/preview-image/page";
import {
  useMaterialSearchService,
  useUpdateMaterialService,
  useMaterialByIdService,
} from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { TagResponse } from "@/types";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
import EditMaterialModal from "@/components/organisms/edit-material-modal";
import { EditMaterialFormData } from "@/schemas/material.schema";
import { toast } from "sonner";

function MaterialContent() {
  const { data: tag } = useTagService();
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const { mutate, isPending } = useUpdateMaterialService();

  // Get current material data to preserve existing values
  const { data: currentMaterialData } = useMaterialByIdService(selectedMaterialId);

  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTabId) {
      setActiveTabId(tag.data[0].id);
    }
  }, [tag?.data, activeTabId]);

  const { data: materials, refetch: refetchMaterials } =
    useMaterialSearchService(activeTabId);

  const handleTabChange = (key: string) => {
    setActiveTabId(key);
  };

  const handleViewDetail = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedMaterialId("");
  };

  const handleUpdateMaterial = async (data: EditMaterialFormData) => {
    try {
      if (!selectedMaterialId || !currentMaterialData?.data) {
        toast.error("Không tìm thấy thông tin học liệu!");
        return;
      }

      const currentMaterial = currentMaterialData.data;

      // Prepare update data with only name and description, preserve other fields
      const updateData: any = {
        name: data.name,
        description: data.description,
        // Preserve existing values for other fields
        lessonId: currentMaterial.lessonId,
        tags: currentMaterial.tags,
        // Add any other fields that should be preserved
      };

      // Only include lessonId from form if it's provided
      if (data.lessonId) {
        updateData.lessonId = data.lessonId;
      }

      // Use the mutation service
      mutate(
        {
          id: selectedMaterialId,
          data: updateData,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật học liệu thành công!");
            handleCloseModal();
            // Refetch materials to update the list
            refetchMaterials();
          },
          onError: (error: any) => {
            console.error("Error updating material:", error);
            toast.error(
              error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật học liệu!"
            );
          },
        }
      );
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Có lỗi xảy ra khi cập nhật học liệu!");
    }
  };

  return (
    <div>
      <Tabs
        defaultActiveKey={activeTabId}
        onChange={handleTabChange}
        items={
          tag?.data?.map((item: TagResponse, index: number) => ({
            label: item.name || `Tab-${index}`,
            key: String(item.id || index), // key chính là id nếu có
            // children: `Nội dung của tag "${item.name}"`,
          })) || []
        }
      />

      <div className="mt-4 grid grid-cols-5 gap-2 ">
        {/* Đang chọn tag ID: <strong>{activeTabId}</strong> */}
        {materials?.data?.content?.map((item: any, idx: any) => {
          const extension = item?.url?.split(".")?.pop();

          const renderMaterialWithButton = (content: React.ReactNode) => (
            <div key={idx} className="relative group">
              {content}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleViewDetail(item.id)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Eye className="w-3 h-3" />
                  Chi tiết
                </Button>
              </div>
            </div>
          );

          switch (extension) {
            case "mp3":
              return renderMaterialWithButton(<AudioPreview item={item} />);

            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
              return renderMaterialWithButton(<PreviewImage item={item} />);
            case "mp4":
            case "webm":
            case "ogg":
              return renderMaterialWithButton(<MediaPreview item={item} />);
            default:
              return null;
          }
        })}
      </div>

      {/* Edit Material Modal */}
      {selectedMaterialId && (
        <EditMaterialModal
          open={isEditModalOpen}
          onClose={handleCloseModal}
          materialId={selectedMaterialId}
          onSubmit={handleUpdateMaterial}
        />
      )}
    </div>
  );
}

export default MaterialContent;
