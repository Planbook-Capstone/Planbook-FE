"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { QuestionBankItem } from "@/services/questionBankServices";

interface QuestionBankColumnHandlers {
  onEdit: (question: QuestionBankItem) => void;
  onDelete: (id: number) => void;
  getLessonName: (lessonId: number) => string;
}

export const createQuestionBankColumns = (
  handlers: QuestionBankColumnHandlers
): ColumnDef<QuestionBankItem>[] => [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "questionContent.question",
    header: "Câu hỏi",
    cell: ({ row }) => {
      const question = row.original.questionContent?.question || "";
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate max-w-md cursor-help">
              {question.length > 100
                ? `${question.substring(0, 100)}...`
                : question}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{question}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "difficultyLevel",
    header: "Mức độ",
    cell: ({ row }) => {
      const level = row.original.difficultyLevel;
      const getDifficultyColor = (level: string) => {
        switch (level) {
          case "KNOWLEDGE":
            return "bg-green-100 text-green-800";
          case "COMPREHENSION":
            return "bg-blue-100 text-blue-800";
          case "APPLICATION":
            return "bg-orange-100 text-orange-800";
          case "ANALYSIS":
            return "bg-red-100 text-red-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      const getDifficultyText = (level: string) => {
        switch (level) {
          case "KNOWLEDGE":
            return "Biết";
          case "COMPREHENSION":
            return "Hiểu";
          case "APPLICATION":
            return "Vận dụng";
          case "ANALYSIS":
            return "Phân tích";
          default:
            return level;
        }
      };

      return (
        <Badge className={getDifficultyColor(level)}>
          {getDifficultyText(level)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lessonId",
    header: "Bài học",
    cell: ({ row }) => {
      const lessonId = row.original.lessonId;
      return handlers.getLessonName(lessonId);
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const question = row.original;
      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlers.onEdit(question)}
                className="h-8 w-8 p-0"
              >
                <EditOutlined className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chỉnh sửa</p>
            </TooltipContent>
          </Tooltip>
          <Popconfirm
            title="Xóa câu hỏi"
            description="Bạn có chắc chắn muốn xóa câu hỏi này?"
            onConfirm={() => handlers.onDelete(question.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <DeleteOutlined className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa</p>
              </TooltipContent>
            </Tooltip>
          </Popconfirm>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
