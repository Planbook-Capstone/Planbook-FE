"use client";

import React from "react";
import { DynamicQuestionForm } from "@/components/forms/dynamic-question/DynamicQuestionForm";
import { DynamicQuestionFormData } from "@/schemas/dynamicQuestion.schema";
import { toast } from "sonner";

function CreateQuestionBankPage() {
  const handleSubmit = (data: DynamicQuestionFormData) => {
    console.log("Form submitted with data:", data);

    // Here you would typically send the data to your API
    // For now, we'll just show a success message
    toast.success("Câu hỏi đã được tạo thành công!");

    // You can add API call here
    // Example:
    // createQuestionMutation.mutate(data);
  };

  return (
    <div>
      <DynamicQuestionForm onSubmit={handleSubmit} />
    </div>
  );
}

export default CreateQuestionBankPage;
