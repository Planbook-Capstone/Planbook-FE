// Utility functions cho SEO

/**
 * Tạo slug từ tiêu đề
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/[đĐ]/g, 'd') // Thay thế đ
    .replace(/[^a-z0-9\s-]/g, '') // Chỉ giữ chữ cái, số, space và dấu gạch ngang
    .replace(/\s+/g, '-') // Thay space bằng dấu gạch ngang
    .replace(/-+/g, '-') // Loại bỏ dấu gạch ngang liên tiếp
    .trim()
    .replace(/^-|-$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
}

/**
 * Tạo excerpt từ nội dung
 */
export function createExcerpt(content: string, maxLength: number = 160): string {
  // Loại bỏ HTML tags
  const textOnly = content.replace(/<[^>]*>/g, '');
  
  if (textOnly.length <= maxLength) {
    return textOnly;
  }
  
  // Cắt tại từ cuối cùng để tránh cắt giữa từ
  const truncated = textOnly.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tạo canonical URL
 */
export function createCanonicalUrl(path: string, baseUrl: string = 'https://planbook.vn'): string {
  // Loại bỏ trailing slash
  const cleanPath = path.replace(/\/$/, '') || '/';
  return `${baseUrl}${cleanPath}`;
}

/**
 * Tạo breadcrumb từ path
 */
export function createBreadcrumb(path: string): Array<{ name: string; url: string }> {
  const segments = path.split('/').filter(Boolean);
  const breadcrumb = [{ name: 'Trang chủ', url: '/' }];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Map segment names
    const segmentNames: Record<string, string> = {
      'auth': 'Xác thực',
      'login': 'Đăng nhập',
      'register': 'Đăng ký',
      'admin': 'Quản trị',
      'staff': 'Nhân viên',
      'home': 'Trang chủ',
      'auto-grading': 'Chấm điểm tự động',
      'exam': 'Thi trực tuyến',
      'tool-manager': 'Quản lý công cụ',
    };
    
    const name = segmentNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumb.push({
      name,
      url: currentPath,
    });
  });
  
  return breadcrumb;
}

/**
 * Tạo structured data cho breadcrumb
 */
export function createBreadcrumbStructuredData(breadcrumb: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://planbook.vn${item.url}`,
    })),
  };
}

/**
 * Tạo keywords từ content
 */
export function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // Loại bỏ HTML tags và ký tự đặc biệt
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi, ' ')
    .toLowerCase();
  
  // Tách từ và đếm tần suất
  const words = cleanContent.split(/\s+/).filter(word => word.length > 3);
  const wordCount: Record<string, number> = {};
  
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Sắp xếp theo tần suất và lấy top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Validate metadata
 */
export function validateMetadata(metadata: {
  title?: string;
  description?: string;
  keywords?: string[];
}) {
  const errors: string[] = [];
  
  if (!metadata.title) {
    errors.push('Title is required');
  } else if (metadata.title.length > 60) {
    errors.push('Title should be less than 60 characters');
  }
  
  if (!metadata.description) {
    errors.push('Description is required');
  } else if (metadata.description.length > 160) {
    errors.push('Description should be less than 160 characters');
  } else if (metadata.description.length < 120) {
    errors.push('Description should be at least 120 characters');
  }
  
  if (metadata.keywords && metadata.keywords.length > 10) {
    errors.push('Too many keywords (max 10)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
