"use client";

import { useState, useEffect } from "react";
import ExamMatrixForm from "@/components/forms/ExamMatrixForm";
import ExamInfoForm, { ExamInfo } from "@/components/forms/ExamInfoForm";
import DocumentSourceSelector from "@/components/templates/document-source-template/DocumentSourceSelector";
import { Button } from "@/components/ui/Button";

interface ExamMatrixData {
  part1: { nb: number; th: number; vd: number };
  part2: { nb: number; th: number; vd: number };
  part3: { nb: number; th: number; vd: number };
}

function ShuffleExamPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFolder, setSelectedFolder] = useState<number>(1); // Khởi tạo với folder đầu tiên

  // State để lưu danh sách các file đã chọn
  const [personalExams, setPersonalExams] = useState<any[]>([]);

  const [matrixData, setMatrixData] = useState<ExamMatrixData>({
    part1: { nb: 0, th: 0, vd: 0 },
    part2: { nb: 0, th: 0, vd: 0 },
    part3: { nb: 0, th: 0, vd: 0 },
  });

  const [examInfo, setExamInfo] = useState<ExamInfo>({
    school: "Trường THPT Nguyễn Huệ",
    grade: "12",
    subject: "Hoa_hoc",
    examTitle: "",
    duration: 90,
    numberOfExams: 1,
  });

  const myFolder = [
    {
      name: "Đề kiểm tra",
      colorId: "6",
      folderId: 1,
      type: "EXAM",
    },
    {
      name: "Ngân hàng câu hỏi",
      colorId: "2",
      folderId: 3,
      type: "SYSTEM",
    },
  ];

  // Tự động chọn folder đầu tiên khi component mount
  useEffect(() => {
    if (myFolder.length > 0 && !selectedFolder) {
      setSelectedFolder(myFolder[0].folderId);
    }
  }, []);

  const handleMatrixChange = (newMatrix: ExamMatrixData) => {
    setMatrixData(newMatrix);
    // Có thể thêm logic xử lý khác ở đây
    console.log("Matrix updated:", newMatrix);
  };

  const handleExamInfoChange = (
    field: keyof ExamInfo,
    value: string | number
  ) => {
    setExamInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFolderSelect = (folderId: number) => {
    setSelectedFolder(folderId); // Luôn chọn folder được click, không cho phép bỏ chọn
  };

  // Callback để xử lý khi file được chọn từ DocumentSourceSelector
  const handleFileSelect = (fileData: any) => {
    // Kiểm tra xem file đã được chọn chưa
    const isAlreadySelected = personalExams.some(
      (exam) => exam.id === fileData.id
    );

    if (!isAlreadySelected) {
      setPersonalExams((prev) => [...prev, fileData]);
      console.log("Added file to selection:", fileData);
      console.log("Total selected files:", personalExams.length + 1);
    } else {
      console.log("File already selected:", fileData.name);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canSubmit = () => {
    // Check if exam title is filled
    if (!examInfo.examTitle.trim()) {
      return false;
    }

    // selectedFolder luôn có giá trị, không cần kiểm tra null

    // Check if matrix has at least one question
    const totalQuestions =
      matrixData.part1.nb +
      matrixData.part1.th +
      matrixData.part1.vd +
      matrixData.part2.nb +
      matrixData.part2.th +
      matrixData.part2.vd +
      matrixData.part3.nb +
      matrixData.part3.th +
      matrixData.part3.vd;

    return totalQuestions > 0;
  };

  const getValidationMessage = () => {
    if (!examInfo.examTitle.trim()) {
      return "Vui lòng nhập tiêu đề đề thi";
    }
    // selectedFolder luôn có giá trị, không cần kiểm tra
    const totalQuestions =
      matrixData.part1.nb +
      matrixData.part1.th +
      matrixData.part1.vd +
      matrixData.part2.nb +
      matrixData.part2.th +
      matrixData.part2.vd +
      matrixData.part3.nb +
      matrixData.part3.th +
      matrixData.part3.vd;

    if (totalQuestions === 0) {
      return "Vui lòng thiết lập ma trận đề thi với ít nhất một câu hỏi";
    }
    return "";
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      // Handle exam creation logic here
      console.log("Creating exam with:", {
        examInfo,
        matrixData,
        selectedFolder,
        personalExams, // Thêm personalExams vào log
      });
      alert("Đề thi đã được tạo thành công!");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <DocumentSourceSelector
              folders={myFolder}
              selectedFolder={selectedFolder}
              onFolderSelect={handleFolderSelect}
              onFileSelect={handleFileSelect}
              selectedFiles={personalExams}
              title="Chọn nguồn tài liệu"
              subtitle="Chọn một thư mục chứa câu hỏi để tạo đề thi"
            />

            {/* Hiển thị danh sách file đã chọn */}
            {personalExams.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Đã chọn {personalExams.length} file:
                </h4>
                <div className="space-y-2">
                  {personalExams.map((exam, index) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between bg-white p-3 rounded border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {exam.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {exam.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPersonalExams((prev) =>
                            prev.filter((e) => e.id !== exam.id)
                          );
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-8">
            {/* Exam Information Form */}
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-calsans">Nguồn đã chọn</h2>
                <h3 className="text-base font-questrial text-blue-800">
                  {personalExams.map((exam) => (
                    <p key={exam.id}>{exam.name}.docx</p>
                  ))}
                </h3>
              </div>
              <div>
                <h2 className="text-lg font-calsans">Thông tin đề thi</h2>
                <h3 className="text-base font-questrial text-neutral-500">
                  Nhập các thông tin cơ bản về đề thi
                </h3>
              </div>
              <ExamInfoForm
                examInfo={examInfo}
                onExamInfoChange={handleExamInfoChange}
              />
            </div>

            {/* Exam Matrix Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-lg font-calsans">Ma trận đề thi</h2>
                <h3 className="text-base font-questrial text-neutral-500">
                  Ma trận phân bổ đề thi dựa trên số lượng câu nhận biết, thông
                  hiểu, vận dụng
                </h3>
              </div>

              <div>
                <ExamMatrixForm
                  onMatrixChange={handleMatrixChange}
                  initialData={matrixData}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-10">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                currentStep >= 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-blue-600`}
              onClick={() => setCurrentStep(1)}
            >
              1
            </div>
            <span
              className="ml-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600"
              onClick={() => setCurrentStep(1)}
            >
              Chọn nguồn tài liệu
            </span>
          </div>
          <div
            className={`w-16 h-0.5 ${
              currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                currentStep >= 2
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-blue-600`}
              onClick={() => setCurrentStep(2)}
            >
              2
            </div>
            <span
              className="ml-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600"
              onClick={() => setCurrentStep(2)}
            >
              Thông tin đề thi
            </span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStepContent()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
        >
          Quay lại
        </Button>
        <div className="flex space-x-2">
          {currentStep < 2 && (
            <Button onClick={handleNextStep}>Tiếp theo</Button>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col items-end">
              {!canSubmit() && (
                <p className="text-sm text-red-500 mb-2">
                  {getValidationMessage()}
                </p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className={!canSubmit() ? "opacity-50 cursor-not-allowed" : ""}
              >
                Tạo đề thi
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShuffleExamPage;
