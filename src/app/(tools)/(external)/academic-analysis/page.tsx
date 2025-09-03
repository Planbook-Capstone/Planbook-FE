import { Metadata } from "next";
import { AcademicAnalysisPage } from "@/components/templates/academic-analysis/AcademicAnalysisPage";

export const metadata: Metadata = {
  title: "Phân Tích Học Lực | PlanBook",
  description:
    "Công cụ phân tích học lực học sinh, xếp loại và đưa ra đề xuất cải thiện dựa trên dữ liệu điểm số",
  keywords: [
    "phân tích học lực",
    "xếp loại học sinh",
    "thống kê điểm số",
    "giáo dục",
  ],
};

export default function AcademicAnalysisPageRoute() {
  return <AcademicAnalysisPage />;
}
