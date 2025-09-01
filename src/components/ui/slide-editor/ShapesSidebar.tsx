"use client";

import React from "react";

interface ShapesSidebarProps {
  onAddShape: (
    shapeType: "rectangle" | "circle" | "triangle" | "star",
    fill?: string,
    stroke?: string
  ) => void;
}

export default function ShapesSidebar({ onAddShape }: ShapesSidebarProps) {
  const shapes = [
    {
      type: "rectangle" as const,
      name: "Hình vuông",
      icon: "⬜",
      fill: "#3b82f6",
      stroke: "#1e40af",
    },
    {
      type: "circle" as const,
      name: "Hình tròn",
      icon: "⭕",
      fill: "#ef4444",
      stroke: "#dc2626",
    },
    {
      type: "triangle" as const,
      name: "Tam giác",
      icon: "🔺",
      fill: "#10b981",
      stroke: "#059669",
    },
    {
      type: "star" as const,
      name: "Hình sao",
      icon: "⭐",
      fill: "#f59e0b",
      stroke: "#d97706",
    },
  ];

  const handleShapeClick = (
    shapeType: "rectangle" | "circle" | "triangle" | "star",
    fill: string,
    stroke: string
  ) => {
    onAddShape(shapeType, fill, stroke);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full font-questrial">
      <div className="mb-6">
        <h3 className="text-lg font-calsans text-gray-800 mb-4">Hình dạng</h3>
        <p className="text-sm text-gray-600 mb-4">
          Chọn hình dạng để thêm vào slide
        </p>

        <div className="space-y-3">
          {shapes.map((shape) => (
            <button
              key={shape.type}
              onClick={() =>
                handleShapeClick(shape.type, shape.fill, shape.stroke)
              }
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded">
                {shape.type === "rectangle" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="307"
                    height="307"
                    viewBox="0 0 307 307"
                    fill="none"
                  >
                    <g filter="url(#filter0_i_2324_2694)">
                      <rect
                        width="307"
                        height="307"
                        rx="25"
                        fill="url(#paint0_linear_2324_2694)"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_2324_2694"
                        x="0"
                        y="0"
                        width="307"
                        height="311"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="15" />
                        <feComposite
                          in2="hardAlpha"
                          operator="arithmetic"
                          k2="-1"
                          k3="1"
                        />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.482741 0 0 0 0 0.939653 0 0 0 0 1 0 0 0 1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="shape"
                          result="effect1_innerShadow_2324_2694"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_2324_2694"
                        x1="153.5"
                        y1="0"
                        x2="153.5"
                        y2="307"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.177358" stop-color="#30C7EF" />
                        <stop offset="0.59036" stop-color="#2BD6E9" />
                        <stop offset="0.874299" stop-color="#28E1E4" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                {shape.type === "circle" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="307"
                    height="307"
                    viewBox="0 0 307 307"
                    fill="none"
                  >
                    <g filter="url(#filter0_i_2324_2697)">
                      <rect
                        width="307"
                        height="307"
                        rx="153.5"
                        fill="url(#paint0_linear_2324_2697)"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_2324_2697"
                        x="0"
                        y="0"
                        width="307"
                        height="311"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="15" />
                        <feComposite
                          in2="hardAlpha"
                          operator="arithmetic"
                          k2="-1"
                          k3="1"
                        />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.918044 0 0 0 0 0.959022 0 0 0 0 1 0 0 0 1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="shape"
                          result="effect1_innerShadow_2324_2697"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_2324_2697"
                        x1="153.5"
                        y1="0"
                        x2="153.5"
                        y2="307"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#407BE9" />
                        <stop offset="0.620192" stop-color="#3AA7FC" />
                        <stop offset="1" stop-color="#30C7EF" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                {shape.type === "triangle" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="345"
                    height="290"
                    viewBox="0 0 345 290"
                    fill="none"
                  >
                    <g filter="url(#filter0_i_2324_2702)">
                      <path
                        d="M163.933 5.23117C167.82 -1.22534 177.18 -1.22534 181.067 5.23117L343.075 274.342C347.088 281.007 342.287 289.5 334.508 289.5H10.4921C2.71257 289.5 -2.08761 281.007 1.92478 274.342L163.933 5.23117Z"
                        fill="url(#paint0_linear_2324_2702)"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_2324_2702"
                        x="0.476562"
                        y="0.388672"
                        width="344.047"
                        height="293.111"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="25" />
                        <feComposite
                          in2="hardAlpha"
                          operator="arithmetic"
                          k2="-1"
                          k3="1"
                        />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.848708 0 0 0 0 0.909225 0 0 0 0 1 0 0 0 0.73 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="shape"
                          result="effect1_innerShadow_2324_2702"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_2324_2702"
                        x1="172.5"
                        y1="-9"
                        x2="172.5"
                        y2="389"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#2501C6" />
                        <stop offset="0.620192" stop-color="#3A67FC" />
                        <stop offset="1" stop-color="#3099EF" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
                {shape.type === "star" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="369"
                    height="348"
                    viewBox="0 0 369 348"
                    fill="none"
                  >
                    <g filter="url(#filter0_i_2324_2705)">
                      <path
                        d="M175.002 7.82395C178.021 -1.33665 190.979 -1.33667 193.998 7.82393L230.619 118.963C231.97 123.064 235.8 125.834 240.117 125.834H358.324C368.045 125.834 372.05 138.301 364.148 143.963L268.758 212.303C265.204 214.849 263.716 219.409 265.085 223.561L301.577 334.31C304.605 343.498 294.12 351.202 286.255 345.568L190.324 276.84C186.842 274.346 182.158 274.346 178.676 276.84L82.7447 345.568C74.8802 351.202 64.3954 343.498 67.4231 334.31L103.915 223.561C105.284 219.409 103.796 214.849 100.242 212.303L4.85213 143.963C-3.05028 138.301 0.954894 125.834 10.676 125.834H128.883C133.2 125.834 137.03 123.064 138.381 118.963L175.002 7.82395Z"
                        fill="url(#paint0_linear_2324_2705)"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_i_2324_2705"
                        x="0.656982"
                        y="0.953613"
                        width="367.686"
                        height="350.531"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="15" />
                        <feComposite
                          in2="hardAlpha"
                          operator="arithmetic"
                          k2="-1"
                          k3="1"
                        />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 1 0 0 0 0 0.989724 0 0 0 0 0.691725 0 0 0 0.91 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="shape"
                          result="effect1_innerShadow_2324_2705"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_2324_2705"
                        x1="184.5"
                        y1="-21"
                        x2="184.5"
                        y2="404"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.283654" stop-color="#FFA13B" />
                        <stop offset="0.899038" stop-color="#FF2C0C" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800 font-calsans">
                  {shape.name}
                </div>
                <div className="text-xs text-gray-500">
                  Nhấn để thêm {shape.name.toLowerCase()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3 font-calsans">
          Hướng dẫn sử dụng
        </h4>
        <div className="text-xs text-gray-600 space-y-2">
          <p>1. Nhấn vào hình dạng để thêm vào slide</p>
          <p>2. Kéo thả để di chuyển vị trí</p>
          <p>3. Kéo góc để thay đổi kích thước</p>
          <p>4. Nhấp chuột phải để xem thêm tùy chọn</p>
        </div>
      </div>
    </div>
  );
}
