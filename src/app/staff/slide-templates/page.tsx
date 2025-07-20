"use client";

import { SlideTemplate } from "@/types/slide-template";
import SlideTemplatesList from "@/components/organisms/slide-templates-list";
import { useRouter } from "next/navigation";

export default function SlideTemplatesPage() {
  const router = useRouter();

  const handleEditTemplate = (template: SlideTemplate) => {
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
        onEdit={handleEditTemplate}
        onDelete={handleDeleteTemplate}
        showCreateButton={true}
      />
    </div>
  );
}
