"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QuestionBankItem,
  QuestionContent,
} from "@/services/questionBankServices";
import { ImageIcon, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";

// Types for form data
interface QuestionFormData {
  lessonIds: number[];
  questionType: "PART_I" | "PART_II" | "PART_III";
  difficultyLevel: "KNOWLEDGE" | "COMPREHENSION" | "APPLICATION" | "ANALYSIS";
  questionContent: QuestionContent;
  explanation: string;
  referenceSource?: string;
}

// Validation schema
const questionSchema = z.object({
  lessonIds: z.array(z.number()).min(1, "Vui lòng chọn ít nhất một bài học"),
  questionType: z.enum(["PART_I", "PART_II", "PART_III"]),
  difficultyLevel: z.enum([
    "KNOWLEDGE",
    "COMPREHENSION",
    "APPLICATION",
    "ANALYSIS",
  ]),
  question: z.string().min(1, "Vui lòng nhập câu hỏi"),
  image: z.string().optional(),
  explanation: z.string().min(1, "Vui lòng nhập giải thích"),
  referenceSource: z.string().optional(),
  // PART_I fields
  optionA: z.string().optional(),
  optionB: z.string().optional(),
  optionC: z.string().optional(),
  optionD: z.string().optional(),
  correctAnswer: z.string().optional(),
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
  shortAnswer: z.string().optional(),
});

type FormData = z.infer<typeof questionSchema>;

interface QuestionBankFormProps {
  onSubmit: (data: QuestionFormData) => void;
  editingQuestion?: QuestionBankItem | null;
  lessonsData?: any;
  loading?: boolean;
}

export const QuestionBankForm: React.FC<QuestionBankFormProps> = ({
  onSubmit,
  editingQuestion,
  lessonsData,
  loading = false,
}) => {
  const [showImageField, setShowImageField] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      lessonIds: [],
      questionType: "PART_I",
      difficultyLevel: "KNOWLEDGE",
      question: "",
      image: "",
      explanation: "",
      referenceSource: "",
      // PART_I fields
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
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
      shortAnswer: "",
    },
  });

  const questionType = watch("questionType");

  // Reset form when editing question changes
  useEffect(() => {
    if (editingQuestion) {
      // Show image field if editing question has an image
      setShowImageField(!!editingQuestion.questionContent.image);
      const baseValues = {
        lessonIds: editingQuestion.lessonIds || (editingQuestion.lessonId ? [editingQuestion.lessonId] : []),
        questionType: editingQuestion.questionType,
        difficultyLevel: editingQuestion.difficultyLevel,
        question: editingQuestion.questionContent.question,
        image: editingQuestion.questionContent.image || "",
        explanation: editingQuestion.explanation,
        referenceSource: editingQuestion.referenceSource || "",
      };

      // Add type-specific values
      if (editingQuestion.questionType === "PART_I") {
        Object.assign(baseValues, {
          optionA: editingQuestion.questionContent.options?.A || "",
          optionB: editingQuestion.questionContent.options?.B || "",
          optionC: editingQuestion.questionContent.options?.C || "",
          optionD: editingQuestion.questionContent.options?.D || "",
          correctAnswer: editingQuestion.questionContent.answer || "",
        });
      } else if (editingQuestion.questionType === "PART_II") {
        Object.assign(baseValues, {
          statementA: editingQuestion.questionContent.statements?.a?.text || "",
          answerA:
            editingQuestion.questionContent.statements?.a?.answer || false,
          statementB: editingQuestion.questionContent.statements?.b?.text || "",
          answerB:
            editingQuestion.questionContent.statements?.b?.answer || false,
          statementC: editingQuestion.questionContent.statements?.c?.text || "",
          answerC:
            editingQuestion.questionContent.statements?.c?.answer || false,
          statementD: editingQuestion.questionContent.statements?.d?.text || "",
          answerD:
            editingQuestion.questionContent.statements?.d?.answer || false,
        });
      } else if (editingQuestion.questionType === "PART_III") {
        Object.assign(baseValues, {
          shortAnswer: editingQuestion.questionContent.answer || "",
        });
      }

      reset(baseValues);
    } else {
      // Hide image field when creating new question
      setShowImageField(false);
      reset({
        lessonIds: [],
        questionType: "PART_I",
        difficultyLevel: "KNOWLEDGE",
        question: "",
        image: "",
        explanation: "",
        referenceSource: "",
        // PART_I fields
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
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
        shortAnswer: "",
      });
    }
  }, [editingQuestion, reset]);

  const handleFormSubmit = (data: FormData) => {
    // Transform form data to API format
    const formData: QuestionFormData = {
      lessonIds: data.lessonIds, // Send the full array of lesson IDs
      questionType: data.questionType,
      difficultyLevel: data.difficultyLevel,
      explanation: data.explanation,
      referenceSource: data.referenceSource,
      questionContent: {
        question: data.question,
        image: data.image,
        ...getQuestionContentByType(data, data.questionType),
      },
    };

    onSubmit(formData);
  };

  const getQuestionContentByType = (data: FormData, type: string) => {
    switch (type) {
      case "PART_I":
        return {
          options: {
            A: data.optionA || "",
            B: data.optionB || "",
            C: data.optionC || "",
            D: data.optionD || "",
          },
          answer: data.correctAnswer || "",
        };
      case "PART_II":
        return {
          statements: {
            a: { text: data.statementA || "", answer: data.answerA || false },
            b: { text: data.statementB || "", answer: data.answerB || false },
            c: { text: data.statementC || "", answer: data.answerC || false },
            d: { text: data.statementD || "", answer: data.answerD || false },
          },
        };
      case "PART_III":
        return {
          answer: data.shortAnswer || "",
        };
      default:
        return {};
    }
  };

  const getLessons = () => {
    try {
      if (!lessonsData) return [];

      let lessons = [];

      if (
        lessonsData.data?.content &&
        Array.isArray(lessonsData.data.content)
      ) {
        lessons = lessonsData.data.content;
      } else if (lessonsData.data && Array.isArray(lessonsData.data)) {
        lessons = lessonsData.data;
      } else if (Array.isArray(lessonsData)) {
        lessons = lessonsData;
      }

      return lessons;
    } catch (error) {
      console.error("Error getting lessons:", error);
      return [];
    }
  };

  const renderQuestionTypeFields = () => {
    switch (questionType) {
      case "PART_I":
        return (
          <div className="space-y-4">
            <Controller
              name="correctAnswer"
              control={control}
              rules={{ required: "Vui lòng chọn đáp án đúng" }}
              render={({ field: correctAnswerField }) => (
                <RadioGroup
                  value={correctAnswerField.value}
                  onValueChange={correctAnswerField.onChange}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RadioGroupItem value="A" id="answer-a" />
                        <Label htmlFor="optionA" className="font-medium">
                          Lựa chọn A *
                        </Label>
                      </div>
                      <Controller
                        name="optionA"
                        control={control}
                        rules={{ required: "Vui lòng nhập lựa chọn A" }}
                        render={({ field }) => (
                          <Input {...field} placeholder="Nhập lựa chọn A" />
                        )}
                      />
                      {errors.optionA && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.optionA.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RadioGroupItem value="B" id="answer-b" />
                        <Label htmlFor="optionB" className="font-medium">
                          Lựa chọn B *
                        </Label>
                      </div>
                      <Controller
                        name="optionB"
                        control={control}
                        rules={{ required: "Vui lòng nhập lựa chọn B" }}
                        render={({ field }) => (
                          <Input {...field} placeholder="Nhập lựa chọn B" />
                        )}
                      />
                      {errors.optionB && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.optionB.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RadioGroupItem value="C" id="answer-c" />
                        <Label htmlFor="optionC" className="font-medium">
                          Lựa chọn C *
                        </Label>
                      </div>
                      <Controller
                        name="optionC"
                        control={control}
                        rules={{ required: "Vui lòng nhập lựa chọn C" }}
                        render={({ field }) => (
                          <Input {...field} placeholder="Nhập lựa chọn C" />
                        )}
                      />
                      {errors.optionC && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.optionC.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RadioGroupItem value="D" id="answer-d" />
                        <Label htmlFor="optionD" className="font-medium">
                          Lựa chọn D *
                        </Label>
                      </div>
                      <Controller
                        name="optionD"
                        control={control}
                        rules={{ required: "Vui lòng nhập lựa chọn D" }}
                        render={({ field }) => (
                          <Input {...field} placeholder="Nhập lựa chọn D" />
                        )}
                      />
                      {errors.optionD && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.optionD.message}
                        </p>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.correctAnswer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correctAnswer.message}
              </p>
            )}
          </div>
        );

      case "PART_II":
        return (
          <div className="space-y-6">
            {/* Statement A */}
            <div className="border p-4 rounded-lg">
              <div className="mb-3">
                <Label htmlFor="statementA">Phát biểu a *</Label>
                <Controller
                  name="statementA"
                  control={control}
                  rules={{ required: "Vui lòng nhập phát biểu a" }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Nhập phát biểu a"
                      rows={2}
                    />
                  )}
                />
                {errors.statementA && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.statementA.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Đáp án a *</Label>
                <Controller
                  name="answerA"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value ? "true" : "false"}
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="answer-a-true" />
                        <Label htmlFor="answer-a-true">Đúng</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="answer-a-false" />
                        <Label htmlFor="answer-a-false">Sai</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            {/* Statement B */}
            <div className="border p-4 rounded-lg">
              <div className="mb-3">
                <Label htmlFor="statementB">Phát biểu b *</Label>
                <Controller
                  name="statementB"
                  control={control}
                  rules={{ required: "Vui lòng nhập phát biểu b" }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Nhập phát biểu b"
                      rows={2}
                    />
                  )}
                />
                {errors.statementB && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.statementB.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Đáp án b *</Label>
                <Controller
                  name="answerB"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value ? "true" : "false"}
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="answer-b-true" />
                        <Label htmlFor="answer-b-true">Đúng</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="answer-b-false" />
                        <Label htmlFor="answer-b-false">Sai</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            {/* Statement C (Optional) */}
            <div className="border p-4 rounded-lg">
              <div className="mb-3">
                <Label htmlFor="statementC">Phát biểu c (tùy chọn)</Label>
                <Controller
                  name="statementC"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Nhập phát biểu c"
                      rows={2}
                    />
                  )}
                />
              </div>
              <div>
                <Label>Đáp án c</Label>
                <Controller
                  name="answerC"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value ? "true" : "false"}
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="answer-c-true" />
                        <Label htmlFor="answer-c-true">Đúng</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="answer-c-false" />
                        <Label htmlFor="answer-c-false">Sai</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>

            {/* Statement D (Optional) */}
            <div className="border p-4 rounded-lg">
              <div className="mb-3">
                <Label htmlFor="statementD">Phát biểu d (tùy chọn)</Label>
                <Controller
                  name="statementD"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Nhập phát biểu d"
                      rows={2}
                    />
                  )}
                />
              </div>
              <div>
                <Label>Đáp án d</Label>
                <Controller
                  name="answerD"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value ? "true" : "false"}
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="answer-d-true" />
                        <Label htmlFor="answer-d-true">Đúng</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="answer-d-false" />
                        <Label htmlFor="answer-d-false">Sai</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case "PART_III":
        return (
          <div>
            <Label htmlFor="shortAnswer">Đáp án *</Label>
            <Controller
              name="shortAnswer"
              control={control}
              rules={{ required: "Vui lòng nhập đáp án" }}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập đáp án (số hoặc chuỗi)" />
              )}
            />
            {errors.shortAnswer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shortAnswer.message}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Lesson Selection */}
      <div className="space-y-2">
        <Label htmlFor="lessonIds" className="text-sm font-medium text-gray-700">
          Bài học <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="lessonIds"
          control={control}
          rules={{ required: "Vui lòng chọn ít nhất một bài học" }}
          render={({ field }) => (
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
              {getLessons().length === 0 ? (
                <p className="text-gray-500 text-sm">Không có bài học nào</p>
              ) : (
                <div className="space-y-2">
                  {getLessons().map((lesson: any) => (
                    <label
                      key={lesson.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(lesson.id) || false}
                        onChange={(e) => {
                          const currentValue = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...currentValue, lesson.id]);
                          } else {
                            field.onChange(
                              currentValue.filter((id: number) => id !== lesson.id)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{lesson.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        />
        {errors.lessonIds && (
          <p className="text-red-500 text-sm mt-1">{errors.lessonIds.message}</p>
        )}
      </div>

      {/* Question Type and Difficulty Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="questionType"
            className="text-sm font-medium text-gray-700"
          >
            Loại câu hỏi <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="questionType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PART_I">PART I - Trắc nghiệm</SelectItem>
                  <SelectItem value="PART_II">PART II - Đúng/Sai</SelectItem>
                  <SelectItem value="PART_III">PART III - Tự luận</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="difficultyLevel"
            className="text-sm font-medium text-gray-700"
          >
            Mức độ <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="difficultyLevel"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KNOWLEDGE">Biết</SelectItem>
                  <SelectItem value="COMPREHENSION">Hiểu</SelectItem>
                  <SelectItem value="APPLICATION">Vận dụng</SelectItem>
                  <SelectItem value="ANALYSIS">Phân tích</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-2">
        <Label htmlFor="question" className="text-sm font-medium text-gray-700">
          Câu hỏi <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="question"
          control={control}
          rules={{ required: "Vui lòng nhập câu hỏi" }}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Nhập nội dung câu hỏi"
              rows={4}
              className="resize-none"
            />
          )}
        />
        {errors.question && (
          <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>
        )}
      </div>

      {/* Image URL - Optional */}
      <div className="space-y-2">
        {!showImageField ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowImageField(true)}
            className="flex items-center gap-2 h-11 text-gray-600 border-dashed hover:border-solid hover:bg-gray-50"
          >
            <ImageIcon className="w-4 h-4" />
            Thêm hình ảnh
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Hình ảnh (URL)
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowImageField(false);
                  setValue("image", "");
                }}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập URL hình ảnh"
                  className="h-11"
                />
              )}
            />
          </div>
        )}
      </div>

      {/* Question Type Specific Fields */}
      {renderQuestionTypeFields()}

      {/* Explanation */}
      <div className="space-y-2">
        <Label
          htmlFor="explanation"
          className="text-sm font-medium text-gray-700"
        >
          Giải thích <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="explanation"
          control={control}
          rules={{ required: "Vui lòng nhập giải thích" }}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Nhập giải thích đáp án"
              rows={4}
              className="resize-none"
            />
          )}
        />
        {errors.explanation && (
          <p className="text-red-500 text-sm mt-1">
            {errors.explanation.message}
          </p>
        )}
      </div>

      {/* Reference Source */}
      <div className="space-y-2">
        <Label
          htmlFor="referenceSource"
          className="text-sm font-medium text-gray-700"
        >
          Nguồn tham khảo
        </Label>
        <Controller
          name="referenceSource"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Nhập nguồn tham khảo (tùy chọn)"
              className="h-11"
            />
          )}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" className="h-11 px-6">
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 px-6 bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)] hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Đang xử lý..."
            : editingQuestion
            ? "Cập nhật"
            : "Thêm mới"}
        </Button>
      </div>
    </form>
  );
};
