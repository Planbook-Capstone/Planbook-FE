import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Footer,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

export interface ExamQuestion {
  question: string;
  options: string[] | Record<string, string>;
  illustrationImage?: string;
}

export interface YesNoQuestion {
  question: string;
  statements: {
    a: { text: string };
    b: { text: string };
    c: { text: string };
    d: { text: string };
  };
  illustrationImage?: string;
}

export interface ShortQuestion {
  question: string;
  illustrationImage?: string;
}

export interface ExamData {
  examTitle: string;
  examSubject: string;
  examTime: string;
  examDate: string;
  examCode?: string;
  atomic_masses?: string | null;
  questions: ExamQuestion[];
  yesNoQuestions: YesNoQuestion[];
  shortQuestions: ShortQuestion[];
}

/**
 * Convert image to PNG format for DOCX compatibility
 */
const convertImageToPNG = async (
  imageSrc: string
): Promise<ArrayBuffer | null> => {
  try {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
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
        }, "image/png");
      };

      img.onerror = () => {
        console.error("Failed to load image:", imageSrc);
        resolve(null);
      };

      // Handle CORS for external images
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
    });
  } catch (error) {
    console.error("Error converting image to PNG:", error);
    return null;
  }
};

/**
 * Create header paragraphs for the exam - matching the updated preview format exactly
 */
const createExamHeader = (examData: ExamData): (Paragraph | Table)[] => {
  return [
    // Create table for header layout - 2 columns (ministry info + exam title)
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
                      text: "BỘ GIÁO DỤC VÀ ĐÀO TẠO",
                      bold: true,
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "ĐỀ THI CHÍNH THỨC",
                      bold: true,
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "(Đề thi có 04 trang)",
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120 },
                }),
              ],
              width: { size: 30, type: WidthType.PERCENTAGE },
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
                        examData.examTitle ||
                        "KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG NĂM 2025",
                      bold: true,
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Môn thi: ${examData.examSubject}`,
                      bold: true,
                      size: 22,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Thời gian làm bài ${examData.examTime}`,
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60 },
                }),
              ],
              width: { size: 70, type: WidthType.PERCENTAGE },
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
                top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
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
  ];
};

/**
 * Create atomic masses section
 */
const createAtomicMassesSection = (
  atomic_masses: string | null
): Paragraph[] => {
  if (!atomic_masses) return [];

  return [
    new Paragraph({
      text: "",
      spacing: { after: 240 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: atomic_masses,
          italics: true,
          size: 24,
        }),
      ],
      spacing: { after: 240 },
    }),
  ];
};

/**
 * Create multiple choice questions section
 */
