export const folderColors: Record<
  string,
  { startColor: string; endColor: string }
> = {
  "1": { startColor: "#FD542D", endColor: "#D62E1F" },
  "2": { startColor: "#FD8B1C", endColor: "#E56000" },
  "3": { startColor: "#28CDFF", endColor: "#1C74FF" },
  "4": { startColor: "#E0BCF9", endColor: "#BA90F5" },
  "5": { startColor: "#FFE35F", endColor: "#F5B800" },
  "6": { startColor: "#B1E4A8", endColor: "#58C168" },
  "7": { startColor: "#FFD8E8", endColor: "#DA7EA4" },
};

 export const statusConfig = {
  DRAFT: { label: "Nháp", color: "bg-gray-100 text-gray-800" },
  SCHEDULED: { label: "Đã lên lịch", color: "bg-yellow-100 text-yellow-800" },
  ACTIVE: { label: "Đang hoạt động", color: "bg-green-100 text-green-800" },
  PAUSED: { label: "Tạm dừng", color: "bg-orange-100 text-orange-800" },
  COMPLETED: { label: "Đã hoàn thành", color: "bg-blue-100 text-blue-800" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};