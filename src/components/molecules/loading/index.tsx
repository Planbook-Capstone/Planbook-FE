import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React from "react";

interface Props {
  message: string;
  progress: number;
}

function LoadingAI({ message, progress }: Props) {
  return (
    <div className="p-5 w-full flex flex-col items-center">
      <Image
        alt="Loading...."
        width={300}
        height={300}
        src="/loading/loading_AI.gif"
        priority
        unoptimized
      />
      <div className="w-3/4 flex flex-col items-start">
        <div className="w-full flex items-center justify-between">
          <p>{message}</p>
          <p>{progress}%</p>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}

export default LoadingAI;
