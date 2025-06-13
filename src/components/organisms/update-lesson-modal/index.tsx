"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useEffect } from "react";

import { useUpdateLessonService } from "@/services/lessonServices";

const FormSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Tên bài không được để trống",
    }),
});

interface UpdateLessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: any | null;
}
function UpdateLessonModal({
  open,
  onOpenChange,
  lesson,
}: UpdateLessonModalProps) {
  const { mutate } = useUpdateLessonService();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: lesson?.name,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (lesson) {
      form.reset({ name: lesson.name });
    }
  }, [lesson, form, open]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        id: String(lesson?.id),
        data: {
          name: data.name,
          chapterId: lesson?.chapter?.id,
        },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật thành công");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Cập nhật bài</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bài</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Cập nhật</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateLessonModal;
