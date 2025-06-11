"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useGradesService } from "@/services/gradeServices";
import { Grade, Subject } from "@/types";
import { da, fi } from "date-fns/locale";
import {
  useSubjectsByGradeService,
  useSubjectsService,
} from "@/services/subjectServices";
import { useCreateBookService } from "@/services/bookServices";
import { sub } from "date-fns";

const FormSchema = z.object({
  grade: z.string({
    required_error: "Vui lòng chọn khối",
  }),
  subject: z.string({
    required_error: "Vui lòng chọn khối",
  }),
  name: z
    .string({
      required_error: "Tên sách không được để trống",
    })
    .trim()
    .min(1, {
      message: "Tên sách phải ít nhất 1 kí tự",
    }),
  // description: z.string().optional(),
});

function CreateBookModal() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>(
    undefined
  );

  const { data: subjectsByGrade } = useSubjectsByGradeService(selectedGrade);

  const { data: grades } = useGradesService();

  const { mutate } = useCreateBookService();

  if (grades?.data?.content?.length === 0) {
    router.push("/admin/resource/setup");
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutate({
      name: data.name,
      subjectId: parseInt(data.subject),
    }, {
      onSuccess: () => {
        toast.success("Tạo sách thành công");
      },
      onError: () => {
        toast.error(
          "Tạo sách thất bại.Vui lòng kiểm tra kĩ thông tin"
        );
      },
    });

    // router.push("/admin/resource/123/content");
  }

  const onChangeGrade = (value: any) => {
    console.log(value);
    setSelectedGrade(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]">
          <Plus /> Tạo mới sách
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[630px]">
        <DialogHeader>
          <DialogTitle>Tạo mới sách</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khối</FormLabel>
                    <Select
                      onValueChange={(data) => {
                        field.onChange(data);
                        onChangeGrade(data);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grades?.data?.content
                          ?.sort((a: Grade, b: Grade) =>
                            a.name.localeCompare(b.name)
                          )
                          .map((g: Grade) => (
                            <SelectItem key={g.id} value={g.id.toString()}>
                              {g.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Môn học</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectsByGrade?.data?.content?.map(
                          (subject: Subject) => (
                            <SelectItem
                              key={subject.id}
                              value={subject.id.toString()}
                            >
                              {subject.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sách</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sách giáo khoa cánh diều ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <div className="flex justify-end items-center gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button type="submit">Tiếp tục</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateBookModal;
