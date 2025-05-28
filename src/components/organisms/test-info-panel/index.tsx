export default function TestInfoPanel() {
  return (
    <aside className="w-1/4 px-6 py-4 space-y-3">
      <div>
        <div className="text-xs font-medium text-gray-500">Tên tài liệu</div>
        <div className="font-semibold">
          Kiểm tra hoá cuối kì - THPT Trần Phú
        </div>
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500">Mô tả</div>
        <div className="text-sm">
          Nghiên cứu các yếu tố ảnh hưởng đến tốc độ phản ứng...
        </div>
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500">Người tạo</div>
        <div className="text-sm">Nguyễn Văn A</div>
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500">Ngày tạo</div>
        <div className="text-sm">15:23 14/5/2025</div>
      </div>
    </aside>
  );
}
