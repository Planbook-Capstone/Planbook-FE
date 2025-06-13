import { Loader2 } from "lucide-react"; // hoặc bất kỳ icon spinner nào từ lucide

function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      {/* <Loading /> */}
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Đang tải trang quản trị...</p>
      </div>
    </div>
  );
}

export default AdminLoading;
