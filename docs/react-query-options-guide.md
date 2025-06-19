# React Query Options Guide

## 📋 Có 2 Options để sử dụng React Query với APIs

### Option 1: Generic Factory Pattern (Khuyến nghị - Clean Code)

#### Import và sử dụng
```typescript
import { 
  createSecondaryQueryHook,
  createSecondaryMutationHook,
  createPdfQueryHook,
  createPdfMutationHook 
} from "@/hooks/useApiFactory";

// Tạo hooks cho Secondary API (port 8000 hoặc 8081)
const useSecondaryTextBooks = createSecondaryQueryHook("textbooks", "/pdf/getAllTextBook");
const useSecondaryUpload = createSecondaryMutationHook("textbooks", "/pdf/upload");

// Tạo hooks cho PDF API (port 8000)
const usePdfTextBooks = createPdfQueryHook("textbooks", "/pdf/getAllTextBook");
const usePdfUpload = createPdfMutationHook("textbooks", "/pdf/upload");

// Sử dụng trong component
function MyComponent() {
  const { data, isLoading, error } = useSecondaryTextBooks();
  const uploadMutation = useSecondaryUpload();

  return (
    <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

#### Ưu điểm:
- ✅ **Reusable**: Dùng chung cho tất cả APIs
- ✅ **Consistent**: Naming convention thống nhất
- ✅ **Scalable**: Dễ dàng thêm API mới
- ✅ **Type Safe**: Full TypeScript support

### Option 2: Dedicated Hooks (Simple)

#### Import và sử dụng
```typescript
import { 
  usePdfSecondaryTextBooks,
  usePdfSecondaryUploadTextBook,
  usePdfSecondaryApi 
} from "@/hooks/usePdfApiSecondary";

