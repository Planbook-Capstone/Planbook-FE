"use client";
import { useToolResultByIdService } from "@/services/toolResultService";
import React from "react";

interface Props {
  params: Promise<{
    fileId: string;
  }>;
}

function FileDetailPage({ params }: Props) {
  const { fileId } = React.use(params);
  const { data } = useToolResultByIdService(fileId);
  console.log(data?.data?.data?.edit);
  return (
    <div className="p-6 h-screen">
      <div className="space-y-2 h-full">
        {data?.data?.type === "EXAM" && (
          <div className="w-full h-full">
            <iframe
              src={data?.data?.data?.edit}
              className="w-full h-full border-0"
              title="Document Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FileDetailPage;
