import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GridIcon, ListIcon } from "@/constants/icon";
import { useState } from "react";

export function ViewToggle() {
  const [viewType, setViewType] = useState<"list" | "grid">("grid");
  return (
    <ToggleGroup
      type="single"
      defaultValue="grid"
      className="border rounded-md px-1 text-[#9B9B9B]"
      size={"sm"}
      onValueChange={(v) => {
        if (v) setViewType(v as "list" | "grid");
      }}
    >
      <ToggleGroupItem
        value="list"
        className="flex items-center gap-1 px-2.5 py-1.5 data-[state=on]:m-1 data-[state=on]:border data-[state=on]:rounded-sm data-[state=on]:bg-transparent data-[state=on]:text-black"
      >
        {ListIcon(viewType === "list")}
        Hàng
      </ToggleGroupItem>
      <ToggleGroupItem
        value="grid"
        className="flex items-center gap-1 px-2.5 py-1.5 data-[state=on]:m-1 data-[state=on]:border data-[state=on]:rounded-sm data-[state=on]:bg-transparent data-[state=on]:text-black"
      >
        {GridIcon(viewType === "grid")}
        Lưới
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
