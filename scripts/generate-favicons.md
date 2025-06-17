# Generate Favicons Guide

## Bước 1: Chuẩn bị logo
- Sử dụng file: `public/images/logo/logoLight.svg` hoặc `public/images/logoPlanbook.png`
- Logo nên có background trong suốt
- Kích thước tối thiểu: 512x512px

## Bước 2: Generate favicons online
Sử dụng một trong các tools sau:

### Option 1: Favicon.io (Khuyến nghị)
1. Truy cập: https://favicon.io/favicon-converter/
2. Upload logo của bạn
3. Download package
4. Copy các files vào thư mục `public/`:
   - `favicon.ico` → `public/favicon.ico`
   - `android-chrome-512x512.png` → `public/icon.png`
   - `apple-touch-icon.png` → `public/apple-icon.png`

### Option 2: RealFaviconGenerator
1. Truy cập: https://realfavicongenerator.net/
2. Upload logo
3. Customize settings
4. Download và copy files

### Option 3: Favicon Generator
1. Truy cập: https://www.favicon-generator.org/
2. Upload logo
3. Download package

## Bước 3: Verify files
Đảm bảo các files sau tồn tại trong `public/`:
- ✅ `favicon.ico` (16x16, 32x32)
- ✅ `icon.png` (512x512)
- ✅ `apple-icon.png` (180x180)
- ✅ `manifest.json`
- ✅ `robots.txt`
- ✅ `sitemap.xml`

## Bước 4: Test
1. Build project: `npm run build`
2. Start production: `npm start`
3. Check browser tab icon
4. Test PWA install
5. Verify meta tags với browser dev tools

## Bước 5: Deploy
- Commit và push changes
- Deploy to production
- Clear browser cache
- Test on multiple devices/browsers

## Troubleshooting
- Nếu icon không đổi: Clear browser cache (Ctrl+Shift+R)
- Nếu vẫn thấy Next.js icon: Check file paths và metadata
- PWA không hoạt động: Verify manifest.json syntax
