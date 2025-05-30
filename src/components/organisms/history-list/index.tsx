import { DataTable } from "../data-table";
import { historyColumns, HistoryItem } from "./columns";

interface HistoryListProps {}

export default function HistoryList(props: HistoryListProps) {
  const data: HistoryItem[] = [
    {
      id: 1,

      title: "Tạo giáo án chi tiết",
      description: "Soạn giáo án theo từng bài học cụ thể.",
      updatedAt: "15:00 20/03/2025",
      sources: "1 nguồn",
    },
    {
      id: 2,
      title: "Lập kế hoạch giảng dạy",
      description: "Lập lịch dạy học cho cả tuần.",
      updatedAt: "15:00 20/03/2025",
      sources: "2 nguồn",
    },
    {
      id: 3,
      title: "Viết nhận xét học sinh",
      description:
        "Gợi ý nhận xét theo năng lực và hành vc và hà năng lực và hành vc và hà năng lực và hành vc và hà năng lực và hành vc và hàc và hành và hành vc và hành vi.",
      updatedAt: "15:00 20/03/2025",
      sources: "1 nguồn",
    },
  ];
  return <DataTable columns={historyColumns} data={data} />;
}
