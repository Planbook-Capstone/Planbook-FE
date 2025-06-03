"use client";
import FolderCard from "@/components/molecules/folder-card";
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
import { Label } from "@/components/ui/label";
import { folderColors } from "@/constants/color";
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
import { Checkbox } from "@/components/ui/checkbox";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Tên thư mục phải ít nhất 1 kí tự",
  }),
  colorId: z.string().min(1, {
    message: "Vui lòng chọn một màu",
  }),
});
function CreateFolderModal() {
  const [selectedColorId, setSelectedColorId] = useState("1");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      colorId: "3",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus color="white" /> Tạo thư mục mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo thư mục mới</DialogTitle>
          <DialogDescription>
            Tạo thư mục để dễ dàng quản lý và sắp xếp nội dung của bạn.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thư mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Cá nhân" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu thư mục</FormLabel>
                    <div className="grid grid-cols-7 gap-3">
                      {Object.entries(folderColors).map(([id, _]) => (
                        <FormControl key={id}>
                          <div className="flex flex-col items-center space-y-1">
                            <Checkbox
                              checked={field.value === id}
                              onCheckedChange={() => field.onChange(id)}
                              // className="peer hidden"
                              id={`color-${id}`}
                            />
                            <Label htmlFor={`color-${id}`}>
                              <FolderCard
                                id={`test_${id}`}
                                width={40}
                                height={30}
                                colorId={id}
                              />
                            </Label>
                          </div>
                        </FormControl>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="float-end">
                Tạo
              </Button>
            </form>
          </Form>
        </div>
        {/* <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button type="submit">Tạo</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default CreateFolderModal;
