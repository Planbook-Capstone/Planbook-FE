import { ViewToggle } from "@/components/molecules/view-toggle";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemSectionProps {
  title?: React.ReactNode;
  action?: React.ReactNode;
}

export default function ItemSection({ title, action }: ItemSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 className="flex gap-1 items-center text-xl font-calsans">{title}</h1>

      <div className="flex justify-end items-center gap-2.5 w-full sm:w-1/2">
        <Select defaultValue="light">
          <SelectTrigger className="min-w-[120px] w-fit">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Mới nhất</SelectItem>
            <SelectItem value="dark">Cũ nhất</SelectItem>
            <SelectItem value="system">Tùy chỉnh</SelectItem>
          </SelectContent>
        </Select>

        <ViewToggle />
        {action}
      </div>
    </div>
  );
}
