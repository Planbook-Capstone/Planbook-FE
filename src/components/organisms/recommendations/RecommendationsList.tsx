"use client";

import React from "react";

interface RecommendationsListProps {
  recommendations?: string[];
}

export function RecommendationsList({
  recommendations = [],
}: RecommendationsListProps) {
  const parseRecommendations = (recs: string[]) => {
    const parsed = [];
    let currentSection = null;

    for (const rec of recs) {
      if (rec.includes("👥") || rec.includes("🤝")) {
        // Main recommendation
        currentSection = {
          type: rec.includes("👥") ? "individual" : "group",
          title: rec.replace(/👥|🤝/, "").trim(),
          items: [],
        };
        parsed.push(currentSection);
      } else if (rec.trim().startsWith("•") && currentSection) {
        // Sub-item
        currentSection.items.push(rec.replace("•", "").trim());
      } else if (rec.trim().startsWith("   •") && currentSection) {
        // Sub-item with indentation
        currentSection.items.push(rec.replace("   •", "").trim());
      }
    }

    return parsed;
  };

  const parsedRecommendations = parseRecommendations(recommendations);

  const getCardStyle = (type: string) => {
    switch (type) {
      case "individual":
        return "bg-orange-50 border-orange-200";
      case "group":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-calsans mb-4">Đề xuất cải thiện</h2>

      <div className="space-y-4">
        {parsedRecommendations.map((section, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getCardStyle(section.type)}`}
          >
            <div className="flex-1">
              <h4 className="font-calsans text-gray-900 mb-2">
                {section.title}
              </h4>

              {section.items.length > 0 && (
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-sm text-gray-700 flex items-start space-x-2"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
