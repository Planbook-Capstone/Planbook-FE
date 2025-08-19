import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Footer,
  PageNumber,
  PageOrientation,
} from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

/**
 * Utility function to parse HTML-like text and convert to TextRun array
 * @param text - Text with HTML tags like <sub>, <sup>, <b>, etc.
 * @param fontSize - Base font size
 * @returns Array of TextRun objects
 */
const parseHtmlText = (text: string, fontSize: number): TextRun[] => {
  if (!text) return [];

  // First, clean up malformed HTML tags
  let cleanText = text
    // Fix malformed sub tags with class attributes
    .replace(/<sub\s+class="[^"]*">/g, '<sub>')
    .replace(/<\/sub>/g, '</sub>')
    // Fix malformed sup tags with class attributes
    .replace(/<sup\s+class="[^"]*">/g, '<sup>')
    .replace(/<\/sup>/g, '</sup>')
    // Fix malformed p tags
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    // Fix any other malformed tags with attributes
    .replace(/<(sub|sup|b|strong)\s+[^>]*>/g, '<$1>')
    // Remove any remaining HTML tags that we don't support
    .replace(/<[^>]+>/g, '');

  console.log("🔧 Original text:", text);
  console.log("🔧 Cleaned text:", cleanText);

  const runs: TextRun[] = [];
  const regex = /<(sub|sup|b|strong)>(.*?)<\/\1>|([^<]+)/g;
  let match;

  while ((match = regex.exec(cleanText)) !== null) {
    if (match[1] && match[2]) {
      // HTML tag found
      const tag = match[1];
      const content = match[2];

      if (tag === "sub") {
        runs.push(
          new TextRun({
            text: content,
            size: fontSize,
            subScript: true,
          })
        );
      } else if (tag === "sup") {
        runs.push(
          new TextRun({
            text: content,
            size: fontSize,
            superScript: true,
          })
        );
      } else if (tag === "b" || tag === "strong") {
        runs.push(
          new TextRun({
            text: content,
            size: fontSize,
            bold: true,
          })
        );
      }
    } else if (match[3]) {
      // Regular text
      runs.push(
        new TextRun({
          text: match[3],
          size: fontSize,
        })
      );
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text: cleanText, size: fontSize })];
};

/**
 * Utility function to generate and download a DOCX file for an exam
 * @param examData - The exam data to be converted to DOCX
 */
