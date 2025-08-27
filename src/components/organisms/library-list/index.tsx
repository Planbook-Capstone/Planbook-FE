import { DataTable } from "../data-table";
import { libraryColumns, LibraryItem } from "./columns";

interface LibraryListProps {
  data: LibraryItem[];
  onItemClick: (item: LibraryItem) => void;
  onRemoveClick: (item: LibraryItem) => void;
  type: string; // "QUIZ" or other types
}

export default function LibraryList({ data, onItemClick, onRemoveClick, type }: LibraryListProps) {
  // Transform data to include handlers
  const dataWithHandlers = data.map(item => ({
    ...item,
    onItemClick: () => onItemClick(item),
    onRemoveClick: () => onRemoveClick(item),
    type: type
  }));

  return <DataTable columns={libraryColumns} data={dataWithHandlers} />;
}
