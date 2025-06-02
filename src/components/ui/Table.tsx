"use client";

import * as React from "react";
import { Table as AntTable } from "antd";
import type { TableProps as AntTableProps } from "antd";
import { cn } from "@/lib/utils";

interface TableProps<RecordType> extends AntTableProps<RecordType> {
  bordered?: boolean;
  className?: string;
  size?: "small" | "middle" | "large";
}

function Table<RecordType extends object = any>({
  className,
  bordered = false,
  size = "middle",
  ...props
}: TableProps<RecordType>) {
  return (
    <AntTable<RecordType>
      className={cn("rounded-xl bg-white", className)}
      bordered={bordered}
      size={size}
      pagination={false}
      {...props}
    />
  );
}

export { Table };
