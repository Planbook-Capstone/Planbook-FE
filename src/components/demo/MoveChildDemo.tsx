"use client";

import React, { useState } from 'react';
import { DragDropContext } from "@hello-pangea/dnd";
import Canvas from './Canvas';
import { useLessonPlanActions } from '../templates/lesson-plan/hooks/useLessonPlanActions';

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

// Sample data for testing
const createSampleData = (): DemoNode[] => {
  const child1: DemoNode = {
    id: 'child-1',
    parentId: 'parent-1',
    title: 'Child 1',
    content: 'Content of child 1',
    fieldType: 'INPUT',
    type: 'PARAGRAPH',
    orderIndex: 0,
    status: 'ACTIVE',
    children: []
  };

  const child2: DemoNode = {
    id: 'child-2',
    parentId: 'parent-1',
    title: 'Child 2',
    content: 'Content of child 2',
    fieldType: 'INPUT',
    type: 'PARAGRAPH',
    orderIndex: 1,
    status: 'ACTIVE',
    children: []
  };

  const child3: DemoNode = {
    id: 'child-3',
    parentId: 'parent-1',
    title: 'Child 3',
    content: 'Content of child 3',
    fieldType: 'INPUT',
    type: 'PARAGRAPH',
    orderIndex: 2,
    status: 'ACTIVE',
    children: []
  };

  const parent: DemoNode = {
    id: 'parent-1',
    parentId: null,
    title: 'Parent Section',
    content: 'This is a parent section with children',
    fieldType: 'INPUT',
    type: 'SECTION',
    orderIndex: 0,
    status: 'ACTIVE',
    children: [child1, child2, child3]
  };

  return [parent];
};

export default function MoveChildDemo() {
  const [demoData, setDemoData] = useState<DemoNode[]>(createSampleData());
  const [trashData, setTrashData] = useState<DemoNode[]>([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);

  const updateFinalData = (newData: DemoNode[]) => {
    console.log('Final data updated:', newData);
  };

  const {
    handleInputChange,
    handleTitleChange,
    handleDeleteNode,
    moveChildUp,
    moveChildDown,
  } = useLessonPlanActions({
    demoData,
    setDemoData,
    trashData,
    setTrashData,
    updateFinalData,
  });

  const handleDragEnd = () => {
    // Empty handler for demo
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Demo: Move Child Up/Down</h1>
      
      <div className="mb-4 space-x-4">
        <button
          onClick={() => setShowDeleteButtons(!showDeleteButtons)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showDeleteButtons ? 'Hide' : 'Show'} Delete Buttons
        </button>
        
        <button
          onClick={() => setDemoData(createSampleData())}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Reset Data
        </button>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Hover over any child node to see up/down arrow buttons on the left</li>
          <li>Click the up arrow to move the child up in the list</li>
          <li>Click the down arrow to move the child down in the list</li>
          <li>First child cannot move up, last child cannot move down</li>
          <li>The buttons are disabled accordingly</li>
        </ul>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Canvas
          demoData={demoData}
          showDeleteButtons={showDeleteButtons}
          onDeleteNode={handleDeleteNode}
          onUpdateNodeTitle={handleTitleChange}
          onUpdateNodeContent={handleInputChange}
          onMoveChildUp={moveChildUp}
          onMoveChildDown={moveChildDown}
        />
      </DragDropContext>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Current Data Structure:</h3>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(demoData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
