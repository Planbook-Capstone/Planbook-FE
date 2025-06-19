# Lesson Creation & PDF Analysis Flow

## 🔄 **Complete Workflow**

### 1. User Creates Lesson with PDF
```
User fills form → Uploads PDF → Submits
```

### 2. Backend Processing
```
Create Chapter → Create Lesson → Get lesson_id → Quick PDF Analysis
```

### 3. PDF Analysis Integration
```
lesson_id + PDF file → useQuickTextBookAnalysisService → Analysis Response
```

## 🎯 **Implementation Details**

### Form Structure
```typescript
interface FormData {
  chapters: Array<{
    chapterTitle: string;
    lessons: Array<{
      lessonTitle: string;
      pdfFile: File;
    }>;
  }>;
}
```

### Service Integration
```typescript
// 1. Create lesson
const createdLesson = await createLessonMutateAsync(lessonData);

// 2. Get lesson_id from response
const lessonId = createdLesson?.data?.data?.id;

// 3. Prepare FormData for analysis
const analysisFormData = new FormData();
analysisFormData.append("lesson_id", lessonId);
analysisFormData.append("file", lesson.pdfFile);
analysisFormData.append("filename", lesson.pdfFile.name);

// 4. Call quick analysis
const analysisResponse = await quickAnalysisMutateAsync(analysisFormData);
```

### API Endpoints Used
```typescript
// From constants/apiEndpoints.ts
PDF_API_ENDPOINTS.QUICK_TEXTBOOK_ANALYSIS: "/pdf/quick-textbook-analysis"

// Service: useQuickTextBookAnalysisService
// Uses: createSecondaryMutationHook with apiSecondary (port 8000)
```

## 📊 **Expected Response Structure**

### Lesson Creation Response
```json
{
  "success": true,
  "data": {
    "data": {
      "id": "lesson_123",
      "name": "Lesson Title",
      "chapterId": "chapter_456"
    }
  }
}
```

### Quick Analysis Response
```json
{
  "success": true,
  "book_id": "232b56e5",
  "lesson_id": "lesson_123",
  "collection_name": "textbook_232b56e5",
  "book_structure": {
    "title": "Textbook Title",
    "subject": "Hóa học",
    "grade": "Lớp 10",
    "chapters": [
      {
        "chapter_id": "chapter_00",
        "title": "Chapter Title",
        "lessons": [
          {
            "lesson_id": "lesson_123",
            "title": "Lesson Title",
            "content": "Extracted content...",
            "page_numbers": [1, 2],
            "images": [
              {
                "page": 1,
                "description": "Image description",
                "format": "png",
                "image_id": "uuid",
                "has_data": true
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 🔧 **Console Logging**

### Form Submission
```javascript
📝 Form submission started: {chapters: [...]}
🔧 Quick Analysis Service available: true
```

### Lesson Creation
```javascript
✅ Lesson created successfully: {
  lessonTitle: "Lesson Name",
  lessonId: "lesson_123",
  pdfFileName: "document.pdf",
  response: {...}
}
```

### Analysis Process
```javascript
🚀 Starting Quick TextBook Analysis for lesson: {
  lessonId: "lesson_123",
  fileName: "document.pdf",
  fileSize: 1024000
}

✅ Quick Analysis Response: {...}
📊 Analysis Data Structure: {
  success: true,
  bookId: "232b56e5",
  lessonId: "lesson_123",
  hasBookStructure: true,
  chaptersCount: 1
}
```

### Error Handling
```javascript
❌ Quick Analysis Error: {...}
📝 Error details: {
  message: "Error message",
  response: {...},
  status: 500
}
```

## 🎨 **UI States**

### Loading States
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);     // Form submission
const [isAnalyzing, setIsAnalyzing] = useState(false);       // PDF analysis
const [analysisProgress, setAnalysisProgress] = useState(""); // Progress message
```

### Button States
```jsx
<Button disabled={isSubmitting || isAnalyzing}>
  {isSubmitting ? "Đang tạo..." : 
   isAnalyzing ? "Đang phân tích..." : 
   "Tạo chương và bài học"}
</Button>
```

### Progress Display
```jsx
{(isAnalyzing || analysisProgress) && (
  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center gap-2">
      {isAnalyzing && <Spinner />}
      <span>{analysisProgress || "Đang phân tích PDF..."}</span>
    </div>
  </div>
)}
```

## 🚨 **Error Handling**

### Analysis Errors Don't Block Lesson Creation
```typescript
try {
  // PDF Analysis
  const analysisResponse = await quickAnalysisMutateAsync(analysisFormData);
  toast.success("Phân tích PDF thành công!");
} catch (analysisError) {
  console.error("Analysis failed:", analysisError);
  toast.error(`Phân tích PDF thất bại: ${analysisError.message}`);
  // ❌ DON'T throw - let other lessons continue
}
```

### Validation
```typescript
// File validation
if (!lesson.pdfFile || lesson.pdfFile.size === 0) {
  throw new Error("Bài học phải có file PDF đính kèm");
}

// Response validation
if (!createdLesson?.data?.data?.id) {
  console.warn("No lesson ID returned, skipping analysis");
  return;
}
```

## 📋 **FormData Structure for Analysis**

### Required Fields
```typescript
const analysisFormData = new FormData();
analysisFormData.append("lesson_id", lessonId);    // ✅ Required
analysisFormData.append("file", pdfFile);          // ✅ Required
analysisFormData.append("filename", fileName);     // ✅ Required
```

### Optional Metadata
```typescript
analysisFormData.append("lesson_title", lessonTitle);
analysisFormData.append("chapter_title", chapterTitle);
analysisFormData.append("book_id", bookId);
```

## 🎯 **Success Criteria**

### ✅ **Lesson Creation Success**
- Lesson created with valid ID
- PDF file uploaded successfully
- Toast notification shown

### ✅ **Analysis Success**
- Quick analysis API called with lesson_id + file
- Response contains book_structure data
- Analysis progress tracked and displayed
- Success toast shown

### ✅ **Error Handling**
- Analysis errors don't block lesson creation
- Detailed error logging
- User-friendly error messages
- Form remains functional after errors

## 🔄 **Flow Diagram**

```
User Input
    ↓
Create Chapter
    ↓
Create Lesson (with PDF)
    ↓
Get lesson_id from response
    ↓
Prepare FormData (lesson_id + file)
    ↓
Call useQuickTextBookAnalysisService
    ↓
Process Analysis Response
    ↓
Update UI & Show Results
```

## 🧪 **Testing Checklist**

### ✅ **Manual Testing**
- [ ] Create lesson with PDF file
- [ ] Check console for lesson_id
- [ ] Verify analysis API call
- [ ] Check analysis response structure
- [ ] Test error scenarios
- [ ] Verify UI states and progress

### ✅ **Console Verification**
- [ ] Form submission logs
- [ ] Lesson creation logs
- [ ] Analysis start logs
- [ ] Analysis response logs
- [ ] Error handling logs

### ✅ **API Integration**
- [ ] Lesson creation endpoint works
- [ ] Quick analysis endpoint works
- [ ] FormData structure correct
- [ ] Response parsing works
- [ ] Error responses handled

**Result: Complete integration of lesson creation with automatic PDF analysis!** 🎉
