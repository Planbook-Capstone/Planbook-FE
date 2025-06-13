"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { GradeResponse, SubjectResponse } from "@/types";
import { useEffect } from "react";
import { useUpdateGradeService } from "@/services/gradeServices";
import { useUpdateSubjectService } from "@/services/subjectServices";

const FormSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Tên môn không được để trống",
    }),
});

interface UpdateSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: SubjectResponse | null;
}
function UpdateSubjectModal({
  open,
  onOpenChange,
  subject,
}: UpdateSubjectModalProps) {
  const { mutate } = useUpdateSubjectService();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: subject?.name,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (subject) {
      form.reset({ name: subject.name });
    }
  }, [subject, form, open]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate(
      {
        id: String(subject?.id),
        data: {
          name: data.name,
          gradeId: subject?.grade?.id,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật môn</DialogTitle>
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
                    <FormLabel>Tên môn</FormLabel>
                    <FormControl>
                      <Input placeholder="Cá nhân" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="float-end">
                Cập nhật
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateSubjectModal;
