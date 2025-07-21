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
import { CalendarIcon, Clock, BookOpen, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CreateExamInstanceData } from "@/services/examInstanceServices";

// Form validation schema
const createInstanceSchema = z.object({
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
}).refine((data) => data.endAt > data.startAt, {
  message: "Thời gian kết thúc phải sau thời gian bắt đầu",
  path: ["endAt"],
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
    const submitData: CreateExamInstanceData = {
      templateId: selectedTemplate.id,
      description: data.description,
      startAt: data.startAt.toISOString(),
      endAt: data.endAt.toISOString(),
    };
    onSubmit(submitData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Selected Template Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template đã chọn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="font-medium text-gray-900">{selectedTemplate.name}</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{selectedTemplate.subject}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Lớp {selectedTemplate.grade}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span>{selectedTemplate.durationMinutes} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 text-center text-orange-600 font-bold">📊</span>
              <span>{selectedTemplate.totalScore} điểm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Instance Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tạo Instance Mới</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả cho instance này..."
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
                              format(field.value, "dd/MM/yyyy HH:mm", { locale: vi })
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
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            onChange={(e) => {
                              if (field.value && e.target.value) {
                                const [hours, minutes] = e.target.value.split(':');
                                const newDate = new Date(field.value);
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                field.onChange(newDate);
                              }
                            }}
                            value={field.value ? format(field.value, "HH:mm") : ""}
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
                              format(field.value, "dd/MM/yyyy HH:mm", { locale: vi })
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
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            onChange={(e) => {
                              if (field.value && e.target.value) {
                                const [hours, minutes] = e.target.value.split(':');
                                const newDate = new Date(field.value);
                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                field.onChange(newDate);
                              }
                            }}
                            value={field.value ? format(field.value, "HH:mm") : ""}
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
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Đang tạo..." : "Tạo Instance"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
