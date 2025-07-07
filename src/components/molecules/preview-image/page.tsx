import Image from "next/image";
import React from "react";

interface Props {
  item: any;
}

function PreviewImage({ item }: Props) {
  return (
    <div>
      <Image src={item.url} alt={item.name} width={100} height={100} />
    </div>
  );
}

export default PreviewImage;
