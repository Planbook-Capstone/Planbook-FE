"use client";
import { Form, Typography } from "antd";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  useChaptersByBookService,
  useCreateChapterService,
} from "@/services/chapterServices";
import { toast } from "sonner";
import {
  useCreateLessonService,
  useLessonsByChapterService,
  useLessonsService,
} from "@/services/lessonServices";
import { useBookByIdService, useBooksService } from "@/services/bookServices";
import { Badge } from "@/components/ui/badge";
import { use, useEffect, useState } from "react";

interface CreateChapterFormProps {
  bookId?: string;
  onClose?: () => void;
}

const CreateChapterForm = ({ bookId }: CreateChapterFormProps) => {
  const { data: book } = useBookByIdService(bookId);
  const { data: chaptersByBook } = useChaptersByBookService(bookId);

  const { mutateAsync: createChapterMutateAsync } = useCreateChapterService();
  const { mutateAsync: createLessonMutateAsync } = useCreateLessonService();

  console.log(chaptersByBook?.data?.content);

  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    console.log("Received values of form:", values);

    for (const chapter of values.chapter) {
      try {
        // Gọi API tạo chương
        const createdChapter = await createChapterMutateAsync({
          name: chapter.chapterTitle.trim(),
          bookId: bookId,
        });
        toast.success(`Tạo chương ${chapter.chapterTitle} thành công`);

        // Tạo bài học bên trong chương
        for (const lesson of chapter.lesson || []) {
          try {
            await createLessonMutateAsync({
              name: lesson.lessonTitle.trim(),
              chapterId: createdChapter?.data?.data?.id, // nếu cần liên kết
            });
            toast.success(`→ Tạo bài ${lesson.lessonTitle} thành công`);
          } catch (lessonError: any) {
            console.error(
              lessonError.response?.data || lessonError.message,
              "Lỗi bài học"
            );
            toast.error(
              lessonError.response?.data ||
                `Tạo bài ${lesson.lessonTitle} thất bại`
            );
          }
        }
      } catch (chapterError: any) {
        console.error(
          chapterError.response?.data || chapterError.message,
          "Lỗi chương"
        );
        toast.error(
          chapterError.response?.data ||
            `Tạo chương ${chapter.chapterTitle} thất bại`
        );
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-calsans py-5">{book?.data?.name}</h1>

        <Badge
          variant={
            chaptersByBook?.data?.content?.length == 0 ? "active" : "warning"
          }
        >
          {chaptersByBook?.data?.content?.length == 0
            ? "Đang tạo mới"
            : " Đang chỉnh sửa"}
        </Badge>
      </div>

      <Form form={form} autoComplete="off" onFinish={onFinish}>
        <Form.List name="chapter">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <div className="flex items-start gap-2 w-full pb-2.5">
                    <Form.Item
                      label="Chương"
                      name={[field.name, "chapterTitle"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tiêu đề chương",
                        },
                        {
                          validator: (_, value) =>
                            value && value.trim().length > 0
                              ? Promise.resolve()
                              : Promise.reject(
                                  "Không được để trống hoặc chỉ chứa khoảng trắng"
                                ),
                        },
                      ]}
                      className="flex-1"
                    >
                      <Input
                        className=" bg-neutral-100 font-calsans placeholder:text-neutral-300"
                        placeholder="Chương 1"
                      />
                    </Form.Item>

                    <Button
                      onClick={() => {
                        remove(field.name);
                      }}
                      className="h-full bg-neutral-800 border text-white hover:bg-neutral-600"
                    >
                      <X />
                    </Button>
                  </div>

                  {/* Nest Form.List */}
                  <Form.Item className="!pl-20">
                    <Form.List name={[field.name, "lesson"]}>
                      {(subFields, subOpt) => (
                        <div className="w-full flex flex-col gap-4">
                          {subFields.map((subField) => (
                            <div
                              className="flex items-start gap-2 w-full"
                              key={subField.key}
                            >
                              <Form.Item
                                className="flex-1"
                                name={[subField.name, "lessonTitle"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập tiêu đề bài học",
                                  },
                                  {
                                    validator: (_, value) =>
                                      value && value.trim().length > 0
                                        ? Promise.resolve()
                                        : Promise.reject(
                                            "Không được để trống hoặc chỉ chứa khoảng trắng"
                                          ),
                                  },
                                ]}
                              >
                                <Input placeholder="Bài 1" />
                              </Form.Item>

                              <Button
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                                className="h-full bg-white border text-neutral-900 hover:bg-neutral-100"
                              >
                                <X />
                              </Button>
                            </div>
                          ))}
                          <Button variant={"dash"} onClick={() => subOpt.add()}>
                            + Thêm bài
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </div>
              ))}

              <Button
                variant={"dash"}
                onClick={() => add()}
                className="bg-neutral-100"
              >
                + Thêm chương
              </Button>
            </div>
          )}
        </Form.List>
        <Form.Item>
          <Button type="submit" className="w-full mt-5">
            Lưu thay đổi
          </Button>
        </Form.Item>
        {/* <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item> */}
      </Form>
    </>
  );
};
export default CreateChapterForm;
