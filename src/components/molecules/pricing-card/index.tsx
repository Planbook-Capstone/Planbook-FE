import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type PricingCardProps = {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
};

export const PricingCard = ({
  name,
  price,
  features,
  popular,
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-8 w-full bg-transparent flex flex-col justify-between hover:scale-110 transition-all cursor-pointer ease-in-out"
      )}
      style={
        popular ? { boxShadow: "45px 25px 75px rgba(0, 0, 0, 0.1)" } : undefined
      }
    >
      {popular && (
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1737B3] text-white text-sm px-4 py-1 rounded-full">
          Phổ biến
        </div>
      )}
      <div>
        <h3 className="text-xl font-questrial mb-1">{name}</h3>
        <p className="text-4xl font-calsans mb-4">{price}</p>
        <p className="text-base font-medium mb-2">Tính năng bao gồm :</p>
        <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex justify-center w-full">
        <Button
          variant={popular ? "default" : "outline"}
          className={cn(
            "h-14 px-10 text-base rounded-full",
            popular ? "bg-[#30C7EF] text-white" : ""
          )}
        >
          Chọn gói ngay
        </Button>
      </div>
    </div>
  );
};
