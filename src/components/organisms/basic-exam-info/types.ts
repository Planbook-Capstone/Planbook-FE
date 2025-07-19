export interface BasicExamInfo {
  subject: string;
  grade: number;
  duration_minutes: number;
  school: string;
  exam_code: string;
  atomic_masses: string | null;
}

export const defaultBasicExamInfo: BasicExamInfo = {
  subject: "Hóa học",
  grade: 10,
  duration_minutes: 45,
  school: "",
  exam_code: "1234",
  atomic_masses: null,
};
