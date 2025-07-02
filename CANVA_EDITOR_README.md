# Canva-like Design Editor

Một ứng dụng thiết kế giống Canva được xây dựng với Next.js, TypeScript, và @dnd-kit cho chức năng drag and drop.

## Tính năng

### ✅ Layout 3 cột
- **Cột trái (Assets Panel)**: Chứa các hình ảnh, text, và shapes có thể kéo thả
- **Cột giữa (Canvas)**: Khu vực thiết kế chính nơi bạn có thể drop và chỉnh sửa elements
- **Cột phải (Preview Panel)**: Xem trước thiết kế với các chế độ desktop, tablet, mobile

### ✅ Drag and Drop
- Kéo elements từ Assets Panel vào Canvas
- Di chuyển elements trong Canvas
- Xóa elements với nút delete
- Visual feedback khi drag

### ✅ Responsive Design
- Tự động ẩn/hiện panels trên các màn hình nhỏ
- Grid layout thích ứng
- Mobile-friendly interface

### ✅ Asset Types
- **Images**: Sử dụng các SVG có sẵn trong dự án
- **Text**: Các kiểu text khác nhau (Heading, Subheading, Body, Caption)
- **Shapes**: Rectangle, Circle, Triangle

## Cách sử dụng

1. **Truy cập trang editor**:
   ```
   http://localhost:3001/(tools)/design-editor
   ```

2. **Thêm elements vào canvas**:
   - Chọn tab trong Assets Panel (Images, Text, Shapes)
   - Kéo element mong muốn vào Canvas
   - Element sẽ xuất hiện tại vị trí ngẫu nhiên

3. **Chỉnh sửa elements**:
   - Click vào element để select
   - Sử dụng các nút control để di chuyển hoặc xóa
   - Kéo element để thay đổi vị trí

4. **Xem preview**:
   - Panel bên phải hiển thị preview real-time
   - Chuyển đổi giữa các chế độ Desktop/Tablet/Mobile
   - Xem danh sách elements hiện tại

## Cấu trúc code

```
src/
├── app/(tools)/design-editor/
│   └── page.tsx                    # Trang chính
├── components/
│   ├── organisms/
│   │   └── CanvaLayout.tsx         # Layout chính với DndContext
│   └── molecules/
│       ├── AssetsPanel.tsx         # Panel chứa assets
│       ├── CanvasArea.tsx          # Khu vực canvas chính
│       └── PreviewPanel.tsx        # Panel preview
```

## Dependencies đã thêm

- `@dnd-kit/core`: Core drag and drop functionality
- `@dnd-kit/sortable`: Sortable utilities
- `@dnd-kit/utilities`: Helper utilities

## Tính năng có thể mở rộng

- [ ] Resize elements bằng cách kéo handles
- [ ] Rotate elements
- [ ] Layer management (bring to front/back)
- [ ] Undo/Redo functionality
- [ ] Save/Load designs
- [ ] Export to image/PDF
- [ ] Custom text editing
- [ ] Color picker
- [ ] Upload custom images
- [ ] Templates library

## Responsive Breakpoints

- **Desktop**: >= 1024px (hiển thị đầy đủ 3 cột)
- **Tablet**: 768px - 1023px (ẩn preview panel)
- **Mobile**: < 768px (ẩn assets panel, chỉ hiển thị canvas)

Ứng dụng đã sẵn sàng sử dụng và có thể mở rộng thêm nhiều tính năng khác!
