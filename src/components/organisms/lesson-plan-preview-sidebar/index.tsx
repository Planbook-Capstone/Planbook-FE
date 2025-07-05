"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SiGoogledocs } from "react-icons/si";

interface Step {
  id: string;
  title: string;
  content?: string;
  nodeType?: string;
  order: number;
  children?: any[];
}

interface LessonPlanPreviewSidebarProps {
  steps: Step[];
  formData: Record<string, Record<string, string>>;
  getMergedComponentsForStep?: (
    stepId: string,
    staticChildren?: any[]
  ) => any[];
  isVisible: boolean;
  onToggleVisibility: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function LessonPlanPreviewSidebar({
  steps,
  formData,
  getMergedComponentsForStep,
  isVisible,
  onToggleVisibility,
  className,
  style,
}: LessonPlanPreviewSidebarProps) {
  // Export to Word function
  const handleExportWord = async () => {
    try {
      // Import docx library dynamically
      const {
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
      } = await import("docx");

      // Get general info step
      const generalInfoStep = steps.find(
        (step) =>
          step.id === "keyword-thông-tin-chung-1" ||
          step.title?.toLowerCase().includes("thông tin") ||
          step.title?.toLowerCase().includes("chung")
      );

      const getFieldValue = (stepId: string, fieldId: string): string => {
        return formData[stepId]?.[fieldId] || "";
      };

      // Create document sections
      const documentChildren: any[] = [];

      // Header section - Phụ lục IV format
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Phụ lục IV",
              size: 26,
              color: "000000",
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "KHUNG KẾ HOẠCH BÀI DẠY",
              bold: true,
              size: 26,
              color: "000000",
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "(Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)",
              size: 24,
              color: "000000",
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: "" }), // Empty line

        // Institution info
        new Paragraph({
          children: [
            new TextRun({
              text: "Tên cơ sở giáo dục: …………………………………...",
              size: 26,
              color: "000000",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Họ và tên giáo viên: …………………………………...",
              size: 26,
              color: "000000",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `TÊN BÀI DẠY: ${
                getFieldValue(
                  generalInfoStep?.id || "",
                  "keyword-lesson-title"
                ) || "…………………………………..."
              }`,
              size: 26,
              color: "000000",
              bold: true,
            }),
          ],
        }),
        new Paragraph({ text: "" }) // Empty line
      );

