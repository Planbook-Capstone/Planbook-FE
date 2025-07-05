import React, { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  ResourceModal,
  ResourceData,
} from "@/components/molecules/resource-modal";
import { Star, Plus, Video, Link, Sparkles } from "lucide-react";
import { Table } from "@/components/organisms/table";
import { ImagePreview } from "@/components/molecules/image-preview";
import { createFieldId } from "@/hooks/useStableId";

interface Keyword {
  id: string;
  title: string;
  content?: string;
  type:
    | "SECTION"
    | "SUBSECTION"
    | "LIST_ITEM"
    | "PARAGRAPH"
    | "CONTENT"
    | "INPUT"
    | "REFERENCES"
    | "TABLE";

  children?: Keyword[];
}

interface KeywordFormProps {
  keyword: Keyword;
  value: string;
  onChange: (value: string) => void;
  index: number;
  level?: number;
  className?: string;
  isEditMode?: boolean;
  onDelete?: (keywordId: string, staticComponent?: any) => void;
}

export function KeywordForm({
  keyword,
  value,
  onChange,
  index,
  level = 0,
  className,
  isEditMode = false,
  onDelete,
}: KeywordFormProps) {
  // Debug re-renders
  // console.log("KeywordForm re-rendered", {
  //   keywordId: keyword.id,
  //   nodeType: keyword.nodeType,
  //   valueLength: value?.length,
  // });
  console.log(keyword, "keyword");
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [promptValue, setPromptValue] = useState("");

  // Initialize resourceData from value on mount
  useEffect(() => {
    if (value && keyword.nodeType === "REFERENCES") {
      try {
        const parsedData = JSON.parse(value);
        setResourceData(parsedData);
      } catch (error) {
        console.error("Error parsing resource data:", error);
      }
    }
  }, [value, keyword.nodeType]);

  const handleResourceSubmit = async (resource: ResourceData) => {
    // Convert File to base64 for storage
    if (resource.type === "image" && resource.file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const resourceWithBase64 = {
          ...resource,
          file: {
            name: resource.file!.name,
            size: resource.file!.size,
            type: resource.file!.type,
            base64: base64,
          },
        };
        setResourceData(resourceWithBase64);
        onChange(JSON.stringify(resourceWithBase64));
      };
      reader.readAsDataURL(resource?.file);
    } else {
      setResourceData(resource);
      onChange(JSON.stringify(resource));
    }
    setShowResourceModal(false);
  };

  // Wrapper component để hiển thị nút xóa
  const renderWithDeleteButton = (content: React.ReactNode) => {
    if (!isEditMode || !onDelete) {
      return content;
    }

    return (
      <div className="relative group">
        {content}
        <div className="absolute top-2 right-2 opacity-100">
          <button
            onClick={() => {
              // For static components, pass the keyword data
              if (!(keyword as any).isDynamic) {
                onDelete(keyword.id, keyword);
              } else {
                onDelete(keyword.id);
              }
            }}
            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
            title="Xóa component này"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const renderByNodeType = () => {
    switch (keyword.type) {
      case "SECTION":
      case "SUBSECTION":
        return renderWithDeleteButton(
          <div style={{ paddingLeft: `${level * 24}px` }}>
            <h3 className={cn("font-calsans text-gray-900 mb-2 text-base")}>
              {keyword.title}
            </h3>
            {keyword.content && (
              <p className="text-sm font-questrial text-gray-600 mb-4">
                {keyword.content}
              </p>
            )}
            {keyword.children && keyword.children.length > 0 && (
              <div className="space-y-4">
                {keyword.children.map((child, childIndex) => (
                  <KeywordForm
                    key={child.id}
                    keyword={child}
                    value=""
                    onChange={() => {}}
                    index={childIndex}
                    level={level + 1}
                    isEditMode={isEditMode}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "CONTENT":
        return renderWithDeleteButton(
          <div style={{ paddingLeft: `${level * 24}px` }} className="space-y-3">
            <h4 className="font-calsans text-gray-900 text-base">
              {keyword.title}
            </h4>
            {keyword.content && (
              <p className="text-sm font-questrial text-gray-600">
                {keyword.content}
              </p>
            )}
            <div className="flex gap-2 border rounded-full items-center">
              <Input
                placeholder="Nhập yêu cầu thay đổi..."
                value={promptValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPromptValue(e.target.value)
                }
                className="flex-1 border-none shadow-none focus-visible:ring-0"
              />
              <Button
                size="sm"
                className="px-3 bg-transparent shadow-none hover:shadow-none"
              >
                <Sparkles className="w-4 h-4 text-neutral-800" />
              </Button>
            </div>
          </div>
        );

      case "INPUT":
        return renderWithDeleteButton(
          <div style={{ paddingLeft: `${level * 24}px` }}>
            <FormField
              label={keyword.title}
              htmlFor={createFieldId("keyword", keyword.title, keyword.id)}
            >
              <Input
                id={createFieldId("keyword", keyword.title, keyword.id)}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log(
                    "KeywordForm Input onChange:",
                    keyword.id,
                    e.target.value
                  );
                  onChange(e.target.value);
                }}
                placeholder={
                  keyword.content || `Nhập ${keyword.title.toLowerCase()}...`
                }
              />
            </FormField>
          </div>
        );

      case "REFERENCES":
        return renderWithDeleteButton(
          <div style={{ paddingLeft: `${level * 24}px` }} className="space-y-3">
            <h4 className="font-calsans text-gray-900 text-base">
              {keyword.title}
            </h4>
            {keyword.content && (
              <p className="text-sm font-questrial text-gray-600">
                {keyword.content}
              </p>
            )}

            {!resourceData ? (
              <Button
                variant="outline"
                onClick={() => setShowResourceModal(true)}
                className="flex items-center gap-2 font-questrial"
              >
                <Plus className="w-4 h-4" />
                Thêm học liệu
              </Button>
            ) : (
              <div className="space-y-2">
                {resourceData.type === "link" ? (
                  <div>
                    {resourceData.description && (
                      <p className="text-sm font-questrial text-gray-600 mb-1">
                        {resourceData.description}
                      </p>
                    )}
                    <FormField label="Đường link">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-gray-400" />
                        <Input
                          value={resourceData.url || ""}
                          readOnly
                          className="flex-1"
                        />
                      </div>
                    </FormField>
                  </div>
                ) : resourceData.type === "image" && resourceData.file ? (
                  <ImagePreview
                    file={resourceData.file}
                    onRemove={() => {
                      setResourceData(null);
                      onChange("");
                    }}
                    className="w-full max-w-xs"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Video className="w-8 h-8 text-green-500" />
                    <span className="text-sm font-questrial">
                      {resourceData.file?.name || "Tài liệu đã upload"}
                    </span>
                  </div>
                )}
                {/* Only show delete button for non-image resources */}
                {resourceData.type !== "image" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResourceData(null);
                      onChange("");
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa
                  </Button>
                )}
              </div>
            )}

            <ResourceModal
              isOpen={showResourceModal}
              onClose={() => setShowResourceModal(false)}
              onSubmit={handleResourceSubmit}
            />
          </div>
        );

      case "TABLE": {
        // Memoize parsed initial data to prevent re-parsing
        const initialTableData = useMemo(() => {
          if (!value) return undefined;
          try {
            return JSON.parse(value);
          } catch (error) {
            console.warn("Failed to parse table data:", error);
            return undefined;
          }
        }, [value]);

        // Stable callback for data changes
        const handleTableDataChange = useCallback(
          (data: any) => {
            // Store table data in the form value as JSON
            onChange(JSON.stringify(data));
          },
          [onChange]
        );

        return renderWithDeleteButton(
          <div style={{ paddingLeft: `${level * 24}px` }} className="space-y-3">
            <h4 className="font-calsans text-gray-900 text-base">
              {keyword?.title}
            </h4>
            {keyword.content && (
              <p className="text-sm font-questrial text-gray-600">
                {keyword.content}
              </p>
            )}
            <Table
              onDataChange={handleTableDataChange}
              initialData={initialTableData}
              className="mt-4"
            />
          </div>
        );
      }

      default:
        return <p>Lỗi không xác định</p>;
    }
  };

  return <div className={cn("space-y-4", className)}>{renderByNodeType()}</div>;
}
