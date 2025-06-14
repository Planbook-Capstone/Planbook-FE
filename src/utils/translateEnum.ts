const statusMap: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Không hoạt động",
};

export function translateStatus(status: string): string {
  return statusMap[status] || "Không xác định";
}

const academicYearStatusMap: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Không hoạt động",
  UPCOMING: "Sắp diễn ra",
};

export function translateAcademicYearStatus(status: string): string {
  return academicYearStatusMap[status] || "Không xác định";
}
