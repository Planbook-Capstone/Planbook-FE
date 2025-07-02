"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Download, FileText, Eye } from "lucide-react";
import { Question } from "@/components/organisms/exam-question-item/types";
import { YesNoQuestion } from "@/components/organisms/yes-no-question-item/types";
import { ShortQuestion } from "@/components/organisms/short-question-item/types";
import { DowloadIcon } from "@/constants/icon";

interface ExamPreviewProps {
  questions: Question[];
  yesNoQuestions: YesNoQuestion[];
  shortQuestions: ShortQuestion[];
  examTitle?: string;
  examSubject?: string;
  examTime?: string;
  examDate?: string;
}

export default function ExamPreview({
  questions,
  yesNoQuestions,
  shortQuestions,
  examTitle = "Đề thi mẫu",
  examSubject = "Môn học",
  examTime = "90 phút",
  examDate = new Date().toLocaleDateString("vi-VN"),
}: ExamPreviewProps) {
  const convertImageToPNG = async (imageSrc: string): Promise<ArrayBuffer | null> => {
    try {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as ArrayBuffer);
              };
              reader.readAsArrayBuffer(blob);
            } else {
              resolve(null);
            }
          }, 'image/png');
        };

        img.onerror = () => {
          console.error("Failed to load image:", imageSrc);
          resolve(null);
        };

        // Handle CORS for external images
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
      });
    } catch (error) {
      console.error("Error converting image to PNG:", error);
      return null;
    }
  };

  const handleExportDocx = async () => {
    try {
      // Import docx library dynamically
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        HeadingLevel,
        AlignmentType,
        ImageRun,
        Media,
      } = await import("docx");

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header
              new Paragraph({
                children: [
                  new TextRun({
                    text: examTitle,
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Môn: ${examSubject} | Thời gian: ${examTime} | Ngày: ${examDate}`,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({ text: "" }), // Empty line

              // Multiple Choice Questions
              ...(questions.length > 0
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "PHẦN I: TRẮC NGHIỆM",
                          bold: true,
                          size: 28,
                        }),
                      ],
                      heading: HeadingLevel.HEADING_1,
                    }),
                    ...(await Promise.all(
                      questions.map(async (question, index) => {
                        const questionParagraphs = [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `Câu ${index + 1}: ${question.question}`,
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                        ];

                        // Add image if exists
                        if (question.illustrationImage) {
                          try {
                            console.log("🖼️ Processing image for DOCX:", question.illustrationImage.substring(0, 50));

                            const imageBuffer = await convertImageToPNG(
                              question.illustrationImage
                            );

                            if (imageBuffer) {
                              console.log("✅ Image buffer created, size:", imageBuffer.byteLength);

                              questionParagraphs.push(
                                new Paragraph({
                                  children: [
                                    new ImageRun({
                                      data: new Uint8Array(imageBuffer),
                                      transformation: {
                                        width: 300,
                                        height: 200,
                                      },
                                      type: "png",
                                    }),
                                  ],
                                })
                              );

                              console.log("✅ Image added to DOCX");
                            } else {
                              console.error("❌ Failed to create image buffer");
                            }
                          } catch (error) {
                            console.error("❌ Error adding image to question:", error);
                          }
                        }

                        // Add options
                        if (Array.isArray(question.options)) {
                          question.options.forEach(
                            (option: string, optIndex: number) => {
                              questionParagraphs.push(
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${String.fromCharCode(
                                        65 + optIndex
                                      )}. ${option}`,
                                      size: 22,
                                    }),
                                  ],
                                })
                              );
                            }
                          );
                        } else if (
                          question.options &&
                          typeof question.options === "object"
                        ) {
                          Object.entries(question.options).forEach(
                            ([key, value]) => {
                              questionParagraphs.push(
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${key}. ${value}`,
                                      size: 22,
                                    }),
                                  ],
                                })
                              );
                            }
                          );
                        }

                        questionParagraphs.push(new Paragraph({ text: "" })); // Empty line
                        return questionParagraphs;
                      })
                    ).then((results) => results.flat())),
                  ]
                : []),

              // Yes/No Questions
              ...(yesNoQuestions.length > 0
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "PHẦN II: ĐÚNG/SAI",
                          bold: true,
                          size: 28,
                        }),
                      ],
                      heading: HeadingLevel.HEADING_1,
                    }),
                    ...yesNoQuestions.flatMap((question, index) => [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Câu ${questions.length + index + 1}: ${
                              question.question
                            }`,
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `a) ${question.statements.a.text}`,
                            size: 22,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `b) ${question.statements.b.text}`,
                            size: 22,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `c) ${question.statements.c.text}`,
                            size: 22,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `d) ${question.statements.d.text}`,
                            size: 22,
                          }),
                        ],
                      }),
                      new Paragraph({ text: "" }), // Empty line
                    ]),
                  ]
                : []),

              // Short Answer Questions
              ...(shortQuestions.length > 0
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "PHẦN III: TỰ LUẬN",
                          bold: true,
                          size: 28,
                        }),
                      ],
                      heading: HeadingLevel.HEADING_1,
                    }),
                    ...shortQuestions.flatMap((question, index) => [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Câu ${
                              questions.length +
                              yesNoQuestions.length +
                              index +
                              1
                            }: ${question.question}`,
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "................................................................................................................................................................................................",
                            size: 22,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "................................................................................................................................................................................................",
                            size: 22,
                          }),
                        ],
                      }),
                      new Paragraph({ text: "" }), // Empty line
                    ]),
                  ]
                : []),
            ],
          },
        ],
      });

      // Generate and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${examTitle.replace(
        /\s+/g,
        "_"
      )}_${new Date().getTime()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to DOCX:", error);
      alert("Có lỗi xảy ra khi xuất file DOCX. Vui lòng thử lại.");
    }
  };

  const totalQuestions =
    questions.length + yesNoQuestions.length + shortQuestions.length;

  return (
    <div className="h-full flex flex-col bg-white font-questrial">
      {/* Header */}
      <div className="p-4 border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-calsans text-gray-800">Xem trước</h2>
          </div>
          <Button onClick={handleExportDocx}>
            {DowloadIcon}
            <span>Tải về</span>
          </Button>
        </div>

        {/* <div className="text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Tổng số câu: {totalQuestions}</span>
            <span>•</span>
            <span>Trắc nghiệm: {questions.length}</span>
            <span>•</span>
            <span>Đúng/Sai: {yesNoQuestions.length}</span>
            <span>•</span>
            <span>Tự luận: {shortQuestions.length}</span>
          </div>
        </div> */}
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-0">
        <div className="max-w-4xl mx-auto  p-5">
          {/* Exam Header */}
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {examTitle}
            </h1>
            <div className="text-gray-600 space-y-1">
              <p>Môn: {examSubject}</p>
              <p>Thời gian làm bài: {examTime}</p>
              <p>Ngày thi: {examDate}</p>
            </div>
          </div>

          {/* Multiple Choice Section */}
          {questions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                PHẦN I: TRẮC NGHIỆM
              </h2>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <p className="font-medium text-gray-900 mb-2">
                      Câu {index + 1}: {question.question}
                    </p>
                    {question.illustrationImage && (
                      <div className="mb-3">
                        <img
                          src={question.illustrationImage}
                          alt="Hình minh họa"
                          className="max-w-xs max-h-48 rounded border"
                          onLoad={() => {
                            console.log(
                              "✅ Image loaded successfully:",
                              question.illustrationImage
                            );
                          }}
                          onError={(e) => {
                            console.error(
                              "❌ Image load error:",
                              question.illustrationImage,
                              e
                            );
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    {/* Debug: Show image data */}
                    {question.illustrationImage && (
                      <div className="text-xs text-gray-500 mb-2">
                        🖼️ Image: {question.illustrationImage.substring(0, 50)}
                        ...
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-1 ml-4">
                      {Array.isArray(question.options)
                        ? question.options.map(
                            (option: string, optIndex: number) => (
                              <p key={optIndex} className="text-gray-700">
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </p>
                            )
                          )
                        : Object.entries(question.options).map(
                            ([key, value]) => (
                              <p key={key} className="text-gray-700">
                                {key}. {value}
                              </p>
                            )
                          )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yes/No Section */}
          {yesNoQuestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                PHẦN II: ĐÚNG/SAI
              </h2>
              <div className="space-y-4">
                {yesNoQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border-l-4 border-green-500 pl-4"
                  >
                    <p className="font-medium text-gray-900 mb-2">
                      Câu {questions.length + index + 1}: {question.question}
                    </p>
                    <div className="grid grid-cols-1 gap-1 ml-4">
                      <p className="text-gray-700">
                        a) {question.statements.a.text}
                      </p>
                      <p className="text-gray-700">
                        b) {question.statements.b.text}
                      </p>
                      <p className="text-gray-700">
                        c) {question.statements.c.text}
                      </p>
                      <p className="text-gray-700">
                        d) {question.statements.d.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Short Answer Section */}
          {shortQuestions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                PHẦN III: TỰ LUẬN
              </h2>
              <div className="space-y-6">
                {shortQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border-l-4 border-purple-500 pl-4"
                  >
                    <p className="font-medium text-gray-900 mb-3">
                      Câu {questions.length + yesNoQuestions.length + index + 1}
                      : {question.question}
                    </p>
                    <div className="space-y-2">
                      <div className="border-b border-dotted border-gray-400 h-6"></div>
                      <div className="border-b border-dotted border-gray-400 h-6"></div>
                      <div className="border-b border-dotted border-gray-400 h-6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalQuestions === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Chưa có câu hỏi nào</p>
              <p className="text-gray-400 text-sm">
                Thêm câu hỏi để xem trước đề thi
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
