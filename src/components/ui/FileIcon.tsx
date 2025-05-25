import Image from "next/image";
import { FILE_ICONS, type FileType } from "@/constants/fileIcons";

export interface FileIconProps {
  type: string;
}

export default function FileIcon({ type }: FileIconProps) {
  const upperType = type.toUpperCase() as FileType;
  const iconPath = FILE_ICONS[upperType] || "";

  return (
    <div className="size-10 rounded-md bg-gray-100 flex items-center justify-center">
      <Image src={iconPath} alt={type} width={24} height={24} />
    </div>
  );
}
