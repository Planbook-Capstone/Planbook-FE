"use client";

import React, { useState } from "react";
import FileThumbnailPreview from "@/components/examples/FileThumbnailPreview";
import { useRecentFiles } from "@/store";

// Mock data for testing
const mockFiles = [
  {
    id: "exam-1",
    type: "exam",
    data: {
      id: 1,
      name: "Đề thi Toán lớp 12",
      type: "EXAM",
      data: {
        parts: [
          {
            part: "PHẦN I",
            title: "TRẮC NGHIỆM",
            questions: [
              {
                questionNumber: 1,
                question: "Tính đạo hàm của hàm số y = x² + 3x - 1",
                options: {
                  A: "2x + 3",
                  B: "x² + 3",
                  C: "2x - 1",
                  D: "3x + 1"
                }
              },
              {
                questionNumber: 2,
                question: "Giải phương trình x² - 4 = 0",
                options: {
                  A: "x = ±2",
                  B: "x = 2",
                  C: "x = -2",
                  D: "x = 4"
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    id: "lesson-plan-1",
    type: "lesson-plan",
    data: {
      id: 2,
      name: "Bài học về Đạo hàm",
      title: "Bài học về Đạo hàm",
      subject: "Toán học",
      grade: 12,
      type: "LESSON_PLAN",
      data: [
        {
          id: "section-1",
          type: "SECTION",
          title: "I. Mục tiêu bài học",
          content: "Học sinh hiểu được khái niệm đạo hàm và ứng dụng",
          children: [
            {
              id: "text-1",
              type: "TEXT",
              title: "",
              content: "Nắm được định nghĩa đạo hàm tại một điểm"
            },
            {
              id: "image-1",
              type: "IMAGE",
              title: "Hình minh họa đạo hàm",
              content: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
              description: "Đồ thị minh họa khái niệm đạo hàm"
            },
            {
              id: "image-2",
              type: "IMAGE",
              title: "Biểu đồ hàm số",
              content: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
              description: "Biểu đồ các loại hàm số"
            },
            {
              id: "table-1",
              type: "TABLE",
              title: "Bảng công thức đạo hàm",
              content: "Các công thức đạo hàm cơ bản"
            }
          ]
        },
        {
          id: "section-2",
          type: "SECTION",
          title: "II. Nội dung bài học",
          content: "Trình bày các khái niệm và công thức",
          children: [
            {
              id: "list-1",
              type: "LIST_ITEM",
              title: "Định nghĩa đạo hàm",
              content: "Đạo hàm của hàm số f(x) tại điểm x₀"
            }
          ]
        }
      ]
    }
  },
  {
    id: "slide-1",
    type: "slide",
    data: {
      id: 3,
      name: "Presentation về Đạo hàm",
      type: "SLIDE",
      data: {
        slides: [
          {
            id: "slide-1",
            title: "Giới thiệu về Đạo hàm",
            elements: [
              {
                id: "text-1",
                type: "text",
                x: 100,
                y: 100,
                width: 400,
                height: 100,
                text: "Đạo hàm trong Toán học",
                style: {
                  fontSize: 24,
                  fontFamily: "Arial",
                  bold: true,
                  color: "#000000"
                }
              }
            ]
          }
        ]
      }
    }
  }
];

export default function TestThumbnailPage() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { recentFiles, clearAll } = useRecentFiles();

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
    console.log("File clicked:", file);
  };

  const handleDeleteFile = (fileId: string) => {
    console.log("Delete file:", fileId);
    // Implement delete logic here
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test FileThumbnailPreview Component
          </h1>
          <p className="text-gray-600">
            Demo các loại file với render image và table support
          </p>
        </div>

        {/* Mock Files Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Mock Files (Demo Data)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mockFiles.map((file) => (
              <div key={file.id} className="space-y-2">
                <FileThumbnailPreview
                  file={file}
                  width={200}
                  height={260}
                  onClick={handleFileClick}
                  onDelete={handleDeleteFile}
                />
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {file.data.name}
                  </h3>
                  <p className="text-xs text-gray-500 capitalize">
                    {file.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Files Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Files ({recentFiles.length})
            </h2>
            {recentFiles.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          
          {recentFiles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recentFiles.map((file) => (
                <div key={file.id} className="space-y-2">
                  <FileThumbnailPreview
                    file={file}
                    width={200}
                    height={260}
                    onClick={handleFileClick}
                  />
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {file.type}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(file.lastOpened).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có file nào trong recent files</p>
              <p className="text-sm">Click vào mock files ở trên để thêm vào recent files</p>
            </div>
          )}
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected File Info
            </h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedFile.id}</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
              <p><strong>Name:</strong> {selectedFile.data.name}</p>
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-gray-700">
                  Raw Data (Click to expand)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(selectedFile, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
