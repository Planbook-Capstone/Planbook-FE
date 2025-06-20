"use client";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  useChaptersByBookService,
  useCreateChapterService,
} from "@/services/chapterServices";
import { toast } from "sonner";
import {
  useCreateLessonService,
  useLessonsByChapterService,
  useLessonsService,
} from "@/services/lessonServices";
import { useBookByIdService, useBooksService } from "@/services/bookServices";
import { Badge } from "@/components/ui/badge";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { getStatusVariant, translateStatus } from "@/utils/translateEnum";
import { useQuickTextBookAnalysisService } from "@/services/textbookServices";

// Zod schema for validation
const lessonSchema = z.object({
  lessonTitle: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề bài học")
    .refine((val) => val.trim().length > 0, {
      message: "Không được để trống hoặc chỉ chứa khoảng trắng",
    }),
  pdfFile: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "Chỉ được upload file PDF",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File phải nhỏ hơn 10MB",
    })
    .refine((file) => file.size > 0, {
      message: "Vui lòng chọn file PDF",
    }),
});

const chapterSchema = z.object({
  chapterTitle: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề chương")
    .refine((val) => val.trim().length > 0, {
      message: "Không được để trống hoặc chỉ chứa khoảng trắng",
    }),
  lessons: z.array(lessonSchema).min(1, "Chương phải có ít nhất 1 bài học"),
});

