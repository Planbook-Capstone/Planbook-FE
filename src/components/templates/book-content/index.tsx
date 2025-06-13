import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";
import * as React from "react";
import { ChevronsUpDown, Edit, EditIcon, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import UpdateChapterModal from "@/components/organisms/update-chapter-modal";
import UpdateLessonModal from "@/components/organisms/update-lesson-modal";

interface BookContentProps {
  bookId?: string;
}

const BookContent: React.FC<BookContentProps> = ({ bookId }) => {
  const { data: chaptersResponse } = useChaptersByBookService(bookId);
  const chapters = chaptersResponse?.data?.content || [];

  const [modalChapterOpen, setModalChapterOpen] = React.useState(false);
  const [editingChapter, setEditingChapter] = React.useState<any | null>(null);

  const [modalLessonOpen, setModalLessonOpen] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState<any | null>(null);

  const lessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  const [openStates, setOpenStates] = React.useState<Record<number, boolean>>(
    {}
  );

  React.useEffect(() => {
    if (chapters.length > 0) {
      const defaultStates: Record<number, boolean> = {};
      chapters.forEach((_: any, i: any) => {
        defaultStates[i] = true;
      });
      setOpenStates(defaultStates);
    }
  }, [chapters]);

  const toggleOpen = (index: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter: any, index: number) => {
        const lessonData =
          (lessonQueries[index]?.data?.data?.content as any[]) || [];

        return (
          <>
            <Collapsible
              key={chapter.id}
              open={openStates[index]}
              onOpenChange={() => toggleOpen(index)}
              className="flex w-full flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex justify-start items-center gap-2">
                  <h4 className="text-base font-calsans">{chapter.name}</h4>

                  <PencilLine
                    size={22}
                    className="cursor-pointer"
                    onClick={() => {
                      setEditingChapter(chapter);
                      setModalChapterOpen(true);
                    }}
                  />
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDown />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="flex flex-col gap-2 pl-10">
                {lessonData.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="rounded-md border px-4 py-2 text-sm flex justify-between"
                  >
                    {lesson.name}
                    <PencilLine
                      size={22}
                      className="cursor-pointer"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setModalLessonOpen(true);
                      }}
                    />
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </>
        );
      })}
      <UpdateChapterModal
        open={modalChapterOpen}
        onOpenChange={(open) => setModalChapterOpen(open)}
        chapter={editingChapter}
      />
      <UpdateLessonModal
        open={modalLessonOpen}
        onOpenChange={(open) => setModalLessonOpen(open)}
        lesson={editingLesson}
      />
    </div>
  );
};

export default BookContent;
