import { Button } from "@/components/ui/Button";
import { Input } from "antd";

interface StepHeaderProps {
  title: string;
  onReportClick?: () => void;
  onNextClick?: () => void;
  nextLabel?: string;
}

export default function StepHeader({
  title,
  onReportClick,
  onNextClick,
  nextLabel = "Tiếp tục",
}: StepHeaderProps) {
  return (
    <div className="flex justify-between flex-col gap-3 mb-6">
      <p className="text-sm text-gray-500 mb-1">Tiêu đề</p>
      <Input value={title} readOnly className="w-full" />
      <div className="flex gap-2">
        <Button onClick={onNextClick}>{nextLabel}</Button>
      </div>
    </div>
  );
}
