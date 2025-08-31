"use client";

import React, { useEffect } from "react";
import { TemplateCanvaLayoutContent } from "@/components/templates/template-canva-layout";
import { ExamProvider, useExamContext } from "@/contexts/ExamContext";
import {
  ExamTemplateProvider,
  useExamTemplateContext,
} from "@/contexts/ExamTemplateContext";
import { defaultScoringConfig } from "@/components/organisms/scoring-config-panel";

function ExamCreationPageContent() {
  // Get exam context
  const {
    basicExamInfo,
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
  } = useExamContext();
  const { setTemplateMetadata, templateMetadata } = useExamTemplateContext();

  // Set metadata from imported data or default
  useEffect(() => {
    if (!templateMetadata) {
      // Check if we have imported data (any questions exist)
      const hasImportedData =
        examQuestions.length > 0 ||
        examYesNoQuestions.length > 0 ||
        examShortQuestions.length > 0;

      if (hasImportedData && basicExamInfo) {
        // Use data from imported exam
        // console.log("=== SETTING METADATA FROM IMPORTED DATA ===");
        // console.log("Basic Info:", basicExamInfo);

        setTemplateMetadata({
          name: `Template ${basicExamInfo.subject} - Lớp ${basicExamInfo.grade}`,
          subject: basicExamInfo.subject || "Hóa học",
          grade: basicExamInfo.grade || 10,
          durationMinutes: basicExamInfo.duration_minutes || 90,
          totalScore:
            (examQuestions.length +
              examYesNoQuestions.length +
              examShortQuestions.length) *
            0.25,
          description: `Template được tạo từ đề thi ${basicExamInfo.subject}`,
          scoringConfig: defaultScoringConfig,
        });
      } else {
        // Use default metadata for manual creation
        console.log("=== SETTING DEFAULT METADATA ===");

        setTemplateMetadata({
          name: "Template mới",
          subject: "Chưa xác định",
          grade: 10,
          durationMinutes: 90,
          totalScore: 10,
          description: "",
          scoringConfig: defaultScoringConfig,
        });
      }
    }
  }, [
    templateMetadata,
    setTemplateMetadata,
    basicExamInfo,
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
  ]);

  // Show canvas directly
  return (
    <div className="h-screen w-full">
      <TemplateCanvaLayoutContent />
    </div>
  );
}

export default function ExamCreationPage() {
  return (
    <ExamProvider>
      <ExamTemplateProvider>
        <ExamCreationPageContent />
      </ExamTemplateProvider>
    </ExamProvider>
  );
}
