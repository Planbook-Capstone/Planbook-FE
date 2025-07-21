"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { InstanceDetails } from "@/components/organisms/instance-details";
import { useExamInstanceByIdService } from "@/services/examInstanceServices";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface ExamInstanceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ExamInstanceDetailsPage({
  params,
}: ExamInstanceDetailsPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const {
    data: instanceResponse,
    isLoading,
    error,
  } = useExamInstanceByIdService(resolvedParams.id);

  const instance = instanceResponse?.data;

  const handleBack = () => {
    router.push("/exam-instances");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin instance...</p>
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy instance
          </h1>
          <p className="text-gray-600 mb-6">
            Instance với ID "{resolvedParams.id}" không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>
      
      <InstanceDetails
        instance={instance}
        onClose={handleBack}
        onEdit={() => {
          // TODO: Implement edit functionality
          console.log("Edit instance:", instance.id);
        }}
        onDelete={() => {
          // TODO: Implement delete functionality
          console.log("Delete instance:", instance.id);
        }}
      />
    </div>
  );
}
