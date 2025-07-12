"use client";

import React from "react";
import { CustomTable } from "@/components/organisms/table";

export default function TestTiptapTablePage() {
  const initialData = {
    headers: ["Hoạt động của giáo viên", "Hoạt động của học sinh"],
    rows: [
      [
        "<p><strong>Bước 1: Chuyển giao nhiệm vụ học tập</strong></p><p>GV nêu vấn đề: \"Thế nào là hàm số đồng biến, nghịch biến trên khoảng K? Cho ví dụ minh họa và vẽ đồ thị (nếu có).\" HS tiếp nhận nhiệm vụ, suy nghĩ và chuẩn bị câu trả lời.</p>",
        "<p>Học sinh lắng nghe và ghi chép</p>"
      ],
      [
        "<p><strong>Bước 2: Thực hiện nhiệm vụ</strong></p><p>HS thực hiện các bài tập/ví dụ về xét tính đơn điệu của hàm số dựa vào dấu của đạo hàm cấp một. GV quan sát, hướng dẫn và hỗ trợ HS khi cần thiết, đặc biệt chú ý đến việc lập và đọc bảng biến thiên.</p>",
        "<p>Học sinh thực hiện bài tập</p>"
      ]
    ]
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Tiptap Editor in Table</h1>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">Hướng dẫn sử dụng:</h2>
        <ul className="text-sm space-y-1">
          <li>• Double-click vào cell để chỉnh sửa với Tiptap editor</li>
          <li>• Sử dụng toolbar để format text (Bold, Italic, Lists, Links, Images)</li>
          <li>• Nhấn <kbd className="bg-gray-200 px-1 rounded">Ctrl+Enter</kbd> để save</li>
          <li>• Nhấn <kbd className="bg-gray-200 px-1 rounded">Escape</kbd> để cancel</li>
          <li>• Click ra ngoài để auto-save</li>
        </ul>
      </div>

      <CustomTable
        initialData={initialData}
        onDataChange={(data) => {
          console.log("Table data changed:", data);
        }}
        showControls={true}
      />
    </div>
  );
}
