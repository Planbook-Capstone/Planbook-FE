"use client";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Plus } from "lucide-react";
import { tagSchema } from "@/schemas";
import { useCreateTagService, useUpdateTagService } from "@/services/tagServices";

interface CreateMaterialTagFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  initialValues?: {
    id?: string;
    name: string;
    description: string;
  };
  isEdit?: boolean;
}

function CreateMaterialTagForm({
  onClose,
  onSuccess,
  initialValues,
  isEdit = false,
}: CreateMaterialTagFormProps) {
  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
    },
    mode: "onChange",
  });

  const { mutate: createTag } = useCreateTagService();
  const { mutate: updateTag } = useUpdateTagService();

  const onSubmit = (data: z.infer<typeof tagSchema>) => {
    if (isEdit && initialValues?.id) {
      updateTag(
        { id: initialValues.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật loại học liệu thành công!");
            form.reset();
            onClose?.();
            onSuccess?.();
          },
          onError: (error) => {
            toast.error("Cập nhật loại học liệu thất bại");
          },
        }
      );
    } else {
      createTag(data, {
        onSuccess: () => {
          toast.success("Tạo loại học liệu thành công!");
          form.reset();
          onClose?.();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Tạo loại học liệu thất bại");
        },
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên loại học liệu</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{isEdit ? "Cập nhật" : "Tạo mới"}</Button>
      </form>
    </Form>
  );
}

// Modal wrapper component
interface CreateMaterialTagModalProps {
  initialValues?: {
    id?: string;
    name: string;
    description: string;
  };
  isEdit?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

function CreateMaterialTagModal({
  initialValues,
  isEdit = false,
  open,
  onOpenChange,
  onSuccess,
  trigger,
}: CreateMaterialTagModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const defaultTrigger = (
    <Button className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]">
      <Plus /> Tạo loại học liệu
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render trigger when modal is not controlled externally */}
      {open === undefined &&
        (trigger ? (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        ) : (
          <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
        ))}
      <DialogContent className="min-w-[330px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa loại học liệu" : "Tạo loại học liệu mới"}
          </DialogTitle>
        </DialogHeader>
        <CreateMaterialTagForm
          onClose={() => setIsOpen(false)}
          onSuccess={onSuccess}
          initialValues={initialValues}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateMaterialTagForm;
export { CreateMaterialTagModal };
