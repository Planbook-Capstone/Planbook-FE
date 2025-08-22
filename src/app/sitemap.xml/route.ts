import { NextResponse } from "next/server";

// Định nghĩa các route tĩnh của website
const staticRoutes = [
  {
    url: "https://planbook.vn",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  },
  {
    url: "https://planbook.vn/auth",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "https://planbook.vn/auth",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "https://planbook.vn/home",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  },

  {
    url: "https://planbook.vn/exam",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    url: "https://planbook.vn/tool-manager",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
];

// Hàm tạo XML sitemap
function generateSitemapXML(routes: typeof staticRoutes): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified.toISOString()}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}

export async function GET() {
  try {
    // Trong tương lai có thể thêm logic để lấy dynamic routes từ database
    // Ví dụ: danh sách bài học, giáo án, etc.

    const sitemap = generateSitemapXML(staticRoutes);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache 1 giờ
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
