"use client";
import TaskProgressWrapper from "@/components/molecules/task-progress-wrapper";
import { Progress } from "@/components/ui/progress";
import { useTaskStatusService } from "@/services/progressTaskServices";
import React from "react";

function DemoPage() {
  return (
    <div className="grid grid-cols-4 gap-2">
      <TaskProgressWrapper />
      <TaskProgressWrapper />
      <TaskProgressWrapper />
      <TaskProgressWrapper />
    </div>
  );
}

export default DemoPage;
