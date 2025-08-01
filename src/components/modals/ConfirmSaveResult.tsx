"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/Button";

// Validation schema
const saveResultSchema = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .max(100, "Tên không được vượt quá 100 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional(),
});

type SaveResultFormData = z.infer<typeof saveResultSchema>;

interface ConfirmSaveResultProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: SaveResultFormData) => void;
  resultId?: string;
  data?: any;
  isLoading?: boolean;
  initialName?: string;
  initialDescription?: string;
}

function ConfirmSaveResult({
  isOpen,
  onClose,
  onConfirm,
  resultId,
  data,
  isLoading = false,
  initialName = "",
  initialDescription = "",
}: ConfirmSaveResultProps) {
  const form = useForm<SaveResultFormData>({
    resolver: zodResolver(saveResultSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Reset form with initial values when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initialName,
        description: initialDescription,
      });
    }
  }, [isOpen, initialName, initialDescription, form]);

  const handleSubmit = (formData: SaveResultFormData) => {
    onConfirm(formData);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lưu kết quả</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả (tùy chọn)..."
                      className="min-h-20"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmSaveResult;
