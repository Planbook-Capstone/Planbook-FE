"use client";

import React, { useState, useMemo } from "react";
import { Tabs, message, Typography } from "antd";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { QuestionBankForm } from "@/components/forms/question-bank/QuestionBankForm";
import QuestionBankTable from "@/components/organisms/question-bank-table";
import {
  useQuestionBanksService,
  useCreateQuestionBankService,
  useUpdateQuestionBankService,
  useDeleteQuestionBankService,
  QuestionBankItem,
  QuestionContent,
} from "@/services/questionBankServices";
import { useLessonsService } from "@/services/lessonServices";
import { Badge } from "@/components/ui/badge";

const { Title, Text } = Typography;

// Types for form data
interface QuestionFormData {
  lessonId: number;
  questionType: "PART_I" | "PART_II" | "PART_III";
  difficultyLevel: "KNOWLEDGE" | "COMPREHENSION" | "APPLICATION" | "ANALYSIS";
  questionContent: QuestionContent;
  explanation: string;
  referenceSource?: string;
}

function QuestionBankManagementPage() {
  const [activeTab, setActiveTab] = useState<"PART_I" | "PART_II" | "PART_III">(
    "PART_I"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionBankItem | null>(null);

  // API hooks
  const { data: questionsData, isLoading } = useQuestionBanksService();
  const { data: lessonsData } = useLessonsService();

  // Use mock data if real data is not available
  const finalLessonsData = lessonsData;
  const finalQuestionsData = questionsData;
  const createMutation = useCreateQuestionBankService();
  const updateMutation = useUpdateQuestionBankService();
  const deleteMutation = useDeleteQuestionBankService();

  // Filter questions by type
  const questionsByType = useMemo(() => {
    if (!finalQuestionsData?.data)
      return { PART_I: [], PART_II: [], PART_III: [] };

    return finalQuestionsData.data.reduce(
      (acc: Record<string, QuestionBankItem[]>, question: QuestionBankItem) => {
        const type = question.questionType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(question);
        return acc;
      },
      { PART_I: [], PART_II: [], PART_III: [] } as Record<
        string,
        QuestionBankItem[]
      >
    );
  }, [finalQuestionsData]);

  // Handle form submission
  const handleSubmit = async (values: QuestionFormData) => {
    try {
      if (editingQuestion) {
        await updateMutation.mutateAsync({
          id: editingQuestion.id.toString(),
          data: values,
        });
        message.success("Cập nhật câu hỏi thành công!");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Thêm câu hỏi thành công!");
      }

      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id.toString());
      message.success("Xóa câu hỏi thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa!");
    }
  };

  // Open modal for adding new question
  const handleAddNew = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (question: QuestionBankItem) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  return (
    <div className="p-5">
      <div className="text-base">
        <div className="gap-2">
          <div className="flex gap-2 items-center">
            <p className="font-bold">Câu 1:</p>
            <p className="text-blue-500">(Đề TN THPT QG - 2020) </p>
            <p className="text-orange-500">[Bài 3_Lớp 10]</p>
            <Badge variant={"success"}>Vận dụng</Badge>
          </div>
          <p>
            Thành phần dịch vị dạ dày gồm 95% là nước, enzyme và hydrochloric
            acid. Sự có mặt của hydrochloric acid làm cho pH của dịch vị trong
            khoảng từ 2 – 3. Khi độ acid trong dịch vị dạ dày tăng thì dễ bị ợ
            chua, ợ hơi, ói mửa, buồn nôn, loét dạ dày, tá tràng. Để làm giảm
            bớt lượng acid dư trong dịch vị dạ dày người ta thường uống thuốc
            muối dạ dày “Nabica” từng lượng nhỏ và cách quãng. Phát biểu nào sau
            đây là sai?
          </p>
        </div>
        <div className="pl-12 grid grid-cols-1 space-y-2 mt-2">
          <p>A. Công thức hoá học của thuốc muối “Nabica” là NaHCO3.</p>
          <p className="">
            B.Khi uống từng lượng nhỏ và cách quãng thuốc muối “Nabica” thì pH
            của dịch vị dạ dày sẽ tăng từ từ.
          </p>
          <p>C. Công thức hoá học của thuốc muối “Nabica” là NaHCO3.</p>
          <p>D. Công thức hoá học của thuốc muối “Nabica” là NaHCO3.</p>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as any)}
        tabBarExtraContent={
          <Dialog
            open={isModalOpen && !editingQuestion}
            onOpenChange={(open) => {
              setIsModalOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]"
                onClick={handleAddNew}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm câu hỏi mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm câu hỏi mới</DialogTitle>
              </DialogHeader>
              <QuestionBankForm
                editingQuestion={null}
                lessonsData={finalLessonsData}
                loading={createMutation.isPending}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        }
        items={[
          {
            key: "PART_I",
            label: "PART I - Trắc nghiệm",
            children: (
              <QuestionBankTable
                questions={questionsByType.PART_I || []}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                lessonsData={finalLessonsData}
              />
            ),
          },
          {
            key: "PART_II",
            label: "PART II - Đúng/Sai",
            children: (
              <QuestionBankTable
                questions={questionsByType.PART_II || []}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                lessonsData={finalLessonsData}
              />
            ),
          },
          {
            key: "PART_III",
            label: "PART III - Tự luận",
            children: (
              <QuestionBankTable
                questions={questionsByType.PART_III || []}
                loading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                lessonsData={finalLessonsData}
              />
            ),
          },
        ]}
      />

      {/* Edit Dialog */}
      <Dialog
        open={isModalOpen && !!editingQuestion}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setEditingQuestion(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
          </DialogHeader>
          <QuestionBankForm
            editingQuestion={editingQuestion}
            lessonsData={finalLessonsData}
            loading={updateMutation.isPending}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default QuestionBankManagementPage;
