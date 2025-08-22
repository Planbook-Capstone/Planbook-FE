"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getMinimumStartTime,
  formatVietnamDate,
  isToday,
  isBeforeToday,
  createVietnamDateTime,
  formatTimeForInput,
} from "@/utils/dateUtils";
import { CreateExamInstanceData } from "@/services/examInstanceServices";
import { BookMarkIcon, BookMarkWhiteIcon } from "@/constants/icon";
import { Badge } from "@/components/ui/badge";

// Form validation schema
const createInstanceSchema = z
  .object({
    description: z
      .string()
      .min(1, "Mô tả không được để trống")
      .max(500, "Mô tả không được vượt quá 500 ký tự"),
    startAt: z.date({
      required_error: "Vui lòng chọn thời gian bắt đầu",
    }),
    endAt: z.date({
      required_error: "Vui lòng chọn thời gian kết thúc",
    }),
  })
  .refine((data) => data.endAt > data.startAt, {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["endAt"],
  })
  .refine((data) => data.startAt >= getMinimumStartTime(), {
    message: "Thời gian bắt đầu phải sau ít nhất 5 phút so với hiện tại",
    path: ["startAt"],
  });

type CreateInstanceFormData = z.infer<typeof createInstanceSchema>;

interface TemplateInfo {
  id: string;
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
}

interface CreateInstanceFormProps {
  selectedTemplate: TemplateInfo;
  onSubmit: (data: CreateExamInstanceData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CreateInstanceForm({
  selectedTemplate,
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateInstanceFormProps) {
  const form = useForm<CreateInstanceFormData>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      description: "",
    },
  });

  const handleSubmit = (data: CreateInstanceFormData) => {
    // Create ISO string without timezone conversion
    const formatToISOWithoutTimezone = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
    };

    const submitData: CreateExamInstanceData = {
      templateId: selectedTemplate.id,
      description: data.description,
      startAt: formatToISOWithoutTimezone(data.startAt),
      endAt: formatToISOWithoutTimezone(data.endAt),
    };
    onSubmit(submitData);
  };

  return (
    <div className="space-y-6">
      {/* Selected Template Info */}
      <div className=" border p-5 rounded-xl shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors duration-300">
              <span className="w-6 h-6 group-hover:hidden">{BookMarkIcon}</span>
              <span className="w-6 h-6 hidden group-hover:block">
                {BookMarkWhiteIcon}
              </span>
            </div>
            <span className="text-base font-calsans text-gray-700 group-hover:text-white transition-colors duration-300">
              {selectedTemplate.subject}
            </span>
          </div>
          <div className="flex gap-1">
            <Badge
              variant="secondary"
              className="bg-black group-hover:bg-white text-white group-hover:text-black text-xs px-2 py-1 rounded-full transition-colors duration-300"
            >
              Lớp {selectedTemplate.grade} - {selectedTemplate.durationMinutes}{" "}
              phút
            </Badge>
            <Badge
              variant="secondary"
              className="bg-black group-hover:bg-white text-white group-hover:text-black text-xs px-2 py-1 rounded-full transition-colors duration-300"
            >
              {selectedTemplate.totalScore} điểm
            </Badge>
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-calsans text-gray-900 group-hover:text-white line-clamp-2 leading-tight transition-colors duration-300">
            {selectedTemplate.name}
          </h3>
        </div>
      </div>

      {/* Create Instance Form */}
      <h2 className="text-base font-calsans">Thông tin chung</h2>

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả cho phiên kiểm tra này..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time */}
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Thời gian bắt đầu *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatVietnamDate(field.value, "dd/MM/yyyy HH:mm")
                          ) : (
                            <span>Chọn thời gian bắt đầu</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // If selecting today, set minimum time to current time + 5 minutes
                            if (isToday(date)) {
                              const minTime = getMinimumStartTime();
                              const newDate = createVietnamDateTime(
                                date,
                                minTime.getHours(),
                                minTime.getMinutes()
                              );
                              field.onChange(newDate);
                            } else {
                              // For future dates, set default time to 8:00 AM
                              const newDate = createVietnamDateTime(date, 8, 0);
                              field.onChange(newDate);
                            }
                          }
                        }}
                        disabled={(date) => isBeforeToday(date)}
                      />
                      <div className="p-3 border-t">
                        <Input
                          type="time"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (field.value && e.target.value) {
                              const [hours, minutes] =
                                e.target.value.split(":");
                              const newDate = createVietnamDateTime(
                                field.value,
                                parseInt(hours),
                                parseInt(minutes)
                              );

                              // Check if the selected time is valid (after minimum time for today)
                              if (isToday(newDate)) {
                                const minTime = getMinimumStartTime();
                                if (newDate < minTime) {
                                  // If time is too early for today, set to minimum allowed time
                                  const correctedDate = createVietnamDateTime(
                                    field.value,
                                    minTime.getHours(),
                                    minTime.getMinutes()
                                  );
                                  field.onChange(correctedDate);
                                  return;
                                }
                              }

                              field.onChange(newDate);
                            }
                          }}
                          value={
                            field.value ? formatTimeForInput(field.value) : ""
                          }
                          min={
                            field.value && isToday(field.value)
                              ? formatTimeForInput(getMinimumStartTime())
                              : undefined
                          }
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time */}
            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Thời gian kết thúc *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            formatVietnamDate(field.value, "dd/MM/yyyy HH:mm")
                          ) : (
                            <span>Chọn thời gian kết thúc</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // If selecting today, set minimum time to current time + 5 minutes
                            if (isToday(date)) {
                              const minTime = getMinimumStartTime();
                              const newDate = createVietnamDateTime(
                                date,
                                minTime.getHours(),
                                minTime.getMinutes()
                              );
                              field.onChange(newDate);
                            } else {
                              // For future dates, set default time to 8:00 AM
                              const newDate = createVietnamDateTime(date, 8, 0);
                              field.onChange(newDate);
                            }
                          }
                        }}
                        disabled={(date) => isBeforeToday(date)}
                      />
                      <div className="p-3 border-t">
                        <Input
                          type="time"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (field.value && e.target.value) {
                              const [hours, minutes] =
                                e.target.value.split(":");
                              const newDate = createVietnamDateTime(
                                field.value,
                                parseInt(hours),
                                parseInt(minutes)
                              );

                              // Check if the selected time is valid (after minimum time for today)
                              if (isToday(newDate)) {
                                const minTime = getMinimumStartTime();
                                if (newDate < minTime) {
                                  // If time is too early for today, set to minimum allowed time
                                  const correctedDate = createVietnamDateTime(
                                    field.value,
                                    minTime.getHours(),
                                    minTime.getMinutes()
                                  );
                                  field.onChange(correctedDate);
                                  return;
                                }
                              }

                              field.onChange(newDate);
                            }
                          }}
                          value={
                            field.value ? formatTimeForInput(field.value) : ""
                          }
                          min={
                            field.value && isToday(field.value)
                              ? formatTimeForInput(getMinimumStartTime())
                              : undefined
                          }
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Đang tạo..." : "Tạo phiên kiểm tra"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
