"use client";
import { Form, Typography } from "antd";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

const CreateChapterForm = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log("📦 Form Values:", values);
  };
  return (
    <Form
      form={form}
      autoComplete="off"
      initialValues={{ items: [{}] }}
      onFinish={onFinish}
    >
      <Form.List name="chapter">
        {(fields, { add, remove }) => (
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div
                // title={`Chương ${field.name + 1}`}
                key={field.key}
              >
                <div className="flex items-center gap-2 w-full pb-2.5">
                  <Form.Item
                    noStyle
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
                  >
                    <Input
                      className="bg-neutral-100 font-calsans placeholder:text-neutral-300"
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
                            className="flex items-center gap-2 w-full"
                            key={subField.key}
                          >
                            <Form.Item
                              noStyle
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

            <Button variant={"dash"} onClick={() => add()}>
              + Thêm chương
            </Button>
          </div>
        )}
      </Form.List>
      <Form.Item className="py-5">
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  );
};
export default CreateChapterForm;
