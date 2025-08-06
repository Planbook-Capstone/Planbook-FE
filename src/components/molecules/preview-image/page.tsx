import Image from "next/image";
import React from "react";

interface Props {
  item: any;
}

function PreviewImage({ item }: Props) {
  return (
    <div>
      <div>{item.name}</div>
      <div className="relative w-full aspect-square overflow-hidden rounded">
        <Image
          src={item.url}
          alt={item.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

export default PreviewImage;
