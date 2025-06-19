# API Constants Guide

## 📋 Centralized API Endpoint Management

### 🎯 **Why Use Constants?**

✅ **Consistency**: Tất cả endpoints ở một nơi  
✅ **Maintainability**: Dễ dàng update URLs  
✅ **Type Safety**: TypeScript support  
✅ **No Hardcoding**: Tránh hardcode URLs  
✅ **Reusability**: Dùng chung across services  

### 📁 **File Structure**

```
src/
├── constants/
│   └── apiEndpoints.ts          # All API constants
├── services/
│   ├── textbookServices.ts      # Using PDF_API_ENDPOINTS
│   └── usePdfApiSecondary.ts    # Using PDF_API_ENDPOINTS
└── hooks/
    └── useApiFactory.ts         # Generic factory
```

## 🔧 **API Constants Structure**

### Main API Endpoints (Port 8080)
```typescript
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/login",
    LOGIN_GOOGLE: "/login-google",
  },
  
  // Books, Chapters, Lessons, etc.
  BOOKS: "/books",
  CHAPTERS: "/chapters",
  LESSONS: "/lessons",
  // ...
} as const;
```

### PDF API Endpoints (Port 8000)
```typescript
export const PDF_API_ENDPOINTS = {
  // Textbook management
  GET_ALL_TEXTBOOKS: "/pdf/getAllTextBook",
  GET_TEXTBOOK_BY_ID: (id: string) => `/pdf/getTextBook/${id}`,
  UPLOAD_TEXTBOOK: "/pdf/upload",
  DELETE_TEXTBOOK: (id: string) => `/pdf/deleteTextBook/${id}`,
  
  // Search and filter
  SEARCH_TEXTBOOKS: "/pdf/search",
  FILTER_BY_SUBJECT: "/pdf/filter/subject",
  FILTER_BY_GRADE: "/pdf/filter/grade",
  
  // Health check
  HEALTH_CHECK: "/health",
} as const;
```

### Third API Endpoints (Port 8082)
```typescript
export const THIRD_API_ENDPOINTS = {
  // Analytics
  ANALYTICS: "/analytics",
  AI_ANALYSIS: "/ai/analysis",
  HEALTH_CHECK: "/health",
} as const;
```

## 🚀 **Usage Examples**

### 1. In Services
```typescript
// services/usePdfApiSecondary.ts
import { PDF_API_ENDPOINTS } from "@/constants/apiEndpoints";

export const pdfApiSecondaryService = {
  getAllTextBooks: async () => {
    const response = await apiSecondary.get(PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS);
    return response.data;
  },
  
  getTextBookById: async (id: string) => {
    const response = await apiSecondary.get(PDF_API_ENDPOINTS.GET_TEXTBOOK_BY_ID(id));
    return response.data;
  },
  
  uploadTextBook: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiSecondary.post(PDF_API_ENDPOINTS.UPLOAD_TEXTBOOK, formData);
    return response.data;
  },
};
```

### 2. In React Query Hooks
```typescript
// services/textbookServices.ts
import { PDF_API_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryQueryHook } from "@/hooks/useApiFactory";

export const useTextBooksService = createSecondaryQueryHook(
  "textbooks",
  PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS
);

export const useUploadTextBookService = createSecondaryMutationHook(
  "textbooks",
  PDF_API_ENDPOINTS.UPLOAD_TEXTBOOK
);
```

### 3. In Components
```typescript
// pages/admin/resource/[bookId]/content/page.tsx
import { pdfApiSecondaryService } from "@/services/usePdfApiSecondary";

const testGetAllTextBooks = async () => {
  console.log("🚀 Calling API with constants...");
  const response = await pdfApiSecondaryService.getAllTextBooks();
  console.log("✅ Response:", response);
};
```

## 🔄 **Migration from Hardcoded URLs**

### Before (Hardcoded)
```typescript
// ❌ Bad - Hardcoded URLs
const response = await apiSecondary.get("/pdf/getAllTextBook");
const book = await apiSecondary.get(`/pdf/getTextBook/${id}`);
const upload = await apiSecondary.post("/pdf/upload", formData);
```

### After (Constants)
```typescript
// ✅ Good - Using constants
import { PDF_API_ENDPOINTS } from "@/constants/apiEndpoints";

const response = await apiSecondary.get(PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS);
const book = await apiSecondary.get(PDF_API_ENDPOINTS.GET_TEXTBOOK_BY_ID(id));
const upload = await apiSecondary.post(PDF_API_ENDPOINTS.UPLOAD_TEXTBOOK, formData);
```

## 📝 **Adding New Endpoints**

### Step 1: Add to Constants
```typescript
// constants/apiEndpoints.ts
export const PDF_API_ENDPOINTS = {
  // Existing endpoints...
  
  // New endpoints
  ANALYZE_TEXTBOOK: "/pdf/analyze",
  GET_PROCESSING_STATUS: (jobId: string) => `/pdf/status/${jobId}`,
  EXTRACT_CONTENT: "/pdf/extract-content",
} as const;
```

