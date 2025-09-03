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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

import { useEffect, useState } from "react";
import {
  useUpdateLessonPlanNodeService,
  useCreateLessonPlanNodeService,
} from "@/services/lessonPlanNodeServices";
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
  { value: "PARAGRAPH", label: "Văn bản" },
];

const fieldTypes = [{ value: "INPUT", label: "Nhập liệu" }];

function EditLessonPlanNodeModal({
  open,
  onOpenChange,
  node,
}: EditLessonPlanNodeModalProps) {
  const { mutate: updateNode, isPending: isUpdating } =
    useUpdateLessonPlanNodeService();
  const { mutate: createNode, isPending: isCreating } =
    useCreateLessonPlanNodeService();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("edit");

  const editForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
      fieldType: "NONE",
      type: "",
    },
    mode: "onChange",
  });

  const addForm = useForm<z.infer<typeof FormSchema>>({
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
      editForm.reset({
        title: node.title || "",
        content: node.content || "",
        fieldType: node.fieldType || "NONE",
        type: node.type || "",
      });
    }
  }, [node, editForm, open]);

  useEffect(() => {
    if (open && activeTab === "add") {
      addForm.reset({
        title: "",
        content: "",
        fieldType: "NONE",
        type: "",
      });
    }
  }, [open, activeTab, addForm]);

  function onSubmitEdit(data: z.infer<typeof FormSchema>) {
    if (!node) return;

    updateNode(
      {
        id: String(node.id),
        data: {
          title: data.title,
          content: data.content || "",
          fieldType: data.fieldType === "NONE" ? null : data.fieldType,
          type: data.type,
          lessonPlanTemplateId: node.lessonPlanTemplateId,
          parentId: node.id,
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
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
      }
    );
  }

  function onSubmitAdd(data: z.infer<typeof FormSchema>) {
    if (!node) return;

    createNode(
      {
        title: data.title,
        content: data.content || "",
        fieldType: data.fieldType === "NONE" ? null : data.fieldType,
        type: data.type,
        lessonPlanTemplateId: node.lessonPlanTemplateId,
        parentId: node.id, // Node hiện tại sẽ là parent của node mới
        orderIndex: 0, // Có thể tính toán order index dựa trên số lượng children
        metadata: null,
        status: "ACTIVE",
      },
      {
        onSuccess: () => {
          toast.success("Tạo node mới thành công");
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({
            queryKey: [`lesson-plan-node-tree-${node?.lessonPlanTemplateId}`],
          });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "edit" ? "Chỉnh sửa Node" : "Thêm Node Con"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
            <TabsTrigger value="add">Thêm Node Con</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(onSubmitEdit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
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
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại Node</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                  control={editForm.control}
                  name="fieldType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại Field (Tùy chọn)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "NONE"}
                      >
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

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(onSubmitAdd)}
                className="w-full space-y-6"
              >
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tiêu đề node con" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập nội dung node con"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại Node</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                  control={addForm.control}
                  name="fieldType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại Field (Tùy chọn)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "NONE"}
                      >
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

                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Đang tạo..." : "Tạo Node Con"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default EditLessonPlanNodeModal;
