"use client";

import { Button } from "@/components/ui/Button";

export default function TestSidebar() {
  return (
    <aside className="w-1/4 px-6 py-4 space-y-4 border-l">
      <div className="flex gap-2">
        <Button variant="outline">Báo cáo</Button>
        <Button variant="outline">Chấm điểm</Button>
        <Button variant="default">Tải về máy</Button>
      </div>
      <div className="grid grid-cols-5 gap-2 text-sm">
        {Array.from({ length: 10 }).map((_, i) => (
          <Button
            key={i}
            variant={i === 7 ? "secondary" : "ghost"}
            className="aspect-square"
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <div className="text-xs space-y-1 text-gray-500">
        <div>
          <span className="inline-block w-3 h-3 rounded-full bg-black mr-1" />{" "}
          Một lựa chọn
        </div>
        <div>
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1" />{" "}
          Tự luận
        </div>
        <div>
          <span className="inline-block w-3 h-3 rounded-full border border-black mr-1" />{" "}
          Nhiều lựa chọn
        </div>
      </div>
    </aside>
  );
}
