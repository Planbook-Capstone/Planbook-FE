"use client";

import React from "react";
import APIToolsTable from "@/components/organisms/api-tools-table";

export default function ToolsPage() {
  return (
    <div className="bg-white">
      {/* Main Content */}
      <div className="w-full">
        <APIToolsTable />
      </div>
    </div>
  );
}
