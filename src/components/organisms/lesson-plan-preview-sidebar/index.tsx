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
  formData: Record<string, Record<string, string>> | Record<string, string>;
  getMergedComponentsForStep?: (
    stepId: string,
    staticChildren?: any[]
  ) => any[];
  getApiChildrenForStep?: (stepId: string) => any[];
  isVisible: boolean;
  onToggleVisibility: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function LessonPlanPreviewSidebar({
  steps,
  formData,
  getMergedComponentsForStep,
  getApiChildrenForStep,
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
                getFieldValue(generalInfoStep?.id || "", "keyword-bai") ||
                "…………………………………..."
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
                  getValueByKeyOrTitle("keyword-thoi-gian") || "(số tiết)"
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

        // Get API children data for this step if available
        const apiChildren = getApiChildrenForStep
          ? getApiChildrenForStep(step.id)
          : [];

        // Use API children if available, otherwise fall back to static children
        const childrenToUse =
          apiChildren.length > 0 ? apiChildren : step.children || [];

        // Get merged components for this step
        const components = getMergedComponentsForStep
          ? getMergedComponentsForStep(step.id, childrenToUse)
          : childrenToUse;

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
      if (component.fieldType === "TABLE" || component.nodeType === "TABLE") {
        // Add table to document
        await addTableToDoc(component, stepData, documentChildren);
      } else if (
        component.fieldType === "REFERENCES" ||
        component.nodeType === "REFERENCES"
      ) {
        // Add references to document
        await addReferencesToDoc(component, stepData, documentChildren, level);
      } else if (
        content &&
        !content.startsWith('{"rows":') &&
        !content.startsWith('{"type":')
      ) {
        // Only render content if it's not JSON data (TABLE or REFERENCES)
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
      } else if (
        resourceData.type === "image" &&
        (resourceData.file || resourceData.url)
      ) {
        // Add image to document - handle both file and URL
        try {
          let imageBuffer: ArrayBuffer | null = null;
          let imageType: "jpg" | "png" | "gif" | "bmp" = "png";

          if (resourceData.file) {
            // Handle uploaded file
            imageBuffer = await convertFileToBuffer(resourceData.file);
            imageType = getImageType(resourceData.file);
          } else if (resourceData.url) {
            // Handle URL image
            try {
              const response = await fetch(resourceData.url);
              if (response.ok) {
                imageBuffer = await response.arrayBuffer();
                // Try to determine image type from URL or content-type
                const contentType = response.headers.get("content-type");
                if (
                  contentType?.includes("jpeg") ||
                  contentType?.includes("jpg")
                ) {
                  imageType = "jpg";
                } else if (contentType?.includes("png")) {
                  imageType = "png";
                } else if (contentType?.includes("gif")) {
                  imageType = "gif";
                } else {
                  // Fallback: try to guess from URL extension
                  const urlLower = resourceData.url.toLowerCase();
                  if (urlLower.includes(".jpg") || urlLower.includes(".jpeg")) {
                    imageType = "jpg";
                  } else if (urlLower.includes(".png")) {
                    imageType = "png";
                  } else if (urlLower.includes(".gif")) {
                    imageType = "gif";
                  }
                }
              }
            } catch (fetchError) {
              console.error("Error fetching image from URL:", fetchError);
              imageBuffer = null;
            }
          }

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
                    type: imageType,
                  }),
                ],
                indent: {
                  left: (level + 1) * 720,
                },
              })
            );
          } else {
            // Add fallback text if image couldn't be loaded
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `[Hình ảnh: ${
                      resourceData.description ||
                      resourceData.url ||
                      "Không thể tải"
                    }]`,
                    color: "666666",
                    size: 24,
                    italics: true,
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
      // Parse table data - use same logic as preview sidebar
      let tableDataStr = stepData?.[component.id] || "";

      // If not found, try parent ID (for nested TABLE components)
      if (!tableDataStr && component.parentId) {
        tableDataStr = stepData?.[component.parentId] || "";
      }

      // If still not found, use component.content (for API data)
      if (!tableDataStr && component.content) {
        tableDataStr = component.content;
      }

      console.log("Word export TABLE data lookup:", {
        componentId: component.id,
        parentId: component.parentId,
        foundData: !!tableDataStr,
        dataSource:
          tableDataStr === stepData?.[component.id]
            ? "direct"
            : tableDataStr === stepData?.[component.parentId]
            ? "parent"
            : "content",
      });

      let richTableData = null;
      if (tableDataStr) {
        try {
          richTableData = JSON.parse(tableDataStr);
        } catch (e) {
          console.log("Failed to parse table data for Word export:", e);
        }
      }

      // Convert RichTable format to Word export format
      let tableData = null;
      if (richTableData && richTableData.rows) {
        // Extract headers from first row (isHeader: true)
        const headerRow = richTableData.rows.find(
          (row: any) =>
            row.cells && row.cells.some((cell: any) => cell.isHeader)
        );

        const headers = headerRow
          ? headerRow.cells.map((cell: any) => cell.content || "")
          : ["Header 1", "Header 2"];

        // Extract data rows (isHeader: false or undefined)
        const dataRows = richTableData.rows
          .filter(
            (row: any) =>
              row.cells && !row.cells.some((cell: any) => cell.isHeader)
          )
          .map((row: any) =>
            row.cells.map((cell: any) => {
              // Strip HTML tags from content
              const content = cell.content || "";
              return content.replace(/<[^>]*>/g, "");
            })
          );

        tableData = {
          headers,
          rows: dataRows,
        };

        console.log("Converted RichTable to Word format:", {
          originalRows: richTableData.rows.length,
          headers: headers,
          dataRows: dataRows.length,
        });
      }

      // Use default table data if conversion failed
      if (!tableData || !tableData.headers || !tableData.rows) {
        tableData = {
          headers: ["Header 1", "Header 2"],
          rows: [
            ["Cell 1-1", "Cell 1-2"],
            ["Cell 2-1", "Cell 2-2"],
          ],
        };
        console.log("Using default table data for Word export");
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

  // Helper function to get form data by title (more flexible)
  const getFieldValue = (stepId: string, keywordTitle: string): string => {
    const stepData = formData[stepId];
    if (!stepData) return "";

    // Try to find by exact title match first
    for (const [key, value] of Object.entries(stepData)) {
      // Check if the key contains the title (case insensitive)
      if (
        key.toLowerCase().includes(keywordTitle.toLowerCase()) ||
        keywordTitle.toLowerCase().includes(key.toLowerCase())
      ) {
        return value as string;
      }
    }

    // Fallback: try original keywordId format
    return stepData[keywordTitle] || "";
  };

  // Get value by keyword pattern (for transformed formData)
  const getValueByKeyPattern = (pattern: string): string => {
    // Search in transformed formData structure: {stepId: {fieldId: "value"}}
    for (const stepId in formData) {
      const stepData = formData[stepId];
      if (!stepData || typeof stepData !== "object") continue;

      // Look for key that contains the pattern
      for (const fieldId in stepData) {
        if (fieldId.includes(pattern)) {
          console.log(
            `Found ${pattern} in fieldId: ${fieldId}, value: ${stepData[fieldId]}`
          );
          return stepData[fieldId];
        }
      }
    }

    console.log(
      `getValueByKeyPattern: No value found for pattern "${pattern}"`
    );
    return "";
  };

  // Legacy function for backward compatibility
  const getValueByKeyOrTitle = (search: string): string => {
    return getValueByKeyPattern(search);
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
      // Try to get resource data from stepData first, then fallback to field.content
      let resourceDataStr = stepData[field.id] || "";

      // If not found, try parent ID (for nested REFERENCES components)
      if (!resourceDataStr && field.parentId) {
        resourceDataStr = stepData[field.parentId] || "";
      }

      // If still not found, use field.content (for API data)
      if (!resourceDataStr && field.content) {
        resourceDataStr = field.content;
      }

      console.log("Preview sidebar renderReferencesComponent:");
      console.log("- field.id:", field.id);
      console.log("- field.parentId:", field.parentId);
      console.log("- stepData keys:", Object.keys(stepData));
      console.log(
        "- resourceDataStr from field.id:",
        stepData[field.id] || "NOT_FOUND"
      );
      console.log(
        "- resourceDataStr from parentId:",
        field.parentId ? stepData[field.parentId] || "NOT_FOUND" : "NO_PARENT"
      );
      console.log(
        "- resourceDataStr from field.content:",
        field.content?.substring(0, 100) + "..."
      );
      console.log(
        "- final resourceDataStr:",
        resourceDataStr.substring(0, 100) + "..."
      );

      if (!resourceDataStr) {
        console.log("No resource data found for field:", field.id);
        return null;
      }

      console.log("Resource data string:", resourceDataStr);
      const resourceData = JSON.parse(resourceDataStr);
      console.log("Parsed resource data:", resourceData);

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
      } else if (
        resourceData.type === "image" &&
        (resourceData.file || resourceData.url)
      ) {
        // Handle both uploaded files and URL images
        if (resourceData.file) {
          // Get image URL for preview (uploaded file)
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
                  <span
                    className="truncate max-w-[200px]"
                    title={resourceData.file.name}
                  >
                    {resourceData.file.name}
                  </span>
                  <span className="text-gray-500 flex-shrink-0">
                    ({(resourceData.file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => {
                      if ("base64" in resourceData.file) {
                        const link = document.createElement("a");
                        link.href = resourceData.file.base64;
                        link.download = resourceData.file.name;
                        link.click();
                      }
                    }}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          );
        } else if (resourceData.url) {
          // Handle URL images from API
          return (
            <div className="ml-4 text-gray-700">
              <div className="space-y-2">
                <div className="border rounded-lg overflow-hidden max-w-xs">
                  <img
                    src={resourceData.url}
                    alt={resourceData.description || "Selected image"}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvaSBoaW5oIGFuaDwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>📷</span>
                  <span>
                    {resourceData.description || "Hình ảnh từ thư viện"}
                  </span>
                </div>
              </div>
            </div>
          );
        }
      } else if (resourceData.type === "video" && resourceData.file) {
        return (
          <div className="ml-4 text-gray-700">
            <div className="flex items-center gap-2">
              <span>🎥</span>
              <span
                className="truncate max-w-[200px]"
                title={resourceData.file.name}
              >
                {resourceData.file.name}
              </span>
              <span className="text-sm text-gray-500 flex-shrink-0">
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
      // Try to parse table data from stepData first, then fallback to field.content
      let tableDataStr = stepData?.[field.id] || "";

      // If not found, try parent ID (for nested TABLE components)
      if (!tableDataStr && field.parentId) {
        tableDataStr = stepData?.[field.parentId] || "";
      }

      // If still not found, use field.content (for API data)
      if (!tableDataStr && field.content) {
        tableDataStr = field.content;
      }

      console.log("Preview sidebar renderTableComponent:");
      console.log("- field.id:", field.id);
      console.log("- field.parentId:", field.parentId);
      console.log("- stepData keys:", Object.keys(stepData));
      console.log(
        "- tableDataStr from field.id:",
        stepData?.[field.id] || "NOT_FOUND"
      );
      console.log(
        "- tableDataStr from parentId:",
        field.parentId ? stepData?.[field.parentId] || "NOT_FOUND" : "NO_PARENT"
      );
      console.log(
        "- tableDataStr from field.content:",
        field.content?.substring(0, 100) + "..."
      );
      console.log(
        "- final tableDataStr:",
        tableDataStr.substring(0, 100) + "..."
      );

      let tableData = null;

      if (tableDataStr) {
        try {
          tableData = JSON.parse(tableDataStr);
        } catch (e) {
          console.log("Failed to parse table data:", e);
        }
      }

      // Use default RichTable format if no user data
      if (!tableData || !tableData.rows) {
        tableData = {
          rows: [
            {
              id: "header-row",
              cells: [
                { id: "h1", content: "Cột 1", isHeader: true },
                { id: "h2", content: "Cột 2", isHeader: true },
              ],
            },
            {
              id: "row-1",
              cells: [
                { id: "r1c1", content: "Nội dung ô 1" },
                { id: "r1c2", content: "Nội dung ô 2" },
              ],
            },
          ],
          columns: 2,
        };
      }

      return (
        <div className="ml-4 mt-2">
          <div className="border border-gray-300 rounded-sm overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {tableData.rows.map((row: any, rowIndex: number) => (
                  <tr
                    key={row.id}
                    className={
                      row.cells[0]?.isHeader ? "bg-gray-50" : "hover:bg-gray-50"
                    }
                  >
                    {row.cells.map((cell: any, cellIndex: number) =>
                      cell.isHeader ? (
                        <th
                          key={cell.id}
                          className="border-b border-gray-300 px-3 py-2 text-left font-calsans font-normal text-gray-900"
                        >
                          {cell.content}
                        </th>
                      ) : (
                        <td
                          key={cell.id}
                          className="border-b border-gray-200 px-3 py-2 text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: cell.content || "",
                          }}
                        />
                      )
                    )}
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

  // Helper function to check if should render header info
  const shouldRenderHeaderInfo = (
    field: any,
    stepData: Record<string, string>
  ) => {
    // Hard-coded keys that should render header info
    const headerKeys = [
      "school_name",
      "teacher_name",
      "lesson_title",
      "subject_grade",
      "time",
    ];

    return (
      headerKeys.includes(field.id) ||
      (field.title &&
        (field.title.toLowerCase().includes("tên cơ sở") ||
          field.title.toLowerCase().includes("giáo viên") ||
          field.title.toLowerCase().includes("tên bài") ||
          field.title.toLowerCase().includes("môn học") ||
          field.title.toLowerCase().includes("thời gian")))
    );
  };

  // Helper function to render nested field structure
  const renderField = (
    field: any,
    stepData: Record<string, string>,
    level: number = 0,
    index: number = 0
  ) => {
    console.log("renderField called:", {
      fieldId: field.id,
      fieldType: field.fieldType,
      nodeType: field.nodeType,
      isDynamic: field.isDynamic,
      stepDataType: typeof stepData,
      stepDataKeys: Object.keys(stepData),
      stepDataValue: stepData?.[field.id],
    });

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

          {/* Special handling based on fieldType */}
          {field.fieldType === "TABLE" || field.nodeType === "TABLE" ? (
            (() => {
              console.log("Calling renderTableComponent for field:", field.id);
              return renderTableComponent(field, stepData);
            })()
          ) : field.fieldType === "REFERENCES" ||
            field.nodeType === "REFERENCES" ? (
            (() => {
              console.log(
                "Calling renderReferencesComponent for field:",
                field.id
              );
              return renderReferencesComponent(field, stepData);
            })()
          ) : field.fieldType === "INPUT" ? (
            <div className="ml-4 text-gray-700">
              <span className="font-questrial">
                {userValue || defaultContent || "Chưa nhập dữ liệu..."}
              </span>
            </div>
          ) : field.nodeType === "PARAGRAPH" && !field.fieldType ? (
            // Original paragraph type
            <div className="ml-4 text-gray-700">
              <span className="font-questrial">
                {userValue || defaultContent || "Chưa có nội dung..."}
              </span>
            </div>
          ) : (
            // Fallback for other types - but don't show JSON data for parent components
            (userValue || defaultContent) &&
            !userValue?.startsWith('{"rows":') &&
            !userValue?.startsWith('{"type":') && (
              <div className="ml-4 text-gray-700">
                {userValue || defaultContent}
              </div>
            )
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
    // Get API children data for this step if available
    const apiChildren = getApiChildrenForStep
      ? getApiChildrenForStep(step.id)
      : [];

    // Use API children if available, otherwise fall back to static children
    const childrenToUse =
      apiChildren.length > 0 ? apiChildren : step.children || [];

    // Get merged components (static + dynamic) if function is available
    const components = getMergedComponentsForStep
      ? getMergedComponentsForStep(step.id, childrenToUse)
      : childrenToUse;

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
  const generalInfoStep = steps.find((step) =>
    step.title?.toLowerCase().includes("thông tin")
  );

  // Get general info step ID for dynamic lookup
  const generalInfoStepId = generalInfoStep?.id;

  // Get objectives step
  const objectivesStep = steps.find((step) =>
    step.title?.toLowerCase().includes("mục tiêu")
  );
  console.log(
    "Objectives step found:",
    objectivesStep?.title,
    objectivesStep?.children?.length
  );
  // Debug: Show formData as pretty JSON in the preview sidebar
  // Remove or comment out in production if not needed
  // console.log(formData, "formData");
  const formDataJson = JSON.stringify(formData, null, 2);
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
              {generalInfoStepId
                ? (formData[generalInfoStepId] as any)?.[
                    Object.keys(formData[generalInfoStepId] || {})[0]
                  ] || "………………………………….."
                : "………………………………….."}
            </div>
            <div>
              Họ và tên giáo viên:{" "}
              {generalInfoStepId
                ? (formData[generalInfoStepId] as any)?.[
                    Object.keys(formData[generalInfoStepId] || {})[1]
                  ] || "………………………………….."
                : "………………………………….."}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-center">
              TÊN BÀI DẠY:{" "}
              {generalInfoStepId
                ? (formData[generalInfoStepId] as any)?.[
                    Object.keys(formData[generalInfoStepId] || {})[2]
                  ] || "………………………………….."
                : "………………………………….."}
            </div>
            <div>
              Môn học/Hoạt động giáo dục:{" "}
              {generalInfoStepId
                ? (formData[generalInfoStepId] as any)?.[
                    Object.keys(formData[generalInfoStepId] || {})[3]
                  ] || "………"
                : "………"}
              ; lớp:{" "}
              {generalInfoStepId
                ? (formData[generalInfoStepId] as any)?.[
                    Object.keys(formData[generalInfoStepId] || {})[4]
                  ] || "………"
                : "………"}
            </div>
            <div>
              Thời gian thực hiện:{" "}
              {generalInfoStep
                ? getValueByKeyOrTitle("keyword-thoi-gian") || "(số tiết)"
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
                {renderStepData(
                  step,
                  (formData[step.id] as Record<string, string>) || {}
                )}
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
