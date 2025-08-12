"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useExecuteToolService } from "@/services/executeToolServices";

type SearchType = "image" | "video" | "both";

function FormuLensPages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [searchType, setSearchType] = useState<SearchType>("both");
  const { mutate: executeTool } = useExecuteToolService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);

    // Determine types based on searchType
    let types: string[] = [];
    if (searchType === "both") {
      types = ["image", "video"];
    } else if (searchType === "image") {
      types = ["image"];
    } else if (searchType === "video") {
      types = ["video"];
    }

    const inputJson = {
      lang: "vi",
      limit: 12,
      query: searchQuery,
      types: types,
    };

    const payload = {
      toolId: "bec58543-3b1c-459b-9b13-a78ddbdb33e3",
      toolType: "EXTERNAL",
      book_id: 1,
      lesson_id: 1,
      input: inputJson,
      academicYearId: 1,
    };

    executeTool(payload, {
      onSuccess: (response: any) => {
        console.log("Search successful:", response?.data?.data?.data);
        setIsLoading(false);
        setResults(response?.data?.data?.data);
      },
      onError: (error) => {
        console.error("Search failed:", error);
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3 items-center">
          <Input
            className="border-2 rounded-full flex-1"
            placeholder="Tìm kiếm công thức hoá học..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSearchType("both")}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                searchType === "both"
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🎯 Tất cả
            </button>
            <button
              type="button"
              onClick={() => setSearchType("image")}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                searchType === "image"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🖼️ Hình ảnh
            </button>
            <button
              type="button"
              onClick={() => setSearchType("video")}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                searchType === "video"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🎥 Video
            </button>
          </div>
          <Button
            type="submit"
            className="rounded-full px-6"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </Button>
        </div>
      </form>

      {results && (
        <div className="pt-10">
          <h2 className="text-xl font-calsans">Kết quả tìm kiếm</h2>

          {/* Images Section */}
          {results.images && results.images.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Hình ảnh</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.images.map((image: any, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.caption || "Image"}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-sm text-gray-600 truncate">
                        {image.caption || "Không có mô tả"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {image.source} - {image.format}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {results.videos && results.videos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Video</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.videos.map((video: any, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.video_id}`}
                        title={video.title}
                        className="w-full h-48 border-0"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">
                        {video.channel}
                      </p>
                      <p className="text-xs text-gray-400">
                        {video.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {(!results.images || results.images.length === 0) &&
           (!results.videos || results.videos.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy kết quả nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FormuLensPages;
