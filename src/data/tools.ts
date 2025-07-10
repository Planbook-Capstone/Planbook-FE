// Mock data for API tools management
export interface ExternalToolConfig {
  id: string; // UUID
  name: string; // Required, tên dịch vụ tích hợp
  apiUrl: string; // Required, validate URL
  tokenUrl: string; // Required, validate URL
  clientId: string; // Required
  clientSecret: string; // Required, có thể hidden trong UI
  description?: string; // Optional, mô tả về công cụ
  ownerId: string; // Required - là `user.id` của tool-manager
}

export const mockExternalToolConfigs: ExternalToolConfig[] = [
  {
    id: "tool-uuid-1",
    name: "AI-Writer",
    apiUrl: "https://api.aiwriter.com/generate",
    tokenUrl: "https://api.aiwriter.com/token",
    clientId: "ai-client",
    clientSecret: "super-secret",
    description: "Tích hợp AI để tạo văn bản",
    ownerId: "uuid-4", // tool-manager 1
  },
  {
    id: "tool-uuid-2",
    name: "OpenAI GPT API",
    apiUrl: "https://api.openai.com/v1",
    tokenUrl: "https://api.openai.com/v1/auth/token",
    clientId: "openai_client_123",
    clientSecret: "sk-openai-secret-key-abc123",
    description: "API tích hợp OpenAI GPT cho tạo nội dung giáo án tự động",
    ownerId: "uuid-4", // tool-manager 1
  },
  {
    id: "tool-uuid-2",
    name: "Google Translate API",
    apiUrl: "https://translation.googleapis.com/language/translate/v2",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: "google_translate_456",
    clientSecret: "google-secret-xyz789",
    description: "API dịch thuật đa ngôn ngữ cho nội dung giáo dục",
    ownerId: "uuid-4", // tool-manager 1
  },
  {
    id: "tool-uuid-3",
    name: "Unsplash Images API",
    apiUrl: "https://api.unsplash.com",
    tokenUrl: "https://unsplash.com/oauth/token",
    clientId: "unsplash_client_789",
    clientSecret: "unsplash-secret-def456",
    description: "API lấy hình ảnh miễn phí cho tài liệu giảng dạy",
    ownerId: "uuid-7", // tool-manager 2
  },
  {
    id: "tool-uuid-4",
    name: "YouTube Data API",
    apiUrl: "https://www.googleapis.com/youtube/v3",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: "youtube_client_012",
    clientSecret: "youtube-secret-ghi789",
    description: "API tìm kiếm video giáo dục từ YouTube",
    ownerId: "uuid-7", // tool-manager 2
  },
  {
    id: "tool-uuid-5",
    name: "Weather API",
    apiUrl: "https://api.openweathermap.org/data/2.5",
    tokenUrl: "https://api.openweathermap.org/auth",
    clientId: "weather_client_345",
    clientSecret: "weather-secret-jkl012",
    description: "API thời tiết cho các bài học về khoa học tự nhiên",
    ownerId: "uuid-4", // tool-manager 1
  },
];

// Revenue data for dashboard charts
export interface RevenueRecord {
  id: string; // UUID
  toolId: string; // liên kết với ExternalToolConfig.id
  month: string; // ISO string hoặc '2025-07', dùng để hiển thị biểu đồ theo tháng
  amount: number; // số tiền thu được, đơn vị VNĐ
}

export const mockRevenueData: RevenueRecord[] = [
  // OpenAI GPT API revenue
  { id: "rev-1", toolId: "tool-uuid-1", month: "2025-01", amount: 2500000 },
  { id: "rev-2", toolId: "tool-uuid-1", month: "2025-02", amount: 3200000 },
  { id: "rev-3", toolId: "tool-uuid-1", month: "2025-03", amount: 2800000 },
  { id: "rev-4", toolId: "tool-uuid-1", month: "2025-04", amount: 3500000 },
  { id: "rev-5", toolId: "tool-uuid-1", month: "2025-05", amount: 4100000 },

  // Google Translate API revenue
  { id: "rev-6", toolId: "tool-uuid-2", month: "2025-01", amount: 1200000 },
  { id: "rev-7", toolId: "tool-uuid-2", month: "2025-02", amount: 1500000 },
  { id: "rev-8", toolId: "tool-uuid-2", month: "2025-03", amount: 1800000 },
  { id: "rev-9", toolId: "tool-uuid-2", month: "2025-04", amount: 2100000 },
  { id: "rev-10", toolId: "tool-uuid-2", month: "2025-05", amount: 2400000 },

  // Unsplash Images API revenue
  { id: "rev-11", toolId: "tool-uuid-3", month: "2025-01", amount: 800000 },
  { id: "rev-12", toolId: "tool-uuid-3", month: "2025-02", amount: 950000 },
  { id: "rev-13", toolId: "tool-uuid-3", month: "2025-03", amount: 1100000 },
  { id: "rev-14", toolId: "tool-uuid-3", month: "2025-04", amount: 1300000 },
  { id: "rev-15", toolId: "tool-uuid-3", month: "2025-05", amount: 1580000 },

  // Weather API revenue
  { id: "rev-16", toolId: "tool-uuid-5", month: "2025-01", amount: 600000 },
  { id: "rev-17", toolId: "tool-uuid-5", month: "2025-02", amount: 750000 },
  { id: "rev-18", toolId: "tool-uuid-5", month: "2025-03", amount: 900000 },
  { id: "rev-19", toolId: "tool-uuid-5", month: "2025-04", amount: 1050000 },
  { id: "rev-20", toolId: "tool-uuid-5", month: "2025-05", amount: 1200000 },
];
