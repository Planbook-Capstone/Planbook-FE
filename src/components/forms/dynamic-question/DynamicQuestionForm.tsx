"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { AdvancedTextEditor } from "@/components/ui/advanced-text-editor";
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
import { QuestionContent } from "@/services/questionBankServices";
import { toast } from "sonner";
import { X, BookOpen } from "lucide-react";
import { LessonSelectorModal } from "@/components/modals/LessonSelectorModal";
import { useLessonsByIdsService } from "@/services/lessonServices";

// Types for form data - matching API format
interface QuestionFormData {
  lessonIds?: number[];
  questionType: "PART_I" | "PART_II" | "PART_III";
  difficultyLevel: "KNOWLEDGE" | "COMPREHENSION" | "APPLICATION";
  questionContent: QuestionContent;
  explanation?: string;
  referenceSource?: string;
}

// Form schema for internal form handling
const questionFormSchema = z.object({
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
  questionType: z.enum(["PART_I", "PART_II", "PART_III"]),
  lessonIds: z.array(z.number()).optional(),
  difficultyLevel: z.enum(["KNOWLEDGE", "COMPREHENSION", "APPLICATION"]),
  explanation: z.string().optional(),
  referenceSource: z.string().optional(),
  hasImage: z.boolean().default(false),
  image: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
  imageUrl: z.string().optional(), // For existing image URL when editing
  // PART_I fields
  optionA: z.string().optional(),
  optionB: z.string().optional(),
  optionC: z.string().optional(),
  optionD: z.string().optional(),
  correctAnswers: z.array(z.boolean()).optional(),
  // PART_II fields
  statementA: z.string().optional(),
  answerA: z.boolean().optional(),
  statementB: z.string().optional(),
  answerB: z.boolean().optional(),
  statementC: z.string().optional(),
  answerC: z.boolean().optional(),
  statementD: z.string().optional(),
  answerD: z.boolean().optional(),
  // PART_III fields
  essayAnswer: z.string().optional(),
});

type FormData = z.infer<typeof questionFormSchema>;

interface DynamicQuestionFormProps {
  onSubmit: (data: QuestionFormData) => void;
  loading?: boolean;
  initialData?: Partial<FormData>;
  isEditing?: boolean; // Add prop to indicate edit mode
}

