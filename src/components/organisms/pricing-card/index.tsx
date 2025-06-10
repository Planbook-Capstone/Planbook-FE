import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/constants/icon";

interface PricingCardProps {
  title?: string;
  subTitle?: string;
  price?: number;
  monthy_price?: number;
}

const PricingCard = ({}: PricingCardProps) => {
  const features = [
    "Tạo giáo án tự động bằng AI",
    "Tạo đề kiểm tra thông minh",
    "Phân tích kết quả học tập học sinh",
    "Tạo slide bài giảng từ giáo án",
    "Chấm bài & nhận xét tự động",
  ];
  return (
    <div className="flex flex-col gap-1.5 px-9 py-12 rounded-lg ">
      <h1 className="font-calsans text-lg">Cơ Bản</h1>
      <p className="text-slate-500 text-sm">
        Phù hợp với giáo viên cá nhân muốn trải nghiệm nhanh các tính năng AI cơ
        bản.
      </p>
      <div className="flex justify-start items-center gap-1.5 py-5">
        <h1 className="font-calsans text-5xl">$0</h1>
        <p className="text-muted-foreground text-sm">/ Tháng</p>
      </div>
      <Button
        variant={"outline"}
        className="font-calsans text-sm text-blue-700 border-blue-700"
      >
        Trải nghiệm ngay
      </Button>
      <div className="pt-5 space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="rounded-full bg-blue-50 max-w-fit p-2">
              {CheckIcon}
            </div>
            <p className="text-sm text-neutral-800 font-manrope font-medium">
              {feature}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;
