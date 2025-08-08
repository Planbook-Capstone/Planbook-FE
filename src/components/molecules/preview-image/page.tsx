import { Image } from "antd";
import React from "react";

interface Props {
  item: any;
}

function PreviewImage({ item }: Props) {
  return (
    <div>
      <div className="font-bold">{item?.name}</div>
      <div>Mô tả: {item?.description}</div>
      <div className="relative w-full aspect-square overflow-hidden rounded">
        <Image src={item?.url} alt={item?.name} />
      </div>
    </div>
  );
}

export default PreviewImage;