### Step 2: Update Service
```typescript
// services/usePdfApiSecondary.ts
export const pdfApiSecondaryService = {
  // Existing methods...
  
  // New methods
  analyzeTextbook: async (data: any) => {
    const response = await apiSecondary.post(PDF_API_ENDPOINTS.ANALYZE_TEXTBOOK, data);
    return response.data;
  },
  
  getProcessingStatus: async (jobId: string) => {
    const response = await apiSecondary.get(PDF_API_ENDPOINTS.GET_PROCESSING_STATUS(jobId));
    return response.data;
  },
};
```

### Step 3: Create React Query Hook
```typescript
// services/textbookServices.ts
export const useAnalyzeTextBookService = createSecondaryMutationHook(
  "analyze",
  PDF_API_ENDPOINTS.ANALYZE_TEXTBOOK
);

export const useProcessingStatusService = createSecondaryQueryHook(
  "processing-status",
  PDF_API_ENDPOINTS.GET_PROCESSING_STATUS("") // Will be replaced with actual jobId
);
```

## 🎯 **Best Practices**

### 1. Naming Convention
```typescript
// ✅ Good - Clear, descriptive names
GET_ALL_TEXTBOOKS: "/pdf/getAllTextBook",
GET_TEXTBOOK_BY_ID: (id: string) => `/pdf/getTextBook/${id}`,
UPLOAD_TEXTBOOK: "/pdf/upload",

// ❌ Bad - Unclear names
GET_BOOKS: "/pdf/getAllTextBook",
BOOK: (id: string) => `/pdf/getTextBook/${id}`,
UPLOAD: "/pdf/upload",
```

### 2. Function Parameters
```typescript
// ✅ Good - Use functions for dynamic URLs
GET_TEXTBOOK_BY_ID: (id: string) => `/pdf/getTextBook/${id}`,
DELETE_TEXTBOOK: (id: string) => `/pdf/deleteTextBook/${id}`,
GET_LESSONS: (bookId: string, chapterId: string) => `/pdf/${bookId}/chapters/${chapterId}/lessons`,

// ❌ Bad - Hardcoded or template strings
GET_TEXTBOOK_BY_ID: "/pdf/getTextBook/", // Incomplete
DELETE_TEXTBOOK: "/pdf/deleteTextBook/${id}", // Template string
```

### 3. Grouping
```typescript
// ✅ Good - Logical grouping
export const PDF_API_ENDPOINTS = {
  // Textbook management
  GET_ALL_TEXTBOOKS: "/pdf/getAllTextBook",
  GET_TEXTBOOK_BY_ID: (id: string) => `/pdf/getTextBook/${id}`,
  
  // Search and filter
  SEARCH_TEXTBOOKS: "/pdf/search",
  FILTER_BY_SUBJECT: "/pdf/filter/subject",
  
  // Health and info
  HEALTH_CHECK: "/health",
  API_INFO: "/info",
} as const;
```

## 🔍 **Testing with Constants**

### Console Logging
```typescript
const testApiCall = async () => {
  console.log("🚀 Calling:", PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS);
  
  try {
    const response = await pdfApiSecondaryService.getAllTextBooks();
    console.log("✅ Success:", response);
  } catch (error) {
    console.error("❌ Error calling:", PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS, error);
  }
};
```

### Environment-specific URLs
```typescript
// .env.local
NEXT_PUBLIC_API_SECONDARY_URL=http://localhost:8000/api/v1

// .env.production
NEXT_PUBLIC_API_SECONDARY_URL=https://api.planbook.vn/api/v1

// Constants work with any base URL
const response = await apiSecondary.get(PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS);
// Calls: http://localhost:8000/api/v1/pdf/getAllTextBook (dev)
// Calls: https://api.planbook.vn/api/v1/pdf/getAllTextBook (prod)
```

## 📊 **Current Implementation Status**

### ✅ **Completed**
- [x] Created `PDF_API_ENDPOINTS` constants
- [x] Updated `pdfApiSecondaryService` to use constants
- [x] Updated `textbookServices.ts` to use constants
- [x] Added TypeScript types
- [x] Updated BookContentPage to test with constants

### 🔄 **In Progress**
- [ ] Update all remaining hardcoded URLs
- [ ] Add more PDF API endpoints
- [ ] Create constants for Third API

### 📋 **Next Steps**
1. Audit codebase for hardcoded URLs
2. Add missing endpoints to constants
3. Update all services to use constants
4. Add validation for endpoint functions
5. Create constants for query keys

## 🎉 **Benefits Achieved**

✅ **Centralized Management**: All endpoints in one place  
✅ **Type Safety**: TypeScript autocomplete and validation  
✅ **Easy Updates**: Change URL once, updates everywhere  
✅ **Consistent Naming**: Clear, descriptive endpoint names  
✅ **Better Testing**: Easy to mock and test endpoints  
✅ **Documentation**: Self-documenting API structure  

**Result: Clean, maintainable, and scalable API endpoint management!** 🚀
