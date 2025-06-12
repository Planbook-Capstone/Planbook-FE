import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function GroupHeader({ groupName, onChange, onDelete }: any) {
  return (
    <div className="flex justify-between items-end gap-2 mb-2">
      <FormField label="Tên nhóm" htmlFor="">
        <Input
          value={groupName}
          placeholder="Tên nhóm"
          onChange={(e: any) => onChange(e.target.value)}
          className="bg-white"
        />
      </FormField>
      <Button
        className="h-10 w-10 bg-white text-neutral-400 hover:text-white border"
        onClick={onDelete}
      >
        <X />
      </Button>
    </div>
  );
}
