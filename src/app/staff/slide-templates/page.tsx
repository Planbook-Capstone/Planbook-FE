"use client";

import SlideTemplatesList from "@/components/organisms/slide-templates-list";
import { useRouter } from "next/navigation";
import { useSlideTemplatesService } from "@/services/slideTemplateServices";
import { SlideTemplateResponse } from "@/types";
import { useEffect } from "react";

export default function SlideTemplatesPage() {
  const router = useRouter();
  const {
    data: templates,
    isLoading: isLoadingTemplates,
    error,
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

  const handleEditTemplate = (template: SlideTemplateResponse) => {
    console.log("Editing template:", template);
    // Redirect to edit page with template ID
    router.push(`/staff/slide-templates/edit/${template.id}`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log("Deleting template:", templateId);
    // TODO: Call API to delete template
    if (confirm("Bạn có chắc chắn muốn xóa template này?")) {
      // Implement delete API call here
      console.log("Template deleted:", templateId);
    }
  };

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
