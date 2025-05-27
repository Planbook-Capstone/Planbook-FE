import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CurriculumListProps = {
  classId?: number;
  subjectId?: number;
  bookId?: number;
};

const CurriculumList = ({
  classId,
  subjectId,
  bookId,
}: CurriculumListProps) => {
  const data = {
    id: 1,
    name: "Hóa học 11 - Bộ sách giáo khoa cánh diều",
    chapters: [
      {
        id: 2,
        title: "Chương 2. Nitrogen - Sulfur",
        description: null,
        createdAt: "24/05/2025 22:48:26",
        status: "ACTIVE",
        lessons: [
          {
            id: 4,
            title: "Bài 4. Đơn chất Nitrogen",
            description: null,
            youtubeLink: null,
            githubLink: null,
            createdAt: "24/05/2025 22:49:31",
            status: "ACTIVE",
          },
          {
            id: 6,
            title: "Bài 6. Sulfur và sulfur dioxide",
            description: null,
            youtubeLink: null,
            githubLink: null,
            createdAt: "24/05/2025 22:50:48",
            status: "ACTIVE",
          },
          {
            id: 19,
            title: "Bài 7. Sulfuric acid và muối sulfate",
            description: null,
            youtubeLink: null,
            githubLink: null,
            createdAt: "24/05/2025 23:05:08",
            status: "ACTIVE",
          },
          {
            id: 5,
            title: "Bài 5. Một số hợp chất quan trọng của nitrogen",
            description: null,
            youtubeLink: null,
            githubLink: null,
            createdAt: "24/05/2025 22:50:39",
            status: "ACTIVE",
          },
        ],
      },
    ],
  };
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={[`chapter - ${data.chapters[0].id}`]}
    >
      {data?.chapters
        ?.sort((a, b) => a.id - b.id)
        .map((c) => (
          <AccordionItem
            key={c.id}
            value={`chapter - ${c.id}`}
            className="pt-5"
          >
            <AccordionTrigger className="border font-calsans text-lg p-2">
              {c.title}
            </AccordionTrigger>

            <AccordionContent className="py-3">
              {c.lessons
                .sort((a, b) => a.id - b.id)
                .map((lesson) => (
                  <li
                    key={lesson.id}
                    className="ml-10 cursor-pointer list-none hover:text-blue-600 transition-colors text-lg"
                    onClick={() => {
                      console.log("Selected lesson:", lesson);
                    }}
                  >
                    {lesson.title}
                  </li>
                ))}
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default CurriculumList;
