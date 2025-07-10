import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  ResourceModal,
  ResourceData,
} from "@/components/molecules/resource-modal";
import { Star, Plus, Video, Link, Sparkles } from "lucide-react";

import { ImagePreview } from "@/components/molecules/image-preview";
import { createFieldId } from "@/hooks/useStableId";
import { RichTable } from "@/components/ui/rich-table";

interface Keyword {
  id: string;
  title: string;
  content?: string;
  type: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH";
  fieldType: "INPUT" | "REFERENCES" | "TABLE" | undefined;

  children?: Keyword[];
}

interface KeywordFormProps {
  keyword: Keyword;
  value: string;
  onChange: (value: string) => void;
  onChildChange?: (childId: string, childTitle: string, value: string) => void;
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
  onChildChange,
  index,
  level = 0,
  className,
  isEditMode = false,
  onDelete,
}: KeywordFormProps) {
  // Debug: Log all KeywordForm renders
  // console.log("KeywordForm render:", {
  //   keywordId: keyword.id,
  //   keywordTitle: keyword.title,
  //   nodeType: keyword.fieldType || keyword.type,
  //   hasOnChange: typeof onChange === "function",
  //   hasOnChildChange: typeof onChildChange === "function",
  //   hasChildren: !!(keyword.children && keyword.children.length > 0),
  //   childrenCount: keyword.children?.length || 0,
  //   children:
  //     keyword.children?.map((c) => ({
  //       id: c.id,
  //       title: c.title,
  //       fieldType: c.fieldType,
  //     })) || [],
  //   onChangeFunction: onChange.toString().substring(0, 100) + "...",
  // });
  // Debug re-renders
  // console.log("KeywordForm re-rendered", {
  //   keywordId: keyword.id,
  //   nodeType: keyword.nodeType,
  //   valueLength: value?.length,
  // });

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [promptValue, setPromptValue] = useState("");

  // Initialize resourceData from value on mount
  // Only update resourceData if value is valid JSON and different from current
  useEffect(() => {
    if (value && keyword.fieldType === "REFERENCES") {
      try {
        const parsedData = JSON.parse(value);
        // Only set if different (avoid infinite loop)
        if (JSON.stringify(parsedData) !== JSON.stringify(resourceData)) {
          setResourceData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing resource data:", error);
      }
    }
  }, [value, keyword.type]);

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
      reader.readAsDataURL(resource.file as File);
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
    // Debug: Log which component is being rendered
    const nodeType = keyword.fieldType ? keyword.fieldType : keyword.type;

    // console.log("KeywordForm renderByNodeType:", {
    //   keywordId: keyword.id,
    //   keywordTitle: keyword.title,
    //   fieldType: keyword.fieldType,
    //   type: keyword.type,
    //   nodeType: nodeType,
    //   hasOnChange: typeof onChange === "function",
    // });

    // if (nodeType === "TABLE") {
    //   console.log("KeywordForm rendering TABLE component:", {
    //     keywordId: keyword.id,
    //     keywordTitle: keyword.title,
    //     nodeType: nodeType,
    //     hasOnChange: typeof onChange === "function",
    //   });
    // }

    switch (nodeType) {
      case "SECTION":
      case "SUBSECTION":
        return renderWithDeleteButton(
          <div style={{ paddingLeft: `${level * 24}px` }}>
            <h3 className={cn("font-calsans text-gray-900 mb-2 text-lg")}>
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
                    onChange={(childValue) => {
                      console.log("SECTION child onChange:", {
                        parentId: keyword.id,
                        childId: child.id,
                        childTitle: child.title,
                        childValue: childValue.substring(0, 100) + "...",
                        hasOnChildChange: !!onChildChange,
                        onChildChangeType: typeof onChildChange,
                      });

                      // Call onChildChange with child's own ID and title
                      if (onChildChange) {
                        // console.log("🎯 KeywordForm calling onChildChange:", {
                        //   childId: child.id,
                        //   childTitle: child.title,
                        //   childValue: childValue.substring(0, 50) + "...",
                        // });
                        onChildChange(child.id, child.title, childValue);
                      } else {
                        console.log(
                          "🎯 KeywordForm fallback to parent onChange (onChildChange not available)"
                        );
                        // Fallback: call parent onChange (for backward compatibility)
                        onChange(childValue);
                      }
                    }}
                    onChildChange={onChildChange} // Pass through onChildChange
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

      case "LIST_ITEM":
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
                    onChange={(childValue) => {
                      console.log("LIST_ITEM child onChange:", {
                        parentId: keyword.id,
                        childId: child.id,
                        childTitle: child.title,
                        childValue: childValue.substring(0, 100) + "...",
                        hasOnChildChange: !!onChildChange,
                        onChildChangeType: typeof onChildChange,
                      });

                      // Call onChildChange with child's own ID and title
                      if (onChildChange) {
                        console.log(
                          "🎯 KeywordForm LIST_ITEM calling onChildChange:",
                          {
                            childId: child.id,
                            childTitle: child.title,
                            childValue: childValue.substring(0, 50) + "...",
                          }
                        );
                        onChildChange(child.id, child.title, childValue);
                      } else {
                        console.log(
                          "🎯 KeywordForm LIST_ITEM fallback to parent onChange (onChildChange not available)"
                        );
                        // Fallback: call parent onChange (for backward compatibility)
                        onChange(childValue);
                      }
                    }}
                    onChildChange={onChildChange} // Pass through onChildChange
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

      case "PARAGRAPH":
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
                defaultValue=""
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.value;
                  console.log("INPUT onChange:", newValue);
                  onChange(newValue);
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
                ) : resourceData.type === "image" &&
                  (resourceData.file || resourceData.url) ? (
                  // Handle both uploaded files and URL images
                  resourceData.file ? (
                    <ImagePreview
                      file={resourceData.file}
                      onRemove={() => {
                        setResourceData(null);
                        onChange("");
                      }}
                      className="w-full max-w-xs"
                    />
                  ) : (
                    // URL image from API
                    <div className="relative w-full max-w-xs">
                      <img
                        src={resourceData.url}
                        alt={resourceData.description || "Selected image"}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvaSBoaW5oIGFuaDwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setResourceData(null);
                          onChange("");
                        }}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700 rounded-full p-1"
                      >
                        ✕
                      </Button>
                      {resourceData.description && (
                        <p className="text-xs text-gray-600 mt-2 px-1">
                          {resourceData.description}
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Video className="w-8 h-8 text-green-500" />
                    <span className="text-sm font-questrial">
                      {resourceData.file?.name ||
                        resourceData.description ||
                        "Tài liệu đã upload"}
                    </span>
                  </div>
                )}
                {/* Only show delete button for non-image resources or images without built-in delete */}
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
        // Parse table data from value
        const tableData = (() => {
          if (!value) return undefined;
          try {
            return JSON.parse(value);
          } catch {
            return undefined;
          }
        })();

        return renderWithDeleteButton(
          <div style={{ paddingLeft: `${level * 24}px` }} className="space-y-3">
            <h4 className="font-calsans text-gray-900 text-lg flex items-center gap-2">
              {keyword.title}
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Có thể chỉnh sửa
              </span>
            </h4>
            <RichTable
              data={tableData}
              onChange={(data) => {
                console.log("TABLE onChange called:", {
                  keywordId: keyword.id,
                  data,
                });
                const jsonData = JSON.stringify(data);
                console.log(
                  "KeywordForm calling onChange with:",
                  jsonData.substring(0, 100) + "..."
                );
                console.log(
                  "onChange function:",
                  onChange.toString().substring(0, 200) + "..."
                );
                try {
                  onChange(jsonData);
                  console.log("onChange called successfully");
                } catch (error) {
                  console.error("Error calling onChange:", error);
                }
              }}
              className="mt-2"
            />
          </div>
        );
      }

      default:
        return (
          <div style={{ paddingLeft: `${level * 24}px` }}>
            <h3 className={cn("font-calsans text-gray-900 mb-2 text-base")}>
              {keyword.title}
            </h3>
            {keyword.content && (
              <p className="text-sm font-questrial text-gray-600 mb-4">
                {keyword.content}
              </p>
            )}
          </div>
        );
    }
  };

  return <div className={cn("space-y-4", className)}>{renderByNodeType()}</div>;
}
