"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { useUpdateLessonPlanNodeService } from "@/services/lessonPlanNodeServices";
import { useQueryClient } from "@tanstack/react-query";

interface LessonPlanNode {
  id: number;
  lessonPlanTemplateId: number;
  parentId: number | null;
  title: string;
  content: string;
  description: string | null;
  fieldType: string | null;
  type: string;
  orderIndex: number;
  metadata: any;
  status: string;
  children: LessonPlanNode[];
}

interface EditLessonPlanNodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: LessonPlanNode | null;
}

const FormSchema = z.object({
  title: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Tiêu đề không được để trống",
    }),
  content: z.string().optional(),
  fieldType: z.string().optional(),
  type: z.string().min(1, {
    message: "Loại node không được để trống",
  }),
});

const nodeTypes = [
  { value: "SECTION", label: "Phần" },
  { value: "SUBSECTION", label: "Phần phụ" },
  { value: "LIST_ITEM", label: "Mục danh sách" },
  { value: "TEXT", label: "Văn bản" },
];

const fieldTypes = [
  { value: "TEXT", label: "Văn bản" },
  { value: "TEXTAREA", label: "Văn bản dài" },
  { value: "NUMBER", label: "Số" },
  { value: "DATE", label: "Ngày" },
  { value: "SELECT", label: "Lựa chọn" },
];

function EditLessonPlanNodeModal({
  open,
  onOpenChange,
  node,
}: EditLessonPlanNodeModalProps) {
  const { mutate, isPending } = useUpdateLessonPlanNodeService();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      fieldType: "NONE",
      type: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (node && open) {
      form.reset({
        title: node.title || "",
        content: node.content || "",
        fieldType: node.fieldType || "NONE",
        type: node.type || "",
      });
    }
  }, [node, form, open]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!node) return;

    mutate(
      {
        id: String(node.id),
        data: {
          title: data.title,
          content: data.content || "",
          fieldType: data.fieldType === "NONE" ? null : data.fieldType,
          type: data.type,
          lessonPlanTemplateId: node.lessonPlanTemplateId,
          parentId: node.parentId,
          orderIndex: node.orderIndex,
          metadata: node.metadata,
          status: node.status,
        },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật node thành công");
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({
            queryKey: [`lesson-plan-node-tree-${node?.lessonPlanTemplateId}`],
          });
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
          <DialogTitle>Chỉnh sửa Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tiêu đề node" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Nhập nội dung node"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại Node</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại node" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nodeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                name="fieldType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại Field (Tùy chọn)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "NONE"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại field" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NONE">Không có</SelectItem>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditLessonPlanNodeModal;
