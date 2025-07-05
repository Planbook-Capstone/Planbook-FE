import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ImagePreviewProps {
  file?:
    | File
    | {
        name: string;
        size: number;
        type: string;
        base64: string;
      };
  onRemove: () => void;
  className?: string;
}

// Fixed duplicate export
// Remove duplicate export
export function ImagePreview({ file, onRemove, className }: ImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const urlRef = React.useRef<string>("");

  useEffect(() => {
    if (!file) {
      setImageUrl("");
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = "";
      }
      return;
    }

    // Handle base64 object
    if ("base64" in file) {
      setImageUrl(file.base64);
      return;
    }

    // Handle File object
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      urlRef.current = url;
      setImageUrl(url);
      return () => {
        if (urlRef.current) {
          URL.revokeObjectURL(urlRef.current);
          urlRef.current = "";
        }
      };
    }
  }, [file]);

  return (
    <div className={`relative group ${className ?? ""}`}>
      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={file?.name || "preview"}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
          disabled={!file}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      {/* File info */}
      <div className="mt-2 text-center">
        <p
          className="text-xs font-medium text-gray-700 truncate"
          title={file?.name || "No file"}
        >
          {file?.name || "No file selected"}
        </p>
        <p className="text-xs text-gray-500">
          {file ? `${(file.size / 1024).toFixed(1)} KB` : ""}
        </p>
      </div>
    </div>
  );
}

export function FileUploader() {
  const [file, setFile] = useState<File | undefined>();

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setFile(f);
        }}
      />
      {file && <ImagePreview file={file} onRemove={() => setFile(undefined)} />}
    </div>
  );
}