      // General info section
      if (generalInfoStep) {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Môn học/Hoạt động giáo dục: ${
                  getFieldValue(generalInfoStep.id, "keyword-subject") ||
                  "Hóa học"
                }; lớp: ${
                  getFieldValue(generalInfoStep.id, "keyword-grade") || "12"
                }`,
                size: 26,
                color: "000000",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Thời gian thực hiện: ${
                  getFieldValue(generalInfoStep.id, "keyword-time") ||
                  "(số tiết)"
                }`,
                size: 26,
                color: "000000",
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Empty line
          new Paragraph({ text: "" }) // Extra empty line
        );
      }

      // Add each step content
      const contentSteps = steps.filter(
        (step) => step.id !== generalInfoStep?.id
      );
      const romanNumerals = [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
      ];

      for (let i = 0; i < contentSteps.length; i++) {
        const step = contentSteps[i];
        const stepNumber = romanNumerals[i] || `${i + 1}`;
        const stepData = formData[step.id] || {};

        // Step title
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${stepNumber}. ${step.title}`,
                bold: true,
                size: 26,
                color: "000000",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
          })
        );

        // Get merged components for this step
        const components = getMergedComponentsForStep
          ? getMergedComponentsForStep(step.id, step.children || [])
          : step.children || [];

        // Add step content
        await addStepContentToDoc(components, stepData, documentChildren, 0);

        documentChildren.push(new Paragraph({ text: "" })); // Empty line between steps
      }

      // Create document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: documentChildren,
          },
        ],
      });

      // Generate and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Giao_an_${new Date().getTime()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("✅ Exported lesson plan to Word successfully");
    } catch (error) {
      console.error("Error exporting to Word:", error);
      alert("Có lỗi xảy ra khi xuất file Word. Vui lòng thử lại.");
    }
  };

  // Helper function to add step content to document
  const addStepContentToDoc = async (
    components: any[],
    stepData: Record<string, string>,
    documentChildren: any[],
    level: number = 0
  ) => {
    const { Paragraph, TextRun } = await import("docx");

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const userValue = stepData?.[component.id] || "";
      const defaultContent = component.content || component.description || "";
      const content = userValue || defaultContent;

      // Add component title and content
      if (component.title) {
        const prefix =
          level === 0
            ? `${i + 1}. `
            : level === 1
            ? `${String.fromCharCode(97 + i)}. `
            : "";

        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${prefix}${component.title}`,
                bold: true,
                size: 26,
                color: "000000",
              }),
            ],
            indent: {
              left: level * 720, // 720 twips = 0.5 inch per level
            },
          })
        );
      }

      // Handle different component types
      if (component.type === "TABLE" || component.nodeType === "TABLE") {
        // Add table to document
        await addTableToDoc(component, stepData, documentChildren);
      } else if (
        component.type === "REFERENCES" ||
        component.nodeType === "REFERENCES"
      ) {
        // Add references to document
        await addReferencesToDoc(component, stepData, documentChildren, level);
      } else if (content) {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                size: 26,
                color: "000000",
              }),
            ],
            indent: {
              left: (level + 1) * 720, // Content indented more than title
            },
          })
        );
      }

      // Add children recursively
      if (component.children && component.children.length > 0) {
        await addStepContentToDoc(
          component.children,
          stepData,
          documentChildren,
          level + 1
        );
      }
    }
  };

  // Helper function to add references to document
  const addReferencesToDoc = async (
    component: any,
    stepData: Record<string, string>,
    documentChildren: any[],
    level: number = 0
  ) => {
    const { Paragraph, TextRun, ImageRun } = await import("docx");

    // Get resource data from form data
    const resourceDataStr = stepData[component.id];
    if (!resourceDataStr) return;

    try {
      const resourceData = JSON.parse(resourceDataStr);

      if (resourceData.type === "link") {
        // Add link with description in italics
        const linkText = resourceData.description
          ? `${resourceData.description}: ${resourceData.url}`
          : resourceData.url;

        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: linkText,
                size: 26,
                color: "000000",
                italics: true,
              }),
            ],
            indent: {
              left: (level + 1) * 720,
            },
          })
        );
      } else if (resourceData.type === "image" && resourceData.file) {
        // Add image to document
        try {
          const imageBuffer = await convertFileToBuffer(resourceData.file);
          if (imageBuffer) {
            // Calculate image dimensions to maintain aspect ratio
            const { width: originalWidth, height: originalHeight } =
              await getImageDimensions(imageBuffer);
            const maxWidth = 400; // Maximum width in pixels
            const aspectRatio = originalHeight / originalWidth;

            // Calculate final dimensions
            const finalWidth = Math.min(maxWidth, originalWidth);
            const finalHeight = finalWidth * aspectRatio;

            documentChildren.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: new Uint8Array(imageBuffer),
                    transformation: {
                      width: finalWidth,
                      height: finalHeight,
                    },
                    type: getImageType(resourceData.file),
                  }),
                ],
                indent: {
                  left: (level + 1) * 720,
                },
              })
            );
          }
        } catch (error) {
          console.error("Error adding image to document:", error);
          // Add error message instead
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[Lỗi hiển thị hình ảnh]",
                  color: "FF0000",
                  size: 26,
                }),
              ],
              indent: {
                left: (level + 1) * 720,
              },
            })
          );
        }
      }
    } catch (error) {
      console.error("Error parsing resource data:", error);
    }
  };

  // Helper function to get image type
  const getImageType = (
    file: File | { name: string; size: number; type: string; base64: string }
  ): "jpg" | "png" | "gif" | "bmp" => {
    if ("base64" in file) {
      if (file.type.includes("jpeg") || file.type.includes("jpg")) {
        return "jpg";
      } else if (file.type.includes("png")) {
        return "png";
      } else if (file.type.includes("gif")) {
        return "gif";
      } else if (file.type.includes("bmp")) {
        return "bmp";
      }
    } else if (file instanceof File) {
      if (file.type.includes("jpeg") || file.type.includes("jpg")) {
        return "jpg";
      } else if (file.type.includes("png")) {
        return "png";
      } else if (file.type.includes("gif")) {
        return "gif";
      } else if (file.type.includes("bmp")) {
        return "bmp";
      }
    }
    return "png"; // default
  };

  // Helper function to get image dimensions
  const getImageDimensions = async (
    imageBuffer: ArrayBuffer
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const blob = new Blob([imageBuffer]);
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 400, height: 300 }); // Default fallback
      };

      img.src = url;
    });
  };

  // Helper function to convert file to buffer
  const convertFileToBuffer = async (
    file: File | { name: string; size: number; type: string; base64: string }
  ): Promise<ArrayBuffer | null> => {
    // Handle base64 object
    if ("base64" in file) {
      try {
        // Convert base64 to ArrayBuffer
        const base64Data = file.base64.split(",")[1]; // Remove data:image/...;base64, prefix
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      } catch (error) {
        console.error("Error converting base64 to buffer:", error);
        return null;
      }
    }

    // Handle File object
    if (file instanceof File) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => resolve(null);
        reader.readAsArrayBuffer(file);
      });
    }

    return null;
  };

  // Helper function to add table to document
  const addTableToDoc = async (
    component: any,
    stepData: Record<string, string>,
    documentChildren: any[]
  ) => {
    const { Table, TableRow, TableCell, WidthType } = await import("docx");

    try {
      // Parse table data
      const tableDataStr = stepData?.[component.id] || "";
      let tableData = null;

      if (tableDataStr) {
        try {
          tableData = JSON.parse(tableDataStr);
        } catch (e) {
          console.log("Failed to parse table data for Word export:", e);
        }
      }

      // Use default table data if no user data
      if (!tableData || !tableData.headers || !tableData.rows) {
        tableData = {
          headers: ["Header 1", "Header 2"],
          rows: [
            ["Cell 1-1", "Cell 1-2"],
            ["Cell 2-1", "Cell 2-2"],
          ],
        };
      }

      // Create table rows
      const tableRows = [];

      // Import needed classes for table creation
      const { Paragraph: TableParagraph, TextRun: TableTextRun } = await import(
        "docx"
      );

      // Header row
      tableRows.push(
        new TableRow({
          children: tableData.headers.map(
            (header: string) =>
              new TableCell({
                children: [
                  new TableParagraph({
                    children: [
                      new TableTextRun({
                        text: header,
                        bold: true,
                        size: 26,
                        color: "000000",
                      }),
                    ],
                  }),
                ],
                width: {
                  size: 100 / tableData.headers.length,
                  type: WidthType.PERCENTAGE,
                },
              })
          ),
        })
      );

      // Data rows
      tableData.rows.forEach((row: string[]) => {
        tableRows.push(
          new TableRow({
            children: row.map(
              (cell: string) =>
                new TableCell({
                  children: [
                    new TableParagraph({
                      children: [
                        new TableTextRun({
                          text: cell,
                          size: 26,
                          color: "000000",
                        }),
                      ],
                    }),
                  ],
                  width: {
                    size: 100 / row.length,
                    type: WidthType.PERCENTAGE,
                  },
                })
            ),
          })
        );
      });

      // Add table to document
      documentChildren.push(
        new Table({
          rows: tableRows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        })
      );
    } catch (error) {
      console.error("Error adding table to Word document:", error);
      // Add error message instead of table
      const { Paragraph, TextRun } = await import("docx");
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "[Lỗi hiển thị bảng]",
              color: "FF0000",
              size: 26,
            }),
          ],
        })
      );
    }
  };
  // Debug: Log formData changes
  React.useEffect(() => {
    console.log("Preview Sidebar - formData updated:", formData);
    console.log("Preview Sidebar - steps:", steps);

    // Log specific step data
    if (Object.keys(formData).length > 0) {
      Object.keys(formData).forEach((stepId) => {
        console.log(`Step ${stepId} data:`, formData[stepId]);
      });
    }

    // Log step IDs and titles for mapping
    steps.forEach((step) => {
      console.log(
        `Step mapping: ID="${step.id}", Title="${step.title}", NodeType="${step.nodeType}"`
      );
    });
  }, [formData, steps]);
  // Helper function to get form data for a specific step and keyword
  const getFieldValue = (stepId: string, keywordId: string): string => {
    return formData[stepId]?.[keywordId] || "";
  };

  // Helper function to generate keyword ID from title (matching the template pattern)
  const generateKeywordId = (title: string, order: number = 1): string => {
    return `keyword-${title.toLowerCase().replace(/\s+/g, "-")}-${order}`;
  };

  // Helper function to find field value by trying multiple ID patterns
  const findFieldValue = (stepId: string, title: string): string => {
    const stepData = formData[stepId];
    if (!stepData) return "";

    // Try different patterns to find the field
    const patterns = [
      generateKeywordId(title, 1),
      generateKeywordId(title, 2),
      generateKeywordId(title, 3),
      title.toLowerCase(),
      title,
    ];

    for (const pattern of patterns) {
      if (stepData[pattern]) {
        return stepData[pattern];
      }
    }

    // Search for keys that contain the title
    const matchingKey = Object.keys(stepData).find((key) =>
      key.toLowerCase().includes(title.toLowerCase())
    );

    return matchingKey ? stepData[matchingKey] : "";
  };

  // Helper function to render References component
  const renderReferencesComponent = (
    field: any,
    stepData: Record<string, string>
  ) => {
    try {
      const resourceDataStr = stepData[field.id];
      if (!resourceDataStr) return null;

      const resourceData = JSON.parse(resourceDataStr);

      if (resourceData.type === "link") {
        return (
          <div className="ml-4 text-gray-700">
            <div className="italic">
              {resourceData.description && (
                <span className="font-medium">
                  {resourceData.description}:{" "}
                </span>
              )}
              <a
                href={resourceData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {resourceData.url}
              </a>
            </div>
          </div>
        );
      } else if (resourceData.type === "image" && resourceData.file) {
        // Get image URL for preview
        const getImageUrl = () => {
          if ("base64" in resourceData.file) {
            return resourceData.file.base64;
          } else if (resourceData.file instanceof File) {
            return URL.createObjectURL(resourceData.file);
          }
          return null;
        };

        const imageUrl = getImageUrl();

        return (
          <div className="ml-4 text-gray-700">
            <div className="space-y-2">
              {imageUrl && (
                <div className="border rounded-lg overflow-hidden max-w-xs">
                  <img
                    src={imageUrl}
                    alt={resourceData.file.name}
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span>📷</span>
                <span>{resourceData.file.name}</span>
                <span className="text-gray-500">
                  ({(resourceData.file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          </div>
        );
      } else if (resourceData.type === "video" && resourceData.file) {
        return (
          <div className="ml-4 text-gray-700">
            <div className="flex items-center gap-2">
              <span>🎥</span>
              <span>{resourceData.file.name}</span>
              <span className="text-sm text-gray-500">
                ({(resourceData.file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error("Error parsing resource data:", error);
      return (
        <div className="ml-4 text-red-600 text-sm">[Lỗi hiển thị học liệu]</div>
      );
    }
    return null;
  };

  // Helper function to render Table component
  const renderTableComponent = (
    field: any,
    stepData: Record<string, string>
  ) => {
    try {
      // Try to parse table data from stepData
      const tableDataStr = stepData?.[field.id] || "";
      let tableData = null;

      if (tableDataStr) {
        try {
          tableData = JSON.parse(tableDataStr);
        } catch (e) {
          console.log("Failed to parse table data:", e);
        }
      }

      // Use default table data if no user data
      if (!tableData || !tableData.headers || !tableData.rows) {
        tableData = {
          headers: ["Header 1", "Header 2"],
          rows: [
            ["Cell 1-1", "Cell 1-2"],
            ["Cell 2-1", "Cell 2-2"],
          ],
        };
      }

      return (
        <div className="ml-4 mt-2">
          <div className="border border-gray-300 rounded-sm overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {tableData.headers.map((header: string, index: number) => (
                    <th
                      key={index}
                      className="border-b border-gray-300 px-3 py-2 text-left font-calsans font-normal text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell: string, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className="border-b border-gray-200 px-3 py-2 text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering table:", error);
      return <div className="ml-4 text-red-500 text-sm">Lỗi hiển thị bảng</div>;
    }
  };

  // Helper function to render nested field structure
  const renderField = (
    field: any,
    stepData: Record<string, string>,
    level: number = 0,
    index: number = 0
  ) => {
    const userValue = stepData?.[field.id] || "";
    const defaultContent = field.content || field.description || "";

    return (
      <div
        key={field.id}
        style={{ marginLeft: `${level * 16}px` }}
        className="space-y-2"
      >
        <div>
          <span className="font-medium">
            {level === 0
              ? `${index + 1}. ${field.title}:`
              : level === 1
              ? `${String.fromCharCode(97 + index)}. ${field.title}:`
              : `${field.title}:`}
          </span>

          {/* Special handling for TABLE and REFERENCES components */}
          {field.type === "TABLE" || field.nodeType === "TABLE"
            ? renderTableComponent(field, stepData)
            : field.type === "REFERENCES" || field.nodeType === "REFERENCES"
            ? renderReferencesComponent(field, stepData)
            : (userValue || defaultContent) && (
                <div className="ml-4 text-gray-700">
                  {userValue || defaultContent}
                </div>
              )}
        </div>

        {/* Render children recursively */}
        {field.children && field.children.length > 0 && (
          <div className="space-y-2">
            {field.children.map((child: any, childIndex: number) =>
              renderField(child, stepData, level + 1, childIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  // Helper function to render all form data for a step
  const renderStepData = (step: any, stepData: Record<string, string>) => {
    // Get merged components (static + dynamic) if function is available
    const components = getMergedComponentsForStep
      ? getMergedComponentsForStep(step.id, step.children || [])
      : step.children || [];

    console.log(
      `Step ${step.title} components:`,
      components.length,
      components
    );

    // If no components, show no data message
    if (components.length === 0) {
      return <div className="text-gray-500 italic">Chưa có dữ liệu...</div>;
    }

    return (
      <div className="space-y-3">
        {components.map((field: any, index: number) =>
          renderField(field, stepData, 0, index)
        )}
      </div>
    );
  };

  // Get general info step
  const generalInfoStep = steps.find(
    (step) =>
      step.title?.toLowerCase().includes("thông tin") ||
      (step.nodeType === "SECTION" && step.order <= 1)
  );

  // Get objectives step
  const objectivesStep = steps.find((step) =>
    step.title?.toLowerCase().includes("mục tiêu")
  );
  console.log(
    "Objectives step found:",
    objectivesStep?.title,
    objectivesStep?.children?.length
  );

  return (
    <div
      className={cn("h-full bg-white overflow-y-auto", className)}
      style={style}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SiGoogledocs className="w-6 h-6 text-blue-500" />
          <h3 className="font-calsans text-lg text-gray-900">
            Xem trước giáo án
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleExportWord}
          >
            <Download className="w-3 h-3 mr-1" />
            Xuất
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 text-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="font-bold text-base">Phụ lục IV</div>
          <div className="font-bold text-base">KHUNG KẾ HOẠCH BÀI DẠY</div>
          <div className="text-xs text-gray-600">
            (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của
            Bộ GDĐT)
          </div>
        </div>

        {/* General Info Section */}
        <div className="space-y-3">
          <div className="space-y-1 text-xs">
            <div>
              Tên cơ sở giáo dục:{" "}
              {generalInfoStep
                ? getFieldValue(generalInfoStep.id, "keyword-school-name") ||
                  "………………………………….."
                : "………………………………….."}
            </div>
            <div>
              Họ và tên giáo viên:{" "}
              {generalInfoStep
                ? getFieldValue(generalInfoStep.id, "keyword-teacher-name") ||
                  "………………………………….."
                : "………………………………….."}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-center">
              TÊN BÀI DẠY:{" "}
              {generalInfoStep
                ? getFieldValue(generalInfoStep.id, "keyword-lesson-name") ||
                  "………………………………….."
                : "………………………………….."}
            </div>
            <div>
              Môn học/Hoạt động giáo dục:{" "}
              {generalInfoStep
                ? getFieldValue(generalInfoStep.id, "keyword-subject") || "………"
                : "………"}
              ; lớp:{" "}
              {generalInfoStep
                ? getFieldValue(generalInfoStep.id, "keyword-class") || "………"
                : "………"}
            </div>
            <div>
              Thời gian thực hiện:{" "}
              {generalInfoStep
                ? getFieldValue(generalInfoStep.id, "keyword-time") ||
                  "(số tiết)"
                : "(số tiết)"}
            </div>
          </div>
        </div>

        {/* Render all steps dynamically */}
        {steps
          .filter((step) => step.id !== generalInfoStep?.id) // Exclude general info step
          .map((step, index) => {
            const romanNumerals = [
              "I",
              "II",
              "III",
              "IV",
              "V",
              "VI",
              "VII",
              "VIII",
              "IX",
              "X",
            ];
            const stepNumber = romanNumerals[index] || `${index + 1}`;

            return (
              <div key={step.id} className="space-y-2">
                <div className="font-bold">
                  {stepNumber}. {step.title}
                </div>
                {renderStepData(step, formData[step.id] || {})}
              </div>
            );
          })}

        {/* Notes */}
        <div className="space-y-2 text-xs text-gray-600 border-t pt-4">
          <div className="font-bold">Ghi chú:</div>
          <div className="space-y-2">
            <div>
              1. Mỗi bài dạy có thể được thực hiện trong nhiều tiết học, bảo đảm
              đủ thời gian dành cho mỗi hoạt động để học sinh thực hiện hiệu
              quả.
            </div>
            <div>
              2. Trong Kế hoạch bài dạy không cần nêu cụ thể lời nói của giáo
              viên, học sinh mà tập trung mô tả rõ hoạt động cụ thể.
            </div>
            <div>
              3. Việc kiểm tra, đánh giá thường xuyên được thực hiện trong quá
              trình tổ chức các hoạt động học.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
