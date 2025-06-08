import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Form, Select, Space } from "antd";
import { Plus, X } from "lucide-react";

interface CreateGardeFormProps {
  onSuccess?: () => void;
}

function CreateSubjectForm({ onSuccess }: CreateGardeFormProps) {
  const GRADES = ["Khối 10", "Khối 11", "Khối 12"];
  const onFinish = (values: any) => {
    console.log("Received values of form:", values);
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
                  name={[name, "subject"]}
                  rules={[
                    { required: true, message: "Vui lòng điền tên môn học" },
                  ]}
                >
                  <Input placeholder="Môn Hóa" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "grade"]}
                  rules={[{ required: true, message: "Vui lòng chọn khối" }]}
                >
                  <Select placeholder="Chọn khối" size="large">
                    {GRADES.map((grade) => (
                      <Select.Option key={grade} value={grade}>
                        {grade}
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
              <Button variant={"dash"} onClick={() => add()} className="w-1/2">
                <Plus /> Thêm môn
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="submit" className="w-1/2">Tạo môn học</Button>
      </Form.Item>
    </Form>
  );
}

export default CreateSubjectForm;
