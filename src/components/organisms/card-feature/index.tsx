import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";

interface CardFeatureProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  href?: string;
}

const CardFeature = ({
  icon,
  title,
  description,
  href = "/",
}: CardFeatureProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(href);
  };
  return (
    <div
      onClick={handleClick}
      className="w-full flex justify-between items-center gap-1 border border-[#DFDFDF] px-2.5 py-3.5 rounded-2xl cursor-pointer  hover:bg-[#FAFAFA]"
    >
      <div className="w-full">{icon}</div>
      <div className="w-full flex flex-col gap-1">
        <h1 className="font-calsans text-base">{title}</h1>
        <p className="text-sm truncate w-4/5">{description}</p>
      </div>
    </div>
  );
};

export default CardFeature;
