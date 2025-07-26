/**
 * Application constants
 */

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id: string) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAILS: (id: string) => `/orders/${id}`,
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  USERS: {
    ME: '/users/me',
    PROFILE: '/users/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    LIST: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 20, 50, 100],
};

// Form validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// User roles
export const ROLE_LABELS = {
  ADMIN: "Quản trị viên",
  STAFF: "Nhân viên",
  PARTNER: "Đối tác",
  USER: "Người dùng",
  TEACHER: "Giáo viên",
  "TOOL-MANAGER": "Quản lý công cụ",
} as const;

export const ROLE_COLORS = {
  ADMIN: "bg-orange-100 text-orange-800",
  STAFF: "bg-blue-100 text-blue-800",
  PARTNER: "bg-green-100 text-green-800",
  USER: "bg-gray-100 text-gray-800",
  TEACHER: "bg-yellow-100 text-yellow-800",
  "TOOL-MANAGER": "bg-purple-100 text-purple-800",
} as const;

export const ORDER_STATUS_COLOR = {
  PENDING: "bg-orange-100 text-orange-800",
  PAID: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800",
}