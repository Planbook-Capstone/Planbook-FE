"use client"
import { Progress } from "@/components/ui/progress";
import { useTaskStatusService } from "@/services/progressTaskServices";
import React from "react";

function DemoPage() {
  const { data } = useTaskStatusService("1a578603-5275-4b88-a6d2-0b6601984682");

  console.log(data?.current_progress, "test");

  return (
    <div className="grid grid-cols-3">
      <Progress value={data?.current_progress} />
    </div>
  );
}

export default DemoPage;
