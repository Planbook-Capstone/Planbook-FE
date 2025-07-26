# Hướng dẫn sử dụng Zustand Store

## Tổng quan

Ứng dụng đã được cập nhật để sử dụng **Zustand** làm state management chính cho việc quản lý user data và theme. Zustand cung cấp:

- ✅ Tự động lưu vào localStorage (persistence)
- ✅ TypeScript support đầy đủ
- ✅ API đơn giản và dễ sử dụng
- ✅ Performance tốt hơn Context API

## Cấu trúc User Data

```typescript
interface User {
  id: string;
  fullName: string | null;
  username: string;
  email: string;
  role: string;
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  birthday: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  token: string;
  refreshToken: string;
}
```

## Cách sử dụng cơ bản

### 1. Import store

```typescript
import { useAppStore } from "@/store";
```

### 2. Sử dụng trong component

```typescript
function MyComponent() {
  const { 
    user, 
    theme, 
    setUser, 
    setTheme, 
    clearUser, 
    updateUser, 
    isAuthenticated 
  } = useAppStore();

  // Kiểm tra đăng nhập
  if (!isAuthenticated()) {
    return <div>Chưa đăng nhập</div>;
  }

  return (
    <div>
      <h1>Xin chào {user?.fullName || user?.username}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

### 3. Sử dụng hook useAuth (khuyến nghị)

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    displayName, 
    isAdmin, 
    isStaff 
  } = useAuth();

  if (!isAuthenticated) {
    return <div>Chưa đăng nhập</div>;
  }

  return (
    <div>
      <h1>Xin chào {displayName}</h1>
      {isAdmin && <p>Bạn là Admin</p>}
      {isStaff && <p>Bạn là Staff</p>}
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

## Các actions có sẵn

### Store actions

```typescript
// Đăng nhập
setUser(userData);

// Đăng xuất
clearUser();

// Cập nhật thông tin user
updateUser({ fullName: "Tên mới", phone: "0123456789" });

// Đổi theme
setTheme("dark");

// Kiểm tra đăng nhập
isAuthenticated();
```

### useAuth hook actions

```typescript
// Đăng nhập với redirect tự động
login(userData);

// Đăng xuất với redirect tự động
logout();

// Kiểm tra role
hasRole("ADMIN");
isAdmin; // boolean
isStaff; // boolean

// Thông tin user
displayName; // string
avatarUrl; // string | null
initials; // string (2 ký tự đầu của tên)
```

## Persistence (Lưu trữ tự động)

Store tự động lưu user data và theme vào localStorage với key `planbook-storage`. Khi user reload trang, data sẽ được khôi phục tự động.

## Migration từ React Query

Các component đã được cập nhật để sử dụng Zustand, nhưng vẫn giữ backward compatibility với React Query:

```typescript
// Cũ (React Query)
const userData = queryClient.getQueryData(["currentUser"]);

// Mới (Zustand)
const { user } = useAppStore();
// hoặc
const { user } = useAuth();
```

## Ví dụ thực tế

### Login component

```typescript
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
  const { login } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      const response = await loginAPI(formData);
      login(response.data); // Tự động redirect theo role
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Protected route

```typescript
import { useAuth } from "@/hooks/useAuth";

function ProtectedPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập</div>;
  }

  if (!isAdmin) {
    return <div>Bạn không có quyền truy cập</div>;
  }

  return <div>Admin Dashboard</div>;
}
```

## Lưu ý

1. **Backward Compatibility**: Các component cũ vẫn hoạt động với React Query
2. **localStorage**: Data được lưu tự động, không cần xử lý thêm
3. **TypeScript**: Tất cả đều có type safety đầy đủ
4. **Performance**: Zustand chỉ re-render component khi data thực sự thay đổi
