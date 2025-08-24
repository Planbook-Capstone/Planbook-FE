"use client";

import { Button } from "@/components/ui/Button";
import { convertToVietnamese } from "@/constants/enum";
import { useLessonPlanAllNodeService } from "@/services/lessonPlanNodeServices";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Edit } from "lucide-react";
import EditLessonPlanNodeModal from "@/components/organisms/edit-lesson-plan-node-modal";
import { GridSkeleton } from "@/components/molecules/grid-skeleton";

interface LessonPlanNode {
  id: number;
  lessonPlanTemplateId: number;
  parentId: number | null;
  title: string;
  content: string;
  description: string | null;
  fieldType: string | null;
  type: string;
  orderIndex: number;
  metadata: any;
  status: string;
  children: LessonPlanNode[];
}

// Recursive component to render nested nodes
const NodeRenderer = ({
  node,
  level = 0,
  onEditNode,
}: {
  node: LessonPlanNode;
  level?: number;
  onEditNode: (node: LessonPlanNode) => void;
}) => {
  // Define 5 border colors that will cycle based on level
  const borderColors = [
    "border-blue-500",
    "border-green-500",
    "border-purple-500",
    "border-orange-500",
    "border-pink-500",
  ];

  const lightBorderColors = [
    "border-blue-300",
    "border-green-300",
    "border-purple-300",
    "border-orange-300",
    "border-pink-300",
  ];

  // Use level to determine color (level % 5)
  const currentBorderColor = borderColors[level % 5];
  const currentLightBorderColor = lightBorderColors[level % 5];

  const getNodeStyle = (type: string, level: number) => {
    const baseStyle = "mb-4";
    const indentStyle = `ml-${level * 4}`;

    switch (type) {
      case "SECTION":
        return `${baseStyle} ${indentStyle} border-l-4 ${currentBorderColor} pl-4`;
      case "SUBSECTION":
        return `${baseStyle} ${indentStyle} border-l-2 ${currentLightBorderColor} pl-3`;
      case "LIST_ITEM":
        return `${baseStyle} ${indentStyle} border-l ${currentLightBorderColor} pl-2`;
      default:
        return `${baseStyle} ${indentStyle}`;
    }
  };

  const getTitleStyle = (type: string, level: number) => {
    switch (type) {
      case "SECTION":
        return "text-xl font-bold text-gray-800 mb-2";
      case "SUBSECTION":
        return level <= 1
          ? "text-lg font-semibold text-gray-700 mb-2"
          : "text-base font-medium text-gray-700 mb-1";
      case "LIST_ITEM":
        return "text-sm text-gray-700 mb-1 font-medium";
      default:
        return "text-base text-gray-600 mb-1";
    }
  };

  const getListPrefix = (type: string, level: number) => {
    if (type === "LIST_ITEM") {
      return level % 2 === 0 ? "• " : "- ";
    }
    return "";
  };

  return (
    <div className={getNodeStyle(node.type, level)}>
      <div
        className={`${getTitleStyle(
          node.type,
          level
        )} flex gap-2 items-center justify-between`}
      >
        <div className="flex gap-2 items-center">
          <div>{getListPrefix(node.type, level)}</div>
          <p className="text-blue-400">
            [{convertToVietnamese(node.type).nodeType}]
          </p>
          <p>{node.title}</p>
          {node.content && node.type === "SECTION" && (
            <div className="text-gray-600  text-sm">({node.content})</div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditNode(node)}
          className="ml-2"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      {/* Recursively render children */}
      {node?.children && node?.children?.length > 0 && (
        <div className="mt-2">
          {node?.children?.map((child) => (
            <NodeRenderer
              key={child.id}
              node={child}
              level={level + 1}
              onEditNode={onEditNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function EditLessonPlanTemplatePage() {
  const { id } = useParams();
  const { data: allNode, isLoading } = useLessonPlanAllNodeService(
    id?.toString() || ""
  )();
  const [editingNode, setEditingNode] = useState<LessonPlanNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditNode = (node: LessonPlanNode) => {
    setEditingNode(node);
    setIsModalOpen(true);
  };

  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingNode(null);
    }
  };

  if (isLoading) {
    return (
      <div>
        <GridSkeleton
          count={4}
          height={140}
          cols="grid-cols-1 lg:grid-cols-1"
        />
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <div>
        {allNode?.data?.map((node: LessonPlanNode) => (
          <NodeRenderer
            key={node.id}
            node={node}
            level={0}
            onEditNode={handleEditNode}
          />
        ))}
      </div>

      <EditLessonPlanNodeModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        node={editingNode}
      />
    </div>
  );
}

export default EditLessonPlanTemplatePage;
