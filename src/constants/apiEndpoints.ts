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
  BOOKS: buildEndpoint(SERVICES.MASTER_DATA, "/books"),
  BOOKS_BY_SUBJECT: buildEndpoint(SERVICES.MASTER_DATA, "/books/by-subject"),

  // Book Types
  BOOK_TYPES: "/book-types",

  // Chapters
  CHAPTERS: buildEndpoint(SERVICES.MASTER_DATA, "/chapters"),
  CHAPTERS_BY_BOOK: buildEndpoint(SERVICES.MASTER_DATA, "/chapters/by-book"),

  // Grades
  GRADES: buildEndpoint(SERVICES.MASTER_DATA, "/grades"),

  // Lessons
  LESSONS: buildEndpoint(SERVICES.MASTER_DATA, "/lessons"),
  LESSONS_BY_CHAPTER: buildEndpoint(
    SERVICES.MASTER_DATA,
    "/lessons/by-chapter"
  ),

  // Subjects
  SUBJECTS: buildEndpoint(SERVICES.MASTER_DATA, "/subjects"),
  SUBJECTS_BY_GRADE: buildEndpoint(SERVICES.MASTER_DATA, "/subjects/by-grade"),

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
  RAG_QUERY: "/rag/query",

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