// Sử dụng individual hooks
function MyComponent() {
  const { data, isLoading, error } = usePdfSecondaryTextBooks();
  const uploadMutation = usePdfSecondaryUploadTextBook();

  return (
    <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// Hoặc sử dụng combined hook
function MyComponent2() {
  const { textbooks, uploadTextBook, isLoading } = usePdfSecondaryApi();

  return (
    <div>
      {textbooks.data && <pre>{JSON.stringify(textbooks.data, null, 2)}</pre>}
    </div>
  );
}
```

#### Ưu điểm:
- ✅ **Simple**: Dễ hiểu và sử dụng
- ✅ **Ready to use**: Không cần config
- ✅ **Specific**: Tailored cho PDF API

## 🚀 Khuyến nghị sử dụng

### Cho dự án lớn: Option 1 (Factory Pattern)
```typescript
// services/pdfApiHooks.ts
import { createSecondaryQueryHook, createSecondaryMutationHook } from "@/hooks/useApiFactory";

// Tạo hooks cho PDF API
export const usePdfTextBooks = createSecondaryQueryHook("textbooks", "/pdf/getAllTextBook");
export const usePdfUpload = createSecondaryMutationHook("textbooks", "/pdf/upload");
export const usePdfSearch = createSecondaryQueryHook("search", "/pdf/search");
export const usePdfDelete = createSecondaryMutationHook("textbooks", "/pdf/deleteTextBook");

// services/userApiHooks.ts
export const useUsers = createSecondaryQueryHook("users", "/users");
export const useCreateUser = createSecondaryMutationHook("users", "/users");

// services/analyticsApiHooks.ts
export const useAnalytics = createThirdQueryHook("analytics", "/analytics");
```

### Cho dự án nhỏ: Option 2 (Dedicated)
```typescript
// Sử dụng trực tiếp
import { usePdfSecondaryApi } from "@/hooks/usePdfApiSecondary";

function MyComponent() {
  const { textbooks, uploadTextBook } = usePdfSecondaryApi();
  // Use directly
}
```

## 🔧 Configuration

### Environment Variables
```env
# Dùng chung apiSecondary cho port 8000
NEXT_PUBLIC_API_SECONDARY_URL=http://localhost:8000/api/v1

# Hoặc dùng riêng apiPdf
NEXT_PUBLIC_API_PDF_URL=http://localhost:8000/api/v1
```

### Axios Instance Selection
```typescript
// Option A: Dùng apiSecondary (port 8000)
import { apiSecondary } from "@/config/axios";
const response = await apiSecondary.get("/pdf/getAllTextBook");

// Option B: Dùng apiPdf (port 8000)
import { apiPdf } from "@/config/axios";
const response = await apiPdf.get("/pdf/getAllTextBook");
```

## 📝 Examples

### Factory Pattern Example
```typescript
// components/TextbookList.tsx
import { createSecondaryQueryHook } from "@/hooks/useApiFactory";

const useTextBooks = createSecondaryQueryHook("textbooks", "/pdf/getAllTextBook");

export default function TextbookList() {
  const { data: textbooks, isLoading, error } = useTextBooks();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {textbooks?.map((book: any) => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

### Dedicated Hooks Example
```typescript
// components/TextbookManager.tsx
import { usePdfSecondaryApi } from "@/hooks/usePdfApiSecondary";

export default function TextbookManager() {
  const { 
    textbooks, 
    uploadTextBook, 
    deleteTextBook, 
    isLoading 
  } = usePdfSecondaryApi();

  const handleUpload = (file: File) => {
    uploadTextBook.mutate({ file });
  };

  const handleDelete = (id: string) => {
    deleteTextBook.mutate(id);
  };

  return (
    <div>
      {textbooks.data?.map((book: any) => (
        <div key={book.id}>
          <span>{book.title}</span>
          <button onClick={() => handleDelete(book.id)}>Delete</button>
        </div>
      ))}
      <input type="file" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Consistent Naming
```typescript
// Good
const useTextBooks = createSecondaryQueryHook("textbooks", "/pdf/getAllTextBook");
const useUploadTextBook = createSecondaryMutationHook("textbooks", "/pdf/upload");

// Bad
const getBooks = createSecondaryQueryHook("books", "/pdf/getAllTextBook");
const uploadFile = createSecondaryMutationHook("files", "/pdf/upload");
```

### 2. Error Handling
```typescript
const { data, isLoading, error } = useTextBooks();

if (error) {
  console.error("API Error:", error);
  // Handle error appropriately
}
```

### 3. Loading States
```typescript
const { data, isLoading } = useTextBooks();

return (
  <div>
    {isLoading && <Spinner />}
    {data && <DataDisplay data={data} />}
  </div>
);
```

### 4. Mutation Feedback
```typescript
const uploadMutation = useUploadTextBook();

const handleUpload = (file: File) => {
  uploadMutation.mutate(
    { file },
    {
      onSuccess: () => toast.success("Upload successful!"),
      onError: (error) => toast.error(`Upload failed: ${error.message}`),
    }
  );
};
```

## 🔄 Migration Guide

### Từ dedicated hooks sang factory pattern:
```typescript
// Before
import { usePdfSecondaryTextBooks } from "@/hooks/usePdfApiSecondary";

// After
import { createSecondaryQueryHook } from "@/hooks/useApiFactory";
const usePdfTextBooks = createSecondaryQueryHook("textbooks", "/pdf/getAllTextBook");
```

### Từ factory pattern sang dedicated hooks:
```typescript
// Before
import { createSecondaryQueryHook } from "@/hooks/useApiFactory";
const useTextBooks = createSecondaryQueryHook("textbooks", "/pdf/getAllTextBook");

// After
import { usePdfSecondaryTextBooks } from "@/hooks/usePdfApiSecondary";
const { data } = usePdfSecondaryTextBooks();
```

**Kết luận: Chọn Option 1 (Factory) cho flexibility và scalability, Option 2 (Dedicated) cho simplicity!** 🎉
