import { DataTable } from "../data-table";
import { historyColumns, HistoryItem } from "./columns";

interface HistoryListProps {
  data: HistoryItem[];
}

export default function HistoryList({data}: HistoryListProps) {
  
  return <DataTable columns={historyColumns} data={data} />;
}
