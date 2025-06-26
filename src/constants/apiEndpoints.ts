/**
 * API Endpoints Constants
 * Centralized management of all API endpoints
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/login",
    LOGIN_GOOGLE: "/login-google",
  },

  // Academic Years
  ACADEMIC_YEARS: "/academic-years",

  // Books
  BOOKS: "/books",
  BOOKS_BY_SUBJECT: "/books/by-subject",

  // Book Types
  BOOK_TYPES: "/book-types",

  // Chapters
  CHAPTERS: "/chapters",
  CHAPTERS_BY_BOOK: "/chapters/by-book",

  // Grades
  GRADES: "/grades",

  // Lessons
  LESSONS: "/lessons",
  LESSONS_BY_CHAPTER: "/lessons/by-chapter",

  // Subjects
  SUBJECTS: "/subjects",
  SUBJECTS_BY_GRADE: "/subjects/by-grade",

  // Forms (Lesson Plans)
  FORMS: "/forms",
} as const;

// PDF API Endpoints (Secondary API - Port 8000)
export const PDF_API_ENDPOINTS = {
  // Textbook management
  GET_ALL_TEXTBOOKS: "/pdf/getAllTextBook",
  GET_TEXTBOOK_BY_ID: (id: string) => `/pdf/getTextBook/${id}`,
  UPLOAD_TEXTBOOK: "/pdf/upload",
  DELETE_TEXTBOOK: (id: string) => `/pdf/deleteTextBook/${id}`,

  // Quick analysis
  QUICK_TEXTBOOK_ANALYSIS: "/pdf/quick-textbook-analysis",

  //Task-progress
  TASKS_STATUS: `/tasks/status`,
} as const;

export const EXAM_GENERATION_ENDPOINTS = {
  EXAM_GENERATION: `/exam/generate-exam`,
} as const;

export const LESSON_FRAMEWORK_ENDPOINTS = {
  //UPLOAD LESON PLAN FRAMEWORK
  LESSON_PLAN_FRAMEWORK: `/lesson/lesson-plan-framework`,
} as const;

// Combined endpoints for easy access
export const ALL_API_ENDPOINTS = {
  MAIN: API_ENDPOINTS,
  PDF: PDF_API_ENDPOINTS,
} as const;

// Type for API endpoints (optional, for better TypeScript support)
export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type PdfApiEndpoint =
  (typeof PDF_API_ENDPOINTS)[keyof typeof PDF_API_ENDPOINTS];
