import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `# Cho phép tất cả bot crawl
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /auth/logout
Disallow: /_next/
Disallow: /private/

# Allow specific important pages
Allow: /auth/login
Allow: /auth/register
Allow: /home
Allow: /auto-grading
Allow: /exam

# Crawl delay (optional - giúp giảm tải server)
Crawl-delay: 1

# Specific rules for Google
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

# Block unwanted bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Khai báo sitemap để Google tìm thấy
Sitemap: https://planbook.vn/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400", // Cache 24 giờ
    },
  });
}