export const downloadExamAsDocx = async (examData: any) => {
  try {
    // Tính toán số trang ước tính (tính thêm 1 trang cho header và spacing)
    const totalQuestions =
      examData.parts?.reduce(
        (total: number, part: any) => total + (part.questions?.length || 0),
        0
      ) || 0;
    const estimatedPages = Math.max(1, Math.ceil(totalQuestions / 12) + 1); // Giảm số câu/trang và +1 trang

    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Trang ",
                      size: 20,
                    }),
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: 20,
                    }),
                    new TextRun({
                      text: `/${estimatedPages}`,
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          },
          children: [
            // Header table - matching docxGeneratorExam format
            new Table({
              rows: [
                new TableRow({
                  children: [
                    // Left column: Ministry info
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "SỞ GIÁO DỤC VÀ ĐÀO TẠO",
                              bold: true,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "ĐỀ THI CHÍNH THỨC",
                              bold: true,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 120 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `(Đề thi có ${estimatedPages} trang)`,
                              size: 20,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 120 },
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NIL, size: 0 },
                        bottom: { style: BorderStyle.NIL, size: 0 },
                        left: { style: BorderStyle.NIL, size: 0 },
                        right: { style: BorderStyle.NIL, size: 0 },
                      },
                    }),
                    // Right column: Exam title and subject
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text:
                                examData.examTitle.toUpperCase() ||
                                "KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG NĂM 2025",
                              bold: true,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Môn thi: ${
                                examData?.subject || "HÓA HỌC"
                              }`,
                              bold: false,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 60 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Thời gian làm bài ${
                                examData.duration || 90
                              } phút, không kể thời gian phát đề`,
                              size: 20,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 60 },
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NIL, size: 0 },
                        bottom: { style: BorderStyle.NIL, size: 0 },
                        left: { style: BorderStyle.NIL, size: 0 },
                        right: { style: BorderStyle.NIL, size: 0 },
                      },
                    }),
                  ],
                }),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NIL, size: 0 },
                bottom: { style: BorderStyle.NIL, size: 0 },
                left: { style: BorderStyle.NIL, size: 0 },
                right: { style: BorderStyle.NIL, size: 0 },
                insideHorizontal: { style: BorderStyle.NIL, size: 0 },
                insideVertical: { style: BorderStyle.NIL, size: 0 },
              },
            }),

            // Empty line after header table
            new Paragraph({
              text: "",
              spacing: { after: 240 },
            }),

            // Student info section with exam code on the right
            new Table({
              rows: [
                new TableRow({
                  children: [
                    // Left side: Student info
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Họ, tên thí sinh: ...................................",
                              bold: true,
                              size: 22,
                            }),
                          ],
                          spacing: { after: 120 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Số báo danh: ........................................",
                              bold: true,
                              size: 22,
                            }),
                          ],
                        }),
                      ],
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NIL, size: 0 },
                        bottom: { style: BorderStyle.NIL, size: 0 },
                        left: { style: BorderStyle.NIL, size: 0 },
                        right: { style: BorderStyle.NIL, size: 0 },
                      },
                    }),
                    // Right side: Exam code with border
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Mã đề: ${examData.examCode || "0314"}`,
                              size: 20,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      borders: {
                        top: {
                          style: BorderStyle.SINGLE,
                          size: 4,
                          color: "000000",
                        },
                        bottom: {
                          style: BorderStyle.SINGLE,
                          size: 4,
                          color: "000000",
                        },
                        left: {
                          style: BorderStyle.SINGLE,
                          size: 4,
                          color: "000000",
                        },
                        right: {
                          style: BorderStyle.SINGLE,
                          size: 4,
                          color: "000000",
                        },
                      },
                      verticalAlign: "center",
                    }),
                  ],
                }),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NIL, size: 0 },
                bottom: { style: BorderStyle.NIL, size: 0 },
                left: { style: BorderStyle.NIL, size: 0 },
                right: { style: BorderStyle.NIL, size: 0 },
                insideHorizontal: { style: BorderStyle.NIL, size: 0 },
                insideVertical: { style: BorderStyle.NIL, size: 0 },
              },
            }),

            // Empty line after student info
            new Paragraph({
              text: "",
              spacing: { after: 240 },
            }),

            // Process each part
            ...(examData.parts
              ?.flatMap((part: any, partIndex: number) => {
                // Define part descriptions
                const getPartDescription = (
                  partIndex: number,
                  questionCount: number
                ) => {
                  const partNumber = partIndex + 1;
                  switch (partNumber) {
                    case 1:
                      return `PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn. Thí sinh trả lời từ câu 1 đến câu ${questionCount}.`;
                    case 2:
                      return `PHẦN II. Câu trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu ${questionCount}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.`;
                    case 3:
                      return `PHẦN III. Câu trắc nghiệm trả lời ngắn. Thí sinh trả lời từ câu 1 đến câu ${questionCount}.`;
                    default:
                      return part.part;
                  }
                };

                const questionCount = part.questions?.length || 0;

                return [
                  // Part title with description
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: getPartDescription(partIndex, questionCount),
                        bold: true,
                        size: 24,
                      }),
                    ],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                  }),

                  // Questions in this part
                  ...part.questions
                    ?.map((question: any, index: number) => {
                      const questionFontSize = 22; // Font size 11pt (22 half-points) cho cả câu hỏi và đáp án

                      return [
                        // Question text
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Câu ${
                                question.questionNumber || index + 1
                              }:`,
                              size: questionFontSize,
                              bold: true, // Tô đậm phần "Câu X:"
                            }),
                            new TextRun({
                              text: ` `,
                              size: questionFontSize,
                            }),
                            ...parseHtmlText(
                              question.question || "",
                              questionFontSize
                            ),
                          ],
                          spacing: { before: 200, after: 100 },
                        }),

                        // Options/Statements - xử lý cả options và statements
                        ...(question.options
                          ? Object.entries(question.options).map(
                              ([key, value]: [string, any]) =>
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${key}. `,
                                      size: questionFontSize,
                                      bold: false,
                                    }),
                                    ...parseHtmlText(
                                      value || "",
                                      questionFontSize
                                    ),
                                  ],
                                  spacing: { after: 50 },
                                  indent: { left: 400 },
                                })
                            )
                          : question.statements
                          ? Object.entries(question.statements).map(
                              ([key, statement]: [string, any]) =>
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${key}) `,
                                      size: questionFontSize,
                                      bold: false,
                                    }),
                                    ...parseHtmlText(
                                      statement.text || statement || "",
                                      questionFontSize
                                    ),
                                  ],
                                  spacing: { after: 50 },
                                  indent: { left: 400 },
                                })
                            )
                          : []),
                      ];
                    })
                    .flat(),
                ];
              })
              .flat() || []),
          ],
        },
      ],
    });

    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const fileName = `${examData.examTitle || "De_thi"}_${
      examData.examCode || "Ma_de"
    }.docx`;
    saveAs(blob, fileName);

    toast.success("Tải xuống thành công!");
  } catch (error) {
    console.error("Error generating DOCX:", error);
    toast.error("Có lỗi xảy ra khi tạo file DOCX");
    throw error;
  }
};

