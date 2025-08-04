"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextarea } from "@/components/ui/rich-textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

function CreateQuestionBankForm() {
  const [selectedTag, setSelectedTag] = useState("Vận dụng");
  const [questionType, setQuestionType] = useState("PART_I");
  const [questionContent, setQuestionContent] = useState(
    'Thành phần dịch vị dạ dày gồm 95% là nước, enzyme và hydrochloric acid. Sự có mặt của hydrochloric acid làm cho pH của dịch vị trong khoảng từ 2 – 3. Khi độ acid trong dịch vị dạ dày tăng thì dễ bị ợ chua, ợ hơi, ói mửa, buồn nôn, loét dạ dày, tá tràng. Để làm giảm bớt lượng acid dư trong dịch vị dạ dày người ta thường uống thuốc muối dạ dày "Nabica" từng lượng nhỏ và cách quãng. Phát biểu nào sau đây là sai?'
  );

  const [options, setOptions] = useState([
    "Công thức hoá học của thuốc muối “Nabica” là NaHCO3.",
    "Khi uống từng lượng nhỏ và cách quãng thuốc muối “Nabica” thì pH của dịch vị dạ dày sẽ tăng từ từ.",
    "Đây là đáp án C.",
    "Đây là đáp án D.",
  ]);

  const [correctAnswers, setCorrectAnswers] = useState([
    false,
    false,
    false,
    false,
  ]);

  // State cho câu hỏi đúng/sai (PART_II)
  const [trueFalseStatements, setTrueFalseStatements] = useState([
    "Tại anode, xuất hiện bọt khí hydrogen trên bề mặt điện cực.",
    "Tại cathode, trước tiên xảy ra sự oxi hóa nước sau đó xảy ra tiếp sự oxi hóa Cu2+.",
    "Dung dịch sau điện phân có giá trị pH tăng lên.",
    "Nếu tiến hành điện phân dung dịch chứa 0,15 mol copper (II) sulfate trong thời gian 38 phút 36 giây với cường độ dòng điện 10A thì khối lượng dung dịch sau phản ứng giảm là 9,6 gam",
  ]);

  const [trueFalseAnswers, setTrueFalseAnswers] = useState([
    false, // a. Sai
    false, // b. Sai
    false, // c. Sai
    true, // d. Đúng
  ]);

  // Function to update individual true/false answer
  const updateTrueFalseAnswer = (index: number, value: boolean) => {
    const newAnswers = [...trueFalseAnswers];
    newAnswers[index] = value;
    setTrueFalseAnswers(newAnswers);
  };

  // Function to update individual statement
  const updateTrueFalseStatement = (index: number, value: string) => {
    const newStatements = [...trueFalseStatements];
    newStatements[index] = value;
    setTrueFalseStatements(newStatements);
  };

  // State cho câu hỏi tự luận (PART_III)
  const [essayAnswer, setEssayAnswer] = useState("");

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index: number, checked: boolean) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index] = checked;
    setCorrectAnswers(newCorrectAnswers);
  };

  // Render phần đáp án dựa trên loại câu hỏi
  const renderAnswerSection = () => {
    switch (questionType) {
      case "PART_I":
        return (
          <div className="pl-12 grid grid-cols-1 space-y-2 mt-2">
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox
                  checked={correctAnswers[index]}
                  onCheckedChange={(checked) =>
                    handleCorrectAnswerChange(index, checked as boolean)
                  }
                  className="mr-2"
                />
                <span>{String.fromCharCode(65 + index)}.</span>
                <Input
                  value={opt}
                  onChange={(e: any) =>
                    handleOptionChange(index, e.target.value)
                  }
                  className="flex-1 border-none shadow-none"
                  placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                />
              </div>
            ))}
          </div>
        );

      case "PART_II":
        return (
          <div className="pl-12 space-y-4 mt-2">
            {trueFalseStatements.map((statement, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="font-medium mt-2">
                    {String.fromCharCode(97 + index)}.
                  </span>
                  <Input
                    value={statement}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateTrueFalseStatement(index, e.target.value)
                    }
                    placeholder={`Nhập câu ${String.fromCharCode(
                      97 + index
                    )}...`}
                    className="flex-1 border-none shadow-none"
                  />
                </div>
                <div className="flex gap-4 ml-8">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={trueFalseAnswers[index] === true}
                      onCheckedChange={(checked) =>
                        updateTrueFalseAnswer(index, checked ? true : false)
                      }
                    />
                    <span>Đúng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={trueFalseAnswers[index] === false}
                      onCheckedChange={(checked) =>
                        updateTrueFalseAnswer(index, checked ? false : true)
                      }
                    />
                    <span>Sai</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "PART_III":
        return (
          <div className="pl-12 space-y-2 mt-2">
            <p className="text-sm text-gray-600">Đáp án:</p>
            <RichTextarea
              value={essayAnswer}
              onChange={setEssayAnswer}
              placeholder="Nhập đáp án cho câu hỏi tự luận..."
              className="text-base leading-relaxed"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Định nghĩa màu sắc cho từng tag
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Vận dụng":
        return "bg-emerald-100 text-emerald-800 border-emerald-500";
      case "Thông hiểu":
        return "bg-amber-100 text-yellow-700 border-amber-200";
      case "Nhận biết":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  return (
    <div className="text-base">
      <div className="gap-2">
        <div className="flex gap-2 items-center">
          <p className="font-bold">Câu 1:</p>
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PART_I">Trắc nghiệm</SelectItem>
              <SelectItem value="PART_II">Đúng/Sai</SelectItem>
              <SelectItem value="PART_III">Tự luận</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="text-blue-500 max-w-fit border-none shadow-none"
            defaultValue={"(Đề TN THPT QG - 2020)"}
            placeholder={"Nguồn"}
          />
          <Input
            defaultValue={"[Bài 1_Hóa 10]"}
            className="text-orange-500 max-w-fit border-none shadow-none"
          />
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger
              className={`w-32 rounded-full px-3 py-1.5 text-xs font-medium border-2 ${getTagColor(
                selectedTag
              )}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-transparent border-none">
              <SelectItem
                value="Vận dụng"
                className="rounded-full mx-1 my-0.5 bg-emerald-500 text-white border-emerald-500 focus:bg-emerald-600 data-[highlighted]:bg-emerald-600"
              >
                Vận dụng
              </SelectItem>
              <SelectItem
                value="Thông hiểu"
                className="rounded-full mx-1 my-0.5 bg-amber-100 text-yellow-700 border-amber-200 focus:bg-amber-200 data-[highlighted]:bg-amber-200"
              >
                Thông hiểu
              </SelectItem>
              <SelectItem
                value="Nhận biết"
                className="rounded-full mx-1 my-0.5 bg-blue-100 text-blue-700 border-blue-200 focus:bg-blue-200 data-[highlighted]:bg-blue-200"
              >
                Nhận biết
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <RichTextarea
          value={questionContent}
          onChange={setQuestionContent}
          placeholder="Nhập nội dung câu hỏi..."
          className="text-base leading-relaxed"
        />
      </div>
      {renderAnswerSection()}
    </div>
  );
}

export default CreateQuestionBankForm;
