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
  BOOKS: "/book",

  // Book Types
  BOOK_TYPES: "/book-type",

  // Chapters
  CHAPTERS: "/chapter",
  CHAPTERS_BY_BOOK: "/chapter/by-book",

  // Grades
  GRADES: "/grade",

  // Lessons
  LESSONS: "/lesson",
  LESSONS_BY_CHAPTER: "/lesson/by-chapter",

  // Subjects
  SUBJECTS: "/subject",
  SUBJECTS_BY_GRADE: "/subject/by-grade",

  // Forms (Lesson Plans)
  FORMS: "/form",
} as const;

// Type for API endpoints (optional, for better TypeScript support)
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