/**
 * Utility function to download all exams as DOCX files
 * @param examResults - Array of exam results to download
 * @param delay - Delay between downloads in milliseconds (default: 500ms)
 */
export const downloadAllExamsAsDocx = async (
  examResults: any[],
  delay: number = 500
) => {
  if (!examResults || examResults.length === 0) {
    toast.error("Không có đề thi nào để tải xuống");
    return;
  }

  try {
    for (let i = 0; i < examResults.length; i++) {
      await downloadExamAsDocx(examResults[i].questionOnly);
      // Add a small delay between downloads to avoid overwhelming the browser
      if (i < examResults.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    toast.success(`Đã tải xuống ${examResults.length} đề thi thành công!`);
  } catch (error) {
    console.error("Error downloading all exams:", error);
    toast.error("Có lỗi xảy ra khi tải xuống tất cả đề thi");
    throw error;
  }
};

/**
 * Utility function to generate and download answer key as DOCX
 * @param answerData - The answer key data to be converted to DOCX
 */
export const downloadAnswerKeyAsDocx = async (answerData: any) => {
  try {
    if (!answerData) {
      toast.error("Không có dữ liệu đáp án để tải xuống");
      return;
    }
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1134, // 2cm
                right: 1134, // 2cm
                bottom: 1134, // 2cm
                left: 1134, // 2cm
              },
            },
          },
          children: [
            // Header table - matching exam format
            new Table({
              rows: [
                new TableRow({
                  children: [
                    // Left column: Ministry info
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "SỞ GIÁO DỤC VÀ ĐÀO TẠO",
                              bold: true,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "ĐÁP ÁN CHÍNH THỨC",
                              bold: true,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 120 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `(Đáp án có 02 trang)`,
                              size: 20,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 120 },
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NIL, size: 0 },
                        bottom: { style: BorderStyle.NIL, size: 0 },
                        left: { style: BorderStyle.NIL, size: 0 },
                        right: { style: BorderStyle.NIL, size: 0 },
                      },
                    }),
                    // Right column: Answer key title and subject
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text:
                                answerData.examTitle ||
                                "KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG NĂM 2025",
                              bold: true,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Môn thi: ${
                                answerData?.subject || "HÓA HỌC"
                              }`,
                              bold: false,
                              size: 22,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 60 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Mã đề: ${answerData.examCode || "0314"}`,
                              size: 20,
                              bold: true,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 60 },
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NIL, size: 0 },
                        bottom: { style: BorderStyle.NIL, size: 0 },
                        left: { style: BorderStyle.NIL, size: 0 },
                        right: { style: BorderStyle.NIL, size: 0 },
                      },
                    }),
                  ],
                }),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NIL, size: 0 },
                bottom: { style: BorderStyle.NIL, size: 0 },
                left: { style: BorderStyle.NIL, size: 0 },
                right: { style: BorderStyle.NIL, size: 0 },
                insideHorizontal: { style: BorderStyle.NIL, size: 0 },
                insideVertical: { style: BorderStyle.NIL, size: 0 },
              },
            }),

            // Empty line after header table
            new Paragraph({
              text: "",
              spacing: { after: 240 },
            }),

            // Process each part
            ...(answerData.parts?.flatMap((part: any, partIndex: number) => [
              // Part header
              new Paragraph({
                children: [
                  new TextRun({
                    text: part.part || `PHẦN ${partIndex + 1}`,
                    size: 24,
                    bold: true,
                  }),
                ],
                spacing: { before: 200, after: 100 },
              }),

              // Create answer table for each part
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                },
                rows: [
                  // Table header
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "Câu",
                                size: 20,
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                        width: { size: 15, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "Đáp án",
                                size: 20,
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                        width: { size: 85, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                  // Answer rows
                  ...part.questions.map(
                    (question: any) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text:
                                      question.questionNumber?.toString() || "",
                                    size: 20,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: formatAnswerForDisplay(
                                      question,
                                      partIndex
                                    ),
                                    size: 20,
                                    bold: true,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                ],
              }),
              new Paragraph({
                text: "",
                spacing: { after: 200 },
              }),
            ]) || []),
          ],
        },
      ],
    });

    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const fileName = `DAP_AN_${answerData.examTitle || "De_thi"}_${
      answerData.examCode || "Ma_de"
    }.docx`;
    saveAs(blob, fileName);

    toast.success("Tải xuống đáp án thành công!");
  } catch (error) {
    console.error("Error generating answer key DOCX:", error);
    toast.error("Có lỗi xảy ra khi tạo file đáp án");
    throw error;
  }
};

