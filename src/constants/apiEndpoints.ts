const SERVICES = {
  AUTH: "identity-service",
  MASTER_DATA: "master-data-service",
  LESSON_PLAN: "lesson-plan-template-service",
  ACADEMIC_RESOURCE: "academic-resource-service",
  EXTERNAL_TOOL: "external-tool-config-service",
  AGGREGATOR: "aggregator",
  SUBSCRIPTION: "purchase-service",
  WORKSPACE: "workspace-service",
  TOOL_LOG: "tool-log-service",
  EXAM_SERVICE: "exam-service",
} as const;

const buildEndpoint = (service: string, path: string) =>
  `/${service}/api${path}`;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: buildEndpoint(SERVICES.AUTH, "/login"),
    REGISTER: buildEndpoint(SERVICES.AUTH, "/register"),
    LOGIN_GOOGLE: buildEndpoint(SERVICES.AUTH, "/login-google"),
    REFRESH_TOKEN: buildEndpoint(SERVICES.AUTH, "/refresh"),
    FORGOT_PASSWORD: buildEndpoint(SERVICES.AUTH, "/forgot-password"),
    RESET_PASSWORD: buildEndpoint(SERVICES.AUTH, "/reset-password"),
    VERIFY: buildEndpoint(SERVICES.AUTH, "/verify"),
  },
  USERS_MANAGEMENT: {
    BASE: buildEndpoint(SERVICES.AUTH, "/users"),
  },
  // Book Types
  BOOK_TYPES: buildEndpoint(SERVICES.AUTH, "/book-types"),

  WALLET: buildEndpoint(SERVICES.AUTH, "/wallets"),
  WALLET_TRANSACTIONS: buildEndpoint(SERVICES.AUTH, "/wallets/transactions"),

  // Academic Years
  ACADEMIC_YEARS: buildEndpoint(SERVICES.WORKSPACE, "/academic-years"),

  //TOOL RESULT IN WORKSPACE
  TOOL_RESULTS: buildEndpoint(SERVICES.WORKSPACE, "/tool-results"),

  //TOOL LOG
  TOOL_LOG: buildEndpoint(SERVICES.TOOL_LOG, "/tool-logs"),

  MASTER_DATA: {
    BOOKS: buildEndpoint(SERVICES.MASTER_DATA, "/books"),
    BOOKS_BY_SUBJECT: buildEndpoint(SERVICES.MASTER_DATA, "/books/by-subject"),

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
    SUBJECTS_BY_GRADE: buildEndpoint(
      SERVICES.MASTER_DATA,
      "/subjects/by-grade"
    ),
  },

  // Subscriptions
  SUBSCRIPTIONS: buildEndpoint(SERVICES.SUBSCRIPTION, "/subscription-packages"),

  //Order
  ORDERS: buildEndpoint(SERVICES.SUBSCRIPTION, "/orders"),

  //CANCEL ORDER
  CANCEL_PAYMENT: buildEndpoint(
    SERVICES.SUBSCRIPTION,
    "/orders/cancel-payment"
  ),

  //EXECUTE-TOOL
  EXECUTE_TOOL: "aggregator/api/tool/execute",

  ESTIMATE_TOKEN: buildEndpoint(SERVICES.AGGREGATOR, "/tool/estimate-token"),

  // Forms (Lesson Plans)
  FORMS: "/forms",

  // Lesson Plan

  LESSON_PLANS: {
    BASE: buildEndpoint(SERVICES.LESSON_PLAN, "/lesson-plan-templates"),

    NODES: buildEndpoint(SERVICES.LESSON_PLAN, "/lesson-nodes"),
    TREE: (id: string) =>
      buildEndpoint(SERVICES.LESSON_PLAN, `/lesson-nodes/${id}/tree`),

    CHIDREN: (nodeId: string) =>
      buildEndpoint(SERVICES.LESSON_PLAN, `/lesson-nodes/${nodeId}/children`),

    ALL_NODES: (lessonPlanId: string) =>
      buildEndpoint(
        SERVICES.LESSON_PLAN,
        `/admin/lesson-nodes/${lessonPlanId}/all-nodes`
      ),
  },

  LESSON_PLAN_GENERATION: "/lesson/generate-lesson-plan-content",
  UPLOAD_DOCX_TO_ONLINE: "/lesson/upload-docx-to-online",

  // Tags
  TAGS: buildEndpoint(SERVICES.ACADEMIC_RESOURCE, "/tags"),

  //ACADEMIC RESOURCE
  ACADEMIC_RESOURCE: buildEndpoint(
    SERVICES.ACADEMIC_RESOURCE,
    "/academic-resources"
  ),
  //ACADEMIC RESOURCE SEARCH
  ACADEMIC_RESOURCE_SEARCH: buildEndpoint(
    SERVICES.ACADEMIC_RESOURCE,
    "/academic-resources/search"
  ),
  ACADEMIC_RESOURCE_UPLOAD: buildEndpoint(
    SERVICES.ACADEMIC_RESOURCE,
    "/academic-resources/upload"
  ),

  ACADEMIC_RESOURSE_INTERNAL: buildEndpoint(
    SERVICES.ACADEMIC_RESOURCE,
    "/academic-resources/internal"
  ),

  // External Tools
  EXTERNAL_TOOLS: buildEndpoint(SERVICES.EXTERNAL_TOOL, "/external-tools"),

  // Slide Templates
  SLIDE_TEMPLATES: "slide-template-service/api/slide-templates",
  SLIDE_DETAILS: "slide-template-service/api/slide-details/template",

  SLIDE_PROCESS_JSON_TEMPLATE: "/slides/process-json-template",
} as const;

