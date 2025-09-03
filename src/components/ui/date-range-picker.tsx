"use client";

import React, { useState } from "react";
import { DatePicker, Button, Space } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export interface DateRange {
  start: Dayjs;
  end: Dayjs;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
}

const presets = [
  {
    label: "7 ngày qua",
    value: () => ({
      start: dayjs().subtract(7, "day"),
      end: dayjs(),
    }),
  },
  {
    label: "30 ngày qua", 
    value: () => ({
      start: dayjs().subtract(30, "day"),
      end: dayjs(),
    }),
  },
  {
    label: "3 tháng qua",
    value: () => ({
      start: dayjs().subtract(3, "month"),
      end: dayjs(),
    }),
  },
  {
    label: "6 tháng qua",
    value: () => ({
      start: dayjs().subtract(6, "month"),
      end: dayjs(),
    }),
  },
  {
    label: "1 năm qua",
    value: () => ({
      start: dayjs().subtract(1, "year"),
      end: dayjs(),
    }),
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const range = {
        start: dates[0],
        end: dates[1],
      };
      onChange?.(range);
      setSelectedPreset(null); // Clear preset selection when manually selecting
    }
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.value();
    onChange?.(range);
    setSelectedPreset(preset.label);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <label className="block text-sm font-calsans text-gray-700 mb-2">
          Khoảng thời gian
        </label>
        <RangePicker
          value={value ? [value.start, value.end] : null}
          onChange={handleRangeChange}
          format="DD/MM/YYYY"
          placeholder={["Từ ngày", "Đến ngày"]}
          suffixIcon={<CalendarOutlined />}
          className="w-full font-questrial"
          size="large"
        />
      </div>
      
      <div>
        <label className="block text-sm font-calsans text-gray-700 mb-2">
          Chọn nhanh
        </label>
        <Space wrap>
          {presets.map((preset) => (
            <Button
              key={preset.label}
              size="small"
              type={selectedPreset === preset.label ? "primary" : "default"}
              onClick={() => handlePresetClick(preset)}
              className="font-questrial"
            >
              {preset.label}
            </Button>
          ))}
        </Space>
      </div>
    </div>
  );
};
