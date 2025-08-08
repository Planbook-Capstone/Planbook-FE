"use client";

import { useState, useEffect } from "react";
import ExamMatrixForm from "@/components/forms/ExamMatrixForm";
import ExamInfoForm, { ExamInfo } from "@/components/forms/ExamInfoForm";
import DocumentSourceSelector from "@/components/templates/document-source-template/DocumentSourceSelector";
import { Button } from "@/components/ui/Button";
import { Steps } from "@/components/ui/steps";
import { useShuffleExamService } from "@/services/questionBankServices";
import { toast } from "sonner";
import TemplatePreview from "@/components/organisms/template-preview";
import { DowloadIcon } from "@/constants/icon";
import { downloadExamAsDocx, downloadAllExamsAsDocx } from "@/utils/examDownloadUtils";

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
  const [systemQuestions, setSystemQuestions] = useState<any[]>([]);

  const { mutate: generateExam, isPending: isGeneratingExam } =
    useShuffleExamService();

  // State để lưu kết quả tạo đề thi
  const [examResult, setExamResult] = useState<any>(null);

  // State để lưu index đề thi được chọn để preview
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);

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

  // Reset selectedExamIndex khi có examResult mới
  useEffect(() => {
    if (examResult && examResult.length > 0) {
      setSelectedExamIndex(0);
    }
  }, [examResult]);

  const handleMatrixChange = (newMatrix: ExamMatrixData) => {
    setMatrixData(newMatrix);
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
    if (fileData.action === "remove") {
      // Xóa file khỏi danh sách
      setPersonalExams((prev) =>
        prev.filter((exam) => exam.id !== fileData.fileId)
      );
      console.log("Removed file from selection:", fileData.fileId);
      return;
    }

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

  // Callback để xử lý khi câu hỏi system được chọn
  const handleSystemQuestionSelect = (questions: any[]) => {
    setSystemQuestions(questions);
    console.log("Selected system questions:", questions);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
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

  console.log(examResult);

  const handleSubmit = () => {
    if (canSubmit()) {
      // Transform matrixData to the expected API format
      const matrixConfig = {
        "PHẦN I": {
          nb: matrixData.part1.nb,
          th: matrixData.part1.th,
          vd: matrixData.part1.vd,
        },
        "PHẦN II": {
          nb: matrixData.part2.nb,
          th: matrixData.part2.th,
          vd: matrixData.part2.vd,
        },
        "PHẦN III": {
          nb: matrixData.part3.nb,
          th: matrixData.part3.th,
          vd: matrixData.part3.vd,
        },
      };

      // Transform personalExams to the expected API format
      const transformedPersonalExams = personalExams?.map((exam) => ({
        sourceExamId: exam.id || exam.sourceExamId,
        contentJson: exam?.data,
      }));

      // Prepare the API request payload
      const apiPayload = {
        toolId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        academicYearId: 1,
        grade: examInfo.grade,
        subject: examInfo.subject,
        school: examInfo.school,
        examTitle: examInfo.examTitle,
        duration: examInfo.duration,
        personalExams: transformedPersonalExams,
        systemQuestions: systemQuestions, // Include selected system questions
        matrixConfig,
        numberOfExams: examInfo.numberOfExams,
      };

      console.log("Creating exam with API payload:", apiPayload);

      // Call the API using the shuffle exam service
      generateExam(apiPayload, {
        onSuccess: (response) => {
          // console.log("Exam generation successful:", response);
          console.log("Exam generation successful:", response?.data?.data);
          toast.success("Tạo đề thi thành công!");
          setExamResult(response?.data?.data);
          setCurrentStep(3); // Chuyển đến step kết quả
        },
        onError: (error) => {
          console.error(
            "Exam generation failed:",
            error?.response?.data?.message
          );
          toast.error(`${error?.response?.data?.message}`);
        },
      });
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
              onSystemQuestionSelect={handleSystemQuestionSelect}
              selectedSystemQuestions={systemQuestions}
              title="Chọn nguồn tài liệu"
              subtitle="Chọn một thư mục chứa câu hỏi để tạo đề thi"
            />
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
                  Đã chọn {systemQuestions.length} câu hỏi từ hệ thống
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
      case 3:
        return (
          <div className="grid grid-cols-3 gap-5 h-screen ">
            <div className="sticky top-0 p-4 w-full h-fit max-h-screen col-span-1 flex flex-col">
              <h1 className="font-calsans w-full text-base lg:text-xl mb-4">
                Mã đề
              </h1>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                {examResult?.map((exam: any, index: number) => (
                  <Button
                    key={index}
                    variant={
                      selectedExamIndex === index ? "default" : "outline"
                    }
                    onClick={() => setSelectedExamIndex(index)}
                    className="w-full justify-start"
                  >
                    <p className="text-base font-questrial font-[600]">
                      {exam?.questionOnly?.examCode}
                    </p>
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 py-4">
                <Button
                  onClick={() => {
                    if (examResult && examResult[selectedExamIndex]) {
                      downloadExamAsDocx(
                        examResult[selectedExamIndex].questionOnly
                      );
                    }
                  }}
                >
                  {DowloadIcon} Tải đề này
                </Button>
                <Button variant="outline" onClick={() => downloadAllExamsAsDocx(examResult)}>
                  {DowloadIcon} Tải tất cả
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-y-auto col-span-2 max-h-screen ">
              <TemplatePreview
                data={examResult?.[selectedExamIndex]?.questionOnly}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const stepItems = [
    {
      title: "Chọn nguồn tài liệu",
      description: "Chọn thư mục và file câu hỏi",
    },
    {
      title: "Thông tin đề thi",
      description: "Cấu hình thông tin và ma trận đề thi",
    },
    {
      title: "Kết quả",
      description: "Xem và tải xuống đề thi đã tạo",
    },
  ];

  const handleStepChange = (step: number) => {
    // Bước 1 và 2: có thể chuyển qua lại tự do
    if (step === 0 || step === 1) {
      setCurrentStep(step + 1);
    }
    // Bước 3: chỉ có thể truy cập nếu đã có kết quả từ submit
    else if (step === 2 && examResult) {
      setCurrentStep(step + 1);
    }
  };

  return (
    <div className="p-10">
      {/* Step Navigation */}
      <div className="mb-8">
        <Steps
          current={currentStep - 1}
          items={stepItems}
          onChange={handleStepChange}
          className="max-w-4xl mx-auto"
        />
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
                disabled={!canSubmit() || isGeneratingExam}
                className={
                  !canSubmit() || isGeneratingExam
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                {isGeneratingExam ? "Đang tạo đề thi..." : "Tạo đề thi"}
              </Button>
            </div>
          )}
          {currentStep === 3 && (
            <Button
              onClick={() => {
                if (examResult && examResult[selectedExamIndex]) {
                  downloadExamAsDocx(
                    examResult[selectedExamIndex].questionOnly
                  );
                }
              }}
            >
              Tải xuống đề thi
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShuffleExamPage;
