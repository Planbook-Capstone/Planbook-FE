"use client"
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateBookTypeService } from "@/services/bookTypeServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  initialValues?: {
    name: string;
    description: string;
    tokenCostPerQuery: number;
    icon?: string; // base64
  };
}

function CreateBookTypeForm({
  onClose,
  initialValues,
}: CreateBookTypeFormProps) {
  const [svgPreview, setSvgPreview] = useState<string | null>(null);
  const { mutate: createBookType } = useCreateBookTypeService();

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

  // const fileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    toast("test");
    // const base64Icon = await fileToBase64(data.icon);

    const payload = {
      name: data.name,
      description: data.description,
      tokenCostPerQuery: data.tokenCostPerQuery,
      icon: "base64Icon",
    };

    console.log("Payload gửi lên API:", payload);

    try {
      if (initialValues) {
        toast.success("Cập nhật thành công!");
      } else {
        createBookType(payload, {
          onSuccess: (data) => {
            toast.success("Tạo mới thành công!");
            form.reset();
          },
          onError: (error) => {
            console.log(error?.response?.data);
            toast.error("Đã xảy ra lỗi khi gửi dữ liệu.");
          },
        });
      }

      onClose?.();
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

        {/* <FormField
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
        /> */}

        <Button type="submit">{initialValues ? "Chỉnh sửa" : "Tạo mới"}</Button>
      </form>
    </Form>
  );
}

export default CreateBookTypeForm;
