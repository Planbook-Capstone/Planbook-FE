export interface CellContent {
  text?: string;
  image?: {
    url: string;
    name?: string;
  };
}

export interface TableData {
  headers: string[];
  rows: (string | CellContent)[][];
}

export interface DemoNode {
  id: string;
  lessonPlanId?: number;
  parentId?: string | null;
  title: string;
  content: string;
  description?: string | null; // New field for image descriptions
  fieldType: "INPUT" | "TABLE" | "IMAGE" | "QUESTION_BANK";
  type:
    | "PARAGRAPH"
    | "LIST_ITEM"
    | "TABLE"
    | "IMAGE"
    | "SECTION"
    | "SUBSECTION"
    | "QUESTION_BANK";
  orderIndex: number;
  metadata?: any;
  status: "ACTIVE" | "DELETED";
  children: DemoNode[];
}

export interface ComponentPaletteItem {
  id: string;
  type:
    | "PARAGRAPH"
    | "LIST_ITEM"
    | "TABLE"
    | "IMAGE"
    | "SECTION"
    | "SUBSECTION"
    | "QUESTION_BANK";
  fieldType: "INPUT" | "TABLE" | "IMAGE" | "QUESTION_BANK";
  title: string;
  icon: React.ReactNode;
  description: string;
}

export interface LessonPlanState {
  demoData: DemoNode[];
  trashData: DemoNode[];
  showDeleteButtons: boolean;
  activeTab: "components" | "images" | "trash";
  showPreview: boolean;
  sidebarCollapsed: boolean;
  currentStep: number;
  finalData: Record<string, DemoNode[]>;
}

export interface WebSocketData {
  status?: string;
  message?: string;
  progress?: number;
  children?: any[];
  tool_code?: string;
  result_id?: string;
}