// PDF API Endpoints (Secondary API - Port 8000)
export const PDF_API_ENDPOINTS = {
  BASE: "/pdf",
  // Textbook management
  GET_ALL_TEXTBOOKS: "/pdf/getAllTextBook",
  GET_TEXTBOOK_BY_ID: (id: string) => `/pdf/getTextBook/${id}`,
  UPLOAD_TEXTBOOK: "/pdf/upload",
  DELETE_TEXTBOOK: (id: string) => `/pdf/deleteTextBook/${id}`,

  // Quick analysis
  QUICK_TEXTBOOK_ANALYSIS: "/pdf/import",

  GUIDES: "/pdf/guides",

  LESSON: "/pdf/lessons",

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
  // Exam Instances
  EXAM_INSTANCES: `/exam-service/api/exam-instances`,
  // Student Exam Taking
  EXAM_BY_CODE: (code: string) =>
    `/exam-service/api/exam-instances/code/${code}`,
  SUBMIT_EXAM: (code: string) =>
    `/exam-service/api/exam-instances/code/${code}/submit`,
  // Question Banks
  QUESTION_BANKS: `/exam-service/api/v1/question-banks`,

  EXAM_GENERATOR: buildEndpoint(SERVICES.EXAM_SERVICE, "/exam-generator"),

  MATRIX_CONFIGS: buildEndpoint(SERVICES.EXAM_SERVICE, "/matrix-configs"),
} as const;

// Academic Analysis Endpoints (Secondary API - Port 8000)
export const ACADEMIC_ANALYSIS_ENDPOINTS = {
  UPLOAD_ANALYSIS: "/api/v1/upload-and-analyze",
  GET_ANALYSIS: (id: string) => `/api/v1/analysis/${id}`,
} as const;

// Combined endpoints for easy access
export const ALL_API_ENDPOINTS = {
  MAIN: API_ENDPOINTS,
  PDF: PDF_API_ENDPOINTS,
  ACADEMIC_ANALYSIS: ACADEMIC_ANALYSIS_ENDPOINTS,
} as const;

// Type for API endpoints (optional, for better TypeScript support)
export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
export type PdfApiEndpoint =
  (typeof PDF_API_ENDPOINTS)[keyof typeof PDF_API_ENDPOINTS];
