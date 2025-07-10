"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LessonPlanKeyword } from "@/types";
import {
  GripVertical,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Hash,
  Edit3,
} from "lucide-react";
import { RichTable } from "@/components/ui/rich-table";
import {
  LESSON_PLAN_FIELDTYPE,
  LESSON_PLAN_TYPE,
  LessonPlanFieldTypeLabel,
  LessonPlanNodeTypeLabel,
} from "@/constants/enum";

interface KeywordManagerProps {
  keywords: LessonPlanKeyword[];
  onUpdate: (keywordId: string, updates: Partial<LessonPlanKeyword>) => void;
  onDelete: (keywordId: string) => void;
  onDragEnd: (result: any) => void;
  level?: number;
  mode?: "admin" | "staff"; // admin: chỉ xem, staff: chỉnh sửa tất cả
}

interface KeywordItemProps {
  keyword: LessonPlanKeyword;
  index: number;
  onUpdate: (updates: Partial<LessonPlanKeyword>) => void;
  onDelete: () => void;
  level: number;
  mode?: "admin" | "staff";
}

function KeywordItem({
  keyword,
  index,
  onUpdate,
  onDelete,
  level,
  mode = "admin",
}: KeywordItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const updateField = useCallback(
    (field: keyof LessonPlanKeyword, value: any) => {
      onUpdate({ [field]: value });
    },
    [onUpdate]
  );

  const addChild = useCallback(() => {
    const newChild: LessonPlanKeyword = {
      id: uuidv4(),
      title: "",
      content: "",
      order: (keyword.children || []).length,
      nodeType: "SUBSECTION", // default to subsection for children
    };

    const updatedChildren = [...(keyword.children || []), newChild];
    updateField("children", updatedChildren);
  }, [keyword.children, updateField]);

  const updateChild = useCallback(
    (childId: string, updates: Partial<LessonPlanKeyword>) => {
      const updatedChildren = (keyword.children || []).map((child) =>
        child.id === childId ? { ...child, ...updates } : child
      );
      updateField("children", updatedChildren);
    },
    [keyword.children, updateField]
  );

  const deleteChild = useCallback(
    (childId: string) => {
      const updatedChildren = (keyword.children || []).filter(
        (child) => child.id !== childId
      );
      updateField("children", updatedChildren);
    },
    [keyword.children, updateField]
  );

  const onChildDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const newChildren = Array.from(keyword.children || []);
      const [reorderedChild] = newChildren.splice(result.source.index, 1);
      newChildren.splice(result.destination.index, 0, reorderedChild);

      // Update order property
      const updatedChildren = newChildren.map((child, index) => ({
        ...child,
        order: index,
      }));

      updateField("children", updatedChildren);
    },
    [keyword.children, updateField]
  );

  const indentClass = level > 0 ? `ml-${level * 6}` : "";
  const borderColor =
    level === 0
      ? "border-sky-200"
      : level === 1
      ? "border-indigo-200"
      : "border-cyan-200";
  const bgColor =
    level === 0 ? "bg-sky-50" : level === 1 ? "bg-indigo-50" : "bg-cyan-50";

  // For admin mode, render without drag and drop
  if (mode === "admin") {
    return (
      <div className={indentClass}>
        <div className={`border rounded-lg ${borderColor} ${bgColor} mb-3`}>
          <div className="p-3">
            <div className="flex items-center gap-3">
              {keyword.children && keyword.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 rounded-full"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </Button>
              )}

              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Bậc {level + 1}</span>
              </div>

              <div className="flex-1">
                {mode === "staff" ? (
                  <Input
                    placeholder="Nhập tiêu đề từ khóa"
                    value={keyword.title}
                    onChange={(e: any) => updateField("title", e.target.value)}
                    className="border-gray-300 bg-transparent shadow-none border focus:bg-white focus:border focus:border-gray-300 bg-white"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm font-medium text-gray-900">
                    {keyword.title}
                  </div>
                )}
              </div>

              {mode === "staff" && (
                <div className="flex flex-row items-center gap-2">
                  {/* Node Type Dropdown */}
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      value={keyword.nodeType || "LIST_ITEM"}
                      onValueChange={(value) => updateField("nodeType", value)}
                    >
                      <SelectTrigger className="w-40 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[9999]"
                        position="popper"
                        sideOffset={4}
                      >
                        {Object.values(LESSON_PLAN_TYPE).map((type) => (
                          <SelectItem key={type} value={type}>
                            {LessonPlanNodeTypeLabel[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Field Type Dropdown */}
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      value={keyword.fieldType ?? "none"} // Nếu null thì truyền "none"
                      onValueChange={(value) =>
                        updateField(
                          "fieldType",
                          value === "none"
                            ? null
                            : (value as LESSON_PLAN_FIELDTYPE)
                        )
                      }
                    >
                      <SelectTrigger className="w-40 h-8 text-xs">
                        <SelectValue placeholder="Chọn loại trường" />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[9999]"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem value="none">Không chọn</SelectItem>
                        {Object.values(LESSON_PLAN_FIELDTYPE).map((type) => (
                          <SelectItem key={type} value={type}>
                            {LessonPlanFieldTypeLabel[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {((keyword.nodeType || "LIST_ITEM") === "PARAGRAPH" ||
                    (keyword.nodeType || "LIST_ITEM") === "LIST_ITEM") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowContent(!showContent)}
                      className="p-1"
                      title="Chỉnh sửa nội dung"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {showContent &&
              ((keyword.nodeType || "LIST_ITEM") === "PARAGRAPH" ||
                (keyword.nodeType || "LIST_ITEM") === "LIST_ITEM") && (
                <div className="mt-3 space-y-3">
                  <FormField label="Nội dung" htmlFor={`content-${keyword.id}`}>
                    <textarea
                      id={`content-${keyword.id}`}
                      placeholder="Nhập nội dung chi tiết cho từ khóa này"
                      value={keyword.content}
                      onChange={(e) => updateField("content", e.target.value)}
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormField>

                  <FormField
                    label="AI Prompt (tùy chọn)"
                    htmlFor={`prompt-${keyword.id}`}
                  >
                    <textarea
                      id={`prompt-${keyword.id}`}
                      placeholder="Nhập prompt để AI hỗ trợ tạo nội dung"
                      value={keyword.prompt || ""}
                      onChange={(e) => updateField("prompt", e.target.value)}
                      className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormField>
                </div>
              )}

            {/* TABLE Section for admin mode */}
            {keyword.fieldType === "TABLE" && (
              <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-blue-50">
                <div className="bg-white p-3 rounded border border-gray-300">
                  <RichTable
                    onChange={(data) => {
                      console.log("KeywordManager TABLE onChange called:", {
                        keywordId: keyword.id,
                        data,
                      });
                      updateField("content", JSON.stringify(data));
                    }}
                    className="bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {isExpanded && keyword.children && keyword.children.length > 0 && (
            <div className="pl-4 pb-3">
              <div className="space-y-2">
                {keyword.children.map((child, childIndex) => (
                  <KeywordItem
                    key={child.id}
                    keyword={child}
                    index={childIndex}
                    onUpdate={(updates) => updateChild(child.id, updates)}
                    onDelete={() => deleteChild(child.id)}
                    level={level + 1}
                    mode={mode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Staff mode with drag and drop
  return (
    <Draggable draggableId={keyword.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${indentClass} ${
            snapshot.isDragging ? "opacity-50" : ""
          }`}
        >
          <div className={`rounded-lg mb-3`}>
            <div className="py-3">
              <div
                className={`flex items-center gap-3 border p-3 rounded-lg ${borderColor} ${bgColor}`}
              >
                {mode === "staff" && (
                  <div
                    {...provided.dragHandleProps}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                {keyword.children && keyword.children.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 rounded-full"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Button>
                )}

                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-800">Bậc {level + 1}</span>
                </div>

                <div className="flex-1">
                  {mode === "staff" ? (
                    <Input
                      placeholder="Nhập tiêu đề từ khóa"
                      value={keyword.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="border-1 bg-transparent focus:bg-white focus:border focus:border-gray-300 bg-white"
                    />
                  ) : (
                    <div className="px-3 py-2 text-sm font-medium text-gray-900">
                      {keyword.title}
                    </div>
                  )}
                </div>

                {mode === "staff" && (
                  <div className="flex items-center gap-2">
                    {/* Node Type Dropdown */}
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={keyword.nodeType || "LIST_ITEM"}
                        onValueChange={(value) =>
                          updateField("nodeType", value)
                        }
                      >
                        <SelectTrigger className="w-40 h-10 bg-white text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9999]"
                          position="popper"
                          sideOffset={4}
                        >
                          {Object.values(LESSON_PLAN_TYPE).map((type) => (
                            <SelectItem key={type} value={type}>
                              {LessonPlanNodeTypeLabel[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Field Type Dropdown */}
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={keyword.fieldType ?? "none"} // Nếu null thì truyền "none"
                        onValueChange={(value) =>
                          updateField(
                            "fieldType",
                            value === "none"
                              ? null
                              : (value as LESSON_PLAN_FIELDTYPE)
                          )
                        }
                      >
                        <SelectTrigger className="w-40 h-10 bg-white text-sm">
                          <SelectValue placeholder="Chọn loại trường" />
                        </SelectTrigger>
                        <SelectContent
                          className="z-[9999]"
                          position="popper"
                          sideOffset={4}
                        >
                          <SelectItem value="none">Không chọn</SelectItem>
                          {Object.values(LESSON_PLAN_FIELDTYPE).map((type) => (
                            <SelectItem key={type} value={type}>
                              {LessonPlanFieldTypeLabel[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {((keyword.nodeType || "LIST_ITEM") === "PARAGRAPH" ||
                      (keyword.nodeType || "LIST_ITEM") === "LIST_ITEM") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowContent(!showContent)}
                        className="p-1"
                        title="Chỉnh sửa nội dung"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    )}

                    {((keyword.nodeType || "LIST_ITEM") === "SUBSECTION" ||
                      (keyword.nodeType || "LIST_ITEM") === "LIST_ITEM") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addChild}
                        className="p-1"
                        title="Thêm mục con"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onDelete}
                      className="p-1 text-black hover:text-gray-700"
                      title="Xóa"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {showContent &&
                ((keyword.nodeType || "LIST_ITEM") === "PARAGRAPH" ||
                  (keyword.nodeType || "LIST_ITEM") === "LIST_ITEM") && (
                  <div className="mt-3 space-y-3">
                    <FormField
                      label="Nội dung"
                      htmlFor={`content-${keyword.id}`}
                    >
                      <textarea
                        id={`content-${keyword.id}`}
                        placeholder="Nhập nội dung chi tiết cho từ khóa này"
                        value={keyword.content}
                        onChange={(e) => updateField("content", e.target.value)}
                        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormField>

                    <FormField
                      label="AI Prompt (tùy chọn)"
                      htmlFor={`prompt-${keyword.id}`}
                    >
                      <textarea
                        id={`prompt-${keyword.id}`}
                        placeholder="Nhập prompt để AI hỗ trợ tạo nội dung"
                        value={keyword.prompt || ""}
                        onChange={(e) => updateField("prompt", e.target.value)}
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormField>
                  </div>
                )}

              {/* TABLE Section */}
              {keyword.fieldType === "TABLE" && (
                <div className="mt-3 pt-3">
                  <div className="bg-white p-3 rounded-xl border border-gray-300">
                    <RichTable
                      onChange={(data) => {
                        console.log("KeywordManager TABLE onChange called:", {
                          keywordId: keyword.id,
                          data,
                        });
                        updateField("content", JSON.stringify(data));
                      }}
                      className="bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Children for admin mode */}
            {isExpanded && keyword.children && keyword.children.length > 0 && (
              <div className="pl-6">
                <DragDropContext onDragEnd={onChildDragEnd}>
                  <Droppable
                    droppableId={`children-${keyword.id}`}
                    type="KEYWORDS"
                  >
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {keyword?.children.map((child, childIndex) => (
                          <KeywordItem
                            key={child.id}
                            keyword={child}
                            index={childIndex}
                            onUpdate={(updates) =>
                              updateChild(child.id, updates)
                            }
                            onDelete={() => deleteChild(child.id)}
                            level={level + 1}
                            mode={mode}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function KeywordManager({
  keywords,
  onUpdate,
  onDelete,
  onDragEnd,
  level = 0,
  mode = "admin",
}: KeywordManagerProps) {
  if (keywords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Hash className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>
          {mode === "staff"
            ? 'Chưa có từ khóa nào. Nhấn "Thêm từ khóa" để bắt đầu.'
            : "Chưa có từ khóa nào được thiết lập."}
        </p>
      </div>
    );
  }

  // For staff mode, use drag and drop from level 1 (same as admin)
  if (mode === "staff") {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="keywords" type="KEYWORDS">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {keywords.map((keyword, index) => (
                <KeywordItem
                  key={keyword.id}
                  keyword={keyword}
                  index={index}
                  onUpdate={(updates) => onUpdate(keyword.id, updates)}
                  onDelete={() => onDelete(keyword.id)}
                  level={level}
                  mode={mode}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="keywords" type="KEYWORDS">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {keywords.map((keyword, index) => (
              <KeywordItem
                key={keyword.id}
                keyword={keyword}
                index={index}
                onUpdate={(updates) => onUpdate(keyword.id, updates)}
                onDelete={() => onDelete(keyword.id)}
                level={level}
                mode={mode}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
