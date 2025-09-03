"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Modal } from "antd";

interface ChartData {
  name: string;
  amount: number;
  id?: string;
  details?: any;
}

interface InteractiveChartProps {
  data: ChartData[];
  type: "line" | "bar";
  title: string;
  loading?: boolean;
  onItemClick?: (item: ChartData) => void;
  formatValue?: (value: number) => string;
  height?: number;
}

const COLORS = [
  "#330BA2", "#3B82F6", "#10B981", "#F59E0B", 
  "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16"
];

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type,
  title,
  loading = false,
  onItemClick,
  formatValue = (value) => new Intl.NumberFormat("vi-VN").format(value),
  height = 300,
}) => {
  const [selectedItem, setSelectedItem] = useState<ChartData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleItemClick = (item: ChartData, index: number) => {
    setSelectedItem(item);
    onItemClick?.(item);
  };

  const handleMouseEnter = (data: any, index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const renderTooltip = (props: any) => {
    if (!props.active || !props.payload || !props.payload.length) {
      return null;
    }

    const data = props.payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-calsans text-gray-900">{props.label}</p>
        <p className="font-questrial text-blue-600">
          {formatValue(data.value)} tokens
        </p>
        <p className="text-xs text-gray-500 mt-1">Click để xem chi tiết</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="font-questrial text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-questrial text-lg">Không có dữ liệu</p>
          <p className="text-sm text-gray-400 mt-1">
            Dữ liệu sẽ hiển thị khi có hoạt động
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart
              data={data}
              margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                className="font-questrial"
              />
              <YAxis 
                width={100}
                tick={{ fontSize: 12 }}
                tickFormatter={formatValue}
                className="font-questrial"
              />
              <Tooltip content={renderTooltip} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ 
                  fill: "#3B82F6", 
                  strokeWidth: 2, 
                  r: 4,
                  cursor: "pointer"
                }}
                activeDot={{ 
                  r: 6, 
                  cursor: "pointer",
                  onClick: handleItemClick
                }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                className="font-questrial"
              />
              <YAxis 
                width={100}
                tick={{ fontSize: 12 }}
                tickFormatter={formatValue}
                className="font-questrial"
              />
              <Tooltip content={renderTooltip} />
              <Bar 
                dataKey="amount" 
                cursor="pointer"
                onClick={handleItemClick}
                onMouseEnter={handleMouseEnter}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={hoveredIndex === index ? "#1E40AF" : COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Detail Modal */}
      <Modal
        title={
          <span className="font-calsans">
            Chi tiết: {selectedItem?.name}
          </span>
        }
        open={!!selectedItem}
        onCancel={() => setSelectedItem(null)}
        footer={null}
        width="90%"
        style={{ maxWidth: 600 }}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-calsans text-gray-700 mb-1">
                  Tên
                </label>
                <p className="font-questrial text-gray-900">
                  {selectedItem.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-calsans text-gray-700 mb-1">
                  Token sử dụng
                </label>
                <p className="font-questrial text-gray-900">
                  {formatValue(selectedItem.amount)} tokens
                </p>
              </div>
            </div>
            
            {selectedItem.details && (
              <div>
                <label className="block text-sm font-calsans text-gray-700 mb-1">
                  Chi tiết bổ sung
                </label>
                <pre className="bg-gray-100 p-3 rounded text-sm font-mono overflow-auto">
                  {JSON.stringify(selectedItem.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
