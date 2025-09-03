"use client";

import React from "react";
import { Select, Tag } from "antd";
import { ToolOutlined } from "@ant-design/icons";

interface Tool {
  id: string;
  name: string;
  description?: string;
}

interface ToolSelectorProps {
  tools: Tool[];
  value?: string[];
  onChange?: (toolIds: string[]) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  tools,
  value = [],
  onChange,
  placeholder = "Chọn công cụ",
  className = "",
  loading = false,
}) => {
  const handleChange = (selectedIds: string[]) => {
    onChange?.(selectedIds);
  };

  const handleSelectAll = () => {
    const allIds = tools.map(tool => tool.id);
    onChange?.(allIds);
  };

  const handleClearAll = () => {
    onChange?.([]);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-calsans text-gray-700">
          Công cụ
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-questrial"
            disabled={loading}
          >
            Chọn tất cả
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-gray-600 hover:text-gray-800 font-questrial"
            disabled={loading}
          >
            Bỏ chọn
          </button>
        </div>
      </div>
      
      <Select
        mode="multiple"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full font-questrial"
        size="large"
        loading={loading}
        suffixIcon={<ToolOutlined />}
        maxTagCount="responsive"
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          return (
            <Tag
              closable={closable}
              onClose={onClose}
              className="font-questrial"
            >
              {label}
            </Tag>
          );
        }}
        options={tools.map(tool => ({
          label: tool.name,
          value: tool.id,
          title: tool.description || tool.name,
        }))}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        showSearch
        allowClear
      />
      
      {value.length > 0 && (
        <div className="text-xs text-gray-500 font-questrial">
          Đã chọn {value.length} / {tools.length} công cụ
        </div>
      )}
    </div>
  );
};
