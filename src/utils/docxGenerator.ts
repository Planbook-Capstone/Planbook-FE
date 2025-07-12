import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, Footer, PageNumber, ImageRun } from "docx";
import { saveAs } from "file-saver";

// Utility function to convert image URL to buffer
const convertImageToBuffer = async (imageUrl: string): Promise<ArrayBuffer | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error("Failed to fetch image:", response.statusText);
      return null;
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error converting image to buffer:", error);
    return null;
  }
};

// Helper function to parse HTML and create TextRun array with formatting
const parseHtmlToTextRuns = (html: string): any[] => {
  if (!html || typeof html !== 'string') {
    return [new TextRun({ text: '', size: 24 })];
  }

  const textRuns: any[] = [];
  let currentText = html;

  // Handle <p> tags - convert to line breaks
  currentText = currentText.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n');

  // Split by bold tags and process each part
  const parts = currentText.split(/(<\/?(?:strong|b)[^>]*>)/gi);
  let isBold = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part.match(/<(strong|b)[^>]*>/i)) {
      isBold = true;
    } else if (part.match(/<\/(strong|b)>/i)) {
      isBold = false;
    } else if (part.trim()) {
      // Clean up remaining HTML tags
      const cleanText = part.replace(/<[^>]*>/g, '').trim();
      if (cleanText) {
        textRuns.push(new TextRun({
          text: cleanText,
          bold: isBold,
          size: 24,
        }));
      }
    }
  }

  // If no formatting was found, just return the plain text
  if (textRuns.length === 0) {
    const plainText = currentText.replace(/<[^>]*>/g, '').trim();
    if (plainText) {
      textRuns.push(new TextRun({
        text: plainText,
        size: 24,
      }));
    }
  }

  return textRuns.length > 0 ? textRuns : [new TextRun({ text: '', size: 24 })];
};

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

  const processNode = async (node: DemoNode, depth: number = 0): Promise<any[]> => {
    const elements: any[] = [];

    // Check fieldType first for special cases like TABLE
    if (node.fieldType === "TABLE") {
      console.log("🎯 Processing TABLE fieldType node:", node.id);
      // Handle TABLE fieldType regardless of node.type - jump to TABLE case
      node = { ...node, type: "TABLE" as any };
    }

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
          for (const child of node.children.sort((a, b) => a.orderIndex - b.orderIndex)) {
            const childElements = await processNode(child, depth);
            elements.push(...childElements);
          }
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
          for (const child of node.children.sort((a, b) => a.orderIndex - b.orderIndex)) {
            const childElements = await processNode(child, depth + 1);
            elements.push(...childElements);
          }
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
          for (const child of node.children.sort((a, b) => a.orderIndex - b.orderIndex)) {
            const childElements = await processNode(child, depth + 1);
            elements.push(...childElements);
          }
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
          for (const child of node.children.sort((a, b) => a.orderIndex - b.orderIndex)) {
            const childElements = await processNode(child, depth + 1);
            elements.push(...childElements);
          }
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

        // Handle both old and new table data formats
        let tableData: TableData;

        console.log("📋 Processing table node:", {
          nodeId: node.id,
          hasTableData: !!node.tableData,
          hasContent: !!node.content,
          contentType: typeof node.content
        });

        // First try to parse from content field (new rich table format)
        if (node.content && typeof node.content === 'string') {
          try {
            const parsedContent = JSON.parse(node.content);
            console.log("📋 Parsing rich table data for DOCX:", parsedContent);

            if (parsedContent.rows && Array.isArray(parsedContent.rows)) {
              // Extract headers from cells with isHeader: true
              const headerRow = parsedContent.rows.find((row: any) =>
                row.cells && row.cells.some((cell: any) => cell.isHeader)
              );

              const headers = headerRow ?
                headerRow.cells
                  .filter((cell: any) => cell.isHeader)
                  .map((cell: any) => {
                    const title = cell.title || cell.content || "";
                    return title.replace(/<[^>]*>/g, "").trim();
                  })
                : ["Cột 1", "Cột 2"];

              // Extract data rows (cells without isHeader or isHeader: false)
              const dataRows = parsedContent.rows
                .filter((row: any) =>
                  row.cells && !row.cells.some((cell: any) => cell.isHeader)
                )
                .map((row: any) =>
                  row.cells.map((cell: any) => {
                    // Combine title and content, preserve HTML formatting info
                    const title = cell.title || "";
                    const content = cell.content || "";
                    let combined = "";

                    if (title && content) {
                      combined = `${title}\n${content}`;
                    } else {
                      combined = title || content;
                    }

                    // Parse HTML and return object with text and formatting
                    return parseHtmlToTextRuns(combined);
                  })
                );

              tableData = {
                headers,
                rows: dataRows,
              };

              console.log("✅ Converted rich table to DOCX format:", {
                headers,
                dataRowsCount: dataRows.length,
                firstRow: dataRows[0]
              });
            } else {
              throw new Error("Invalid rich table format");
            }
          } catch (error) {
            console.error("❌ Error parsing rich table data:", error);
            // Fallback to tableData field or default
            tableData = node.tableData || {
              headers: ["Cột 1", "Cột 2"],
              rows: [["", ""], ["", ""]],
            };
          }
        }
        // Fallback to tableData field (old format) if content parsing failed
        else if (node.tableData && node.tableData.headers && node.tableData.rows) {
          console.log("📋 Using tableData field as fallback:", node.tableData);
          tableData = node.tableData;
        }
        // Use default if no data available
        else {
          console.log("📋 Using default table data");
          tableData = {
            headers: ["Cột 1", "Cột 2"],
            rows: [["", ""], ["", ""]],
          };
        }

        // Calculate equal column widths
        const totalWidth = 9000; // Total table width in DXA units (about 5 inches)
        const columnWidth = Math.floor(totalWidth / tableData.headers.length);

        console.log(`📏 Setting equal column widths: ${tableData.headers.length} columns, ${columnWidth} DXA each`);

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
                width: {
                  size: columnWidth,
                  type: WidthType.DXA,
                },
              })
            ),
          }),
          // Data rows
          ...tableData.rows.map(row =>
            new TableRow({
              children: row.map(cell => {
                let cellTextRuns: any[] = [];

                if (typeof cell === 'string') {
                  // Parse HTML string to TextRuns with formatting
                  cellTextRuns = parseHtmlToTextRuns(cell);
                } else if (Array.isArray(cell)) {
                  // Already parsed TextRuns array
                  cellTextRuns = cell;
                } else if (cell && typeof cell === 'object') {
                  if ('text' in cell && 'image' in cell) {
                    // New CellContent format
                    if (cell.image) {
                      cellTextRuns = [new TextRun({
                        text: `[Hình ảnh: ${cell.image.name || 'image'}]`,
                        size: 24,
                      })];
                    } else {
                      cellTextRuns = parseHtmlToTextRuns(cell.text || '');
                    }
                  } else if ('type' in cell && 'content' in cell) {
                    // Old format compatibility
                    const text = cell.type === 'image' ? `[Hình ảnh: ${cell.content}]` : cell.content;
                    cellTextRuns = parseHtmlToTextRuns(text);
                  }
                }

                // Ensure we have at least one TextRun
                if (cellTextRuns.length === 0) {
                  cellTextRuns = [new TextRun({ text: '', size: 24 })];
                }

                return new TableCell({
                  children: [
                    new Paragraph({
                      children: cellTextRuns,
                    }),
                  ],
                  width: {
                    size: columnWidth,
                    type: WidthType.DXA,
                  },
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
          for (const child of node.children.sort((a, b) => a.orderIndex - b.orderIndex)) {
            const childElements = await processNode(child, depth + 1);
            elements.push(...childElements);
          }
        }
        break;

      case "IMAGE":
        // Add image title
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

        // Add actual image or placeholder
        if (node.content) {
          try {
            // Try to add actual image
            const imageBuffer = await convertImageToBuffer(node.content);
            if (imageBuffer) {
              elements.push(
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: new Uint8Array(imageBuffer),
                      transformation: {
                        width: 400,
                        height: 300,
                      },
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
            } else {
              // Fallback to placeholder if image loading fails
              elements.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "[Không thể tải hình ảnh]",
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
            }
          } catch (error) {
            console.error("Error adding image to DOCX:", error);
            // Fallback to placeholder
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "[Lỗi tải hình ảnh]",
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
          }
        } else {
          // No image content
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[Chưa có hình ảnh]",
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
        }

        // Process children
        if (node.children && node.children.length > 0) {
          for (const child of node.children.sort((a, b) => a.orderIndex - b.orderIndex)) {
            const childElements = await processNode(child, depth + 1);
            elements.push(...childElements);
          }
        }
        break;

      default:
        break;
    }

    return elements;
  };

  // Process all nodes
  for (const node of data.sort((a, b) => a.orderIndex - b.orderIndex)) {
    const nodeElements = await processNode(node, 0);
    children.push(...nodeElements);
  }

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
