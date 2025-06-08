import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "antd";
import { FormProvider, useForm } from "react-hook-form";

export function FormPreview({ config }: { config: any[] }) {
  const methods = useForm();
  const { register, handleSubmit, setValue, watch } = methods;

  const onSubmit = (data: any) => {
    console.log("Submitted form values:", data);
  };

  const allValues = watch();

  const renderField = (field: any, namePrefix = "", index?: number) => {
    if (!field || !field.field_name) return null;
    const fieldName =
      namePrefix && field?.field_name
        ? `${namePrefix}.${field.field_name}`
        : field?.field_name ?? "";

    const key = index !== undefined ? `${fieldName}-${index}` : fieldName;
    const label = field.label || field.field_name;
    const placeholder = field.placeholder || "";
    const defaultValue = field.default_value;

    switch (field.data_type) {
      case "text":
        return (
          <div key={key} className="space-y-1">
            <Label className="block font-medium">{label}</Label>
            <Input
              type={field.data_type}
              {...register?.(fieldName)}
              placeholder={placeholder}
              defaultValue={defaultValue}
            />
          </div>
        );
      case "boolean":
        return (
          <div key={key} className="flex items-center gap-2">
            <Checkbox {...register?.(fieldName)} />
            <Label>{label}</Label>
          </div>
        );
      case "array":
        return (
          <div key={key} className="p-2 space-y-2">
            <div className="font-calsans text-lg">{label} (1 mục)</div>
            {field.fields?.map((subField: any, i: number) =>
              renderField(subField, `${fieldName}[0]`, i)
            )}
          </div>
        );
      case "select":
        const options = (field.options || []).map((opt: any) => ({
          label: opt.title,
          value: opt.title,
        }));

        const value = allValues[fieldName] || field.default_value || [];

        return (
          <div key={key} className="space-y-1">
            <label className="block font-medium">{field.field_name}</label>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              options={options}
              value={value}
              onChange={(val) => {
                setValue(fieldName, val);
              }}
              placeholder="Chọn giá trị"
              allowClear
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md bg-white"
      >
        {config.map((group, i) => (
          <div key={`group-${i}`} className="space-y-3">
            <h3 className="text-xl font-calsans">
              {group.group_name || `Nhóm ${i + 1}`}
            </h3>
            {group.fields.map((field: any, j: number) =>
              renderField(field, "", j)
            )}
          </div>
        ))}
        <Button type="submit">Gửi thông tin</Button>
      </form>
    </FormProvider>
  );
}
