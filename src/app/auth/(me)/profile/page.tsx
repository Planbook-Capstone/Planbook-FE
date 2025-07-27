"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfileService } from "@/services/userService";
import { toast } from "sonner";
import { Camera } from "lucide-react";

function ProfilePage() {
  const { user, updateUser, isAuthenticated, initials, avatarUrl } = useAuth();
  const updateProfileMutation = useUpdateProfileService();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || null,
    birthday: user?.birthday || "",
    avatar: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || null,
        birthday: user.birthday || "",
        avatar: null,
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = "Họ và tên không được vượt quá 50 ký tự";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
    }

    // Validate phone
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
      }
    }

    // Validate birthday
    if (formData.birthday && formData.birthday.trim()) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100); // 100 years ago
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 13); // At least 13 years old

      if (isNaN(birthDate.getTime())) {
        newErrors.birthday = "Ngày sinh không hợp lệ";
      } else if (birthDate < minDate) {
        newErrors.birthday = "Ngày sinh không được quá 100 năm";
      } else if (birthDate > maxDate) {
        newErrors.birthday = "Tuổi phải từ 13 trở lên";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "gender" && value === "" ? null : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setSelectedImage(file);

      // Update formData with the selected file
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);

    // Remove avatar from formData
    setFormData((prev) => ({
      ...prev,
      avatar: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!user?.id) return;

    console.log(formData, "formData");

    // Validate form before saving
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    const loadingToast = toast.loading("Đang cập nhật thông tin...");

    // Prepare data for API
    const dataToSend = {
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      gender:
        formData.gender &&
        (formData.gender === "MALE" || formData.gender === "FEMALE")
          ? formData.gender
          : undefined,
      birthday: formData.birthday
        ? (() => {
            const date = new Date(formData.birthday);
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          })()
        : "",
    };

    // Remove undefined fields
    Object.keys(dataToSend).forEach((key) => {
      if ((dataToSend as any)[key] === undefined) {
        delete (dataToSend as any)[key];
      }
    });

    // If there's an avatar file, create FormData
    let finalData: FormData | typeof dataToSend;
    if (formData.avatar) {
      finalData = new FormData();
      Object.keys(dataToSend).forEach((key) => {
        const value = (dataToSend as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          (finalData as FormData).append(key, value);
        }
      });
      (finalData as FormData).append("avatar", formData.avatar);
    } else {
      finalData = dataToSend;
    }

    // Use appropriate mutation based on whether there's a file

    console.log("Sending data:", finalData);
    console.log("Has avatar:", !!formData.avatar);
    console.log("Using file upload mutation:", !!formData.avatar);

    updateProfileMutation.mutate(
      {
        id: user.id,
        data: finalData,
      },
      {
        onSuccess: () => {
          // Update user data in store (exclude avatar file)
          const { avatar, ...userDataToUpdate } = formData;
          updateUser(userDataToUpdate);
          setIsEditing(false);
          setErrors({}); // Clear all errors
          toast.dismiss(loadingToast);
          toast.success("Cập nhật thông tin thành công");
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
          toast.dismiss(loadingToast);
          toast.error("Có lỗi xảy ra khi cập nhật thông tin");
        },
      }
    );
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || null,
      birthday: user?.birthday || "",
      avatar: null,
    });
    setErrors({}); // Clear all errors
    // Reset image selection
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-calsans">Hồ sơ của bạn</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline">
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline">
                Hủy
              </Button>
              <Button onClick={handleSave}>Lưu thay đổi</Button>
            </>
          )}
        </div>
      </div>

      <div>
        {/* Profile Avatar Section */}
        <div className="mb-8">
          <p className="text-sm text-gray-600">Ảnh hồ sơ</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Avatar className="w-20 h-20 bg-teal-500 text-white text-2xl font-bold">
                {previewUrl ? (
                  <AvatarImage src={previewUrl} alt="Preview" />
                ) : avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Current avatar" />
                ) : (
                  <AvatarFallback className="bg-teal-500 text-white text-2xl">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              {isEditing && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white border-2 border-gray-200 hover:bg-gray-50"
                  onClick={handleImageSelect}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isEditing && (
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImageSelect}
                  className="text-sm"
                >
                  Chọn ảnh
                </Button>
                {selectedImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Xóa ảnh
                  </Button>
                )}
              </div>
            )}
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6 max-w-2xl">
          {/* Full Name Field */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField label="Họ và tên">
                <Input
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={`bg-gray-50 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  readOnly={!isEditing}
                  placeholder="Chưa cập nhật"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </FormField>
            </div>
          </div>

          {/* Username Field */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField label="Tên đăng nhập">
                <Input
                  value={formData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="bg-gray-50"
                  readOnly={!isEditing}
                />
              </FormField>
            </div>
          </div>

          {/* Email Field */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField label="Địa chỉ email">
                <Input
                  value={formData.email}
                  className="bg-gray-50"
                  readOnly
                  disabled
                />
              </FormField>
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField label="Số điện thoại">
                <Input
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("phone", e.target.value)
                  }
                  className={`bg-gray-50 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  readOnly={!isEditing}
                  placeholder="Chưa cập nhật"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </FormField>
            </div>
          </div>

          {/* Gender Field */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField label="Giới tính">
                {isEditing ? (
                  <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="gender-male"
                        checked={formData.gender === "MALE"}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange("gender", "MALE");
                          } else if (formData.gender === "MALE") {
                            handleInputChange("gender", "");
                          }
                        }}
                      />
                      <label
                        htmlFor="gender-male"
                        className="text-sm cursor-pointer"
                      >
                        Nam
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="gender-female"
                        checked={formData.gender === "FEMALE"}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange("gender", "FEMALE");
                          } else if (formData.gender === "FEMALE") {
                            handleInputChange("gender", "");
                          }
                        }}
                      />
                      <label
                        htmlFor="gender-female"
                        className="text-sm cursor-pointer"
                      >
                        Nữ
                      </label>
                    </div>
                  </div>
                ) : (
                  <Input
                    value={
                      formData.gender === "MALE"
                        ? "Nam"
                        : formData.gender === "FEMALE"
                        ? "Nữ"
                        : "Chưa cập nhật"
                    }
                    className="bg-gray-50"
                    readOnly
                    placeholder="Chưa cập nhật"
                  />
                )}
              </FormField>
            </div>
          </div>

          {/* Birthday Field */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField label="Ngày sinh">
                <Input
                  type={isEditing ? "date" : "text"}
                  value={
                    formData.birthday
                      ? isEditing
                        ? (() => {
                            // Convert DD-MM-YYYY to YYYY-MM-DD for date input
                            if (
                              formData.birthday.includes("-") &&
                              formData.birthday.split("-").length === 3
                            ) {
                              const parts = formData.birthday.split("-");
                              if (parts[0].length === 2) {
                                // Format is DD-MM-YYYY, convert to YYYY-MM-DD
                                return `${parts[2]}-${parts[1]}-${parts[0]}`;
                              }
                            }
                            // If already in YYYY-MM-DD format or ISO format
                            return formData.birthday.split("T")[0];
                          })()
                        : (() => {
                            // For display mode, show in DD/MM/YYYY format
                            if (
                              formData.birthday.includes("-") &&
                              formData.birthday.split("-").length === 3
                            ) {
                              const parts = formData.birthday.split("-");
                              if (parts[0].length === 2) {
                                // Already in DD-MM-YYYY format, convert to DD/MM/YYYY for display
                                return `${parts[0]}/${parts[1]}/${parts[2]}`;
                              } else if (parts[0].length === 4) {
                                // In YYYY-MM-DD format, convert to DD/MM/YYYY for display
                                return `${parts[2]}/${parts[1]}/${parts[0]}`;
                              }
                            }
                            // Fallback to date parsing
                            return new Date(
                              formData.birthday
                            ).toLocaleDateString("vi-VN");
                          })()
                      : ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("birthday", e.target.value)
                  }
                  className={`bg-gray-50 ${
                    errors.birthday ? "border-red-500" : ""
                  }`}
                  readOnly={!isEditing}
                  placeholder="Chưa cập nhật"
                />
                {errors.birthday && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>
                )}
              </FormField>
            </div>
          </div>

          {/* Created At Field (Read-only) */}
          {/* <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField label="Ngày tạo tài khoản">
                <Input
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                      : ""
                  }
                  className="bg-gray-100"
                  readOnly
                  disabled
                />
              </FormField>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
