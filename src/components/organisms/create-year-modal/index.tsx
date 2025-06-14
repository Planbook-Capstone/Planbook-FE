"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateAcademicYearService } from "@/services/academicYearServices";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/Button";

const FormSchema = z
  .object({
    start_date: z.date({
      required_error: "Vui lòng chọn ngày bắt đầu năm học.",
    }),
    end_date: z.date({
      required_error: "Vui lòng chọn ngày kết thúc năm học.",
    }),
  })
  .refine(
    (data) => {
      const startYear = data.start_date.getFullYear();
      const endYear = data.end_date.getFullYear();
      const yearDiff = endYear - startYear;

      return yearDiff >= 1;
    },
    {
      path: ["end_date"],
      message: "Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 1 năm.",
    }
  )
  .refine(
    (data) => {
      const startYear = data.start_date.getFullYear();
      const endYear = data.end_date.getFullYear();
      const yearDiff = endYear - startYear;

      return yearDiff <= 2;
    },
    {
      path: ["end_date"],
      message: "Ngày kết thúc không được quá 2 năm so với ngày bắt đầu.",
    }
  );

function CreateYearModal() {
  const [open, setOpen] = useState(false);
  const createAcademicYear = useCreateAcademicYearService();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const payload = {
        startDate: data.start_date.toISOString(),
        endDate: data.end_date.toISOString(),
      };

      createAcademicYear.mutate(payload, {
        onSuccess: () => {
          toast.success("Tạo năm học thành công!");
          form.reset();
          setOpen(false);
        },
        onError: (error) => {
          toast.error("Có lỗi xảy ra khi tạo năm học");
          console.error("Error creating academic year:", error);
        },
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý dữ liệu");
      console.error("Error formatting data:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]">
          <Plus /> Tạo năm học mới
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[300px]">
        <DialogHeader>
          <DialogTitle>Tạo năm học mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Năm bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}>
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn năm bắt đầu</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01") || date < new Date()
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Năm kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}>
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn năm kết thúc</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={2050}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end items-center gap-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={createAcademicYear.isPending}
                  >
                    Hủy
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createAcademicYear.isPending}>
                  {createAcademicYear.isPending ? "Đang tạo..." : "Tạo"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateYearModal;
