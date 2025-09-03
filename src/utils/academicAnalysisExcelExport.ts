import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AcademicAnalysisResponse } from "@/services/academicAnalysisService";
import { toast } from "sonner";

// Define color scheme for Excel styling
const COLORS = {
  primary: "FF4472C4", // Blue
  secondary: "FF70AD47", // Green
  accent: "FFFFC000", // Orange
  danger: "FFE74C3C", // Red
  success: "FF27AE60", // Green
  warning: "FFF39C12", // Yellow
  info: "FF3498DB", // Light Blue
  light: "FFF8F9FA", // Light Gray
  dark: "FF343A40", // Dark Gray
  white: "FFFFFFFF", // White
};

// Cell style definitions
const STYLES = {
  header: {
    fill: { fgColor: { rgb: COLORS.primary } },
    font: { bold: true, color: { rgb: COLORS.white }, sz: 12 },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: COLORS.dark } },
      bottom: { style: "thin", color: { rgb: COLORS.dark } },
      left: { style: "thin", color: { rgb: COLORS.dark } },
      right: { style: "thin", color: { rgb: COLORS.dark } },
    },
  },
  subHeader: {
    fill: { fgColor: { rgb: COLORS.secondary } },
    font: { bold: true, color: { rgb: COLORS.white }, sz: 11 },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: COLORS.dark } },
      bottom: { style: "thin", color: { rgb: COLORS.dark } },
      left: { style: "thin", color: { rgb: COLORS.dark } },
      right: { style: "thin", color: { rgb: COLORS.dark } },
    },
  },
  title: {
    fill: { fgColor: { rgb: COLORS.accent } },
    font: { bold: true, color: { rgb: COLORS.dark }, sz: 14 },
    alignment: { horizontal: "center", vertical: "center" },
  },
  data: {
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: COLORS.light } },
      bottom: { style: "thin", color: { rgb: COLORS.light } },
      left: { style: "thin", color: { rgb: COLORS.light } },
      right: { style: "thin", color: { rgb: COLORS.light } },
    },
  },
  number: {
    alignment: { horizontal: "right", vertical: "center" },
    numFmt: "0.00",
    border: {
      top: { style: "thin", color: { rgb: COLORS.light } },
      bottom: { style: "thin", color: { rgb: COLORS.light } },
      left: { style: "thin", color: { rgb: COLORS.light } },
      right: { style: "thin", color: { rgb: COLORS.light } },
    },
  },
};

/**
 * Helper function to apply styles to a range of cells
 */
const applyCellStyle = (
  worksheet: XLSX.WorkSheet,
  range: string,
  style: any
) => {
  const decoded = XLSX.utils.decode_range(range);
  for (let R = decoded.s.r; R <= decoded.e.r; ++R) {
    for (let C = decoded.s.c; C <= decoded.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" };
      worksheet[cellAddress].s = style;
    }
  }
};

/**
 * Helper function to set column widths
 */
const setColumnWidths = (worksheet: XLSX.WorkSheet, widths: number[]) => {
  worksheet["!cols"] = widths.map((width) => ({ wch: width }));
};

/**
 * Helper function to merge cells
 */
const mergeCells = (worksheet: XLSX.WorkSheet, range: string) => {
  if (!worksheet["!merges"]) worksheet["!merges"] = [];
  worksheet["!merges"].push(XLSX.utils.decode_range(range));
};

/**
 * Create a formatted sheet with title and data
 */
