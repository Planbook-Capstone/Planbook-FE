import { folderColors } from "@/constants/color";
import React from "react";

interface FolderCardProps {
  colorId?: string;
  id: string;
  title?: string;
  width?: number;
  height?: number;
}

function FolderCard({
  // title = "Không tiêu đề",
  title,
  colorId = "1",
  id,
  width = 122,
  height = 90,
}: FolderCardProps) {
  const { startColor, endColor } = folderColors[colorId];
  return (
    <div className="group flex flex-col items-center justify-center gap-1 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 122 90"
        fill="none"
        className="transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:-translate-y-1"
      >
        <g clipPath={`url(#clip_${id})`}>
          <path
            d="M120.085 14.1861V83.5406C120.085 87.1075 117.184 90 113.607 90H8.55106C4.97387 90 2.073 87.1075 2.073 83.5406V6.45939C2.073 2.89252 4.97387 0 8.55106 0H31.6246C33.6237 0 35.5114 0.921109 36.7384 2.49462L40.8196 7.72672H113.607C117.184 7.72672 120.085 10.6192 120.085 14.1861Z"
            fill={`url(#paint0_linear_${id})`}
          />
          <path
            d="M112.515 12.4408H9.64457C8.21348 12.4408 7.05334 13.5976 7.05334 15.0246V77.5476C7.05334 78.9746 8.21348 80.1314 9.64457 80.1314H112.515C113.946 80.1314 115.106 78.9746 115.106 77.5476V15.0246C115.106 13.5976 113.946 12.4408 112.515 12.4408Z"
            fill="white"
          />
          <path
            d="M4.66422 17.7207H117.494C118.924 17.7207 120.085 18.8782 120.085 20.3045V84.8325C120.085 87.685 117.763 90 114.903 90H7.25545C4.39473 90 2.073 87.685 2.073 84.8325V20.3045C2.073 18.8782 3.23387 17.7207 4.66422 17.7207Z"
            fill={`url(#paint1_linear_${id})`}
            className="transition-transform duration-300 ease-in-out group-hover:-rotate-x-45 origin-bottom-left"
          />
        </g>
        <defs>
          <linearGradient
            id={`paint0_linear_${id}`}
            x1="61.079"
            y1="0"
            x2="61.079"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={startColor} />
            <stop offset="0.27" stopColor={endColor} />
          </linearGradient>
          <linearGradient
            id={`paint1_linear_${id}`}
            x1="61.0791"
            y1="17.7207"
            x2="61.0791"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={startColor} />
            <stop offset="1" stopColor={endColor} />
          </linearGradient>
          <clipPath id={`clip0_${id}`}>
            <rect width="122" height="90" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <p className="text-sm">{title}</p>
    </div>
  );
}

export default FolderCard;
