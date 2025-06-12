const statusMap: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Không hoạt động",
};

export function translateStatus(status: string): string {
  return statusMap[status] || "Không xác định";
}
