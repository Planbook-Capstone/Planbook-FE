import { ACADEMIC_ANALYSIS_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  createSecondaryMutationUploadFilesHook,
  createSecondaryQueryWithPathParamHook,
} from "@/hooks/useApiFactory";

// Types for academic analysis
export interface StudentGrade {
  subject: string;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  class_name: string;
  grades: StudentGrade[];
}

export interface StudentAnalysis {
  student: Student;
  average_score: number;
  rank: number;
  grade_level: string;
  weak_subjects: string[];
  strong_subjects: string[];
}

export interface SubjectStatistic {
  subject: string;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  highest_score_student: string;
  lowest_score_student: string;
  total_students: number;
  pass_rate: number;
  excellent_count: number;
  good_count: number;
  average_count: number;
  weak_count: number;
}

export interface TopStudent {
  name: string;
  score: number;
}

export interface ClassStatistics {
  class_name: string;
  total_students: number;
  overall_average: number;
  highest_score: number;
  lowest_score: number;
  grade_distribution: {
    Giỏi: number;
    Khá: number;
    "Trung bình": number;
    Yếu: number;
  };
  top_students: TopStudent[];
  weak_students: TopStudent[];
  subject_statistics: SubjectStatistic[];
}

export interface AcademicAnalysisResponse {
  class_statistics: ClassStatistics;
  student_summaries: StudentAnalysis[];
  recommendations: string[];
}

// Hook for uploading academic analysis file
export const useUploadAcademicAnalysis = createSecondaryMutationUploadFilesHook(
  "academic-analysis",
  ACADEMIC_ANALYSIS_ENDPOINTS.UPLOAD_ANALYSIS
);

// Hook for getting analysis result by ID
export const useGetAcademicAnalysis = createSecondaryQueryWithPathParamHook(
  "academic-analysis-result",
  "/academic-analysis"
);
