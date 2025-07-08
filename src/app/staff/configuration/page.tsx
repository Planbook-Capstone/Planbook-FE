"use client";
import CreateConfigurationModal from "@/components/organisms/create-configuration-modal";
import { Button } from "@/components/ui/Button";
import { ConfigurationFormData } from "@/schemas/configuration.schema";
import { Plus } from "lucide-react";
import  { useState } from "react";

function ConfigurationPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateMaterial = (data: ConfigurationFormData) => {
    console.log("Creating material:", data);
    // TODO: Call API to create material
  };

  return (
    <div>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center gap-2 float-end"
      >
        <Plus className="w-4 h-4" />
        Tạo hướng dẫn
      </Button>

      <CreateConfigurationModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMaterial}
      />
    </div>
  );
}

export default ConfigurationPage;