const createFormattedSheet = (
  title: string,
  headers: string[],
  data: any[][],
  options: {
    titleColor?: string;
    headerColor?: string;
    columnWidths?: number[];
    numberColumns?: number[];
  } = {}
) => {
  const sheetData = [[title], [""], headers, ...data];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Apply title style
  applyCellStyle(
    worksheet,
    "A1:" + XLSX.utils.encode_col(headers.length - 1) + "1",
    {
      ...STYLES.title,
      fill: { fgColor: { rgb: options.titleColor || COLORS.accent } },
    }
  );

  // Merge title cells
  if (headers.length > 1) {
    mergeCells(
      worksheet,
      "A1:" + XLSX.utils.encode_col(headers.length - 1) + "1"
    );
  }

  // Apply header style
  const headerRange = "A3:" + XLSX.utils.encode_col(headers.length - 1) + "3";
  applyCellStyle(worksheet, headerRange, {
    ...STYLES.header,
    fill: { fgColor: { rgb: options.headerColor || COLORS.primary } },
  });

  // Apply data styles
  if (data.length > 0) {
    const dataStartRow = 4;
    const dataEndRow = dataStartRow + data.length - 1;

    for (let col = 0; col < headers.length; col++) {
      const colLetter = XLSX.utils.encode_col(col);
      const dataRange = `${colLetter}${dataStartRow}:${colLetter}${dataEndRow}`;

      if (options.numberColumns?.includes(col)) {
        applyCellStyle(worksheet, dataRange, STYLES.number);
      } else {
        applyCellStyle(worksheet, dataRange, STYLES.data);
      }
    }
  }

  // Set column widths
  if (options.columnWidths) {
    setColumnWidths(worksheet, options.columnWidths);
  } else {
    // Auto-width based on content
    const autoWidths = headers.map((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...data.map((row) => String(row[index] || "").length)
      );
      return Math.min(Math.max(maxLength + 2, 10), 30);
    });
    setColumnWidths(worksheet, autoWidths);
  }

  return worksheet;
};

/**
 * Utility function to export academic analysis data to Excel
 * @param data - Academic analysis response data
 * @param filename - Optional filename for the Excel file
 */
