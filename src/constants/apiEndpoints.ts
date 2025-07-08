/**
 * API Endpoints Constants
 * Centralized management of all API endpoints
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth-service-local/api/login",
    LOGIN_GOOGLE: "/auth-service-local/api/login-google",
  },

  // Academic Years
  ACADEMIC_YEARS: "/academic-years",

  // Books
  BOOKS: "master-data-service-local/api/books",
  BOOKS_BY_SUBJECT: "master-data-service-local/api/books/by-subject",

  // Book Types
  BOOK_TYPES: "/book-types",

  // Chapters
  CHAPTERS: "master-data-service-local/api/chapters",
  CHAPTERS_BY_BOOK: "master-data-service-local/api/chapters/by-book",

  // Grades
  GRADES: "master-data-service-local/api/grades",

  // Lessons
  LESSONS: "master-data-service-local/api/lessons",
  LESSONS_BY_CHAPTER: "master-data-service-local/api/lessons/by-chapter",

  // Subjects
  SUBJECTS: "master-data-service-local/api/subjects",
  SUBJECTS_BY_GRADE: "master-data-service-local/api/subjects/by-grade",

  // Forms (Lesson Plans)
  FORMS: "/forms",

  // Lesson Plan Templates
  LESSON_PLANS: "/lesson-plan-service-local/api/lesson-plans",

  LESSON_NODES: "/lesson-plan-service-local/api/lesson-nodes",
  LESSON_NODES_TREE: (id: string) =>
    `/lesson-plan-service-local/api/lesson-nodes/${id}/tree`,

  LESSON_NODE_CHIDREN: (nodeId: string) =>
    `/lesson-plan-service-local/api/lesson-nodes/${nodeId}/children`,

  // Tags
  TAGS: "/academic-resource-service-local/api/tags",

  //ACADEMIC RESOURCE
  ACADEMIC_RESOURCE: "academic-resource-service-local/api/academic-resources",
  //ACADEMIC RESOURCE SEARCH
  ACADEMIC_RESOURCE_SEARCH:
    "academic-resource-service-local/api/academic-resources/search",
  ACADEMIC_RESOURCE_UPLOAD:
    "/academic-resource-service-local/api/academic-resources/upload",

  ACADEMIC_RESOURSE_INTERNAL:
    "/academic-resource-service-local/api/academic-resources/internal",
} as const;

// PDF API Endpoints (Secondary API - Port 8000)
export const PDF_API_ENDPOINTS = {
  // Textbook management
  GET_ALL_TEXTBOOKS: "/pdf/getAllTextBook",
  GET_TEXTBOOK_BY_ID: (id: string) => `/pdf/getTextBook/${id}`,
  UPLOAD_TEXTBOOK: "/pdf/upload",
  DELETE_TEXTBOOK: (id: string) => `/pdf/deleteTextBook/${id}`,

  // Quick analysis
  QUICK_TEXTBOOK_ANALYSIS: "/pdf/import",

  //SEARCH
  RAG_QUERY: "pdf/rag-query",

  //Task-progress
  TASKS_STATUS: `/tasks/status`,
} as const;

export const EXAM_ENDPOINTS = {
  GENERATE_EXAM: `/exam/generate-exam`,
  GENERATE_SMART_EXAM: `/exam/generate-smart-exam`,
  EXAM_IMPORT: `/exam/import-docx`,
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
