"use client";

import SlideTemplatesList from "@/components/organisms/slide-templates-list";
import { useRouter } from "next/navigation";
import {
  useSlideTemplatesService,
  useUpdateSlideTemplateStatus,
} from "@/services/slideTemplateServices";
import { SlideTemplateResponse } from "@/types";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { GridSkeleton } from "@/components/molecules/grid-skeleton";

export default function SlideTemplatesPage() {
  const router = useRouter();
  const {
    data: templates,
    isLoading: isLoadingTemplates,
    error,
    refetch,
  } = useSlideTemplatesService(
    {
      retry: 1, // Only retry once
      staleTime: 0, // Don't use stale data
    },
    {
      offset: 1, // Number instead of string
      pageSize: 10, // Number instead of string
      sortBy: "createdAt",
      sortDirection: "desc",
    }
  );

  useEffect(() => {
    if (templates) {
      console.log("Templates:", templates?.data?.content);
    }
    if (error) {
      console.error("Error loading templates:", error);
    }
  }, [templates, error]);
  const { mutate: updateSlideTemplateStatus } = useUpdateSlideTemplateStatus();

  const handleEditTemplate = (template: SlideTemplateResponse) => {
    updateSlideTemplateStatus(
      {
        id: template?.id,
        field: "status",
        queryParams: { newStatus: "ACTIVE" },
      },
      {
        onSuccess: () => {
          toast.success("Đã khôi phục mẫu thành công!");
          refetch();
        },
        onError: (error) => {
          toast.error("Có lỗi xảy ra khi khôi phục hoạt mẫu!");
        },
      }
    );
  };

  const handleDeleteTemplate = (templateId: string) => {
    // console.log("Deleting template:", templateId);
    // // TODO: Call API to delete template
    // if (confirm("Bạn có chắc chắn muốn xóa template này?")) {
    //   // Implement delete API call here
    //   console.log("Template deleted:", templateId);
    // }

    updateSlideTemplateStatus(
      {
        id: templateId,
        field: "status",
        queryParams: { newStatus: "INACTIVE" },
      },
      {
        onSuccess: () => {
          toast.success("Đã xoá mẫu thành công!");
          refetch();
        },
        onError: (error) => {
          toast.error("Có lỗi xảy ra khi xoá hoạt mẫu!");
        },
      }
    );
  };

  if (isLoadingTemplates) {
    return (
      <>
        <div>
          <GridSkeleton
            count={7}
            height={150}
            cols="grid-cols-2 lg:grid-cols-4"
          />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Templates List */}
      <SlideTemplatesList
        initialTemplates={templates?.data?.content}
        onEdit={handleEditTemplate}
        onDelete={handleDeleteTemplate}
        showCreateButton={true}
      />
    </div>
  );
}