const formSchema = z.object({
  chapters: z.array(chapterSchema).min(1, "Phải có ít nhất 1 chương"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateChapterFormProps {
  bookId?: string;
  onClose?: () => void;
}

const CreateChapterForm = ({ bookId }: CreateChapterFormProps) => {
  const { data: book } = useBookByIdService(bookId);
  const { data: chaptersByBook } = useChaptersByBookService(bookId);

  const { mutateAsync: createChapterMutateAsync } = useCreateChapterService();
  const { mutateAsync: createLessonMutateAsync } = useCreateLessonService();
  const { mutateAsync: quickAnalysisMutateAsync } = useQuickTextBookAnalysisService();

  console.log("Chapters by book:", chaptersByBook?.data?.content);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chapters: [
        {
          chapterTitle: "",
          lessons: [{ lessonTitle: "", pdfFile: new File([], "") }],
        },
      ],
    },
  });

  const {
    fields: chapterFields,
    append: appendChapter,
    remove: removeChapter,
  } = useFieldArray({
    control,
    name: "chapters",
  });

  console.log("Form errors:", errors);
  console.log("Chapter fields:", chapterFields);

  const onSubmit = async (data: FormData) => {
    console.log("Received values of form:", data);
    setIsSubmitting(true);

    try {
      // Validate that we have at least one chapter
      if (!data.chapters || data.chapters.length === 0) {
        toast.error("Phải có ít nhất 1 chương");
        return;
      }

      for (const chapter of data.chapters) {
        try {
          // Gọi API tạo chương
          const createdChapter = await createChapterMutateAsync({
            name: chapter.chapterTitle.trim(),
            bookId: bookId,
          });
          toast.success(`Tạo chương ${chapter.chapterTitle} thành công`);

          // Tạo bài học bên trong chương
          for (const lesson of chapter.lessons || []) {
            try {
              const lessonData: any = {
                name: lesson.lessonTitle.trim(),
                chapterId: createdChapter?.data?.data?.id, // nếu cần liên kết
              };

              // Kiểm tra và xử lý file PDF (bắt buộc)
              if (!lesson.pdfFile || lesson.pdfFile.size === 0) {
                throw new Error(
                  `Bài học "${lesson.lessonTitle}" phải có file PDF đính kèm`
                );
              }

              lessonData.pdfFile = lesson.pdfFile;
              lessonData.pdfFileName = lesson.pdfFile.name;
              console.log(
                `PDF file attached for lesson ${lesson.lessonTitle}:`,
                lesson.pdfFile.name
              );

              const createdLesson = await createLessonMutateAsync(lessonData);
              toast.success(
                `→ Tạo bài ${lesson.lessonTitle} thành công (có PDF: ${lesson.pdfFile.name})`
              );

              // Gọi Quick TextBook Analysis sau khi tạo lesson thành công
              if (createdLesson?.data?.data?.id && lesson.pdfFile) {
                try {
                  setIsAnalyzing(true);
                  setAnalysisProgress(`Đang phân tích PDF cho bài "${lesson.lessonTitle}"...`);

                  console.log("🚀 Starting Quick TextBook Analysis for lesson:", {
                    lessonId: createdLesson.data.data.id,
                    fileName: lesson.pdfFile.name,
                    fileSize: lesson.pdfFile.size
                  });

                  // Tạo FormData cho quick analysis
                  const analysisFormData = new FormData();
                  analysisFormData.append("lesson_id", createdLesson.data.data.id);
                  analysisFormData.append("file", lesson.pdfFile);
                  analysisFormData.append("filename", lesson.pdfFile.name);
                  analysisFormData.append("create_embeddings", "true");

                  // // Optional: Thêm metadata
                  // analysisFormData.append("lesson_title", lesson.lessonTitle);
                  // analysisFormData.append("chapter_title", chapter.chapterTitle);
                  if (bookId) {
                    analysisFormData.append("book_id", bookId);
                  }

                  const analysisResponse = await quickAnalysisMutateAsync(analysisFormData);

                  console.log("✅ Quick Analysis Response:", analysisResponse);
                  console.log("📊 Analysis Data Structure:", {
                    success: analysisResponse?.success,
                    bookId: analysisResponse?.book_id,
                    lessonId: analysisResponse?.lesson_id,
                    hasBookStructure: !!analysisResponse?.book_structure,
                    chaptersCount: analysisResponse?.book_structure?.chapters?.length || 0
                  });

                  toast.success(
                    `📊 Phân tích PDF cho bài "${lesson.lessonTitle}" thành công!`
                  );

                  setAnalysisProgress(`Phân tích hoàn tất cho bài "${lesson.lessonTitle}"`);
                } catch (analysisError: any) {
                  console.error("❌ Quick Analysis Error:", analysisError);
                  console.error("📝 Error details:", {
                    message: analysisError.message,
                    response: analysisError.response?.data,
                    status: analysisError.response?.status
                  });

                  toast.error(
                    `Phân tích PDF thất bại cho bài "${lesson.lessonTitle}": ${analysisError.message}`
                  );
                  setAnalysisProgress(`Lỗi phân tích: ${analysisError.message}`);
                  // Không throw error để không dừng việc tạo lesson khác
                } finally {
                  setIsAnalyzing(false);
                }
              }
            } catch (lessonError: any) {
              console.error(
                lessonError.response?.data || lessonError.message,
                "Lỗi bài học"
              );
              toast.error(
                lessonError.response?.data ||
                  `Tạo bài ${lesson.lessonTitle} thất bại`
              );
            }
          }
        } catch (chapterError: any) {
          console.error(
            "Chapter creation error:",
            chapterError.response?.data || chapterError.message
          );
          toast.error(
            chapterError.response?.data?.message ||
              chapterError.message ||
              `Tạo chương ${chapter.chapterTitle} thất bại`
          );
        }
      }

      // Reset form after successful submission
      toast.success("Tạo tất cả chương và bài học thành công!");
      reset({
        chapters: [
          {
            chapterTitle: "",
            lessons: [{ lessonTitle: "", pdfFile: new File([], "") }],
          },
        ],
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error("Có lỗi xảy ra khi tạo chương và bài học");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-calsans py-5">{book?.data?.name}</h1>

        <Badge variant={getStatusVariant(book?.data?.status)}>
          {translateStatus(book?.data?.status)}{" "}
        </Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
          {chapterFields.map((chapterField, chapterIndex) => (
            <div key={chapterField.id}>
              <div className="flex items-start gap-2 w-full pb-2.5">
                <div className="flex-1">
                  <Controller
                    name={`chapters.${chapterIndex}.chapterTitle`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100 font-calsans placeholder:text-neutral-300"
                        placeholder="Chương 1"
                      />
                    )}
                  />
                  {errors.chapters?.[chapterIndex]?.chapterTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.chapters[chapterIndex]?.chapterTitle?.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (chapterFields.length <= 1) {
                      toast.error("Phải có ít nhất 1 chương");
                      return;
                    }
                    removeChapter(chapterIndex);
                  }}
                  disabled={chapterFields.length <= 1}
                  className="h-full bg-neutral-800 border text-white hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X />
                </Button>
              </div>

              {/* Lessons Section */}
              <div className="pl-14">
                <LessonsFieldArray
                  control={control}
                  chapterIndex={chapterIndex}
                  errors={errors}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="dash"
            onClick={() =>
              appendChapter({
                chapterTitle: "",
                lessons: [{ lessonTitle: "", pdfFile: new File([], "") }],
              })
            }
            className="bg-neutral-100"
          >
            + Thêm chương
          </Button>
        </div>

        <Button type="submit" className="w-full mt-5" disabled={isSubmitting}>
          {isSubmitting ? "Đang tạo..." : "Tạo chương và bài học"}
        </Button>
      </form>
    </>
  );
};

// Separate component for lessons field array
const LessonsFieldArray = ({
  control,
  chapterIndex,
  errors,
}: {
  control: any;
  chapterIndex: number;
  errors: any;
}) => {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `chapters.${chapterIndex}.lessons`,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {lessonFields.map((lessonField, lessonIndex) => (
        <div
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          key={lessonField.id}
        >
          <div className="flex items-start gap-2 w-full mb-3">
            <div className="flex-1">
              <Controller
                name={`chapters.${chapterIndex}.lessons.${lessonIndex}.lessonTitle`}
                control={control}
                render={({ field }) => <Input {...field} placeholder="Bài 1" />}
              />
              {errors.chapters?.[chapterIndex]?.lessons?.[lessonIndex]
                ?.lessonTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.chapters[chapterIndex]?.lessons[lessonIndex]
                      ?.lessonTitle?.message
                  }
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={() => {
                if (lessonFields.length <= 1) {
                  toast.error("Mỗi chương phải có ít nhất 1 bài học");
                  return;
                }
                removeLesson(lessonIndex);
              }}
              disabled={lessonFields.length <= 1}
              className="h-full bg-white border text-neutral-900 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X />
            </Button>
          </div>

          {/* PDF Upload Section */}
          <div className="mt-3">
            <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
              <FileText size={16} />
              Tài liệu PDF <span className="text-red-500">*</span>
            </label>
            <Controller
              name={`chapters.${chapterIndex}.lessons.${lessonIndex}.pdfFile`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file type
                          if (file.type !== "application/pdf") {
                            toast.error("Chỉ được upload file PDF!");
                            e.target.value = "";
                            return;
                          }
                          // Validate file size (10MB)
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error("File phải nhỏ hơn 10MB!");
                            e.target.value = "";
                            return;
                          }
                          onChange(file);
                        }
                      }}
                      // className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                    />
                  </div>

                  {/* Display selected file info */}
                  {value && value.size > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <FileText size={16} className="text-green-600" />
                      <span className="text-sm text-green-700 flex-1">
                        {value.name} ({(value.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => onChange(new File([], ""))}
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}

                  {/* Upload area hint */}
                  <div className="text-xs text-gray-500 mt-1">
                    Chọn file PDF (tối đa 10MB)
                  </div>
                </div>
              )}
            />
            {errors.chapters?.[chapterIndex]?.lessons?.[lessonIndex]
              ?.pdfFile && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors.chapters[chapterIndex]?.lessons[lessonIndex]?.pdfFile
                    ?.message
                }
              </p>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="dash"
        onClick={() =>
          appendLesson({ lessonTitle: "", pdfFile: new File([], "") })
        }
      >
        + Thêm bài
      </Button>
    </div>
  );
};

export default CreateChapterForm;
