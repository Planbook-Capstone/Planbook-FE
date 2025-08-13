"use client";

import React, { useState } from "react";
import { AdvancedTextEditor } from "./advanced-text-editor";

export function TestEditor() {
  const [content, setContent] = useState("");

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Test Advanced Text Editor</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Phím tắt:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+B</kbd>: Đậm</li>
          <li>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+I</kbd>: Nghiêng</li>
          <li>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+U</kbd>: Gạch chân</li>
          <li>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+Shift+=</kbd>: Chỉ số trên (superscript)</li>
          <li>• <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+Shift+-</kbd>: Chỉ số dưới (subscript)</li>
        </ul>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-1">Cách sử dụng:</p>
          <ol className="text-xs text-blue-700 space-y-1">
            <li>1. Nhập text: "H2O" hoặc "x2 + y2 = z2"</li>
            <li>2. Chọn (select) phần cần format: "2" trong "H2O"</li>
            <li>3. Nhấn <kbd className="px-1 py-0.5 bg-blue-100 rounded">Ctrl+Shift+-</kbd> để tạo H₂O</li>
            <li>4. Hoặc nhấn <kbd className="px-1 py-0.5 bg-blue-100 rounded">Ctrl+Shift+=</kbd> để tạo x²</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">
            💡 Mở Console (F12) để xem debug messages
          </p>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 min-h-[100px] focus-within:border-blue-500">
        <AdvancedTextEditor
          content={content}
          onChange={setContent}
          placeholder="Nhập văn bản và thử các phím tắt... Ví dụ: H2O, x² + y² = z²"
          className="w-full"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">HTML Output:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
          {content || "Chưa có nội dung"}
        </pre>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Rendered Preview:</h3>
        <div
          className="border border-gray-200 p-3 rounded min-h-[50px] bg-white"
          dangerouslySetInnerHTML={{ __html: content || "Chưa có nội dung" }}
        />
      </div>
    </div>
  );
}
