import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Image
        alt="Loading...."
        width={1000}
        height={1000}
        src="/loading/loading.gif"
        priority
        unoptimized
        className="object-contain"
      />
    </div>
  );
};

export default Loading;
