"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { RichTextarea } from "@/components/ui/rich-textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  dynamicQuestionSchema,
  DynamicQuestionFormData,
  getInitialFormValues,
} from "@/schemas/dynamicQuestion.schema";
import { toast } from "sonner";

interface DynamicQuestionFormProps {
  onSubmit: (data: DynamicQuestionFormData) => void;
  loading?: boolean;
  initialData?: Partial<DynamicQuestionFormData>;
}

export const DynamicQuestionForm: React.FC<DynamicQuestionFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
}) => {
  const [questionType, setQuestionType] = useState<"PART_I" | "PART_II" | "PART_III">(
    initialData?.questionType || "PART_I"
  );

  const form = useForm<DynamicQuestionFormData>({
    resolver: zodResolver(dynamicQuestionSchema),
    defaultValues: {
      ...getInitialFormValues(questionType),
      ...initialData,
    },
    mode: "onSubmit",
  });

  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = form;
  const watchedHasImage = watch("hasImage");
  const watchedQuestionType = watch("questionType");
  const watchedImage = watch("image");

  // Reset form when question type changes
  useEffect(() => {
    if (watchedQuestionType !== questionType) {
      setQuestionType(watchedQuestionType);
      const newValues = getInitialFormValues(watchedQuestionType);
      
      // Keep common fields
      const currentValues = form.getValues();
      reset({
        ...newValues,
        questionContent: currentValues.questionContent,
        referenceSource: currentValues.referenceSource,
        lessonTag: currentValues.lessonTag,
        difficultyLevel: currentValues.difficultyLevel,
        explanation: currentValues.explanation,
        hasImage: currentValues.hasImage,
        image: currentValues.image,
        questionType: watchedQuestionType,
      });
    }
  }, [watchedQuestionType, questionType, form, reset]);

  const handleFormSubmit = (data: DynamicQuestionFormData) => {
    try {
      onSubmit(data);
      toast.success("Câu hỏi đã được tạo thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo câu hỏi");
    }
  };

  // Get tag color based on difficulty level
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Vận dụng":
        return "bg-emerald-100 text-emerald-800 border-emerald-500";
      case "Thông hiểu":
        return "bg-amber-100 text-yellow-700 border-amber-200";
      case "Nhận biết":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Render answer section based on question type
  const renderAnswerSection = () => {
    switch (questionType) {
      case "PART_I":
        return (
          <div className="pl-12 grid grid-cols-1 space-y-2 mt-2">
            {["A", "B", "C", "D"].map((letter, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`correctAnswers.${index}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span>{letter}.</span>
                <FormField
                  control={control}
                  name={`option${letter}` as keyof DynamicQuestionFormData}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          className="border-none shadow-none"
                          placeholder={`Đáp án ${letter}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        );

      case "PART_II":
        return (
          <div className="pl-12 space-y-4 mt-2">
            {["A", "B", "C", "D"].map((letter, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="font-medium mt-2">
                    {letter.toLowerCase()}.
                  </span>
                  <FormField
                    control={control}
                    name={`statement${letter}` as keyof DynamicQuestionFormData}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Nhập câu ${letter.toLowerCase()}...`}
                            className="border-none shadow-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 ml-8">
                  <FormField
                    control={control}
                    name={`answer${letter}` as keyof DynamicQuestionFormData}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === true}
                              onCheckedChange={(checked) => field.onChange(checked ? true : false)}
                            />
                          </FormControl>
                          <span>Đúng</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === false}
                              onCheckedChange={(checked) => field.onChange(checked ? false : true)}
                            />
                          </FormControl>
                          <span>Sai</span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case "PART_III":
        return (
          <div className="pl-12 space-y-2 mt-2">
            <p className="text-sm text-gray-600">Đáp án:</p>
            <FormField
              control={control}
              name="essayAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextarea
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Nhập đáp án cho câu hỏi tự luận..."
                      className="text-base leading-relaxed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="text-base">
        <div className="gap-2">
          {/* Header section */}
          <div className="flex gap-2 items-center flex-wrap">
            <p className="font-bold">Câu hỏi:</p>
            
            <FormField
              control={control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PART_I">Trắc nghiệm</SelectItem>
                      <SelectItem value="PART_II">Đúng/Sai</SelectItem>
                      <SelectItem value="PART_III">Tự luận</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="referenceSource"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-blue-500 max-w-fit border-none shadow-none"
                      placeholder="Nguồn (VD: Đề TN THPT QG - 2020)"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="lessonTag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-orange-500 max-w-fit border-none shadow-none"
                      placeholder="Tag bài học (VD: [Bài 1_Hóa 10])"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={`w-32 rounded-full px-3 py-1.5 text-xs font-medium border-2 ${getTagColor(
                          field.value || "Nhận biết"
                        )}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-transparent border-none">
                      <SelectItem value="Vận dụng" className="rounded-full mx-1 my-0.5 bg-emerald-500 text-white">
                        Vận dụng
                      </SelectItem>
                      <SelectItem value="Thông hiểu" className="rounded-full mx-1 my-0.5 bg-amber-100 text-yellow-700">
                        Thông hiểu
                      </SelectItem>
                      <SelectItem value="Nhận biết" className="rounded-full mx-1 my-0.5 bg-blue-100 text-blue-700">
                        Nhận biết
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="hasImage"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border border-neutral-700"
                    />
                  </FormControl>
                  <Label>Thêm ảnh minh họa</Label>
                </FormItem>
              )}
            />
          </div>

          {/* Question content */}
          <FormField
            control={control}
            name="questionContent"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormControl>
                  <RichTextarea
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập nội dung câu hỏi..."
                    className="text-base leading-relaxed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image upload section */}
          {watchedHasImage && (
            <FormField
              control={control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                      <input
                        {...field}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
                        className="w-full cursor-pointer"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Chọn ảnh để tải lên (PNG, JPG, JPEG)
                      </p>
                      {watchedImage && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <img
                            src={URL.createObjectURL(watchedImage as File)}
                            alt="Preview"
                            className="max-w-full max-h-48 object-contain rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Answer section */}
        {renderAnswerSection()}

        {/* Explanation section */}
        <div className="mt-4">
          <FormField
            control={control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-purple-500">
                  Giải thích đáp án
                </FormLabel>
                <FormControl>
                  <RichTextarea
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Nhập giải thích cho đáp án..."
                    className="text-base leading-relaxed text-neutral-700"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo câu hỏi"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
