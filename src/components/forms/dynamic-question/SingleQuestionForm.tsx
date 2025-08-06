"use client";

import React, { useEffect, useState } from "react";
import { Control, FieldErrors, useWatch, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RichTextarea } from "@/components/ui/rich-textarea";
import { ChemicalFormulaInput } from "@/components/ui/chemical-formula-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { X, BookOpen } from "lucide-react";
import { LessonSelectorModal } from "@/components/modals/LessonSelectorModal";
import { useLessonsByIdsService } from "@/services/lessonServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultipleDynamicQuestionFormData } from "@/schemas/dynamicQuestion.schema";

interface SingleQuestionFormProps {
  control: Control<MultipleDynamicQuestionFormData>;
  index: number;
  errors?: FieldErrors<MultipleDynamicQuestionFormData["questions"][0]>;
}

export function SingleQuestionForm({
  control,
  index,
  errors,
}: SingleQuestionFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const { setValue } = useFormContext();

  const watchedQuestionType = useWatch({
    control,
    name: `questions.${index}.questionType`,
  });

  const watchedHasImage = useWatch({
    control,
    name: `questions.${index}.hasImage`,
  });

  const watchedImage = useWatch({
    control,
    name: `questions.${index}.image`,
  });

  const watchedLessonIds = useWatch({
    control,
    name: `questions.${index}.lessonIds`,
  });

  const [useChemicalInput, setUseChemicalInput] = useState(false);

  // Get lesson names for display
  const lessonQueries = useLessonsByIdsService(watchedLessonIds || []);
  const selectedLessons = lessonQueries
    .filter(query => query.data?.data)
    .map(query => query.data.data)
    .filter(lesson => lesson && lesson.name);

  // Handle image preview
  useEffect(() => {
    if (watchedImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(watchedImage);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  // Clear image preview when hasImage is turned off
  useEffect(() => {
    if (!watchedHasImage) {
      setImagePreview(null);
    }
  }, [watchedHasImage]);

  // Get tag color based on difficulty level
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "APPLICATION":
        return "bg-emerald-100 text-emerald-800 border-emerald-500";
      case "COMPREHENSION":
        return "bg-amber-100 text-yellow-700 border-amber-200";
      case "KNOWLEDGE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ANALYSIS":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Render answer section based on question type
  const renderAnswerSection = () => {
    switch (watchedQuestionType) {
      case "PART_I":
        return (
          <div className="pl-12 grid grid-cols-1 space-y-2 mt-2">
            {["A", "B", "C", "D"].map((letter, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={`questions.${index}.correctAnswers.${optionIndex}` as any}
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
                  name={`questions.${index}.option${letter}` as any}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        {useChemicalInput ? (
                          <ChemicalFormulaInput
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder={`Đáp án ${letter} (có thể chứa công thức hóa học)`}
                            className="border-none shadow-none"
                          />
                        ) : (
                          <Input
                            value={field.value || ""}
                            onChange={field.onChange}
                            className="border-none shadow-none"
                            placeholder={`Đáp án ${letter}`}
                          />
                        )}
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
            {["A", "B", "C", "D"].map((letter, statementIndex) => (
              <div key={statementIndex} className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="font-medium mt-2">
                    {letter.toLowerCase()}.
                  </span>
                  <FormField
                    control={control}
                    name={`questions.${index}.statement${letter}` as any}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          {useChemicalInput ? (
                            <ChemicalFormulaInput
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder={`Nhập câu ${letter.toLowerCase()} (có thể chứa công thức hóa học)...`}
                              className="border-none shadow-none"
                            />
                          ) : (
                            <Input
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder={`Nhập câu ${letter.toLowerCase()}...`}
                              className="border-none shadow-none"
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-4 ml-8">
                  <FormField
                    control={control}
                    name={`questions.${index}.answer${letter}` as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === true}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? true : false)
                              }
                            />
                          </FormControl>
                          <span>Đúng</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value === false}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? false : true)
                              }
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
              name={`questions.${index}.essayAnswer`}
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
    <div className="text-base">
      <div className="gap-2">
        {/* Header section */}
        <div className="flex gap-2 items-center flex-wrap">
          <p className="font-bold">Câu hỏi:</p>

          <FormField
            control={control}
            name={`questions.${index}.questionType`}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name={`questions.${index}.referenceSource`}
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

          <div className="flex flex-col gap-2">
            <FormField
              control={control}
              name={`questions.${index}.lessonIds`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsLessonModalOpen(true)}
                      className="text-orange-500 border-none shadow-none hover:bg-orange-50"
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      {selectedLessons.length > 0
                        ? `${selectedLessons.length} bài học`
                        : "Chọn bài học"
                      }
                    </Button>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Display selected lessons */}
            {selectedLessons.length > 0 && (
              <div className="flex flex-wrap gap-1 max-w-md">
                {selectedLessons.map((lesson, lessonIndex) => (
                  <span
                    key={lessonIndex}
                    className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full"
                  >
                    {lesson.name}
                    <button
                      type="button"
                      onClick={() => {
                        const newLessonIds = (watchedLessonIds || []).filter(
                          id => id !== Number(lesson.id)
                        );
                        setValue(`questions.${index}.lessonIds`, newLessonIds);
                      }}
                      className="ml-1 hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <FormField
            control={control}
            name={`questions.${index}.difficultyLevel`}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`w-32 rounded-full px-3 py-1.5 text-xs font-medium border-2 ${getTagColor(
                        field.value || "KNOWLEDGE"
                      )}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-transparent border-none">
                    <SelectItem
                      value="APPLICATION"
                      className="rounded-full mx-1 my-0.5 bg-emerald-500 text-white"
                    >
                      Vận dụng
                    </SelectItem>
                    <SelectItem
                      value="COMPREHENSION"
                      className="rounded-full mx-1 my-0.5 bg-amber-100 text-yellow-700"
                    >
                      Thông hiểu
                    </SelectItem>
                    <SelectItem
                      value="KNOWLEDGE"
                      className="rounded-full mx-1 my-0.5 bg-blue-100 text-blue-700"
                    >
                      Nhận biết
                    </SelectItem>
                    <SelectItem
                      value="ANALYSIS"
                      className="rounded-full mx-1 my-0.5 bg-purple-100 text-purple-700"
                    >
                      Phân tích
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`questions.${index}.hasImage`}
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

          <div className="flex items-center space-x-2">
            <Switch
              checked={useChemicalInput}
              onCheckedChange={setUseChemicalInput}
              className="border border-neutral-700"
            />
            <Label>Công thức hóa học</Label>
          </div>
        </div>

        {/* Question content */}
        <FormField
          control={control}
          name={`questions.${index}.question`}
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormControl>
                {useChemicalInput ? (
                  <ChemicalFormulaInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập nội dung câu hỏi với công thức hóa học..."
                    className="text-base leading-relaxed"
                  />
                ) : (
                  <RichTextarea
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập nội dung câu hỏi..."
                    className="text-base leading-relaxed"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image upload section */}
        {watchedHasImage && (
          <FormField
            control={control}
            name={`questions.${index}.image`}
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
                    {imagePreview && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700">
                            Preview:
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onChange(undefined);
                              setImagePreview(null);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Xóa ảnh
                          </Button>
                        </div>
                        <img
                          src={imagePreview}
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
          name={`questions.${index}.explanation`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-purple-500">
                Giải thích đáp án
              </FormLabel>
              <FormControl>
                {useChemicalInput ? (
                  <ChemicalFormulaInput
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Nhập giải thích cho đáp án (có thể chứa công thức hóa học)..."
                    className="text-base leading-relaxed text-neutral-700"
                  />
                ) : (
                  <RichTextarea
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Nhập giải thích cho đáp án..."
                    className="text-base leading-relaxed text-neutral-700"
                  />
                )}
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Lesson Selector Modal */}
      <LessonSelectorModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onConfirm={(selectedLessonIds) => {
          // Update form field with selected lesson IDs
          setValue(`questions.${index}.lessonIds`, selectedLessonIds);
        }}
        selectedLessonIds={watchedLessonIds || []}
        title="Chọn bài học cho câu hỏi"
      />
    </div>
  );
}
