import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useGradesService } from "@/services/gradeServices";
import { useCreateSubjectService } from "@/services/subjectServices";
import { Grade, Subject } from "@/types";
import { Form, Select, Space } from "antd";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface CreateSubjectFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

function CreateSubjectForm({ onSuccess, onClose }: CreateSubjectFormProps) {
  const { data: grades } = useGradesService();
  const { mutateAsync } = useCreateSubjectService();
  const onFinish = async (values: any) => {
    console.log("Received values of form:", values);

    for (const subject of values.subjects) {
      try {
        await mutateAsync(subject);
        toast.success(`Tạo môn học ${subject.name} thành công`);
      } catch (error: any) {
        console.error(error.response?.data || error.message, "Lỗi");
        toast.error(
          error.response?.data || `Tạo môn học ${subject.name} thất bại`
        );
        // Có thể tiếp tục hoặc break nếu muốn dừng
      }
    }

    onClose?.();

    // if (onSuccess) {
    //   onSuccess();
    // }
  };

  return (
    <Form onFinish={onFinish} autoComplete="off">
      <Form.List name="subjects">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
                className="border-b-[1px] py-2.5"
              >
                <h1 className="font-calsans">Môn học {key + 1}</h1>
                <Form.Item
                  {...restField}
                  name={[name, "name"]}
                  rules={[
                    { required: true, message: "Vui lòng điền tên môn học" },
                  ]}
                >
                  <Input placeholder="Môn Hóa" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "gradeId"]}
                  rules={[{ required: true, message: "Vui lòng chọn khối" }]}
                >
                  <Select
                    placeholder="Chọn khối"
                    size="large"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {grades?.data?.content?.map((grade: Grade) => (
                      <Select.Option key={grade?.id} value={grade?.id}>
                        {grade?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  onClick={() => {
                    remove(name);
                  }}
                  className="h-full bg-neutral-800 border text-white hover:bg-neutral-600"
                >
                  <X />
                </Button>
              </Space>
            ))}
            <Form.Item>
              <Button variant={"dash"} onClick={() => add()} className="w-full">
                <Plus /> Thêm môn
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="submit" className="flex items-center w-full">
          Tạo môn học
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CreateSubjectForm;
