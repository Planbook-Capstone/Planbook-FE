"use client";

import React, { useState } from "react";
import { MultipleDynamicQuestionForm } from "@/components/forms/dynamic-question/MultipleDynamicQuestionForm";
import { DynamicQuestionFormData } from "@/schemas/dynamicQuestion.schema";
import { toast } from "sonner";
import { useCreateMaterialService } from "@/services/materialServices";
import { useCreateQuestionBankService, QuestionContent } from "@/services/questionBankServices";

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

  // Transform DynamicQuestionFormData to QuestionFormData
  const transformQuestionData = (data: DynamicQuestionFormData, imageUrl?: string): QuestionFormData => {
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
        const correctIndex = data.correctAnswers?.findIndex(answer => answer === true);
        questionContent.answer = correctIndex !== -1 ? ["A", "B", "C", "D"][correctIndex || 0] : "A";
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
      lessonIds: data.lessonIds && data.lessonIds.length > 0 ? data.lessonIds : undefined,
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

            const uploadResult = await createMaterialMutation.mutateAsync(formData);
            imageUrl = uploadResult?.data?.data?.url;

            console.log(`Image uploaded for question: ${imageUrl}`);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            toast.error(`Lỗi upload ảnh cho câu hỏi: ${questionData.question.substring(0, 30)}...`);
            continue; // Skip this question if image upload fails
          }
        }

        // Transform to API format
        const transformedQuestion = transformQuestionData(questionData, imageUrl);
        processedQuestions.push(transformedQuestion);
      }

      // Create all questions
      const createPromises = processedQuestions.map(question =>
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
    <div>
      <MultipleDynamicQuestionForm
        onSubmit={handleMultipleSubmit}
        loading={isSubmitting}
      />
    </div>
  );
}

export default CreateQuestionBankPage;
