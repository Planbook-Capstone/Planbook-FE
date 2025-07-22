"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useExamTemplateByIdService } from "@/services/examTemplateServices";
import { TemplateCanvaLayoutContent } from "@/components/templates/template-canva-layout";
import { ExamProvider, useExamContext } from "@/contexts/ExamContext";
import {
  ExamTemplateProvider,
  useExamTemplateContext,
} from "@/contexts/ExamTemplateContext";
import { useRouter } from "next/navigation";

interface ExamTemplateDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

// Component để xử lý dữ liệu và populate vào context
function ExamTemplateDetailsContent({ templateId }: { templateId: string }) {
  const {
    data: templateData,
    isLoading,
    error,
  } = useExamTemplateByIdService(templateId);

  const { setExamFromApiResponse } = useExamContext();
  const { setTemplateMode, setTemplateMetadata } = useExamTemplateContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (templateData?.data && !hasInitialized.current) {
      const template = templateData.data;
      console.log("=== TEMPLATE DATA RECEIVED ===");
      console.log("Template:", template);

      // Set template mode
      setTemplateMode(true);

      // Set template metadata
      setTemplateMetadata({
        name: template.name,
        subject: template.subject,
        grade: template.grade,
        durationMinutes: template.durationMinutes,
        totalScore: template.totalScore,
        gradingConfig: template.gradingConfig,
      });

      // Mark as initialized
      hasInitialized.current = true;

      // Convert template data to API response format and use setExamFromApiResponse
      // Transform the data to match the expected format in setExamFromApiResponse
      const parts = template.contentJson?.parts || [];
      const transformedParts = [];

      // Find and transform parts by their names
      const part1 = parts.find(p => p.part === "PHẦN I");
      const part2 = parts.find(p => p.part === "PHẦN II");
      const part3 = parts.find(p => p.part === "PHẦN III");

      // Transform PHẦN I (Multiple Choice) - keep as is
      if (part1) {
        transformedParts.push(part1);
      }

      // Transform PHẦN II (True/False) - convert subQuestions to statements format
      if (part2) {
        const transformedPart2 = {
          ...part2,
          questions: part2.questions?.map((q: any) => {
            if (q.subQuestions) {
              // Convert subQuestions to statements format
              const statements = {
                a: { text: q.subQuestions[0]?.statement || "", answer: q.subQuestions[0]?.answer || false },
                b: { text: q.subQuestions[1]?.statement || "", answer: q.subQuestions[1]?.answer || false },
                c: { text: q.subQuestions[2]?.statement || "", answer: q.subQuestions[2]?.answer || false },
                d: { text: q.subQuestions[3]?.statement || "", answer: q.subQuestions[3]?.answer || false },
              };
              return {
                ...q,
                statements
              };
            }
            return q;
          }) || []
        };
        transformedParts.push(transformedPart2);
      }

      // Transform PHẦN III (Short Answer) - keep as is
      if (part3) {
        transformedParts.push(part3);
      }

      // Add any remaining parts
      parts.forEach(part => {
        if (part.part !== "PHẦN I" && part.part !== "PHẦN II" && part.part !== "PHẦN III") {
          transformedParts.push(part);
        }
      });

      const apiResponseFormat = {
        data: {
          data: {
            subject: template.subject,
            grade: template.grade,
            duration_minutes: template.durationMinutes,
            school: template.contentJson?.examInfo?.header || "",
            exam_code: template.contentJson?.examInfo?.examCode || "",
            atomic_masses: null,
            parts: transformedParts
          }
        }
      };

      console.log("=== LOADING TEMPLATE DATA ===");
      console.log("Original template:", template);
      console.log("Transformed parts:", transformedParts);
      console.log("API Response Format:", apiResponseFormat);

      // Use the existing setExamFromApiResponse method
      setExamFromApiResponse(apiResponseFormat);
    }
  }, [templateData]); // Only depend on templateData, use ref to prevent re-initialization

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang tải thông tin template...</p>
        </div>
      </div>
    );
  }

  if (error || !templateData) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-red-600 text-lg font-semibold mb-2">
            Không thể tải thông tin template
          </h2>
          <p className="text-red-500 mb-4">
            {error?.message || "Đã xảy ra lỗi khi tải dữ liệu"}
          </p>
        </div>
      </div>
    );
  }

  // Render the template canvas layout
  return <TemplateCanvaLayoutContent />;
}

export default function ExamTemplateDetails({
  params,
}: ExamTemplateDetailsProps) {
  const resolvedParams = use(params);

  return (
    <ExamProvider>
      <ExamTemplateProvider>
        <ExamTemplateDetailsContent templateId={resolvedParams.id} />
      </ExamTemplateProvider>
    </ExamProvider>
  );

