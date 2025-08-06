"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  multipleDynamicQuestionSchema,
  MultipleDynamicQuestionFormData,
  DynamicQuestionFormData,
  getInitialFormValues,
} from "@/schemas/dynamicQuestion.schema";
import { SingleQuestionForm } from "./SingleQuestionForm";

interface MultipleDynamicQuestionFormProps {
  onSubmit: (data: DynamicQuestionFormData[]) => void;
  loading?: boolean;
  initialData?: MultipleDynamicQuestionFormData;
}

export function MultipleDynamicQuestionForm({
  onSubmit,
  loading = false,
  initialData,
}: MultipleDynamicQuestionFormProps) {
  const form = useForm<MultipleDynamicQuestionFormData>({
    resolver: zodResolver(multipleDynamicQuestionSchema),
    defaultValues: initialData || {
      questions: [getInitialFormValues("PART_I")],
    },
    mode: "onSubmit",
  });

  const { fields, remove, prepend } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("=== RESETTING FORM WITH NEW DATA ===");
      console.log("New initialData:", initialData);
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleAddQuestion = () => {
    prepend(getInitialFormValues("PART_I"));
    toast.success("Đã thêm câu hỏi mới");
  };

  const handleRemoveQuestion = (index: number) => {
    if (fields.length <= 1) {
      toast.error("Phải có ít nhất một câu hỏi");
      return;
    }
    remove(index);
    toast.success("Đã xóa câu hỏi");
  };

  const handleDuplicateQuestion = (index: number) => {
    const questionToDuplicate = form.getValues(`questions.${index}`);
    prepend({ ...questionToDuplicate });
    toast.success("Đã sao chép câu hỏi");
  };

  const handleFormSubmit = (data: MultipleDynamicQuestionFormData) => {
    try {
      onSubmit(data.questions);
      toast.success(`Đã tạo thành công ${data.questions.length} câu hỏi!`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo câu hỏi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      
        <Button
          type="button"
          onClick={handleAddQuestion}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Thêm câu hỏi
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative">
                <div className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Câu hỏi {index + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateQuestion(index)}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Sao chép
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveQuestion(index)}
                        disabled={fields.length <= 1}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <SingleQuestionForm
                    control={form.control}
                    index={index}
                    errors={form.formState.errors.questions?.[index]}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Tổng cộng: {fields.length} câu hỏi
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Đặt lại
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="min-w-[120px]"
              >
                Tạo tất cả câu hỏi
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
