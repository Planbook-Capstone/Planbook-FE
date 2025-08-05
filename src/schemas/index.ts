// Export all schemas from a central location
export { lessonSchema, type LessonFormData } from "./lesson.schema";
export { chapterSchema, type ChapterFormData } from "./chapter.schema";
export { formSchema, type FormData } from "./form.schema";
export {
  gradeItemSchema,
  gradeFormSchema,
  type GradeItemFormData,
  type GradeFormData,
} from "./grade.schema";
export {
  academicYearSchema,
  type AcademicYearFormData,
} from "./academicYear.schema";
export { frameworkSchema, type FrameworkFormData } from "./framework.schema";
export { tagSchema, type TagData } from "./tag.schema";
export {
  materialSchema,
  type MaterialFormData,
  type FileData,
  type MaterialTag,
  getFileCategory,
  formatFileSize,
  getFileIcon,
} from "./material.schema";
export {
  dynamicQuestionSchema,
  type DynamicQuestionFormData,
  getInitialFormValues,
} from "./dynamicQuestion.schema";
export {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
  type UserResponse,
  type CreateUserRequest,
  type UpdateUserRequest,
  roleOptions,
} from "./user.schema";
