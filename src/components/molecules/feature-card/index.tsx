import Image from "next/image";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string[];
  description: string;
  image: string;
  className?: string;
  imageStyleClassName?: string;
};

export const FeatureCard = ({
  title,
  description,
  image,
  className,
  imageStyleClassName,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "bg-white h-[600px] w-[600px] rounded-4xl p-6 md:p-12 flex flex-col justify-between border relative overflow-hidden",
        className
      )}
    >
      <div className="max-w-3/5 mt-7">
        <h3 className="text-[1.7rem] font-calsans mb-4">
          {title.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h3>
        <p className="text-base">{description}</p>
      </div>
      <div className="absolute left-0 right-0 bottom-0">
        <Image
          src={image}
          alt={"image"}
          width={800}
          height={800}
          className={cn(
            "absolute bottom-0 left-0 right-0 translate-x-2 scale-115 object-contain",
            imageStyleClassName
          )}
        />
      </div>
    </div>
  );
};
