import { z } from "zod";
import { chapterSchema } from "./chapter.schema";

export const formSchema = z.object({
  chapters: z.array(chapterSchema).min(1, "Phải có ít nhất 1 chương"),
});

export type FormData = z.infer<typeof formSchema>;
