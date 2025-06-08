import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Form } from "antd";
import { Plus, X } from "lucide-react";

interface CreateGardeFormProps {
  onSuccess?: () => void;
}

function CreateGardeForm({ onSuccess }: CreateGardeFormProps) {
  const onFinish = (values: any) => {
    console.log("Received values of form:", values);
    if (onSuccess) {
      onSuccess();
    }
  };
  return (
    <Form onFinish={onFinish}>
      <Form.List
        name="grades"
        rules={[
          {
            validator: async (_, grades) => {
              if (!grades || grades.length < 1) {
                return Promise.reject(new Error("Phải có ít nhất 1 khối"));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <div className="flex items-start gap-2 w-full pb-2.5" key={index}>
                <Form.Item
                  //   noStyle
                  label="Tên khối"
                  name={[field.name, "grade"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Vui lòng nhập tên khối hoặc xóa ô này.",
                    },
                  ]}
                >
                  <Input
                    className="bg-background font-calsans"
                    placeholder="Khối 10"
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
            ))}
            <Form.Item>
              <Button variant={"dash"} onClick={() => add()} className="w-1/2">
                <Plus /> Thêm khối
              </Button>

              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="submit">Tạo khối</Button>
      </Form.Item>
    </Form>
  );
}

export default CreateGardeForm;