/**
 * Format answer for display based on part type
 */
const formatAnswerForDisplay = (question: any, partIndex: number): string => {
  switch (partIndex) {
    case 0: // PHẦN I - Multiple choice
      return question.answer || "";
    case 1: // PHẦN II - True/False
      if (question.statements) {
        return Object.entries(question.statements)
          .map(
            ([key, value]: [string, any]) =>
              `${key.toUpperCase()}: ${value ? "Đúng" : "Sai"}`
          )
          .join(", ");
      }
      return "";
    case 2: // PHẦN III - Short answer
      return question.answer || "";
    default:
      return question.answer || "";
  }
};

/**
 * Format answer for table display - simplified format for the table
 */
const formatAnswerForTableDisplay = (question: any, partIndex: number): string => {
  switch (partIndex) {
    case 0: // PHẦN I - Multiple choice (A, B, C, D)
      return question.answer || "";
    case 1: // PHẦN II - True/False (D,S,S,D format)
      if (question.statements) {
        return Object.entries(question.statements)
          .map(([, value]: [string, any]) => value ? "D" : "S")
          .join(",");
      }
      return "";
    case 2: // PHẦN III - Short answer (số)
      return question.answer || "";
    default:
      return question.answer || "";
  }
};

/**
 * Utility function to download all answer keys as a single table DOCX file (landscape A4)
 * @param examResults - Array of exam results with answer keys
 */
