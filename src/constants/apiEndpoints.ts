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

// Type for API endpoints (optional, for better TypeScript support)
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
