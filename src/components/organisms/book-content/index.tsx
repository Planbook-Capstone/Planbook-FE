import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";

interface BookContentProps {
  bookId?: string;
}

const BookContent: React.FC<BookContentProps> = ({ bookId }) => {
  const { data: chaptersResponse } = useChaptersByBookService(bookId);
  const chapters = chaptersResponse?.data?.content || [];

  const lessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  return (
    <div className="space-y-4">
      {chapters?.map((chapter: any, index: number) => {
        const lessonData =
          (lessonQueries[index]?.data?.data?.content as any[]) || [];

        return (
          <div key={chapter.id} className="p-4 border rounded shadow-sm">
            <h2 className="font-bold text-lg">{chapter.name}</h2>
            <ul className="list-disc ml-5 mt-2">
              {lessonData?.map((lesson: any) => (
                <li key={lesson.id}>{lesson.name}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default BookContent;
