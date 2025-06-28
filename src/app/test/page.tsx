import AutoGradingPage from "@/components/templates/auto-grading";
import ChatScreenTemplate from "@/components/templates/chat-screen";
import ExamMatrixTemplate from "@/components/templates/matrix";
import MatrixTemplate2 from "@/components/templates/matrix-v2";
import TestLayout from "@/components/templates/test-layout";

export default function Page() {
  return (
    <div className="h-screen space-y-6">
      <ExamMatrixTemplate />
      <MatrixTemplate2 />
    </div>
  );
}
