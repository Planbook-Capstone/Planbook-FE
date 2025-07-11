import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, Footer, PageNumber } from "docx";
import { saveAs } from "file-saver";

interface CellContent {
  text?: string;
  image?: {
    url: string;
    name?: string;
  };
}

interface TableData {
  headers: string[];
  rows: (string | CellContent)[][];
}

interface DemoNode {
  id: string;
  lessonPlanId?: number;
  parentId?: string | null;
  title: string;
  content: string;
  fieldType: "INPUT" | "TABLE" | "IMAGE";
  type: "PARAGRAPH" | "LIST_ITEM" | "TABLE" | "IMAGE" | "SECTION" | "SUBSECTION";
  orderIndex: number;
  metadata?: any;
  status: "ACTIVE" | "DELETED";
  children: DemoNode[];
  tableData?: TableData;
}

interface LessonPlanHeader {
  school?: string;
  department?: string;
  subject?: string;
  grade?: string;
  lessonTitle?: string;
  duration?: string;
  teacherName?: string;
}

const createLessonPlanHeader = (headerInfo: LessonPlanHeader = {}) => {
  const {
    school = "Trường:.....................",
    department = "Tổ:..............................",
    subject = "Môn học/Hoạt động giáo dục: ..........",
    grade = "lớp:........",
    lessonTitle = "TÊN BÀI DẠY: ................................................",
    duration = "Thời gian thực hiện: (số tiết)",
    teacherName = "Họ và tên giáo viên:\n................................"
  } = headerInfo;

  return [
    // Header section
    new Paragraph({
      children: [
        new TextRun({
          text: "Phụ lục IV",
          bold: true,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "KHUNG KẾ HOẠCH BÀI DẠY",
          bold: true,
          size: 32,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "(Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)",
          italic: true,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),

    // School and teacher info table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: "none", size: 0, color: "FFFFFF" },
        bottom: { style: "none", size: 0, color: "FFFFFF" },
        left: { style: "none", size: 0, color: "FFFFFF" },
        right: { style: "none", size: 0, color: "FFFFFF" },
        insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
        insideVertical: { style: "none", size: 0, color: "FFFFFF" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: school, size: 24 })],
                }),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: "none", size: 0, color: "FFFFFF" },
                bottom: { style: "none", size: 0, color: "FFFFFF" },
                left: { style: "none", size: 0, color: "FFFFFF" },
                right: { style: "none", size: 0, color: "FFFFFF" },
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: teacherName, size: 24 })],
                }),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: "none", size: 0, color: "FFFFFF" },
                bottom: { style: "none", size: 0, color: "FFFFFF" },
                left: { style: "none", size: 0, color: "FFFFFF" },
                right: { style: "none", size: 0, color: "FFFFFF" },
              },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: department, size: 24 })],
                }),
              ],
              borders: {
                top: { style: "none", size: 0, color: "FFFFFF" },
                bottom: { style: "none", size: 0, color: "FFFFFF" },
                left: { style: "none", size: 0, color: "FFFFFF" },
                right: { style: "none", size: 0, color: "FFFFFF" },
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "................................", size: 24 })],
                }),
              ],
              borders: {
                top: { style: "none", size: 0, color: "FFFFFF" },
                bottom: { style: "none", size: 0, color: "FFFFFF" },
                left: { style: "none", size: 0, color: "FFFFFF" },
                right: { style: "none", size: 0, color: "FFFFFF" },
              },
            }),
          ],
        }),
      ],
    }),

    // Lesson title
    new Paragraph({
      children: [
        new TextRun({
          text: lessonTitle,
          bold: true,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
    }),

    // Subject and duration
    new Paragraph({
      children: [
        new TextRun({
          text: `${subject} ${grade}`,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: duration,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }),
  ];
};

export const generateDocx = async (data: DemoNode[], filename: string = "document.docx", headerInfo?: LessonPlanHeader) => {
  const children: any[] = [];

  // Add lesson plan header
  children.push(...createLessonPlanHeader(headerInfo));

  const processNode = (node: DemoNode, depth: number = 0): any[] => {
    const elements: any[] = [];

    switch (node.type) {
      case "SECTION":
        // Add section title
        if (node.title) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.title,
                  bold: true,
                  size: 32, // 16pt
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: {
                after: 240, // 12pt
                before: 240,
              },
            })
          );
        }

        // Add section content
        if (node.content) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.content,
                  size: 24, // 12pt
                }),
              ],
              spacing: {
                after: 120, // 6pt
              },
            })
          );
        }

        // Process children
        if (node.children && node.children.length > 0) {
          node.children
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach(child => {
              elements.push(...processNode(child, depth));
            });
        }
        break;

      case "SUBSECTION":
        // Add subsection title
        if (node.title) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.title,
                  bold: true,
                  size: 28, // 14pt
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: {
                after: 120, // 6pt
                before: 240, // 12pt
              },
            })
          );
        }

        // Add subsection content
        if (node.content) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.content,
                  size: 24, // 12pt
                }),
              ],
              spacing: {
                after: 120, // 6pt
              },
            })
          );
        }

        // Process children with indentation
        if (node.children && node.children.length > 0) {
          node.children
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach(child => {
              elements.push(...processNode(child, depth + 1));
            });
        }
        break;

      case "PARAGRAPH":
        // Add paragraph title if it's not default
        if (node.title && node.title !== "Mới: Text/Paragraph") {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.title,
                  bold: true,
                  size: 26, // 13pt
                }),
              ],
              spacing: {
                after: 60, // 3pt
                before: 120, // 6pt
              },
            })
          );
        }

        // Add paragraph content
        if (node.content) {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.content,
                  size: 24, // 12pt
                }),
              ],
              spacing: {
                after: 120, // 6pt
              },
              indent: {
                left: depth * 360, // Indent based on depth
              },
            })
          );
        }

        // Process children
        if (node.children && node.children.length > 0) {
          node.children
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach(child => {
              elements.push(...processNode(child, depth + 1));
            });
        }
        break;

      case "LIST_ITEM":
        // Create list item
        const listText = `${node.title || "Item"}: ${node.content || ""}`;
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: listText,
                size: 24, // 12pt
              }),
            ],
            bullet: {
              level: depth,
            },
            spacing: {
              after: 60, // 3pt
            },
            indent: {
              left: depth * 360,
            },
          })
        );

        // Process children
        if (node.children && node.children.length > 0) {
          node.children
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach(child => {
              elements.push(...processNode(child, depth + 1));
            });
        }
        break;

      case "TABLE":
        // Add table title if it's not default
        if (node.title && node.title !== "Mới: Table") {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.title,
                  bold: true,
                  size: 26, // 13pt
                }),
              ],
              spacing: {
                after: 60, // 3pt
                before: 120, // 6pt
              },
            })
          );
        }

        // Get table data
        const tableData = node.tableData || {
          headers: ["Cột 1", "Cột 2"],
          rows: [
            ["", ""],
            ["", ""]
          ]
        };

        // Create table rows
        const tableRows = [
          // Header row
          new TableRow({
            children: tableData.headers.map(header =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: header,
                        bold: true,
                        size: 24,
                      }),
                    ],
                  }),
                ],
              })
            ),
          }),
          // Data rows
          ...tableData.rows.map(row =>
            new TableRow({
              children: row.map(cell => {
                let cellText = '';
                if (typeof cell === 'string') {
                  cellText = cell;
                } else if (cell && typeof cell === 'object') {
                  if ('text' in cell && 'image' in cell) {
                    // New CellContent format
                    if (cell.image) {
                      cellText = `[Hình ảnh: ${cell.image.name || 'image'}]`;
                    } else {
                      cellText = cell.text || '';
                    }
                  } else if ('type' in cell && 'content' in cell) {
                    // Old format compatibility
                    cellText = cell.type === 'image' ? `[Hình ảnh: ${cell.content}]` : cell.content;
                  }
                }

                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cellText,
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                });
              }),
            })
          )
        ];

        // Create table
        const table = new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: tableRows,
        });

        elements.push(table);

        // Add spacing after table
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: "", size: 24 })],
            spacing: { after: 120 },
          })
        );

        // Process children
        if (node.children && node.children.length > 0) {
          node.children
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach(child => {
              elements.push(...processNode(child, depth + 1));
            });
        }
        break;

      case "IMAGE":
        // Add image placeholder
        if (node.title && node.title !== "Mới: Image") {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: node.title,
                  bold: true,
                  size: 26, // 13pt
                }),
              ],
              spacing: {
                after: 60, // 3pt
                before: 120, // 6pt
              },
            })
          );
        }

        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "[Image Placeholder]",
                italics: true,
                size: 24,
              }),
            ],
            spacing: {
              after: 120, // 6pt
            },
            indent: {
              left: depth * 360,
            },
          })
        );

        // Process children
        if (node.children && node.children.length > 0) {
          node.children
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .forEach(child => {
              elements.push(...processNode(child, depth + 1));
            });
        }
        break;

      default:
        break;
    }

    return elements;
  };

  // Process all nodes
  data
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach(node => {
      children.push(...processNode(node, 0));
    });

  // Create document with header and footer
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
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        children: children.length > 0 ? children : [
          new Paragraph({
            children: [
              new TextRun({
                text: "Không có nội dung để xuất",
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Generate and save
  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw error;
  }
};
