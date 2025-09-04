"use client";

import React, { use, useState } from "react";
import {
  useExamByCodeService,
  ExamContentData,
} from "@/services/studentExamServices";
import { formatVietnamDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/Button";
import QuestionRender from "@/components/organisms/question-render";
import { useSubmissionById } from "@/services/examInstanceServices";
import { Modal } from "@/components/ui/modal";

interface ResultExamPageProps {
  params: Promise<{
    code: string;
  }>;
}

function ResultExamPage({ params }: ResultExamPageProps) {
  const resolvedParams = use(params);

  // API hooks
  const {
    data: examResponse,
    isLoading: isLoadingExam,
    error: examError,
  } = useExamByCodeService(resolvedParams.code);

  const examData = examResponse?.data as ExamContentData;

  const [open, setOpen] = useState(false);
  const [submissionCode, setSubmissionCode] = useState("");
  const [error, setError] = useState("");
  const {
    data: studentResult,
    refetch,
    isFetching,
    error: errorSubmission,
  } = useSubmissionById(submissionCode, {
    enabled: false, // Không fetch khi render
  });
  const handleOpen = () => {
    setOpen(true);
    setSubmissionCode("");
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setSubmissionCode("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionCode.trim()) {
      setError("Vui lòng nhập mã code nộp bài.");
      return;
    }

    setError("");

    const result = await refetch();

    if (result.data) {
      console.log("Submission:", result.data);
    }

    setOpen(false);
  };

  if (isLoadingExam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin bài thi...</p>
        </div>
      </div>
    );
  }

  if (examError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu bài thi</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin bài thi</p>
        </div>
      </div>
    );
  }

  console.log(studentResult?.data, "tran");

  return (
    <>
      {studentResult?.data && (
        <div className="p-5  font-questrial">
          <h1 className="text-xl">
            Bài làm của{" "}
            <span className="font-calsans">
              {studentResult?.data?.studentName}
            </span>
          </h1>
          <p className="text-lg">Điểm: {studentResult?.data?.score}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 ">
        <aside
          className={`w-full px-6 py-6 space-y-6 md:sticky md:top-0 md:h-screen`}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
              <div className="font-calsans text-nowrap ">Tên bài kiểm tra</div>
              <div className="font-questrial text-gray-900  leading-relaxed">
                {examData.examName || "Không có tên"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
              <div className="font-calsans text-nowrap">Môn học</div>
              <div className="font-questrial text-gray-900  leading-relaxed">
                {examData.subject || "Không có thông tin"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
              <div className="font-calsans text-nowrap">Khối lớp</div>
              <div className="font-questrial text-gray-900  leading-relaxed">
                {examData.grade
                  ? `Lớp ${examData.grade}`
                  : "Không có thông tin"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
              <div className="font-calsans text-nowrap">Thời gian làm bài</div>
              <div className="font-questrial text-gray-900  leading-relaxed">
                {examData.durationMinutes
                  ? `${examData.durationMinutes} phút`
                  : "Không có thông tin"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
              <div className="font-calsans text-nowrap">Mã đề</div>
              <div className="font-questrial text-gray-900  leading-relaxed">
                {examData.code || "Không có mã"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
              <div className="font-calsans text-nowrap ">Thời gian bắt đầu</div>
              <div className="font-questrial text-gray-900  leading-relaxed">
                {examData.startAt
                  ? formatVietnamDate(
                      new Date(examData.startAt),
                      "dd/MM/yyyy HH:mm"
                    )
                  : "Không có thông tin"}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
              <div className="font-calsans text-nowrap ">
                Thời gian kết thúc
              </div>
              <div className="font-questrial text-gray-900  leading-relaxed">
                {examData.endAt
                  ? formatVietnamDate(
                      new Date(examData.endAt),
                      "dd/MM/yyyy HH:mm"
                    )
                  : "Không có thông tin"}
              </div>
            </div>

            {examData.school && (
              <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
                <div className="font-calsans text-nowrap">Trường</div>
                <div className="font-questrial text-gray-900  leading-relaxed">
                  {examData.school}
                </div>
              </div>
            )}

            {examData.totalScore && (
              <div className="grid grid-cols-[1fr_2fr] gap-5 text-base">
                <div className="font-calsans text-nowrap">Tổng điểm</div>
                <div className="font-questrial text-gray-900  leading-relaxed">
                  {examData.totalScore} điểm
                </div>
              </div>
            )}
          </div>

          <Button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white text-xs py-3"
            onClick={handleOpen}
          >
            Nhập mã code của bạn để xem kết quả
          </Button>

          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Vui lòng nhập mã code bài làm của bạn"
          >
            <div>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Nhập mã code..."
                  value={submissionCode}
                  onChange={(e) => setSubmissionCode(e.target.value)}
                  autoFocus
                />
                {error && <div className="text-red-500 text-xs">{error}</div>}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Xác nhận
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </aside>
        <div className="col-span-2 px-6 py-6">
          {examData?.contentJson?.parts && (
            <QuestionRender
              parts={examData.contentJson.parts}
              studentResult={studentResult?.data?.resultDetails || []}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ResultExamPage;
