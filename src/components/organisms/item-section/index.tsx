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

export default function ItemSection({ title,action }: ItemSectionProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="flex items-center justify-start text-xl font-calsans">
        {title}
      </h1>

      <div className="flex justify-end items-center gap-2.5 w-1/2">
        <Select defaultValue="light">
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Mới nhất</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <ViewToggle />
        {action}
      </div>
    </div>
  );
}
