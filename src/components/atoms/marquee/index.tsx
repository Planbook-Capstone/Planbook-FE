"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { PiSparkleFill } from "react-icons/pi";

interface MarqueeProps {
  text?: string;
  className?: string;
  textClassName?: string;
  speed?: number; // seconds for one cycle
  direction?: "left" | "right";
  showLogo?: boolean;
}

export const Marquee = ({
  text = "PLANBOOK",
  className,
  textClassName,
  speed = 20,
  direction = "left",
  showLogo = true,
}: MarqueeProps) => {
  const animationDirection =
    direction === "left" ? "marquee-left" : "marquee-right";

  const MarqueeItem = () => (
    <div className="inline-flex items-center mx-8">
      <span
        className={cn(
          "text-[200px] md:text-8xl text-4xl font-bold text-black",
          textClassName
        )}
      >
        {text}
      </span>
      {showLogo && (
        <PiSparkleFill className="ml-12 mr-8 md:w-20 md:h-20 w-8 h-8 text-black" />
      )}
    </div>
  );

  return (
    <div className={cn("bg-lime-300 py-4 overflow-hidden", className)}>
      <div
        className="whitespace-nowrap flex"
        style={{
          animation: `${animationDirection} ${speed}s linear infinite`,
        }}
      >
        <div className="flex">
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
        </div>
        <div className="flex">
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
          <MarqueeItem />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};
