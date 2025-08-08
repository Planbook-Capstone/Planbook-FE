"use client";

import React, { useState } from "react";

interface ExamMatrixData {
  part1: { nb: number; th: number; vd: number };
  part2: { nb: number; th: number; vd: number };
  part3: { nb: number; th: number; vd: number };
}

interface ExamMatrixFormProps {
  onMatrixChange?: (matrix: ExamMatrixData) => void;
  initialData?: ExamMatrixData;
}

const ExamMatrixForm: React.FC<ExamMatrixFormProps> = ({
  onMatrixChange,
  initialData,
}) => {
  const [examMatrix, setExamMatrix] = useState<ExamMatrixData>(
    initialData || {
      part1: { nb: 0, th: 0, vd: 0 },
      part2: { nb: 0, th: 0, vd: 0 },
      part3: { nb: 0, th: 0, vd: 0 },
    }
  );

  const handleInputChange = (part: string, type: string, value: string) => {
    const newMatrix = {
      ...examMatrix,
      [part]: {
        ...examMatrix[part as keyof typeof examMatrix],
        [type]: parseInt(value) || 0,
      },
    };

    setExamMatrix(newMatrix);

    // Gọi callback nếu có
    if (onMatrixChange) {
      onMatrixChange(newMatrix);
    }
  };

  const getTotalByType = (type: string) => {
    return (
      examMatrix.part1[type as keyof typeof examMatrix.part1] +
      examMatrix.part2[type as keyof typeof examMatrix.part2] +
      examMatrix.part3[type as keyof typeof examMatrix.part3]
    );
  };

  const getTotalByPart = (part: string) => {
    const partData = examMatrix[part as keyof typeof examMatrix];
    return partData.nb + partData.th + partData.vd;
  };

  const getGrandTotal = () => {
    return getTotalByType("nb") + getTotalByType("th") + getTotalByType("vd");
  };

  return (
    <div className="overflow-hidden">
      <table className="w-full text-center rounded-md border mb-4">
        <thead className="font-calsans text-base">
          <tr>
            <th
              className="border px-2 py-4 align-middle bg-amber-50"
              colSpan={3}
            >
              <span className="font-normal">Phần 1</span>
            </th>
            <th
              className="border px-2 py-4 align-middle bg-green-50"
              colSpan={3}
            >
              <span className="font-normal">Phần 2</span>
            </th>
            <th className="border px-2 py-4 align-middle bg-sky-50" colSpan={3}>
              <span className="font-normal">Phần 3</span>
            </th>
            <th className="border px-2 py-4 align-middle " rowSpan={2}>
              <span className="font-normal">Tổng</span>
            </th>
          </tr>
          <tr>
            {[1, 2, 3].map((partNum) => (
              <React.Fragment key={partNum}>
                <th className="border px-2 py-2">
                  <span className="font-normal">NB</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal">TH</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal">VD</span>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Hàng nhập liệu */}
          <tr className="font-questrial">
            {/* Phần 1 */}
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part1.nb}
                onChange={(e) =>
                  handleInputChange("part1", "nb", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part1.th}
                onChange={(e) =>
                  handleInputChange("part1", "th", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part1.vd}
                onChange={(e) =>
                  handleInputChange("part1", "vd", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>

            {/* Phần 2 */}
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part2.nb}
                onChange={(e) =>
                  handleInputChange("part2", "nb", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part2.th}
                onChange={(e) =>
                  handleInputChange("part2", "th", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part2.vd}
                onChange={(e) =>
                  handleInputChange("part2", "vd", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>

            {/* Phần 3 */}
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part3.nb}
                onChange={(e) =>
                  handleInputChange("part3", "nb", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part3.th}
                onChange={(e) =>
                  handleInputChange("part3", "th", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="number"
                min="0"
                value={examMatrix.part3.vd}
                onChange={(e) =>
                  handleInputChange("part3", "vd", e.target.value)
                }
                className="w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </td>

            {/* Tổng số câu */}
            <td className="border px-2 py-1">
              <div className="px-2 py-2 text-center font-semibold text-blue-600 bg-gray-50 rounded">
                {getGrandTotal()}
              </div>
            </td>
          </tr>

          {/* Hàng tổng theo phần */}
          <tr className="bg-gray-50">
            <td className="border px-2 py-3 text-center" colSpan={3}>
              <span className="font-calsans text-amber-700">
                {getTotalByPart("part1")}
              </span>
            </td>
            <td className="border px-2 py-3 text-center" colSpan={3}>
              <span className="font-calsans text-green-700">
                {getTotalByPart("part2")}
              </span>
            </td>
            <td className="border px-2 py-3 text-center" colSpan={3}>
              <span className="font-calsans text-sky-700">
                {getTotalByPart("part3")}
              </span>
            </td>
            <td className="border px-2 py-3 text-center">
              <span className="font-bold font-questrial text-blue-700">
                {getGrandTotal()}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExamMatrixForm;
