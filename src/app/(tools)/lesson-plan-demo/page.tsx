"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";

export default function LessonPlanDemoPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900">Đầu mục</h2>
            <p className="text-sm text-gray-500">Học tập</p>
            <p className="text-sm text-gray-500">Đáng kể học liệu</p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">Kiến thức</div>
            <div className="text-xs text-gray-600 leading-relaxed">
              Nguyên cứu cơ yếu tố ảnh hưởng đến tốc độ phản ứng có chế phản ứng
              và cân bằng điện tử...
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">Ứng dụng</div>
            <div className="text-xs text-gray-600 leading-relaxed">
              Nguyên cứu cơ yếu tố ảnh hưởng đến tốc độ phản ứng có chế phản ứng
              và cân bằng điện tử...
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mục tiêu</h1>

          <div className="space-y-6">
            {/* Ứng dụng Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ứng dụng
              </h2>

              <div className="space-y-4">
                <div className="text-sm text-gray-700">
                  Sau bài học này, HS sẽ:
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Trình bày được khái niệm phản ứng thuận nghịch và trạng
                      thái cân bằng của một phản ứng thuận nghịch
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Viết được biểu thức hằng số cân bằng (Kc) của một phản ứng
                      thuận nghịch
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Thực hiện được thí nghiệm nghiên cứu ảnh hưởng của nồng
                      độ, nhiệt độ, áp suất đến cân bằng hóa học
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Vận dụng được nguyên lí Chatelier để giải thích ảnh hưởng
                      của nhiệt độ, nồng độ, áp suất đến cân bằng hóa học.
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm text-gray-600">
                      Yêu cầu chính xác
                    </Label>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <Textarea
                    placeholder=""
                    className="w-full min-h-[80px] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Kiến thức Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kiến thức
              </h2>

              <div className="space-y-4">
                <div className="text-sm text-gray-700">
                  Sau bài học này, HS sẽ:
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Trình bày được khái niệm phản ứng thuận nghịch và trạng
                      thái cân bằng của một phản ứng thuận nghịch
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Viết được biểu thức hằng số cân bằng (Kc) của một phản ứng
                      thuận nghịch
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Thực hiện được thí nghiệm nghiên cứu ảnh hưởng của nồng
                      độ, nhiệt độ, áp suất đến cân bằng hóa học
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-gray-400">-</span>
                    <span>
                      Vận dụng được nguyên lí Chatelier để giải thích ảnh hưởng
                      của nhiệt độ, nồng độ, áp suất đến cân bằng hóa học.
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm text-gray-600">
                      Yêu cầu chính xác
                    </Label>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <Textarea
                    placeholder=""
                    className="w-full min-h-[80px] text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
