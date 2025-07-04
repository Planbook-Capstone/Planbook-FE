import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { ResourceModal } from "@/components/molecules/resource-modal";
import { Star, Plus, Image, Video, Link } from "lucide-react";

interface Keyword {
  id: string;
  title: string;
  content?: string;
  nodeType:
    | "SECTION"
    | "SUBSECTION"
    | "LIST_ITEM"
    | "PARAGRAPH"
    | "CONTENT"
    | "INPUT"
    | "REFERENCES";
  children?: Keyword[];
}

interface KeywordFormProps {
  keyword: Keyword;
  value: string;
  onChange: (value: string) => void;
  index: number;
  level?: number;
  className?: string;
}

interface ResourceData {
  type: "image" | "video" | "link";
  url?: string;
  file?: File;
  description?: string;
}

export function KeywordForm({
  keyword,
  value,
  onChange,
  index,
  level = 0,
  className,
}: KeywordFormProps) {
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [promptValue, setPromptValue] = useState("");

  const handleResourceSubmit = (resource: ResourceData) => {
    setResourceData(resource);
    setShowResourceModal(false);
  };

  const renderByNodeType = () => {
    switch (keyword.nodeType) {
      case "SECTION":
      case "SUBSECTION":
        return (
          <div style={{ paddingLeft: `${level * 24}px` }}>
            <h3
              className={cn(
                "font-calsans text-gray-900 mb-2",
                keyword.nodeType === "SECTION" ? "text-lg" : "text-base"
              )}
            >
              {index + 1}. {keyword.title}
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
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "CONTENT":
        return (
          <div style={{ paddingLeft: `${level * 24}px` }} className="space-y-3">
            <h4 className="font-calsans text-gray-900">{keyword.title}</h4>
            {keyword.content && (
              <p className="text-sm font-questrial text-gray-600">
                {keyword.content}
              </p>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Nhập prompt..."
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" className="px-3">
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case "INPUT":
        return (
          <div style={{ paddingLeft: `${level * 24}px` }}>
            <FormField label={keyword.title} htmlFor={`keyword-${keyword.id}`}>
              <Input
                id={`keyword-${keyword.id}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={
                  keyword.content || `Nhập ${keyword.title.toLowerCase()}...`
                }
              />
            </FormField>
          </div>
        );

      case "REFERENCES":
        return (
          <div style={{ paddingLeft: `${level * 24}px` }} className="space-y-3">
            <h4 className="font-calsans text-gray-900">{keyword.title}</h4>
            {keyword.content && (
              <p className="text-sm font-questrial text-gray-600">
                {keyword.content}
              </p>
            )}

            {!resourceData ? (
              <Button
                variant="outline"
                onClick={() => setShowResourceModal(true)}
                className="flex items-center gap-2"
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
                ) : (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    {resourceData.type === "image" ? (
                      <Image className="w-8 h-8 text-blue-500" />
                    ) : (
                      <Video className="w-8 h-8 text-green-500" />
                    )}
                    <span className="text-sm font-questrial">
                      {resourceData.file?.name || "Tài liệu đã upload"}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResourceData(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  Xóa
                </Button>
              </div>
            )}

            <ResourceModal
              isOpen={showResourceModal}
              onClose={() => setShowResourceModal(false)}
              onSubmit={handleResourceSubmit}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return <div className={cn("space-y-4", className)}>{renderByNodeType()}</div>;
}
