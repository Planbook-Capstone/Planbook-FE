const SERVICES = {
  AUTH: "auth-service",
  MASTER_DATA: "master-data-service-local",
  LESSON_PLAN: "lesson-plan-service",
  ACADEMIC_RESOURCE: "academic-resource-service-local",
  EXTERNAL_TOOL: "external-tool-config-service",
  AGGREGATOR: "aggregator",
} as const;

const buildEndpoint = (service: string, path: string) =>
  `/${service}/api${path}`;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth-service/api/login",
    LOGIN_GOOGLE: "/auth-service/api/login-google",
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

  //EXECUTE-TOOL
  EXECUTE_TOOL: "aggregator/api/tool/execute",

  // Forms (Lesson Plans)
  FORMS: "/forms",

  // Lesson Plan

  LESSON_PLANS: {
    BASE: buildEndpoint(SERVICES.LESSON_PLAN, "/lesson-plans"),

    NODES: buildEndpoint(SERVICES.LESSON_PLAN, "/lesson-nodes"),
    TREE: (id: string) => `/lesson-plan-service/api/lesson-nodes/${id}/tree`,

    CHIDREN: (nodeId: string) =>
      `/lesson-plan-service/api/lesson-nodes/${nodeId}/children`,
  },
  LESSON_PLAN_GENERATION: "/lesson/generate-lesson-plan-content",

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

  // External Tools
  EXTERNAL_TOOLS: "external-tool-config-service/api/external-tools",
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
  TASKS_RESULT: (taskId: string) => `/tasks/result/${taskId}`,
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
