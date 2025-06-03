"use client";

import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload";
import Image from "next/image";

const { Dragger } = Upload;

interface AnswerUploadProps extends Partial<UploadProps> {
  title?: string;
  description?: string;
  acceptTypes?: string[];
  onFilesChange?: (files: File[]) => void;
}

export default function AnswerUpload({
  title = "Tải file đáp án",
  description = "Đăng tải file để tiến hành chấm điểm tự động",
  acceptTypes = ["image/png", "image/jpeg"],
  onFilesChange,
  ...uploadProps
}: AnswerUploadProps) {
  const handleBeforeUpload = (file: File) => {
    const isAccepted = acceptTypes.includes(file.type);
    if (!isAccepted) {
      message.error(
        `${file.name} không đúng định dạng (${acceptTypes.join(", ")})`
      );
    }
    return isAccepted || Upload.LIST_IGNORE;
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    const files = info.fileList
      .filter((f) => f.status !== "error")
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => !!f);

    onFilesChange?.(files);
    uploadProps.onChange?.(info);
  };

  return (
    <Dragger
      multiple
      showUploadList
      beforeUpload={handleBeforeUpload}
      onChange={handleChange}
      {...uploadProps}
      className="bg-white rounded-lg p-8 h-[300px]"
    >
      <p className="ant-upload-drag-icon w-full flex justify-center">
        <Image
          src="/images/illustration/packing.svg"
          width="100"
          height="100"
          alt="Upload"
        />
      </p>
      <p className="text-lg font-calsans">{title}</p>
      <p className="text-gray-500 font-questrial">{description}</p>
    </Dragger>
  );
}
