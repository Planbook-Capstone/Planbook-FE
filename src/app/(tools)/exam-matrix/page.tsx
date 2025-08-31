"use client";
import MatrixTemplate2 from "@/components/templates/matrix-v2";
import { useEffect } from "react";

function ExamMatrixPage() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Changes that you made may not be saved.";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  return (
    <div className="h-screen space-y-6">
      <MatrixTemplate2 />
    </div>
  );
}

export default ExamMatrixPage;
