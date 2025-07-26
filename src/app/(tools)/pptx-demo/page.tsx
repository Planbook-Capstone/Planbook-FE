"use client";

import { useState } from "react";
import { parsePptx, PptxSlide, PptxParseResult } from "@/lib/pptxParser";

export default function PptxDemoPage() {
  const [parseResult, setParseResult] = useState<PptxParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"slides" | "json">("slides");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pptx')) {
      setError('Please select a .pptx file');
      return;
    }

    setLoading(true);
    setError(null);
    setParseResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await parsePptx(arrayBuffer);
      setParseResult(result);
    } catch (err) {
      setError(`Error parsing PPTX: ${err}`);
      console.error('PPTX parsing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderSlideElement = (element: any, index: number) => {
    switch (element.type) {
      case 'text':
        return (
          <div
            key={index}
            className="absolute border border-blue-200 bg-blue-50 p-1 text-xs"
            style={{
              left: element.x,
              top: element.y,
              fontSize: Math.max(element.style?.fontSize || 12, 8),
              color: element.style?.color || '#000',
              fontFamily: element.style?.fontFamily || 'Arial',
              fontWeight: element.style?.bold ? 'bold' : 'normal',
              fontStyle: element.style?.italic ? 'italic' : 'normal',
            }}
          >
            {element.text}
          </div>
        );

      case 'image':
        return (
          <div
            key={index}
            className="absolute border border-green-200 bg-green-50"
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
            }}
          >
            <img
              src={element.src}
              alt={element.name || 'Image'}
              className="w-full h-full object-contain"
            />
          </div>
        );

      case 'shape':
        return (
          <div
            key={index}
            className="absolute border border-red-200 bg-red-50 flex items-center justify-center"
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
            }}
          >
            {element.svgPath ? (
              <svg
                width={element.width}
                height={element.height}
                viewBox={`0 0 ${element.width} ${element.height}`}
                className="w-full h-full"
              >
                <g
                  fill={element.fill || '#ccc'}
                  stroke={element.border ? '#999' : 'none'}
                  dangerouslySetInnerHTML={{ __html: element.svgPath }}
                />
              </svg>
            ) : (
              <span className="text-xs text-gray-600">{element.shapeType || 'Shape'}</span>
            )}
          </div>
        );

      case 'table':
        return (
          <div
            key={index}
            className="absolute border border-purple-200 bg-purple-50 p-2"
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
            }}
          >
            <div className="text-xs font-bold mb-1">Table</div>
            {element.rows && (
              <table className="w-full text-xs border-collapse">
                <tbody>
                  {element.rows.slice(0, 3).map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.cells.slice(0, 3).map((cell: any, cellIndex: number) => (
                        <td
                          key={cellIndex}
                          className="border border-gray-300 p-1"
                          style={{
                            backgroundColor: cell.style?.backgroundColor,
                            color: cell.style?.color,
                            fontWeight: cell.style?.bold ? 'bold' : 'normal',
                          }}
                        >
                          {cell.text.substring(0, 20)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case 'group':
        return (
          <div
            key={index}
            className="absolute border border-yellow-200 bg-yellow-50 flex items-center justify-center"
            style={{
              left: element.x,
              top: element.y,
              width: element.width || 100,
              height: element.height || 100,
            }}
          >
            <span className="text-xs text-gray-600">Group</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">PPTX Parser Demo</h1>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload PPTX File</h2>
          <input
            type="file"
            accept=".pptx"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {loading && <p className="mt-2 text-blue-600">Parsing PPTX...</p>}
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>

        {parseResult && (
          <>
            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Parse Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{parseResult.slides.length}</div>
                  <div className="text-sm text-gray-600">Slides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{parseResult.images.length}</div>
                  <div className="text-sm text-gray-600">Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {parseResult.slides.reduce((sum, slide) => sum + slide.elements.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Elements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {parseResult.slides.reduce((sum, slide) => sum + slide.shapes.filter(s => s.type === 'table').length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Tables</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab("slides")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      activeTab === "slides"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Slides Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("json")}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      activeTab === "json"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    JSON Data
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "slides" && (
                  <div className="space-y-8">
                    {parseResult.slides.map((slide) => (
                      <div key={slide.slideNumber} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-4">Slide {slide.slideNumber}</h3>
                        <div className="relative bg-white border border-gray-300 mx-auto" style={{ width: 800, height: 600 }}>
                          {slide.elements.map((element, index) => renderSlideElement(element, index))}
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          Elements: {slide.elements.length} | 
                          Types: {[...new Set(slide.elements.map(e => e.type))].join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "json" && (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(parseResult, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
