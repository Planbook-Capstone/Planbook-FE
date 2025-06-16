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
import { useCreateBookTypeService, useUpdateBookTypeService } from "@/services/bookTypeServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Plus } from "lucide-react";

const FormSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Tên chức năng không được để trống",
    }),
  description: z
    .string({ required_error: "Mô tả không được để trống" })
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Mô tả không được để trống",
    }),
  tokenCostPerQuery: z.coerce
    .number({
      invalid_type_error: "Phải là số",
    })
    .int("Phải là số nguyên")
    .gt(0, "Phải lớn hơn 0"),

  icon: z
    .instanceof(File, { message: "Vui lòng chọn một file SVG" })
    .refine((file) => file.type === "image/svg+xml", {
      message: "Chỉ chấp nhận file SVG",
    }),
});

interface CreateBookTypeFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    tokenCostPerQuery: number;
    icon?: string; // base64
  };
}

function CreateBookTypeForm({
  onClose,
  onSuccess,
  initialValues,
}: CreateBookTypeFormProps) {
  const [svgPreview, setSvgPreview] = useState<string | null>(null);
  const { mutate: createBookType } = useCreateBookTypeService();
  const { mutate: updateBookType } = useUpdateBookTypeService();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      tokenCostPerQuery: initialValues?.tokenCostPerQuery || undefined,
      icon: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialValues?.icon) {
      setSvgPreview(initialValues.icon);
    }
  }, [initialValues]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const base64Icon = await fileToBase64(data.icon);

    const payload = {
      name: data.name,
      description: data.description,
      tokenCostPerQuery: data.tokenCostPerQuery,
      icon: base64Icon,
    };

    console.log("Payload gửi lên API:", payload);

    try {
      if (initialValues?.id) {
        // Edit mode
        updateBookType(
          {
            id: initialValues.id,
            data: payload,
          },
          {
            onSuccess: () => {
              toast.success("Cập nhật thành công!");
              onSuccess?.(); // Call parent success callback first
              onClose?.();
            },
            onError: (error) => {
              console.log(error?.response?.data);
              toast.error("Đã xảy ra lỗi khi cập nhật dữ liệu.");
            },
          }
        );
      } else {
        // Create mode
        createBookType(payload, {
          onSuccess: () => {
            toast.success("Tạo mới thành công!");
            form.reset();
            onClose?.();
          },
          onError: (error) => {
            console.log(error?.response?.data);
            toast.error("Đã xảy ra lỗi khi gửi dữ liệu.");
          },
        });
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi dữ liệu");
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
              <FormLabel>Tên chức năng</FormLabel>
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
        <FormField
          control={form.control}
          name="tokenCostPerQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chi phí token mỗi lượt truy vấn</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".svg"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setSvgPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      // User clicked cancel or removed file
                      field.onChange(undefined);
                      setSvgPreview(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
              {svgPreview && (
                <div className="mt-2 border rounded p-2 bg-muted">
                  <p className="text-sm mb-1 text-muted-foreground">
                    Xem trước:
                  </p>
                  <div className="w-[100px] h-[100px]">
                    <img
                      src={svgPreview}
                      alt="SVG Preview"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit">{initialValues ? "Chỉnh sửa" : "Tạo mới"}</Button>
      </form>
    </Form>
  );
}

// Modal wrapper component
interface CreateBookTypeModalProps {
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    tokenCostPerQuery: number;
    icon?: string;
  };
  isEdit?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

function CreateBookTypeModal({
  initialValues,
  isEdit = false,
  open,
  onOpenChange,
  onSuccess,
  trigger
}: CreateBookTypeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const defaultTrigger = (
    <Button className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]">
      <Plus /> Tạo loại sách mới
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render trigger when modal is not controlled externally */}
      {open === undefined && (
        trigger ? (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        ) : (
          <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
        )
      )}
      <DialogContent className="min-w-[630px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa chức năng" : "Tạo chức năng mới"}
          </DialogTitle>
        </DialogHeader>
        <CreateBookTypeForm
          onClose={() => setIsOpen(false)}
          onSuccess={onSuccess}
          initialValues={initialValues}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateBookTypeForm;
export { CreateBookTypeModal };
