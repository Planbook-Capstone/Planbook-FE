"use client";

import React, { useState, useRef, useEffect } from "react";
import { MultipleDynamicQuestionForm } from "@/components/forms/dynamic-question/MultipleDynamicQuestionForm";
import { DynamicQuestionFormData, MultipleDynamicQuestionFormData } from "@/schemas/dynamicQuestion.schema";
import { toast } from "sonner";
import { useCreateMaterialService } from "@/services/materialServices";
import {
  useCreateQuestionBankService,
  QuestionContent,
} from "@/services/questionBankServices";
import { Button } from "@/components/ui/Button";
import { useExamImportService } from "@/services/examImportServices";

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
  const { mutate: importExam, isPending: isImporting } = useExamImportService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedQuestions, setImportedQuestions] = useState<MultipleDynamicQuestionFormData | null>(null);
  const [formKey, setFormKey] = useState<string>('default');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: Log when importedQuestions changes
  useEffect(() => {
    console.log("=== IMPORTED QUESTIONS CHANGED ===");
    console.log("importedQuestions:", importedQuestions);
    if (importedQuestions) {
      console.log("Number of questions:", importedQuestions.questions.length);
      console.log("First question:", importedQuestions.questions[0]);
    }
  }, [importedQuestions]);

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

      // Don't clear previously imported questions - we'll append new ones
    }
  };

  // Map imported question data to form format
  const mapImportedDataToFormData = (importedData: any[]): MultipleDynamicQuestionFormData => {
    const mappedQuestions: DynamicQuestionFormData[] = importedData.map((item) => {
      const baseQuestion: DynamicQuestionFormData = {
        question: item.questionContent.question || "",
        questionType: item.questionType || "PART_I",
        difficultyLevel: item.difficultyLevel || "KNOWLEDGE",
        explanation: item.explanation || "",
        referenceSource: item.referenceSource || "",
        hasImage: false,
        lessonIds: item.lessonId ? [item.lessonId] : null,
        // Initialize all fields
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

      // Map specific question type data
      if (item.questionType === "PART_I" && item.questionContent.options) {
        baseQuestion.optionA = item.questionContent.options.A || "";
        baseQuestion.optionB = item.questionContent.options.B || "";
        baseQuestion.optionC = item.questionContent.options.C || "";
        baseQuestion.optionD = item.questionContent.options.D || "";

        // Set correct answer
        const correctAnswer = item.questionContent.answer;
        if (correctAnswer === "A") baseQuestion.correctAnswers = [true, false, false, false];
        else if (correctAnswer === "B") baseQuestion.correctAnswers = [false, true, false, false];
        else if (correctAnswer === "C") baseQuestion.correctAnswers = [false, false, true, false];
        else if (correctAnswer === "D") baseQuestion.correctAnswers = [false, false, false, true];
      } else if (item.questionType === "PART_II" && item.questionContent.statements) {
        baseQuestion.statementA = item.questionContent.statements.a?.text || "";
        baseQuestion.answerA = item.questionContent.statements.a?.answer || false;
        baseQuestion.statementB = item.questionContent.statements.b?.text || "";
        baseQuestion.answerB = item.questionContent.statements.b?.answer || false;
        baseQuestion.statementC = item.questionContent.statements.c?.text || "";
        baseQuestion.answerC = item.questionContent.statements.c?.answer || false;
        baseQuestion.statementD = item.questionContent.statements.d?.text || "";
        baseQuestion.answerD = item.questionContent.statements.d?.answer || false;
      } else if (item.questionType === "PART_III" && item.questionContent.answer) {
        baseQuestion.essayAnswer = item.questionContent.answer || "";
      }

      return baseQuestion;
    });

    return { questions: mappedQuestions };
  };

  // Handle file processing
  const handleFileProcess = () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file trước!");
      return;
    }

    console.log("=== FILE SUBMIT HANDLER ===");
    console.log("Processing file:", selectedFile);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Add staff_import field
    formData.append('staff_import', 'true');

    // Call the exam import service
    importExam(formData, {
      onSuccess: (response) => {
        console.log("Exam import successful:", response?.data?.data);
        toast.success("Import đề thi thành công!");

        // Process the imported data and convert to question bank format
        if (response?.data?.data && Array.isArray(response?.data?.data)) {
          const newMappedData = mapImportedDataToFormData(response?.data?.data);
          const isFirstImport = !importedQuestions;
          const currentQuestionsCount = importedQuestions?.questions.length || 0;
          const newQuestionsCount = newMappedData.questions.length;
          const totalAfterImport = currentQuestionsCount + newQuestionsCount;

          // Append to existing questions instead of replacing
          setImportedQuestions(prevQuestions => {
            if (prevQuestions) {
              // Merge with existing questions
              const combinedQuestions = {
                questions: [...prevQuestions.questions, ...newMappedData.questions]
              };
              console.log("Appended questions. Total:", combinedQuestions.questions.length);
              return combinedQuestions;
            } else {
              // First import
              console.log("First import. Questions:", newMappedData.questions.length);
              return newMappedData;
            }
          });

          // Update form key to force re-render
          setFormKey(`imported-${Date.now()}`);

          console.log("New mapped questions:", newMappedData);
          console.log("Current questions count:", currentQuestionsCount);
          console.log("New questions count:", newQuestionsCount);
          console.log("Total after import:", totalAfterImport);

          // Show different message based on whether this is first import or additional
          if (isFirstImport) {
            toast.success(`Đã import thành công ${newQuestionsCount} câu hỏi!`);
          } else {
            toast.success(`Đã import thêm ${newQuestionsCount} câu hỏi! Tổng cộng: ${totalAfterImport} câu hỏi.`);
          }
        } else {
          console.error("Invalid response data format:", response);
          toast.error("Dữ liệu import không hợp lệ!");
        }
      },
      onError: (error) => {
        console.error("Exam import failed:", error);
        toast.error("Import đề thi thất bại. Vui lòng thử lại!");
      },
    });
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
              disabled={isImporting}
            >
              {isImporting ? "Đang xử lí..." : "Xử lí"}
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
        key={formKey}
        onSubmit={handleMultipleSubmit}
        loading={isSubmitting}
        initialData={importedQuestions || undefined}
      />
    </div>
  );
}

export default CreateQuestionBankPage;
