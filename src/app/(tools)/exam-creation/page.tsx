"use client";

import React, { useState, useEffect, useRef } from "react";
import { CanvaLayoutContent } from "@/components/templates/canva-layout";
import { TemplateCanvaLayoutContent } from "@/components/templates/template-canva-layout";
import { useExamImportService } from "@/services/examImportServices";
import { toast } from "sonner";
import { useExamContext, ExamProvider } from "@/contexts/ExamContext";
import {
  ExamTemplateProvider,
  useExamTemplateContext,
} from "@/contexts/ExamTemplateContext";
import ExamTemplateSelector from "@/components/organisms/exam-template-selector";
import ExamTemplateMetadataForm, {
  ExamTemplateMetadata,
} from "@/components/organisms/exam-template-metadata-form";
import { useSearchParams } from "next/navigation";

function ExamCreationPageContent() {
  const [hasData, setHasData] = useState(false);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [isTemplateMode, setIsTemplateMode] = useState(false);

  // Initialize the exam import service
  const { mutate: importExam, isPending: isImporting } = useExamImportService();

  // Get exam context
  const { setExamFromApiResponse } = useExamContext();
  const { setTemplateMode, setTemplateMetadata } = useExamTemplateContext();
  const searchParams = useSearchParams();
  const hasInitializedPreview = useRef(false);

  // Check URL parameters on component mount
  useEffect(() => {
    const mode = searchParams.get("mode");
    const preview = searchParams.get("preview");

    console.log("=== URL PARAMS DETECTION ===");
    console.log("Mode:", mode);
    console.log("Preview:", preview);
    console.log("Has initialized preview:", hasInitializedPreview.current);

    if (mode === "template") {
      setIsTemplateMode(true);
      setTemplateMode(true);

      if (preview === "true" && !hasInitializedPreview.current) {
        // If preview mode, set default template metadata and show canvas directly
        console.log(
          "Preview mode detected - setting default template metadata"
        );

        setTemplateMetadata({
          name: "Template Đề Thi Mẫu",
          subject: "Hóa học",
          grade: 10,
          durationMinutes: 90,
          totalScore: 10,
          gradingConfig: {
            "PHẦN I": 0.25,
            "PHẦN II": 1.0,
            "PHẦN III": 0.25,
          },
          description: "Template mẫu để tạo đề thi",
        });

        setHasData(true);
        hasInitializedPreview.current = true;
      }
    }
  }, [searchParams, setTemplateMode, setTemplateMetadata]);

  const handleFileSubmit = (files: File[]) => {
    console.log("=== FILE SUBMIT HANDLER ===");
    console.log("Number of files:", files.length);
    console.log(
      "File details:",
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
      }))
    );

    // Create FormData for file upload
    const formData = new FormData();

    // Add each file to FormData
    files.forEach((file) => {
      formData.append(`file`, file);
    });

    // Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Call the exam import service
    importExam(formData, {
      onSuccess: (response) => {
        console.log("Exam import successful:", response);
        toast.success("Import đề thi thành công!");

        if (isTemplateMode) {
          // If in template mode, show metadata form after import
          setExamFromApiResponse(response);
          setShowMetadataForm(true);
        } else {
          // Normal mode - just show canvas
          setExamFromApiResponse(response);
          setHasData(true);
        }
      },
      onError: (error) => {
        console.error("Exam import failed:", error);
        toast.error("Import đề thi thất bại. Vui lòng thử lại!");
      },
    });
  };

  const handleCreateManually = () => {
    console.log("Creating exam manually");

    if (isTemplateMode) {
      // If in template mode, show metadata form first
      setShowMetadataForm(true);
    } else {
      // Normal mode - just show canvas
      setHasData(true);
    }
  };

  const handleMetadataSubmit = (metadata: ExamTemplateMetadata) => {
    console.log("Template metadata:", metadata);

    // Set template metadata in context
    setTemplateMetadata(metadata);

    // Show canvas after metadata is set
    setHasData(true);
    setShowMetadataForm(false);
  };

  const handleMetadataCancel = () => {
    setShowMetadataForm(false);
    setIsTemplateMode(false);
    setTemplateMode(false);
  };

  const handleModeSelect = (isTemplate: boolean) => {
    setIsTemplateMode(isTemplate);
    setTemplateMode(isTemplate);
  };

  // Show metadata form if needed
  if (showMetadataForm) {
    return (
      <div className="w-full">
        <ExamTemplateMetadataForm
          onSubmit={handleMetadataSubmit}
          onCancel={handleMetadataCancel}
        />
      </div>
    );
  }

  // Show template selector or file import interface when there's no data
  if (!hasData) {
    return (
      <div className="w-full">
        <ExamTemplateSelector
          onImportFile={(files) => {
            handleModeSelect(true); // Set template mode
            handleFileSubmit(files);
          }}
          onCreateManually={() => {
            handleModeSelect(true); // Set template mode
            handleCreateManually();
          }}
          isImporting={isImporting}
        />
      </div>
    );
  }

  // Show appropriate canvas based on mode
  return (
    <div className="h-screen w-full">
      {isTemplateMode ? <TemplateCanvaLayoutContent /> : <CanvaLayoutContent />}
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
