import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  useCreateGradeService,
  useGradesService,
} from "@/services/gradeServices";
import { Form } from "antd";
import { on } from "events";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface CreateGardeFormProps {
  onSuccess?: () => void;
}

function CreateGardeForm({ onSuccess }: CreateGardeFormProps) {
  const { mutateAsync } = useCreateGradeService();
  const { data: grades } = useGradesService();

  if (grades?.data?.content.length > 0) {
    onSuccess?.();
  }
  const onFinish = async (values: any) => {
    console.log("Received values of form:", values);

    for (const grade of values.grades) {
      try {
        await mutateAsync(grade);
        toast.success(`Tạo khối ${grade.name} thành công`);
      } catch (error: any) {
        console.error(error.response?.data || error.message, "Lỗi");
        toast.error(error.response?.data || `Tạo khối ${grade.name} thất bại`);
        // Nếu muốn dừng luôn khi có lỗi thì dùng: break;
      }
    }

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
                  required={false}
                  label="Tên Lớp"
                  name={[field.name, "name"]}
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
                    placeholder="Lớp 10"
                  />
                </Form.Item>
                {fields.length > 1 ? (
                  <Button
                    onClick={() => {
                      remove(field.name);
                    }}
                    className="h-full bg-neutral-800 border text-white hover:bg-neutral-600"
                  >
                    <X />
                  </Button>
                ) : null}
              </div>
            ))}
            <Form.Item>
              <Button variant={"dash"} onClick={() => add()} className="w-1/2">
                <Plus /> Thêm Lớp
              </Button>

              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="submit">Tạo Lớp</Button>
      </Form.Item>
    </Form>
  );
}

export default CreateGardeForm;
