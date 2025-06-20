import { Progress } from "@/components/ui/progress";
import { useTaskStatusService } from "@/services/progressTaskServices";
import React, { useEffect } from "react";

interface TaskProgressWrapperProps {
  taskId?: string;
  onTaskCompleted?: (taskId: string) => void;
}

function TaskProgressWrapper({ taskId, onTaskCompleted }: TaskProgressWrapperProps) {
  const { data } = useTaskStatusService(taskId!);

  // Don't render if no taskId
  if (!taskId) return null;

  // Auto-remove completed tasks after 3 seconds
  useEffect(() => {
    if (data?.status === 'completed' && onTaskCompleted) {
      const timer = setTimeout(() => {
        onTaskCompleted(taskId);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data?.status, taskId, onTaskCompleted]);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      {/* Task Type */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Task: {data?.task_type?.replace('_', ' ').toUpperCase() || 'Loading...'}
        </h3>
        <span className="text-sm text-gray-500">
          Status: {data?.status || 'Unknown'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{data?.current_progress || 0}%</span>
        </div>
        <Progress value={data?.current_progress || 0} className="h-2" />
      </div>

      {/* Current Message */}
      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-800 font-medium">
          {data?.current_message || 'Waiting for updates...'}
        </p>
      </div>

      {/* Task ID for debugging */}
      <div className="text-xs text-gray-400">
        Task ID: {taskId}
      </div>

      {/* Additional Info */}
      {/* {data?.estimated_duration && (
        <div className="text-xs text-gray-500">
          Estimated duration: {data.estimated_duration}
        </div>
      )} */}
    </div>
  );
}

export default TaskProgressWrapper;
