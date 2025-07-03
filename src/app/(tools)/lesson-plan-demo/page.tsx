"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  rectIntersection,
  pointerWithin,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable, useDroppable } from "@dnd-kit/core";

// Draggable Sidebar Item Component
function DraggableSidebarItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 hover:border-blue-300 transition-all"
    >
      <div className="text-sm font-medium text-gray-900 mb-1">{item.title}</div>
      <div className="text-xs text-gray-600 leading-relaxed">
        {item.description}
      </div>
    </div>
  );
}

// Droppable Area Component
function DroppableArea({ children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "main-content",
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-colors ${isOver ? "bg-blue-50" : ""}`}
    >
      {children}
    </div>
  );
}

// Section Component with Up/Down buttons
function SectionCard({
  section,
  index,
  totalSections,
  onMoveUp,
  onMoveDown,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {section.title}{" "}
            <span className="text-xs text-gray-400">(#{index + 1})</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Move Up Button */}
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className={`p-1 rounded transition-colors ${
              index === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
            title="Di chuyển lên"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          {/* Move Down Button */}
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === totalSections - 1}
            className={`p-1 rounded transition-colors ${
              index === totalSections - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
            title="Di chuyển xuống"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(section.id)}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-2"
            title="Xóa"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-700">Sau bài học này, HS sẽ:</div>

        <div className="space-y-3">
          {section.content.map((item, contentIndex) => (
            <div
              key={contentIndex}
              className="flex items-start gap-3 text-sm text-gray-700"
            >
              <span className="text-gray-400">-</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm text-gray-600">Yêu cầu chính xác</Label>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
          <Textarea
            placeholder={`Nhập yêu cầu chính xác cho ${section.title.toLowerCase()}...`}
            className="w-full min-h-[80px] text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default function LessonPlanDemoPage() {
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const sidebarItems = [
    {
      id: "kien-thuc",
      title: "Kiến thức",
      description:
        "Nguyên cứu cơ yếu tố ảnh hưởng đến tốc độ phản ứng có chế phản ứng và cân bằng điện tử...",
    },
    {
      id: "ung-dung",
      title: "Ứng dụng",
      description:
        "Nguyên cứu cơ yếu tố ảnh hưởng đến tốc độ phản ứng có chế phản ứng và cân bằng điện tử...",
    },
    {
      id: "ky-nang",
      title: "Kỹ năng",
      description:
        "Phát triển kỹ năng thực hành và quan sát thí nghiệm hóa học...",
    },
    {
      id: "thai-do",
      title: "Thái độ",
      description: "Hình thành thái độ tích cực trong học tập môn hóa học...",
    },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    console.log("Drag start:", event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("Drag end:", {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data,
      overData: over?.data,
    });
    setActiveId(null);

    if (!over) {
      console.log("No over target");
      return;
    }

    // Check if dragging from sidebar
    const sidebarItem = sidebarItems.find((item) => item.id === active.id);
    if (sidebarItem) {
      console.log("Adding from sidebar:", sidebarItem.title);
      // Adding new section from sidebar
      const existingSection = sections.find(
        (section) => section.id === sidebarItem.id
      );
      if (existingSection) {
        console.log("Section already exists");
        return;
      }

      const newSection = {
        id: sidebarItem.id,
        title: sidebarItem.title,
        content: [
          "Nội dung mẫu cho " + sidebarItem.title.toLowerCase(),
          "Thêm nội dung chi tiết tại đây",
          "Có thể chỉnh sửa và bổ sung thêm",
        ],
      };

      setSections([...sections, newSection]);
      return;
    }

    // Reordering existing sections
    const activeSection = sections.find((s) => s.id === active.id);
    const overSection = sections.find((s) => s.id === over.id);

    console.log("Section check:", {
      activeSection: !!activeSection,
      overSection: !!overSection,
      sectionsCount: sections.length,
      sectionIds: sections.map((s) => s.id),
    });

    if (activeSection && overSection && active.id !== over.id) {
      console.log("Reordering sections from", active.id, "to", over.id);
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        console.log("Moving from index", oldIndex, "to", newIndex);
        const result = arrayMove(items, oldIndex, newIndex);
        console.log(
          "New order:",
          result.map((r) => r.id)
        );
        return result;
      });
    } else {
      console.log("Reorder conditions not met");
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
    // Item sẽ tự động xuất hiện lại trong sidebar do filter logic
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [
      newSections[index],
      newSections[index - 1],
    ];
    setSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];
    setSections(newSections);
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-900">Đầu mục</h2>
              <p className="text-sm text-gray-500">Học tập</p>
              <p className="text-sm text-gray-500">Đáng kể học liệu</p>
            </div>

            <div className="space-y-3">
              {sidebarItems
                .filter(
                  (item) => !sections.some((section) => section.id === item.id)
                )
                .map((item) => (
                  <DraggableSidebarItem key={item.id} item={item} />
                ))}
            </div>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-blue-700 font-medium mb-1">
                💡 Hướng dẫn
              </div>
              <div className="text-xs text-blue-600">
                Kéo thả các thẻ vào bên phải để tạo nội dung. Dùng nút ↑↓ để sắp
                xếp lại thứ tự.
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Mục tiêu</h1>

            <DroppableArea>
              {sections.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-gray-500 mb-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Kéo thả để tạo nội dung
                  </h3>
                  <p className="text-gray-500">
                    Kéo các thẻ từ sidebar bên trái vào đây để tạo các phần nội
                    dung cho giáo án
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      index={index}
                      totalSections={sections.length}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onDelete={handleDeleteSection}
                    />
                  ))}
                </div>
              )}
            </DroppableArea>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg opacity-90">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {sections.find((s) => s.id === activeId)?.title ||
                    sidebarItems.find((s) => s.id === activeId)?.title}
                </h2>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
