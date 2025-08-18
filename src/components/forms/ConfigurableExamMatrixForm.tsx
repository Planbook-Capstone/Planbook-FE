"use client";

import React, { useState, useEffect } from "react";

// Types for configurable matrix
interface DifficultyLevel {
  id: string;
  name: string;
  label: string;
  color: string;
}

interface MatrixPart {
  id: string;
  name: string;
  label: string;
  color: string;
  difficultyLevels: DifficultyLevel[];
}

interface MatrixTemplateConfig {
  id?: string;
  name: string;
  description: string;
  parts: MatrixPart[];
}

interface MatrixData {
  [partId: string]: {
    [difficultyId: string]: number;
  };
}

interface ConfigurableExamMatrixFormProps {
  config: MatrixTemplateConfig;
  onMatrixChange?: (matrix: MatrixData) => void;
  initialData?: MatrixData;
  readonly?: boolean;
}

const ConfigurableExamMatrixForm: React.FC<ConfigurableExamMatrixFormProps> = ({
  config,
  onMatrixChange,
  initialData,
  readonly = false,
}) => {
  // Initialize matrix data based on config
  const initializeMatrix = (): MatrixData => {
    const matrix: MatrixData = {};
    config.parts.forEach((part: MatrixPart) => {
      matrix[part.id] = {};
      part.difficultyLevels.forEach((difficulty: DifficultyLevel) => {
        matrix[part.id][difficulty.id] = 0;
      });
    });
    return matrix;
  };

  const [examMatrix, setExamMatrix] = useState<MatrixData>(
    initialData || initializeMatrix()
  );

  // Update matrix when config changes
  useEffect(() => {
    if (!initialData) {
      setExamMatrix(initializeMatrix());
    }
  }, [config]);

  const handleInputChange = (partId: string, difficultyId: string, value: string) => {
    if (readonly) return;

    const newMatrix = {
      ...examMatrix,
      [partId]: {
        ...examMatrix[partId],
        [difficultyId]: parseInt(value) || 0,
      },
    };

    setExamMatrix(newMatrix);

    // Gọi callback nếu có
    if (onMatrixChange) {
      onMatrixChange(newMatrix);
    }
  };

  // Calculate total by difficulty across all parts
  const getTotalByDifficulty = (difficultyId: string) => {
    return config.parts.reduce((total, part) => {
      return total + (examMatrix[part.id]?.[difficultyId] || 0);
    }, 0);
  };

  // Calculate total by part
  const getTotalByPart = (partId: string) => {
    const partData = examMatrix[partId];
    if (!partData) return 0;
    
    return Object.values(partData).reduce((sum, value) => sum + value, 0);
  };

  // Calculate grand total
  const getGrandTotal = () => {
    return config.parts.reduce((total, part) => {
      return total + getTotalByPart(part.id);
    }, 0);
  };

  return (
    <div className="overflow-hidden">
      <table className="w-full text-center rounded-md border mb-4">
        <thead className="font-calsans text-base">
          <tr>
            {config.parts.map((part) => (
              <th
                key={part.id}
                className={`border px-2 py-4 align-middle ${part.color}`}
                colSpan={part.difficultyLevels.length}
              >
                <span className="font-normal">
                  {part.name}
                  {part.label && (
                    <div className="text-xs text-gray-600 mt-1">
                      ({part.label})
                    </div>
                  )}
                </span>
              </th>
            ))}
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Tổng</span>
            </th>
          </tr>
          <tr>
            {config.parts.map((part) =>
              part.difficultyLevels.map((difficulty) => (
                <th key={`${part.id}-${difficulty.id}`} className="border px-2 py-2">
                  <span className="font-normal" title={difficulty.label}>
                    {difficulty.name}
                  </span>
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {/* Hàng nhập liệu */}
          <tr className="font-questrial">
            {config.parts.map((part) =>
              part.difficultyLevels.map((difficulty) => (
                <td key={`${part.id}-${difficulty.id}`} className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    value={examMatrix[part.id]?.[difficulty.id] || 0}
                    onChange={(e) =>
                      handleInputChange(part.id, difficulty.id, e.target.value)
                    }
                    className={`w-full px-2 py-2 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      readonly ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="0"
                    disabled={readonly}
                  />
                </td>
              ))
            )}
            {/* Tổng số câu */}
            <td className="border px-2 py-1">
              <div className="px-2 py-2 text-center font-semibold text-blue-600 bg-gray-50 rounded">
                {getGrandTotal()}
              </div>
            </td>
          </tr>

          {/* Hàng tổng theo phần */}
          <tr className="bg-gray-50">
            {config.parts.map((part) => (
              <td
                key={`${part.id}-total`}
                className="border px-2 py-3 text-center"
                colSpan={part.difficultyLevels.length}
              >
                <span className={`font-calsans ${part.color.replace('bg-', 'text-').replace('-50', '-700')}`}>
                  {getTotalByPart(part.id)}
                </span>
              </td>
            ))}
            <td className="border px-2 py-3 text-center">
              <span className="font-bold font-questrial text-blue-700">
                {getGrandTotal()}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary by difficulty levels */}
      {config.parts.length > 0 && config.parts[0].difficultyLevels.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium font-calsans mb-2">Tổng theo mức độ:</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            {config.parts[0].difficultyLevels.map((difficulty) => (
              <div key={difficulty.id} className="bg-white p-2 rounded">
                <div className="text-sm text-gray-600">{difficulty.label}</div>
                <div className="font-bold text-lg">{getTotalByDifficulty(difficulty.id)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurableExamMatrixForm;
