import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noIndex = false,
  noFollow = false,
}: SEOProps): Metadata {
  const baseUrl = 'https://planbook.vn';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const ogImage = image ? `${baseUrl}${image}` : `${baseUrl}/images/og-image.png`;

  const allKeywords = [
    ...keywords,
    'planbook',
    'giáo án',
    'quản lý giáo án',
    'hệ thống giáo dục',
    ...tags,
  ];

  const metadata: Metadata = {
    title: title ? `${title} | PlanBook` : undefined,
    description,
    keywords: allKeywords.length > 0 ? allKeywords : undefined,
    alternates: {
      canonical: url || '/',
    },
    openGraph: {
      type,
      locale: 'vi_VN',
      url: fullUrl,
      title: title ? `${title} | PlanBook` : 'PlanBook - Hệ thống quản lý giáo án thông minh',
      description: description || 'PlanBook là hệ thống quản lý giáo án thông minh, hỗ trợ giáo viên tạo, quản lý và chia sẻ giáo án hiệu quả.',
      siteName: 'PlanBook',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || 'PlanBook',
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | PlanBook` : 'PlanBook - Hệ thống quản lý giáo án thông minh',
      description: description || 'PlanBook là hệ thống quản lý giáo án thông minh, hỗ trợ giáo viên tạo, quản lý và chia sẻ giáo án hiệu quả.',
      images: [ogImage],
      creator: '@planbook_vn',
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

// Hook để sử dụng trong các component
export function useSEO(props: SEOProps) {
  return generateMetadata(props);
}

// Các template SEO cho các trang phổ biến
export const SEOTemplates = {
  home: (): SEOProps => ({
    title: 'Trang chủ',
    description: 'PlanBook - Hệ thống quản lý giáo án thông minh, hỗ trợ giáo viên tạo, quản lý và chia sẻ giáo án hiệu quả.',
    keywords: ['trang chủ', 'planbook', 'hệ thống giáo dục'],
    url: '/',
  }),

  login: (): SEOProps => ({
    title: 'Đăng nhập',
    description: 'Đăng nhập vào hệ thống PlanBook để quản lý giáo án và sử dụng các tính năng giáo dục thông minh.',
    keywords: ['đăng nhập', 'login', 'tài khoản'],
    url: '/auth/login',
    noIndex: true, // Không index trang login
  }),

  register: (): SEOProps => ({
    title: 'Đăng ký',
    description: 'Tạo tài khoản PlanBook miễn phí để bắt đầu sử dụng hệ thống quản lý giáo án thông minh.',
    keywords: ['đăng ký', 'register', 'tài khoản mới'],
    url: '/auth/register',
    noIndex: true, // Không index trang register
  }),

  autoGrading: (): SEOProps => ({
    title: 'Chấm điểm tự động',
    description: 'Hệ thống chấm điểm tự động của PlanBook giúp giáo viên tiết kiệm thời gian và nâng cao độ chính xác trong việc đánh giá học sinh.',
    keywords: ['chấm điểm tự động', 'đánh giá', 'AI grading'],
    url: '/auto-grading',
  }),

  exam: (): SEOProps => ({
    title: 'Thi trực tuyến',
    description: 'Hệ thống thi trực tuyến của PlanBook cho phép tạo và quản lý các kỳ thi một cách hiệu quả và bảo mật.',
    keywords: ['thi trực tuyến', 'online exam', 'kiểm tra'],
    url: '/exam',
  }),

  admin: (): SEOProps => ({
    title: 'Quản trị hệ thống',
    description: 'Trang quản trị hệ thống PlanBook dành cho administrators.',
    url: '/admin',
    noIndex: true, // Không index trang admin
    noFollow: true,
  }),
};
