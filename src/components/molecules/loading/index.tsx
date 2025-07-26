import { Progress } from "@/components/ui/progress";
import { TypewriterText } from "@/components/ui/TypewriterText";
import Image from "next/image";
import React from "react";

interface Props {
  message: string;
  progress: number;
}

function LoadingAI({ message, progress }: Props) {
  return (
    <div className="mx-auto  w-full flex flex-col items-center">
      <Image
        alt="Loading...."
        width={300}
        height={300}
        src="/loading/loading_AI.gif"
        priority
        unoptimized
      />
      <div className="w-3/4 flex flex-col items-start gap-1">
        <div className="w-full flex items-center justify-between">
          <TypewriterText texts={[message,"Đang xử lí ...","Vui lòng chờ ..."]}/>
          <p>{progress}%</p>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}

export default LoadingAI;
