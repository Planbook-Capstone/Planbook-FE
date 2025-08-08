"use client";

import React from 'react';

// Simple debug component to test paste functionality
export default function PasteDebug() {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Right click detected!");
    alert("Right click works!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    if (isCtrlOrCmd && e.key.toLowerCase() === "v") {
      e.preventDefault();
      console.log("Ctrl+V detected!");
      alert("Ctrl+V works!");
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-blue-500 m-4">
      <h3 className="text-lg font-bold mb-2">Debug Paste Functionality</h3>
      <div 
        className="p-4 bg-gray-100 cursor-pointer"
        onContextMenu={handleRightClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <p>Right-click me or press Ctrl+V while focused</p>
        <p className="text-sm text-gray-600">Check console for logs</p>
      </div>
    </div>
  );
}
