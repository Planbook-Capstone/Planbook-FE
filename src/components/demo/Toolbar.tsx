"use client";

interface ToolbarProps {
  showDeleteButtons: boolean;
  onToggleDeleteButtons: () => void;
  onShowPreview: () => void;
  onExportJSON: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Toolbar({
  showDeleteButtons,
  onToggleDeleteButtons,
  onShowPreview,
  onExportJSON,
  sidebarCollapsed,
  onToggleSidebar
}: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
            title={sidebarCollapsed ? "Mở sidebar" : "Đóng sidebar"}
          >
            {sidebarCollapsed ? "☰" : "✕"}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Dynamic Layout Demo
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDeleteButtons}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showDeleteButtons
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showDeleteButtons ? "Ẩn nút xóa" : "Hiện nút xóa"}
          </button>
          <button
            onClick={onShowPreview}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            📄 Preview
          </button>
          <button
            onClick={onExportJSON}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
