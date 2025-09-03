"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: "number" | "currency" | "percentage";
  suffix?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  previousValue,
  format = "number",
  suffix = "",
  icon,
  className = "",
  style,
  loading = false,
}) => {
  const formatValue = (val: number): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(val);
      case "percentage":
        return `${val.toFixed(1)}%`;
      case "number":
      default:
        return new Intl.NumberFormat("vi-VN").format(val);
    }
  };

  const calculateTrend = () => {
    if (previousValue === undefined || previousValue === 0) return null;

    const change = value - previousValue;
    const percentChange = (change / previousValue) * 100;

    return {
      change,
      percentChange,
      isPositive: change > 0,
      isNegative: change < 0,
      isNeutral: change === 0,
    };
  };

  const trend = calculateTrend();

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4" />;
    if (trend.isPositive) return <TrendingUp className="w-4 h-4" />;
    if (trend.isNegative) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    if (trend.isPositive) return "text-green-600";
    if (trend.isNegative) return "text-red-600";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
        style={style}
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            {icon && <div className="h-6 w-6 bg-gray-200 rounded"></div>}
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-calsans text-gray-700">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="mb-2">
        <p className="text-3xl font-calsans text-gray-900">
          {formatValue(value)}
          {suffix && (
            <span className="text-lg text-gray-500 ml-1">{suffix}</span>
          )}
        </p>
      </div>

      {trend && (
        <div
          className={`flex items-center gap-1 text-sm font-questrial ${getTrendColor()}`}
        >
          {getTrendIcon()}
          <span>
            {Math.abs(trend.percentChange).toFixed(1)}%
            {trend.isPositive && " tăng"}
            {trend.isNegative && " giảm"}
            {trend.isNeutral && " không đổi"}
          </span>
          <span className="text-gray-500 ml-1">so với kỳ trước</span>
        </div>
      )}
    </div>
  );
};
