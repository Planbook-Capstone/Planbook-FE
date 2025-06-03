import { Button } from "@/components/ui/Button";
import { Input } from "antd";

interface StepHeaderProps {
  onReportClick?: () => void;
  onNextClick?: () => void;
  nextLabel?: string;
}

export default function StepHeader({
  onReportClick,
  onNextClick,
  nextLabel = "Tiếp tục",
}: StepHeaderProps) {
  return (
    <div className="fixed bottom-0 left-0 bg-white border-t-[0.5px] flex justify-end gap-3 p-6 w-full">
      <div className="flex gap-2 justify-end">
        <Button className="font-questrial" onClick={onNextClick}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
