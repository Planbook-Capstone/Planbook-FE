"use client";

import React, { useState, useRef } from "react";
import { MultipleDynamicQuestionForm } from "@/components/forms/dynamic-question/MultipleDynamicQuestionForm";
import { DynamicQuestionFormData } from "@/schemas/dynamicQuestion.schema";
import { toast } from "sonner";
import { useCreateMaterialService } from "@/services/materialServices";
import {
  useCreateQuestionBankService,
  QuestionContent,
} from "@/services/questionBankServices";
import { Button } from "@/components/ui/Button";

// Types for API format
interface QuestionFormData {
  lessonIds?: number[];
  questionType: "PART_I" | "PART_II" | "PART_III";
  difficultyLevel: "KNOWLEDGE" | "COMPREHENSION" | "APPLICATION" | "ANALYSIS";
  questionContent: QuestionContent;
  explanation?: string;
  referenceSource?: string;
}

function CreateQuestionBankPage() {
  const createMutation = useCreateQuestionBankService();
  const createMaterialMutation = useCreateMaterialService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is DOCX or PDF
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/pdf", // PDF
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ hỗ trợ file DOCX và PDF!");
        return;
      }

      // Save the selected file
      setSelectedFile(file);
      console.log("Selected file:", file);
      toast.success(`Đã chọn file: ${file.name}`);

      // TODO: Add your file processing logic here
      // For example: parse DOCX/PDF content and convert to questions
    }
  };

  // Handle file processing
  const handleFileProcess = () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file trước!");
      return;
    }

    console.log("Processing file:", selectedFile);
    toast.info(`Đang xử lý file: ${selectedFile.name}...`);

    // TODO: Add your file processing logic here
    // For example: parse DOCX/PDF content and convert to questions
  };

  // Transform DynamicQuestionFormData to QuestionFormData
  const transformQuestionData = (
    data: DynamicQuestionFormData,
    imageUrl?: string
  ): QuestionFormData => {
    const questionContent: QuestionContent = {
      question: data.question,
      image: imageUrl,
    };

    // Add type-specific content
    switch (data.questionType) {
      case "PART_I":
        questionContent.options = {
          A: data.optionA || "",
          B: data.optionB || "",
          C: data.optionC || "",
          D: data.optionD || "",
        };
        // Find correct answer
        const correctIndex = data.correctAnswers?.findIndex(
          (answer) => answer === true
        );
        questionContent.answer =
          correctIndex !== -1 ? ["A", "B", "C", "D"][correctIndex || 0] : "A";
        break;

      case "PART_II":
        questionContent.statements = {
          A: { text: data.statementA || "", answer: data.answerA || false },
          B: { text: data.statementB || "", answer: data.answerB || false },
          C: { text: data.statementC || "", answer: data.answerC || false },
          D: { text: data.statementD || "", answer: data.answerD || false },
        };
        break;

      case "PART_III":
        questionContent.answer = data.essayAnswer || "";
        break;
    }

    return {
      lessonIds:
        data.lessonIds && data.lessonIds.length > 0
          ? data.lessonIds
          : undefined,
      questionType: data.questionType,
      difficultyLevel: data.difficultyLevel || "KNOWLEDGE",
      questionContent,
      explanation: data.explanation,
      referenceSource: data.referenceSource,
    };
  };

  const handleMultipleSubmit = async (data: DynamicQuestionFormData[]) => {
    console.log("Multiple questions submitted:", data);
    setIsSubmitting(true);

    try {
      const processedQuestions: QuestionFormData[] = [];

      // Process each question
      for (const questionData of data) {
        let imageUrl: string | undefined;

        // If question has image file, upload it first
        if (questionData.hasImage && questionData.image instanceof File) {
          try {
            const formData = new FormData();
            formData.append("file", questionData.image);
            formData.append(
              "metadataJson",
              JSON.stringify({
                type: "question-image",
                name: questionData.image.name,
                description: "Question illustration image",
                url: "null", // Will be set by backend after file upload
              })
            );

            const uploadResult = await createMaterialMutation.mutateAsync(
              formData
            );
            imageUrl = uploadResult?.data?.data?.url;

            console.log(`Image uploaded for question: ${imageUrl}`);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            toast.error(
              `Lỗi upload ảnh cho câu hỏi: ${questionData.question.substring(
                0,
                30
              )}...`
            );
            continue; // Skip this question if image upload fails
          }
        }

        // Transform to API format
        const transformedQuestion = transformQuestionData(
          questionData,
          imageUrl
        );
        processedQuestions.push(transformedQuestion);
      }

      // Create all questions
      const createPromises = processedQuestions.map((question) =>
        createMutation.mutateAsync(question)
      );

      await Promise.all(createPromises);

      toast.success(`Đã tạo thành công ${processedQuestions.length} câu hỏi!`);

      // Optionally redirect or reset form
      // router.push('/staff/question-bank');
    } catch (error) {
      console.error("Error creating questions:", error);
      toast.error("Có lỗi xảy ra khi tạo câu hỏi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="absolute right-0 -top-11 flex gap-2 items-end">
        {selectedFile && (
          <div className="flex flex-col items-end gap-2">
            <p>{selectedFile.name}</p>
            <Button
              className="w-1/2"
              variant={"outline"}
              onClick={handleFileProcess}
            >
              Xử lí
            </Button>
          </div>
        )}
        <div
          className="overflow-hidden relative rounded-lg p-10 group hover:shadow-md transition-all cursor-pointer flex flex-col items-start justify-end text-center aspect-[4/3] w-16"
          onClick={handleFileSelect}
        >
          <h2 className="text-sm p-1  z-10 text-white text-start absolute left-0 top-0">
            Import từ <br />
            <span className="font-calsans text-white underline bg-clip-text leading-tight">
              DOCX
              <br />
              PDF
            </span>
          </h2>
          <img
            src={"/images/illustration/docx.svg"}
            className="absolute group-hover:scale-110 transition-all -bottom-2/6 -right-1/6 h-[100%] object-cover z-10"
          />
          <img
            src={"/images/background/import.svg"}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </div>
      </div>
      <MultipleDynamicQuestionForm
        onSubmit={handleMultipleSubmit}
        loading={isSubmitting}
      />
    </div>
  );
}

export default CreateQuestionBankPage;
