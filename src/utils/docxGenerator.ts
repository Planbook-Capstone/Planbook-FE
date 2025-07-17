import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, Footer, PageNumber, ImageRun } from "docx";
import { saveAs } from "file-saver";

// Helper function to load image via Image element and convert to canvas
const loadImageViaCanvas = (imageUrl: string): Promise<ArrayBuffer | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Try to enable CORS

    img.onload = () => {
      try {
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          console.error("❌ Could not get canvas context");
          resolve(null);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            blob.arrayBuffer().then(resolve).catch(() => resolve(null));
          } else {
            resolve(null);
          }
        }, 'image/png');
      } catch (error) {
        console.error("❌ Canvas conversion error:", error);
        resolve(null);
      }
    };

    img.onerror = () => {
      console.error("❌ Image load error");
      resolve(null);
    };

    // Set timeout to avoid hanging
    setTimeout(() => {
      console.error("❌ Image load timeout");
      resolve(null);
    }, 10000);

    img.src = imageUrl;
  });
};

// Utility function to convert image URL to buffer
const convertImageToBuffer = async (imageUrl: string): Promise<ArrayBuffer | null> => {
  try {
    console.log("🔄 Converting image to buffer:", {
      isDataUrl: imageUrl.startsWith('data:'),
      urlLength: imageUrl.length,
      urlStart: imageUrl.substring(0, 50)
    });

    // Handle data URLs (base64 images)
    if (imageUrl.startsWith('data:')) {
      console.log("🔍 Processing data URL:", {
        fullUrl: imageUrl.substring(0, 100) + "...",
        hasComma: imageUrl.includes(','),
        mimeType: imageUrl.split(',')[0]
      });

      // Extract base64 data from data URL
      const parts = imageUrl.split(',');
      if (parts.length !== 2) {
        console.error("❌ Invalid data URL format - no comma separator");
        return null;
      }

      const base64Data = parts[1];
      if (!base64Data) {
        console.error("❌ Invalid data URL format - no base64 data");
        return null;
      }

      console.log("🔍 Base64 data:", {
        length: base64Data.length,
        start: base64Data.substring(0, 50)
      });

      try {
        // Convert base64 to ArrayBuffer
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        console.log("✅ Converted data URL to buffer:", bytes.buffer.byteLength, "bytes");
        return bytes.buffer;
      } catch (decodeError) {
        console.error("❌ Error decoding base64:", decodeError);
        return null;
      }
    } else if (imageUrl.startsWith('http')) {
      // Handle HTTP URLs with multiple fallback strategies
      console.log("🌐 Fetching HTTP URL:", imageUrl);

      // Strategy 1: Try with CORS
      try {
        console.log("🔄 Trying CORS fetch...");
        const response = await fetch(imageUrl, {
          mode: 'cors',
          headers: {
            'Accept': 'image/*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (response.ok) {
          const buffer = await response.arrayBuffer();
          console.log("✅ CORS fetch successful, size:", buffer.byteLength);
          return buffer;
        }
        console.log("⚠️ CORS fetch failed:", response.status, "trying proxy...");
      } catch (corsError) {
        console.log("⚠️ CORS error:", corsError, "trying proxy...");
      }

      // Strategy 2: Try with CORS proxy
      try {
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${imageUrl}`;
        console.log("🔄 Trying CORS proxy:", proxyUrl);

        const response = await fetch(proxyUrl, {
          headers: {
            'Accept': 'image/*',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        if (response.ok) {
          const buffer = await response.arrayBuffer();
          console.log("✅ Proxy fetch successful, size:", buffer.byteLength);
          return buffer;
        }
        console.log("⚠️ Proxy fetch failed:", response.status);
      } catch (proxyError) {
        console.log("⚠️ Proxy error:", proxyError);
      }

      // Strategy 3: Try alternative proxy
      try {
        const altProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
        console.log("🔄 Trying alternative proxy:", altProxyUrl);

        const response = await fetch(altProxyUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          console.log("✅ Alternative proxy successful, size:", buffer.byteLength);
          return buffer;
        }
        console.log("⚠️ Alternative proxy failed:", response.status);
      } catch (altProxyError) {
        console.log("⚠️ Alternative proxy error:", altProxyError);
      }

      // Strategy 4: Try simple fetch without CORS (might work for some images)
      try {
        console.log("🔄 Trying simple fetch...");
        const response = await fetch(imageUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          console.log("✅ Simple fetch successful, size:", buffer.byteLength);
          return buffer;
        }
        console.log("⚠️ Simple fetch failed:", response.status);
      } catch (simpleError) {
        console.log("⚠️ Simple fetch error:", simpleError);
      }

      // Strategy 5: Try loading image via Image element and convert to canvas
      try {
        console.log("🔄 Trying Image element + canvas conversion...");
        const buffer = await loadImageViaCanvas(imageUrl);
        if (buffer) {
          console.log("✅ Canvas conversion successful, size:", buffer.byteLength);
          return buffer;
        }
        console.log("⚠️ Canvas conversion failed");
      } catch (canvasError) {
        console.log("⚠️ Canvas error:", canvasError);
      }

      console.error("❌ All HTTP fetch strategies failed for:", imageUrl);
      return null;
    } else {
      console.error("❌ Unsupported image URL format:", imageUrl);
      return null;
    }
  } catch (error) {
    console.error("❌ Error converting image to buffer:", error);
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
          italics: true,
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

    // Store original type for title styling
    const originalType = node.type;

    // Check fieldType first for special cases like TABLE
    if (node.fieldType === "TABLE") {
      console.log("🎯 Processing TABLE fieldType node:", node.id, "originalType:", originalType);
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
          // Use different styling based on original type
          if (originalType === "SUBSECTION") {
            elements.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: node.title,
                    bold: true,
                    size: 28, // 14pt - same as SUBSECTION
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: {
                  after: 120, // 6pt
                  before: 240, // 12pt
                },
              })
            );
          } else {
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
        }

        // Handle both old and new table data formats
        let tableData: TableData;

        console.log("📋 Processing table node:", {
          nodeId: node.id,
          hasTableData: !!(node as any).tableData,
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
                    // Combine title and content for text content
                    const title = cell.title || "";
                    const content = cell.content || "";
                    let textContent = "";

                    if (title && content) {
                      textContent = `${title}\n${content}`;
                    } else {
                      textContent = title || content;
                    }

                    // Check if this cell has HTML content with images
                    // Look for <img> tags with any src (data:image/ or http/https URLs)
                    const imgRegex = /<img[^>]+src=["']([^"']*)["'][^>]*>/gi;
                    let imageMatch;
                    let extractedImageUrl = null;
                    let cleanTextContent = textContent;

                    // Extract image URL from HTML content
                    if ((imageMatch = imgRegex.exec(textContent)) !== null) {
                      extractedImageUrl = imageMatch[1];
                      // Remove the img tag from text content
                      cleanTextContent = textContent.replace(/<img[^>]*>/gi, '').trim();
                      // Clean up HTML tags and decode entities
                      cleanTextContent = cleanTextContent
                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace(/&quot;/g, '"')
                        .trim();
                    }

                    if (extractedImageUrl) {
                      console.log("🖼️ Found image in HTML content:", {
                        originalContent: textContent.substring(0, 100),
                        extractedUrl: extractedImageUrl.substring(0, 50) + "...",
                        cleanText: cleanTextContent
                      });

                      return {
                        text: cleanTextContent || "",
                        image: {
                          url: extractedImageUrl,
                          name: "table-image"
                        }
                      } as CellContent;
                    } else {
                      // Regular text cell - clean HTML and return
                      const cleanText = textContent
                        .replace(/<[^>]*>/g, '') // Remove HTML tags
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace(/&quot;/g, '"')
                        .trim();
                      return cleanText;
                    }
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
            const nodeAny = node as any;
            tableData = nodeAny.tableData || {
              headers: ["Cột 1", "Cột 2"],
              rows: [["", ""], ["", ""]],
            };
          }
        }
        // Fallback to tableData field (old format) if content parsing failed
        else if ((node as any).tableData && (node as any).tableData.headers && (node as any).tableData.rows) {
          console.log("📋 Using tableData field as fallback:", (node as any).tableData);
          tableData = (node as any).tableData;
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
          ...await Promise.all(tableData.rows.map(async (row) =>
            new TableRow({
              children: await Promise.all(row.map(async (cell) => {
                const cellParagraphs: any[] = [];

                if (typeof cell === 'string') {
                  // Parse HTML string to TextRuns with formatting
                  const cellTextRuns = parseHtmlToTextRuns(cell);
                  cellParagraphs.push(new Paragraph({
                    children: cellTextRuns,
                  }));
                } else if (Array.isArray(cell)) {
                  // Already parsed TextRuns array (legacy)
                  cellParagraphs.push(new Paragraph({
                    children: cell,
                  }));
                } else if (cell && typeof cell === 'object') {
                  if ('text' in cell && 'image' in cell) {
                    // New CellContent format - handle mixed content
                    const cellContent = cell as CellContent;

                    // Add text content if exists
                    if (cellContent.text) {
                      const textRuns = parseHtmlToTextRuns(cellContent.text);
                      cellParagraphs.push(new Paragraph({
                        children: textRuns,
                      }));
                    }

                    // Add image directly in cell if exists
                    if (cellContent.image) {
                      console.log("🖼️ Adding image directly to table cell:", {
                        url: cellContent.image.url.substring(0, 50) + "...",
                        isDataUrl: cellContent.image.url.startsWith('data:'),
                        isHttpUrl: cellContent.image.url.startsWith('http')
                      });

                      try {
                        const imageBuffer = await convertImageToBuffer(cellContent.image.url);
                        if (imageBuffer) {
                          // Detect image type
                          let imageType = "png";
                          if (cellContent.image.url.startsWith('data:image/')) {
                            const mimeType = cellContent.image.url.split(',')[0].split(':')[1].split(';')[0];
                            if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
                              imageType = "jpg";
                            } else if (mimeType.includes('png')) {
                              imageType = "png";
                            }
                          } else if (cellContent.image.url.includes('.jpg') || cellContent.image.url.includes('.jpeg')) {
                            imageType = "jpg";
                          } else if (cellContent.image.url.includes('.png')) {
                            imageType = "png";
                          }

                          cellParagraphs.push(new Paragraph({
                            children: [
                              new ImageRun({
                                data: new Uint8Array(imageBuffer),
                                transformation: {
                                  width: 200, // Smaller for table cells
                                  height: 150,
                                },
                                type: imageType as any,
                              }),
                            ],
                          }));
                          console.log("✅ Successfully added image to table cell");
                        } else {
                          console.error("❌ Failed to convert image to buffer");
                          cellParagraphs.push(new Paragraph({
                            children: [
                              new TextRun({
                                text: `[Không thể tải ảnh: ${cellContent.image.name || 'image'}]`,
                                italics: true,
                                size: 20,
                                color: "FF0000",
                              }),
                            ],
                          }));
                        }
                      } catch (error) {
                        console.error("❌ Error adding image to table cell:", error);
                        cellParagraphs.push(new Paragraph({
                          children: [
                            new TextRun({
                              text: `[Lỗi tải ảnh: ${cellContent.image.name || 'image'}]`,
                              italics: true,
                              size: 20,
                              color: "FF0000",
                            }),
                          ],
                        }));
                      }
                    }
                  } else if ('type' in cell && 'content' in cell) {
                    // Old format compatibility
                    const cellData = cell as any;
                    const text = cellData.type === 'image' ? `[📷 ${cellData.content}]` : String(cellData.content || '');
                    const textRuns = parseHtmlToTextRuns(text);
                    cellParagraphs.push(new Paragraph({
                      children: textRuns,
                    }));
                  }
                }

                // Ensure at least one paragraph
                if (cellParagraphs.length === 0) {
                  cellParagraphs.push(new Paragraph({
                    children: [new TextRun({ text: '', size: 24 })],
                  }));
                }

                return new TableCell({
                  children: cellParagraphs,
                  width: {
                    size: columnWidth,
                    type: WidthType.DXA,
                  },
                });
              })),
            })
          ))
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



        // Add spacing after table and images
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
                      type: "png",
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
