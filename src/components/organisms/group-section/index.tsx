import { FieldList } from "@/components/molecules/field-list";
import { GroupHeader } from "@/components/molecules/group-header";
import { Button } from "@/components/ui/Button";

export function GroupSection({ group, onUpdate, onDelete }: any) {
  return (
    <div className="border p-4 rounded-lg bg-slate-50 space-y-4">
      <GroupHeader
        groupName={group.group_name}
        onChange={(newName: string) =>
          onUpdate({ ...group, group_name: newName })
        }
        onDelete={onDelete}
      />

      <FieldList
        fields={group.fields}
        onChange={(newFields: any[]) =>
          onUpdate({ ...group, fields: newFields })
        }
      />

      <Button
        size="sm"
        onClick={() => {
          const updated = [...(group.fields || [])];
          updated.push({
            field_name: "",
            data_type: "text",
            is_required: false,
            fields: [],
          });
          onUpdate({ ...group, fields: updated });
        }}
      >
        + Thêm trường
      </Button>
    </div>
  );
}
