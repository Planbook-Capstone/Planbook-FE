"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GridIcon, ListIcon } from "@/constants/icon";
import { useSearchParams, useRouter } from "next/navigation";

export function ViewToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentView = searchParams.get("view") || "grid";

  const handleChange = (v: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", v);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <ToggleGroup
      type="single"
      value={currentView}
      className="border rounded-md px-1 text-[#9B9B9B]"
      size={"sm"}
      onValueChange={(v) => {
        if (v) handleChange(v);
      }}
    >
      <ToggleGroupItem
        value="list"
        className="flex items-center gap-1 px-2.5 py-1.5 data-[state=on]:m-1 data-[state=on]:border data-[state=on]:rounded-sm data-[state=on]:bg-transparent data-[state=on]:text-black"
      >
        {ListIcon(currentView === "list")}
        Hàng
      </ToggleGroupItem>
      <ToggleGroupItem
        value="grid"
        className="flex items-center gap-1 px-2.5 py-1.5 data-[state=on]:m-1 data-[state=on]:border data-[state=on]:rounded-sm data-[state=on]:bg-transparent data-[state=on]:text-black"
      >
        {GridIcon(currentView === "grid")}
        Lưới
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
