import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `# ------------------------------
# Robots.txt for planbook.vn
# ------------------------------

# Cho phép tất cả bot crawl
User-agent: *
Allow: /

# Disallow khu vực nhạy cảm
Disallow: /admin/
Disallow: /api/
Disallow: /auth/logout
Disallow: /private/

# Cho phép bot crawl các tài nguyên cần thiết
Allow: /_next/static/
Allow: /_next/image/
Allow: /videos/
Allow: /images/
Allow: /background/

# Crawl delay (tùy chọn, giúp giảm tải server)
Crawl-delay: 1

# Quy tắc riêng cho Google
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Quy tắc cho Facebook crawler (ảnh/video share)
User-agent: facebookexternalhit
Allow: /

# Block các bot xấu / spam
User-agent: AhrefsBot
Disallow: /
User-agent: MJ12bot
Disallow: /
User-agent: DotBot
Disallow: /

# Sitemap để Google dễ index
Sitemap: https://planbook.vn/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache 24h
    },
  });
}