export const DynamicQuestionForm: React.FC<DynamicQuestionFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
  isEditing = false,
}) => {
  const [questionType, setQuestionType] = useState<
    "PART_I" | "PART_II" | "PART_III"
  >(initialData?.questionType || "PART_I");
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);


  const form = useForm<any>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question: "",
      questionType: "PART_I",
      lessonIds: undefined,
      difficultyLevel: "KNOWLEDGE",
      explanation: "",
      referenceSource: "",
      hasImage: false,
      imageUrl: "",
      // PART_I fields
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswers: [false, false, false, false],
      // PART_II fields
      statementA: "",
      answerA: false,
      statementB: "",
      answerB: false,
      statementC: "",
      answerC: false,
      statementD: "",
      answerD: false,
      // PART_III fields
      essayAnswer: "",
      ...initialData,
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;
  const watchedHasImage = watch("hasImage");
  const watchedQuestionType = watch("questionType");
  const watchedImage = watch("image");
  const watchedImageUrl = watch("imageUrl");
  const watchedLessonIds = watch("lessonIds");

  // Get lesson names for display
  const lessonQueries = useLessonsByIdsService(watchedLessonIds || []);
  const selectedLessons = lessonQueries
    .filter(query => query.data?.data)
    .map(query => query.data.data)
    .filter(lesson => lesson && lesson.name);

  // Reset form when question type changes
  useEffect(() => {
    if (watchedQuestionType !== questionType) {
      setQuestionType(watchedQuestionType);

      // Keep common fields
      const currentValues = form.getValues();
      const newDefaults = {
        question: currentValues.question,
        referenceSource: currentValues.referenceSource,
        lessonIds: currentValues.lessonIds,
        difficultyLevel: currentValues.difficultyLevel,
        explanation: currentValues.explanation,
        hasImage: currentValues.hasImage,
        image: currentValues.image,
        questionType: watchedQuestionType,
        // Reset type-specific fields
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswers: [false, false, false, false],
        statementA: "",
        answerA: false,
        statementB: "",
        answerB: false,
        statementC: "",
        answerC: false,
        statementD: "",
        answerD: false,
        essayAnswer: "",
      };

      reset(newDefaults);
    }
  }, [watchedQuestionType, questionType, form, reset]);

  const handleFormSubmit = (data: any) => {
    try {
      // Transform data to match API format
      const transformedData: QuestionFormData & { imageFile?: File } = {
        lessonIds: data.lessonIds && data.lessonIds.length > 0 ? data.lessonIds : undefined,
        questionType: data.questionType,
        difficultyLevel: data.difficultyLevel,
        explanation: data.explanation || undefined,
        referenceSource: data.referenceSource,
        // Pass the File object separately for upload
        imageFile: data.hasImage && data.image instanceof File ? data.image : undefined,
        questionContent: {
          question: data.question,
          // Handle image logic:
          // - If hasImage is false: no image
          // - If hasImage is true and image is File: will be uploaded (set to undefined for now)
          // - If hasImage is true and image is null/undefined but imageUrl exists: use existing imageUrl
          // - If hasImage is true but both image and imageUrl are null/empty: no image
          image: data.hasImage
            ? (data.image instanceof File
                ? undefined // Will be set after upload
                : (data.imageUrl || undefined)) // Use existing URL or undefined
            : undefined,
          // Add options for PART_I
          ...(data.questionType === "PART_I" && {
            options: {
              A: data.optionA || "",
              B: data.optionB || "",
              C: data.optionC || "",
              D: data.optionD || "",
            },
            answer:
              data.correctAnswers?.findIndex((answer: boolean) => answer) !== -1
                ? ["A", "B", "C", "D"][
                    data.correctAnswers?.findIndex((answer: boolean) => answer) || 0
                  ]
                : "A",
          }),
          // Add statements for PART_II
          ...(data.questionType === "PART_II" && {
            statements: {
              A: { text: data.statementA || "", answer: data.answerA || false },
              B: { text: data.statementB || "", answer: data.answerB || false },
              C: { text: data.statementC || "", answer: data.answerC || false },
              D: { text: data.statementD || "", answer: data.answerD || false },
            },
          }),
          // Add answer for PART_III
          ...(data.questionType === "PART_III" && {
            answer: data.essayAnswer || "",
          }),
        },
      };

      onSubmit(transformedData);
      toast.success("Câu hỏi đã cập nhật thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật câu hỏi");
    }
  };

  // Get tag color based on difficulty level
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "APPLICATION":
        return "bg-emerald-100 text-emerald-800 border-emerald-500";
      case "COMPREHENSION":
        return "bg-amber-100 text-yellow-700 border-amber-200";
      case "KNOWLEDGE":
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
                  name={`option${letter}` as any}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <AdvancedTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                          placeholder={`Đáp án ${letter}`}
                          className="border-none shadow-none"
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
                    name={`statement${letter}` as any}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <AdvancedTextEditor
                            content={field.value || ""}
                            onChange={field.onChange}
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
                    name={`answer${letter}` as any}
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
              name="essayAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AdvancedTextEditor
                      content={field.value || ""}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isEditing}
                    
                  >
                    <FormControl>
                      <SelectTrigger className={`w-32 h-8 text-xs ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
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

            <div className="flex flex-col gap-2">
              <FormField
                control={control}
                name="lessonIds"
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
                          setValue("lessonIds", newLessonIds);
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
              name="difficultyLevel"
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
            name="question"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormControl>
                  <AdvancedTextEditor
                    content={field.value}
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
                      {(watchedImage || watchedImageUrl) && (
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
                                // Clear both image and imageUrl
                                onChange(undefined);
                                form.setValue("imageUrl", "");
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Xóa ảnh
                            </Button>
                          </div>
                          <img
                            src={
                              watchedImage
                                ? URL.createObjectURL(watchedImage as File)
                                : watchedImageUrl
                            }
                            alt="Preview"
                            className="max-w-full max-h-48 object-contain rounded border"
                          />
                          {watchedImageUrl && !watchedImage && (
                            <p className="text-xs text-gray-500 mt-1">
                              Ảnh hiện tại - Chọn file mới để thay thế
                            </p>
                          )}
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
                  <AdvancedTextEditor
                    content={field.value || ""}
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
            {loading ? "Đang tạo..." : "Lưu câu hỏi"}
          </Button>
        </div>
      </form>

      {/* Lesson Selector Modal */}
      <LessonSelectorModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onConfirm={(selectedLessonIds) => {
          setValue("lessonIds", selectedLessonIds);
        }}
        selectedLessonIds={watchedLessonIds || []}
        title="Chọn bài học cho câu hỏi"
      />
    </Form>
  );
};
