/**
 * Utility function to convert pathname to readable label
 * @param pathname - The current pathname from usePathname()
 * @returns Readable label for the page
 */
export const getPageLabel = (pathname: string): string => {
  const pathMap: Record<string, string> = {
    // Tools pages
    "/lesson-plan": "Tạo giáo án",
    "/lesson-plan-demo": "Lesson plan-demo",
    "/exam": "Tạo bài kiểm tra",
    "/exam-creation": "Tạo bài kiểm",
    "/grading-test": "Chấm điểm tự động",
    "/chats": "Tạo slide bài giảng",
    "/reports": "Báo cáo",
  };

  // Remove any query parameters and get clean pathname
  const cleanPath = pathname.split("?")[0];

  // Handle dynamic routes (e.g., /lesson-plan/123)
  const segments = cleanPath.split("/").filter(Boolean);

  // Try exact match first
  if (pathMap[cleanPath]) {
    return pathMap[cleanPath];
  }

  // Try base path for dynamic routes
  if (segments.length > 1) {
    const basePath = `/${segments[0]}`;
    if (pathMap[basePath]) {
      return pathMap[basePath];
    }
  }

  // Return default or capitalize first segment
  if (segments.length > 0) {
    const firstSegment = segments[0];
    return (
      firstSegment.charAt(0).toUpperCase() +
      firstSegment.slice(1).replace("-", " ")
    );
  }

  return "Trang chủ";
};

/**
 * Get breadcrumb items for a given pathname
 * @param pathname - The current pathname
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];

  // Add home breadcrumb
  breadcrumbs.push({
    label: "Trang chủ",
    href: "/",
  });

  // Add intermediate breadcrumbs
  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label: getPageLabel(currentPath),
      href: isLast ? undefined : currentPath,
      active: isLast,
    });
  });

  return breadcrumbs;
};

/**
 * Get page actions based on pathname
 * @param pathname - The current pathname
 * @returns Array of action objects for DetailHeader
 */
export const getPageActions = (pathname: string) => {
  const cleanPath = pathname.split("?")[0];

  const actionsMap: Record<string, any[]> = {
    // "/lesson-plan": [
    //   {
    //     label: "Tạo mới",
    //     icon: "Plus",
    //     onClick: () => console.log("Create new lesson plan"),
    //     variant: "default",
    //   },
    //   {
    //     label: "Cài đặt",
    //     icon: "Settings",
    //     onClick: () => console.log("Settings"),
    //     variant: "outline",
    //   },
    // ],
    "/lesson-plan-demo": [
      {
        label: "Chỉnh sửa",
        icon: "Edit",
        onClick: () => console.log("Edit lesson plan demo"),
        variant: "outline",
      },
    ],
    "/grading-test": [
      {
        label: "Báo cáo",
        icon: "AlertCircle",
        onClick: () => console.log("Report"),
        variant: "outline",
      },
    ],
    "/chats": [
      {
        label: "Báo cáo",
        icon: "AlertCircle",
        onClick: () => console.log("Report"),
        variant: "outline",
      },
    ],
  };

  // Handle dynamic routes
  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length > 1) {
    const basePath = `/${segments[0]}`;
    if (actionsMap[basePath] && !actionsMap[cleanPath]) {
      return actionsMap[basePath];
    }
  }

  return actionsMap[cleanPath] || [];
};