export const exportAcademicAnalysisToExcel = async (
  data: AcademicAnalysisResponse,
  filename?: string
) => {
  try {
    if (!data) {
      toast.error("Không có dữ liệu để xuất");
      return;
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // 1. Tổng quan lớp học (Class Overview)
    const classOverviewHeaders = ["Thông tin", "Giá trị"];
    const classOverviewData = [
      ["Tên lớp", data.class_statistics.class_name || "N/A"],
      ["Tổng số học sinh", data.class_statistics.total_students],
      [
        "Điểm trung bình chung",
        data.class_statistics.overall_average.toFixed(2),
      ],
      ["Điểm cao nhất", data.class_statistics.highest_score],
      ["Điểm thấp nhất", data.class_statistics.lowest_score],
      ["", ""], // Empty row
      ["PHÂN LOẠI HỌC LỰC", ""],
      ["Giỏi", data.class_statistics.grade_distribution.Giỏi],
      ["Khá", data.class_statistics.grade_distribution.Khá],
      ["Trung bình", data.class_statistics.grade_distribution["Trung bình"]],
      ["Yếu", data.class_statistics.grade_distribution.Yếu],
    ];

    const classOverviewSheet = createFormattedSheet(
      "TỔNG QUAN LỚP HỌC",
      classOverviewHeaders,
      classOverviewData,
      {
        titleColor: COLORS.primary,
        headerColor: COLORS.secondary,
        columnWidths: [25, 15],
        numberColumns: [1],
      }
    );
    XLSX.utils.book_append_sheet(workbook, classOverviewSheet, "Tổng quan lớp");

    // 2. Thống kê theo môn học (Subject Statistics) với biểu đồ
    const subjectStatsHeaders = [
      "Môn học",
      "Điểm TB",
      "Điểm cao nhất",
      "Điểm thấp nhất",
      "HS điểm cao nhất",
      "HS điểm thấp nhất",
      "Tổng HS",
      "Tỷ lệ đạt (%)",
      "SL Giỏi",
      "SL Khá",
      "SL TB",
      "SL Yếu",
    ];

    const subjectStatsData = data.class_statistics.subject_statistics.map(
      (subject) => [
        subject.subject,
        subject.average_score.toFixed(2),
        subject.highest_score,
        subject.lowest_score,
        subject.highest_score_student,
        subject.lowest_score_student,
        subject.total_students,
        subject.pass_rate.toFixed(1),
        subject.excellent_count,
        subject.good_count,
        subject.average_count,
        subject.weak_count,
      ]
    );

    const subjectStatsSheet = createFormattedSheet(
      "THỐNG KÊ THEO MÔN HỌC",
      subjectStatsHeaders,
      subjectStatsData,
      {
        titleColor: COLORS.info,
        headerColor: COLORS.primary,
        columnWidths: [15, 10, 12, 12, 18, 18, 10, 12, 10, 10, 10, 10],
        numberColumns: [1, 2, 3, 6, 7, 8, 9, 10, 11],
      }
    );

    // Thêm biểu đồ cho điểm trung bình môn học
    const chartStartRow = subjectStatsData.length + 6;
    const chartData = [
      ["", ""],
      ["BIỂU ĐỒ ĐIỂM TRUNG BÌNH THEO MÔN HỌC", ""],
      ["", ""],
      ["Môn học", "Điểm TB"],
      ...data.class_statistics.subject_statistics.map((subject) => [
        subject.subject,
        subject.average_score,
      ]),
    ];

    // Thêm dữ liệu biểu đồ vào sheet
    XLSX.utils.sheet_add_aoa(subjectStatsSheet, chartData, {
      origin: `A${chartStartRow}`,
    });

    // Format biểu đồ title
    applyCellStyle(
      subjectStatsSheet,
      `A${chartStartRow + 1}:B${chartStartRow + 1}`,
      {
        ...STYLES.title,
        fill: { fgColor: { rgb: COLORS.success } },
      }
    );
    mergeCells(
      subjectStatsSheet,
      `A${chartStartRow + 1}:B${chartStartRow + 1}`
    );

    // Format biểu đồ headers
    applyCellStyle(
      subjectStatsSheet,
      `A${chartStartRow + 3}:B${chartStartRow + 3}`,
      STYLES.subHeader
    );

    XLSX.utils.book_append_sheet(
      workbook,
      subjectStatsSheet,
      "Thống kê môn học"
    );

    // 3. Bảng xếp hạng học sinh (Student Rankings)
    const studentRankingHeaders = [
      "Hạng",
      "Tên học sinh",
      "Lớp",
      "Điểm TB",
      "Xếp loại",
      "Môn mạnh",
      "Môn yếu",
    ];

    const studentRankingData = data.student_summaries
      .sort((a, b) => a.rank - b.rank)
      .map((student) => [
        student.rank,
        student.student.name,
        student.student.class_name,
        student.average_score.toFixed(2),
        student.grade_level,
        student.strong_subjects.join(", ") || "Không có",
        student.weak_subjects.join(", ") || "Không có",
      ]);

    const studentRankingSheet = createFormattedSheet(
      "BẢNG XẾP HẠNG HỌC SINH",
      studentRankingHeaders,
      studentRankingData,
      {
        titleColor: COLORS.warning,
        headerColor: COLORS.primary,
        columnWidths: [8, 20, 12, 10, 12, 25, 25],
        numberColumns: [0, 3],
      }
    );
    XLSX.utils.book_append_sheet(
      workbook,
      studentRankingSheet,
      "Xếp hạng học sinh"
    );

    // 4. Chi tiết điểm từng học sinh (Detailed Scores)
    const subjects =
      data.student_summaries[0]?.student.grades.map((g) => g.subject) || [];
    const detailedScoresHeaders = [
      "Tên học sinh",
      "Lớp",
      ...subjects,
      "Điểm TB",
      "Xếp hạng",
      "Xếp loại",
    ];

    const detailedScoresData = data.student_summaries
      .sort((a, b) => a.rank - b.rank)
      .map((studentSummary) => {
        const student = studentSummary.student;
        const scores = subjects.map((subject) => {
          const grade = student.grades.find((g) => g.subject === subject);
          return grade ? grade.score : "N/A";
        });

        return [
          student.name,
          student.class_name,
          ...scores,
          studentSummary.average_score.toFixed(2),
          studentSummary.rank,
          studentSummary.grade_level,
        ];
      });

    const detailedScoresSheet = createFormattedSheet(
      "CHI TIẾT ĐIỂM SỐ HỌC SINH",
      detailedScoresHeaders,
      detailedScoresData,
      {
        titleColor: COLORS.success,
        headerColor: COLORS.primary,
        columnWidths: [20, 12, ...subjects.map(() => 10), 10, 10, 12],
        numberColumns: [
          2,
          ...subjects.map((_, index) => index + 2),
          subjects.length + 2,
          subjects.length + 3,
        ],
      }
    );
    XLSX.utils.book_append_sheet(
      workbook,
      detailedScoresSheet,
      "Chi tiết điểm số"
    );

    // 5. Học sinh xuất sắc (Top Students)
    if (data.class_statistics.top_students.length > 0) {
      const topStudentsHeaders = ["Tên học sinh", "Điểm số"];
      const topStudentsData = data.class_statistics.top_students.map(
        (student) => [student.name, student.score]
      );

      const topStudentsSheet = createFormattedSheet(
        "HỌC SINH XUẤT SẮC",
        topStudentsHeaders,
        topStudentsData,
        {
          titleColor: COLORS.success,
          headerColor: COLORS.secondary,
          columnWidths: [25, 12],
          numberColumns: [1],
        }
      );
      XLSX.utils.book_append_sheet(workbook, topStudentsSheet, "HS xuất sắc");
    }

    // 6. Học sinh cần hỗ trợ (Weak Students)
    if (data.class_statistics.weak_students.length > 0) {
      const weakStudentsHeaders = ["Tên học sinh", "Điểm số"];
      const weakStudentsData = data.class_statistics.weak_students.map(
        (student) => [student.name, student.score]
      );

      const weakStudentsSheet = createFormattedSheet(
        "HỌC SINH CẦN HỖ TRỢ",
        weakStudentsHeaders,
        weakStudentsData,
        {
          titleColor: COLORS.danger,
          headerColor: COLORS.warning,
          columnWidths: [25, 12],
          numberColumns: [1],
        }
      );
      XLSX.utils.book_append_sheet(
        workbook,
        weakStudentsSheet,
        "HS cần hỗ trợ"
      );
    }

    // 7. Khuyến nghị (Recommendations)
    if (data.recommendations.length > 0) {
      const recommendationsHeaders = ["Khuyến nghị"];
      const recommendationsData = data.recommendations.map(
        (recommendation, index) => [`${index + 1}. ${recommendation}`]
      );

      const recommendationsSheet = createFormattedSheet(
        "KHUYẾN NGHỊ GIÁO DỤC",
        recommendationsHeaders,
        recommendationsData,
        {
          titleColor: COLORS.info,
          headerColor: COLORS.accent,
          columnWidths: [80],
          numberColumns: [],
        }
      );
      XLSX.utils.book_append_sheet(
        workbook,
        recommendationsSheet,
        "Khuyến nghị"
      );
    }

    // 8. Biểu đồ tổng hợp (Summary Charts)
    const summaryHeaders = ["Loại thống kê", "Giá trị"];
    const summaryData = [
      ["Tổng số học sinh", data.class_statistics.total_students],
      [
        "Điểm trung bình chung",
        data.class_statistics.overall_average.toFixed(2),
      ],
      ["", ""],
      ["PHÂN LOẠI HỌC LỰC", ""],
      ["Học sinh Giỏi", data.class_statistics.grade_distribution.Giỏi],
      ["Học sinh Khá", data.class_statistics.grade_distribution.Khá],
      [
        "Học sinh Trung bình",
        data.class_statistics.grade_distribution["Trung bình"],
      ],
      ["Học sinh Yếu", data.class_statistics.grade_distribution.Yếu],
      ["", ""],
      ["TỶ LỆ PHẦN TRĂM", ""],
      [
        "% Giỏi",
        (
          (data.class_statistics.grade_distribution.Giỏi /
            data.class_statistics.total_students) *
          100
        ).toFixed(1) + "%",
      ],
      [
        "% Khá",
        (
          (data.class_statistics.grade_distribution.Khá /
            data.class_statistics.total_students) *
          100
        ).toFixed(1) + "%",
      ],
      [
        "% Trung bình",
        (
          (data.class_statistics.grade_distribution["Trung bình"] /
            data.class_statistics.total_students) *
          100
        ).toFixed(1) + "%",
      ],
      [
        "% Yếu",
        (
          (data.class_statistics.grade_distribution.Yếu /
            data.class_statistics.total_students) *
          100
        ).toFixed(1) + "%",
      ],
    ];

    const summarySheet = createFormattedSheet(
      "BIỂU ĐỒ TỔNG HỢP",
      summaryHeaders,
      summaryData,
      {
        titleColor: COLORS.accent,
        headerColor: COLORS.primary,
        columnWidths: [25, 15],
        numberColumns: [1],
      }
    );

    // Thêm biểu đồ phân loại học lực
    const gradeChartStartRow = summaryData.length + 6;
    const gradeChartData = [
      ["", ""],
      ["BIỂU ĐỒ PHÂN LOẠI HỌC LỰC", ""],
      ["", ""],
      ["Xếp loại", "Số lượng", "Tỷ lệ %"],
      [
        "Giỏi",
        data.class_statistics.grade_distribution.Giỏi,
        (
          (data.class_statistics.grade_distribution.Giỏi /
            data.class_statistics.total_students) *
          100
        ).toFixed(1),
      ],
      [
        "Khá",
        data.class_statistics.grade_distribution.Khá,
        (
          (data.class_statistics.grade_distribution.Khá /
            data.class_statistics.total_students) *
          100
        ).toFixed(1),
      ],
      [
        "Trung bình",
        data.class_statistics.grade_distribution["Trung bình"],
        (
          (data.class_statistics.grade_distribution["Trung bình"] /
            data.class_statistics.total_students) *
          100
        ).toFixed(1),
      ],
      [
        "Yếu",
        data.class_statistics.grade_distribution.Yếu,
        (
          (data.class_statistics.grade_distribution.Yếu /
            data.class_statistics.total_students) *
          100
        ).toFixed(1),
      ],
    ];

    // Thêm dữ liệu biểu đồ vào sheet
    XLSX.utils.sheet_add_aoa(summarySheet, gradeChartData, {
      origin: `A${gradeChartStartRow}`,
    });

    // Format biểu đồ title
    applyCellStyle(
      summarySheet,
      `A${gradeChartStartRow + 1}:C${gradeChartStartRow + 1}`,
      {
        ...STYLES.title,
        fill: { fgColor: { rgb: COLORS.warning } },
      }
    );
    mergeCells(
      summarySheet,
      `A${gradeChartStartRow + 1}:C${gradeChartStartRow + 1}`
    );

    // Format biểu đồ headers
    applyCellStyle(
      summarySheet,
      `A${gradeChartStartRow + 3}:C${gradeChartStartRow + 3}`,
      STYLES.subHeader
    );

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Biểu đồ tổng hợp");

    // Generate filename
    const defaultFilename = `Phan_tich_hoc_tap_${
      data.class_statistics.class_name || "Lop"
    }_${new Date().toISOString().split("T")[0]}.xlsx`;
    const finalFilename = filename || defaultFilename;

    // Write and download the file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, finalFilename);
    toast.success("Xuất file Excel thành công!");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("Có lỗi xảy ra khi xuất file Excel");
    throw error;
  }
};