const createMultipleChoiceSection = async (
  questions: ExamQuestion[]
): Promise<Paragraph[]> => {
  if (questions.length === 0) return [];

  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "",
      spacing: { after: 240 },
    }),
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
  ];

  const questionParagraphs = await Promise.all(
    questions.map(async (question, index) => {
      const questionParagraphs: Paragraph[] = [
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
          console.log(
            "🖼️ Processing image for DOCX:",
            question.illustrationImage.substring(0, 50)
          );

          const imageBuffer = await convertImageToPNG(
            question.illustrationImage
          );

          if (imageBuffer) {
            console.log(
              "✅ Image buffer created, size:",
              imageBuffer.byteLength
            );

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
        question.options.forEach((option: string, optIndex: number) => {
          questionParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${String.fromCharCode(65 + optIndex)}. ${option}`,
                  size: 22,
                }),
              ],
            })
          );
        });
      } else if (question.options && typeof question.options === "object") {
        Object.entries(question.options).forEach(([key, value]) => {
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
        });
      }

      questionParagraphs.push(new Paragraph({ text: "" })); // Empty line
      return questionParagraphs;
    })
  );

  paragraphs.push(...questionParagraphs.flat());
  return paragraphs;
};

/**
 * Create yes/no questions section
 */
const createYesNoSection = async (
  yesNoQuestions: YesNoQuestion[],
  questionsOffset: number
): Promise<Paragraph[]> => {
  if (yesNoQuestions.length === 0) return [];

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: "PHẦN II: ĐÚNG/SAI",
          bold: true,
          size: 28,
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 240 },
    }),
  ];

  const questionParagraphs = await Promise.all(
    yesNoQuestions.map(async (question, index) => {
      const questionParagraphs: Paragraph[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: `Câu ${questionsOffset + index + 1}: ${question.question}`,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 120 },
        }),
      ];

      // Add image if exists
      if (question.illustrationImage) {
        try {
          console.log(
            "🖼️ Processing image for Yes/No question:",
            question.illustrationImage.substring(0, 50)
          );

          const imageBuffer = await convertImageToPNG(
            question.illustrationImage
          );

          if (imageBuffer) {
            console.log(
              "✅ Image buffer created, size:",
              imageBuffer.byteLength
            );

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
                spacing: { after: 120 },
              })
            );

            console.log("✅ Image added to Yes/No question");
          } else {
            console.error("❌ Failed to create image buffer");
          }
        } catch (error) {
          console.error("❌ Error adding image to Yes/No question:", error);
        }
      }

      // Add statements with proper indentation
      questionParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `a) ${question.statements.a.text}`,
              size: 22,
            }),
          ],
          indent: { left: 720 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `b) ${question.statements.b.text}`,
              size: 22,
            }),
          ],
          indent: { left: 720 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `c) ${question.statements.c.text}`,
              size: 22,
            }),
          ],
          indent: { left: 720 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `d) ${question.statements.d.text}`,
              size: 22,
            }),
          ],
          indent: { left: 720 },
        }),
        new Paragraph({
          text: "",
          spacing: { after: 240 },
        })
      );

      return questionParagraphs;
    })
  );

  paragraphs.push(...questionParagraphs.flat());
  return paragraphs;
};

/**
 * Create short answer questions section
 */
const createShortAnswerSection = async (
  shortQuestions: ShortQuestion[],
  questionsOffset: number
): Promise<Paragraph[]> => {
  if (shortQuestions.length === 0) return [];

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: "PHẦN III: TỰ LUẬN",
          bold: true,
          size: 28,
        }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { after: 240 },
    }),
  ];

  const questionParagraphs = await Promise.all(
    shortQuestions.map(async (question, index) => {
      const questionParagraphs: Paragraph[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: `Câu ${questionsOffset + index + 1}: ${question.question}`,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 120 },
        }),
      ];

      // Add image if exists
      if (question.illustrationImage) {
        try {
          console.log(
            "🖼️ Processing image for Short question:",
            question.illustrationImage.substring(0, 50)
          );

          const imageBuffer = await convertImageToPNG(
            question.illustrationImage
          );

          if (imageBuffer) {
            console.log(
              "✅ Image buffer created, size:",
              imageBuffer.byteLength
            );

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
                spacing: { after: 120 },
              })
            );

            console.log("✅ Image added to Short question");
          } else {
            console.error("❌ Failed to create image buffer");
          }
        } catch (error) {
          console.error("❌ Error adding image to Short question:", error);
        }
      }

      // Add answer lines
      // questionParagraphs.push(
      //   new Paragraph({
      //     children: [
      //       new TextRun({
      //         text: "................................................................................................................................................................................................",
      //         size: 22,
      //       }),
      //     ],
      //   }),
      //   new Paragraph({
      //     children: [
      //       new TextRun({
      //         text: "................................................................................................................................................................................................",
      //         size: 22,
      //       }),
      //     ],
      //   }),
      //   new Paragraph({
      //     children: [
      //       new TextRun({
      //         text: "................................................................................................................................................................................................",
      //         size: 22,
      //       }),
      //     ],
      //   }),
      //   new Paragraph({
      //     text: "",
      //     spacing: { after: 240 }
      //   })
      // );

      return questionParagraphs;
    })
  );

  paragraphs.push(...questionParagraphs.flat());
  return paragraphs;
};

/**
 * Generate and download DOCX file for exam
 */
export const generateExamDocx = async (examData: ExamData): Promise<void> => {
  try {
    // Create document sections
    const headerParagraphs = createExamHeader(examData);
    const atomicMassesParagraphs = createAtomicMassesSection(
      examData.atomic_masses || null
    );
    const multipleChoiceParagraphs = await createMultipleChoiceSection(
      examData.questions
    );
    const yesNoParagraphs = await createYesNoSection(
      examData.yesNoQuestions,
      examData.questions.length
    );
    const shortAnswerParagraphs = await createShortAnswerSection(
      examData.shortQuestions,
      examData.questions.length + examData.yesNoQuestions.length
    );

    // Combine all sections
    const allElements = [
      ...headerParagraphs,
      ...atomicMassesParagraphs,
      ...multipleChoiceParagraphs,
      ...yesNoParagraphs,
      ...shortAnswerParagraphs,
    ];

    // Create document with page numbering
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
                      children: [PageNumber.CURRENT],
                      size: 22,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
            }),
          },
          children: allElements,
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exam-test.docx`;
    // link.download = `${examData.examTitle.replace(
    //   /\s+/g,
    //   "_"
    // )}_${new Date().getTime()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("✅ DOCX file generated and downloaded successfully");
  } catch (error) {
    console.error("❌ Error generating DOCX:", error);
    throw new Error("Có lỗi xảy ra khi xuất file DOCX. Vui lòng thử lại.");
  }
};