export const downloadAllAnswerKeysAsTableDocx = async (examResults: any[]) => {
  if (!examResults || examResults.length === 0) {
    toast.error("Không có đáp án nào để tải xuống");
    return;
  }

  try {
    // Organize questions by parts and question numbers
    const partQuestions = new Map<number, Map<number, { [examCode: string]: string }>>();
    const examCodes: string[] = [];

    // Process each exam result
    examResults.forEach((examResult) => {
      const answerData = examResult.answerOnly;
      const examCode = answerData.examCode || "Unknown";
      if (!examCodes.includes(examCode)) {
        examCodes.push(examCode);
      }

      // Process each part
      answerData.parts?.forEach((part: any, partIndex: number) => {
        if (!partQuestions.has(partIndex)) {
          partQuestions.set(partIndex, new Map());
        }

        const partMap = partQuestions.get(partIndex)!;

        part.questions?.forEach((question: any, questionIndex: number) => {
          const questionNumber = questionIndex + 1; // Use 1-based indexing within each part
          if (!partMap.has(questionNumber)) {
            partMap.set(questionNumber, {});
          }

          const answerText = formatAnswerForTableDisplay(question, partIndex);
          partMap.get(questionNumber)![examCode] = answerText;
        });
      });
    });

    // Sort parts and questions
    const sortedParts = Array.from(partQuestions.entries()).sort(([a], [b]) => a - b);

    // Create document with landscape orientation
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
              margin: {
                top: 567, // 1cm
                right: 567, // 1cm
                bottom: 567, // 1cm
                left: 567, // 1cm
              },
            },
          },
          children: [
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "BẢNG ĐÁP ÁN TẤT CẢ CÁC ĐỀ",
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Create tables for each part
            ...sortedParts.flatMap(([partIndex, questionsMap]) => {
              const partName = partIndex === 0 ? "PHẦN I" : partIndex === 1 ? "PHẦN II" : "PHẦN III";
              const sortedQuestions = Array.from(questionsMap.entries()).sort(([a], [b]) => a - b);

              return [
                // Part title
                new Paragraph({
                  children: [
                    new TextRun({
                      text: partName,
                      bold: true,
                      size: 24,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 300, after: 200 },
                }),

                // Part table
                new Table({
                  width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                  },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 2 },
                    bottom: { style: BorderStyle.SINGLE, size: 2 },
                    left: { style: BorderStyle.SINGLE, size: 2 },
                    right: { style: BorderStyle.SINGLE, size: 2 },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                  },
                  rows: [
                    // Header row
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({
                                  text: "Câu/Đề",
                                  size: 20,
                                  bold: true,
                                }),
                              ],
                            }),
                          ],
                          width: { size: 10, type: WidthType.PERCENTAGE },
                        }),
                        ...examCodes.map(examCode =>
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: examCode,
                                    size: 20,
                                    bold: true,
                                  }),
                                ],
                              }),
                            ],
                            width: { size: 90 / examCodes.length, type: WidthType.PERCENTAGE },
                          })
                        ),
                      ],
                    }),
                    // Answer rows for this part
                    ...sortedQuestions.map(([questionNumber, answers]) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: questionNumber.toString(),
                                    size: 20,
                                    bold: true,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          ...examCodes.map(examCode =>
                            new TableCell({
                              children: [
                                new Paragraph({
                                  alignment: AlignmentType.CENTER,
                                  children: [
                                    new TextRun({
                                      text: answers[examCode] || "",
                                      size: 20,
                                    }),
                                  ],
                                }),
                              ],
                            })
                          ),
                        ],
                      })
                    ),
                  ],
                }),

                // Add spacing after each part table
                new Paragraph({
                  text: "",
                  spacing: { after: 300 },
                }),
              ];
            }),
          ],
        },
      ],
    });

    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const fileName = `BANG_DAP_AN_TAT_CA_DE.docx`;
    saveAs(blob, fileName);

    toast.success("Tải xuống bảng đáp án thành công!");
  } catch (error) {
    console.error("Error generating answer table DOCX:", error);
    toast.error("Có lỗi xảy ra khi tạo bảng đáp án");
    throw error;
  }
};

/**
 * Utility function to download all answer keys as DOCX files
 * @param examResults - Array of exam results with answer keys
 * @param delay - Delay between downloads in milliseconds (default: 500ms)
 */
export const downloadAllAnswerKeysAsDocx = async (
  examResults: any[],
  delay: number = 500
) => {
  if (!examResults || examResults.length === 0) {
    toast.error("Không có đáp án nào để tải xuống");
    return;
  }

  try {
    for (let i = 0; i < examResults.length; i++) {
      await downloadAnswerKeyAsDocx(examResults[i].answerOnly);
      // Add a small delay between downloads to avoid overwhelming the browser
      if (i < examResults.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    toast.success(`Đã tải xuống ${examResults.length} đáp án thành công!`);
  } catch (error) {
    console.error("Error downloading all answer keys:", error);
    toast.error("Có lỗi xảy ra khi tải xuống tất cả đáp án");
    throw error;
  }
};
