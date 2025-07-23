import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/constants/icon";
import { hi } from "date-fns/locale";

interface PricingCardProps {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  feature?: string[];
  highlight?: boolean;
  tokenAmount?: number;
}

const PricingCard = ({
  id,
  title,
  description,
  price,
  feature,
  highlight,
  tokenAmount,
}: PricingCardProps) => {
  const features = [
    "Tạo giáo án tự động bằng AI",
    "Tạo đề kiểm tra thông minh",
    "Phân tích kết quả học tập học sinh",
    "Tạo slide bài giảng từ giáo án",
    "Chấm bài & nhận xét tự động",
  ];
  return (
    <div
      className={`flex flex-col gap-3 px-9 py-12 rounded-3xl  ${
        highlight
          ? "bg-[url('/images/background/abstract-bg.png')] bg-[length:300%] bg-center text-white"
          : "bg-white border"
      }`}
    >
      <h1 className="font-calsans text-2xl lg:text-3xl">
        {title?.toUpperCase() || "Free".toUpperCase()}
      </h1>
      <p className={`${highlight ? "text-white" : "text-slate-500"}  text-sm`}>
        {description}
      </p>

      <div className="pt-5 space-y-2">
        <p className="text-sm font-medium mb-3 opacity-80">
          Tính năng bao gồm:
        </p>
        <ul>
          <li className="flex items-center gap-x-2">
            <span className={`${highlight ? "text-white" : "text-black"} mt-1`}>
              •
            </span>
            <span>Tặng ngay {tokenAmount} token AI</span>
          </li>
          {features?.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                className={`${highlight ? "text-white" : "text-black"} mt-1`}
              >
                •
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="flex justify-start items-start gap-1.5 py-5"> */}
      <h1 className="font-calsans text-3xl lg:text-6xl">
        {price?.toLocaleString("vi-VN")}
      </h1>
      {/* <p className="text-muted-foreground text-sm">/ {tokenAmount}</p>
      </div> */}
      <p className="text-sm opacity-80 leading-relaxed">
        Bắt đầu số hóa công việc giảng dạy. Tiết kiệm thời gian và nâng cao hiệu
        quả
      </p>
      <Button
        className={`w-full h-12 text-base rounded-full font-medium transition-all  border border-white/30 backdrop-blur-sm 
          ${
            highlight
              ? "bg-white/10 hover:bg-white/30 text-white"
              : "bg-black text-white"
          }
        `}
      >
        Trải nghiệm ngay
      </Button>
    </div>
  );
};

export default PricingCard;
