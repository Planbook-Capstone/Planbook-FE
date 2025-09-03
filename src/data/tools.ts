// Mock data for API tools management
export interface ExternalToolConfig {
  id: string;
  name: string;
  apiUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  description?: string;
  icon?: string; // Base64 encoded image or URL
  ownerId: string;
}

export const mockExternalToolConfigs: ExternalToolConfig[] = [];

// Revenue data for dashboard charts
export interface RevenueRecord {
  id: string;
  toolId: string;
  month: string;
  amount: number;
}

export const mockRevenueData: RevenueRecord[] = [];
