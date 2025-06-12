import { FieldItem } from "../fileld-item";

export function FieldList({ fields, onChange }: any) {
  return (
    <div className="space-y-4">
      {fields.map((field: any, index: number) => (
        <FieldItem
          key={index}
          field={field}
          onChange={(newField: any) => {
            const updated = [...fields];
            updated[index] = newField;
            onChange(updated);
          }}
          onDelete={() => {
            const updated = [...fields];
            updated.splice(index, 1);
            onChange(updated);
          }}
        />
      ))}
    </div>
  );
}
