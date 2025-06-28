import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";

interface CurriculumListProps {
  bookId?: string;
  onLessonSelect?: (lessonId: string) => void;
}

const CurriculumList = ({ bookId, onLessonSelect }: CurriculumListProps) => {
  // Get chapters by book
  const { data: chaptersResponse, isLoading: isLoadingChapters } =
    useChaptersByBookService(bookId);
  const chapters = chaptersResponse?.data?.content || [];

  // Get lessons for all chapters at once
  const lessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  // // Show loading state
  // if (isLoadingChapters) {
  //   return (
  //     <div className="flex items-center justify-center p-8">
  //       <p>Đang tải chương...</p>
  //     </div>
  //   );
  // }

  // Show message if no chapters
  if (!chapters || chapters.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <p className="font-questrial">Không có chương nào trong sách này</p>
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={chapters.map((chapter: any) => `chapter-${chapter.id}`)}
    >
      {chapters
        .sort((a: any, b: any) => a.id - b.id)
        .map((chapter: any, index: number) => {
          // Get lessons data for this specific chapter
          const lessonData =
            (lessonQueries[index]?.data?.data?.content as any[]) || [];
          const isLoadingLessons = lessonQueries[index]?.isLoading || false;

          return (
            <AccordionItem
              key={chapter.id}
              value={`chapter-${chapter.id}`}
              className="mb-2"
            >
              <AccordionTrigger className="border font-calsans text-base p-2">
                {chapter.name}
              </AccordionTrigger>

              <AccordionContent className="py-3">
                {isLoadingLessons ? (
                  <div className="ml-10 text-gray-500 font-questrial">
                    Đang tải bài học...
                  </div>
                ) : lessonData.length > 0 ? (
                  lessonData
                    .sort((a: any, b: any) => a.id - b.id)
                    .map((lesson: any) => (
                      <li
                        key={lesson.id}
                        className="ml-10 text-[15px] cursor-pointer list-none hover:text-blue-600 transition-colors text-lg py-1"
                        onClick={() => {
                          console.log(
                            "Lesson clicked:",
                            lesson.id,
                            lesson.name
                          );
                          onLessonSelect?.(lesson.id.toString());
                        }}
                      >
                        {lesson.name}
                      </li>
                    ))
                ) : (
                  <div className="ml-10 text-gray-500 font-questrial">
                    Chưa có bài học nào
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
};

export default CurriculumList;
