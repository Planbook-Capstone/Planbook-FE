"use client";

import React from "react";
import { Select } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

export type TimeGranularity = "day" | "week" | "month";

interface TimeGranularitySelectorProps {
  value?: TimeGranularity;
  onChange?: (granularity: TimeGranularity) => void;
  className?: string;
}

const options = [
  {
    label: "Theo ngày",
    value: "day" as TimeGranularity,
    description: "Hiển thị dữ liệu theo từng ngày",
  },
  {
    label: "Theo tuần", 
    value: "week" as TimeGranularity,
    description: "Hiển thị dữ liệu theo từng tuần",
  },
  {
    label: "Theo tháng",
    value: "month" as TimeGranularity,
    description: "Hiển thị dữ liệu theo từng tháng",
  },
];

export const TimeGranularitySelector: React.FC<TimeGranularitySelectorProps> = ({
  value = "month",
  onChange,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-calsans text-gray-700">
        Độ chi tiết thời gian
      </label>
      <Select
        value={value}
        onChange={onChange}
        className="w-full font-questrial"
        size="large"
        suffixIcon={<ClockCircleOutlined />}
        options={options.map(option => ({
          ...option,
          title: option.description,
        }))}
      />
    </div>
  );
};
