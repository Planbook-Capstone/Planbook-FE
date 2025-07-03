/**
 * ROLE CONFIGURATION
 * 
 * 🎯 **CHỖ DUY NHẤT CẦN SỬA ĐỂ THAY ĐỔI PHÂN QUYỀN**
 * 
 * Chỉ cần thay đổi giá trị DEFAULT_ROLE để đổi quyền cho toàn bộ hệ thống:
 * - 'admin' = Chỉ xem (view-only)
 * - 'staff' = Toàn quyền (full permissions)
 */

import { UserRole } from '@/contexts/RoleContext';

// 🔧 THAY ĐỔI ROLE TẠI ĐÂY
export const DEFAULT_ROLE: UserRole = 'admin'; // Đổi thành 'staff' để có full permissions

// Role descriptions for documentation
export const ROLE_DESCRIPTIONS = {
  admin: {
    name: 'Admin',
    description: 'Chỉ xem (view-only)',
    permissions: [
      'Xem templates',
      'Xem chi tiết templates', 
      'Không thể chỉnh sửa',
      'Không thể xóa',
      'Không thể thêm mới',
      'Không thể lưu',
      'Không thể kéo thả'
    ]
  },
  staff: {
    name: 'Staff', 
    description: 'Toàn quyền (full permissions)',
    permissions: [
      'Xem templates',
      'Tạo templates mới',
      'Chỉnh sửa templates',
      'Xóa templates', 
      'Thêm/xóa steps',
      'Thêm/xóa keywords',
      'Lưu templates',
      'Kéo thả sắp xếp'
    ]
  }
} as const;

// Helper function to get current role config
export function getCurrentRoleConfig() {
  return ROLE_DESCRIPTIONS[DEFAULT_ROLE];
}

// Helper function to check if current role has permission
export function hasPermission(permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission][DEFAULT_ROLE];
}

// Permission matrix
const PERMISSIONS = {
  canView: { admin: true, staff: true },
  canEdit: { admin: false, staff: true },
  canDelete: { admin: false, staff: true },
  canCreate: { admin: false, staff: true },
  canSave: { admin: false, staff: true },
  canDrag: { admin: false, staff: true },
} as const;
