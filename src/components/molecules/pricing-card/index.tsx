import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type PricingCardProps = {
  id: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
  buttonText: string;
  buttonSubtext: string;
  cardType: "purple" | "dark" | "gradient";
  features?: string[];
};

export const PricingCard = ({
  id,
  name,
  description,
  price,
  badge,
  buttonText,
  buttonSubtext,
  cardType,
  features,
}: PricingCardProps) => {
  const getCardStyles = () => {
    // Glass morphism effect - transparent with backdrop blur
    return "bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-xl";
  };

  const getBadgeStyles = () => {
    // Glass effect for badges too
    return "bg-white/20 backdrop-blur-sm text-white border border-white/30";
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 w-full flex flex-col justify-between hover:scale-105 transition-all cursor-pointer ease-in-out min-h-[500px] group",
        getCardStyles()
      )}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      {/* ID Number */}
      <div className="absolute top-6 left-6 text-lg font-bold opacity-60">
        {id}
      </div>

      {/* Badge */}
      {badge && (
        <div
          className={cn(
            "absolute top-6 right-6 text-xs px-3 py-1 rounded-full font-bold",
            getBadgeStyles()
          )}
        >
          {badge}
        </div>
      )}

      <div className="mt-12">
        {/* Title */}
        <h3 className="text-4xl md:text-5xl font-calsans mb-6 leading-tight">
          {name}
        </h3>

        {/* Description */}
        <p className="text-base mb-6 opacity-90 leading-relaxed">
          {description}
        </p>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-3 opacity-80">
              Tính năng bao gồm:
            </p>
            <ul className="space-y-2 text-sm opacity-80">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-white/60 mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-white/60 text-xs">
                  +{features.length - 3} tính năng khác
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Price */}
        <p className="text-5xl md:text-6xl font-calsans mb-8">{price}</p>
      </div>

      <div className="space-y-4">
        {/* Subtext */}
        <p className="text-sm opacity-80 leading-relaxed">{buttonSubtext}</p>

        {/* Button */}
        <Button className="w-full h-12 text-base rounded-full font-medium transition-all bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
