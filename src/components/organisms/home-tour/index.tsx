"use client";

import React, { useState, useEffect } from "react";
import { Tour, Button } from "antd";
import type { TourProps } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./tour.css";
import { BookTypeResponse } from "@/types";

interface HomeTourProps {
  onTourComplete?: () => void;
  bookTypes?: BookTypeResponse[];
}

const HomeTour: React.FC<HomeTourProps> = ({ onTourComplete, bookTypes }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // Tạo nội dung động cho các chức năng từ API
  const generateFeaturesDescription = () => {
    if (!bookTypes || bookTypes.length === 0) {
      return (
        <div>
          <p>Đây là khu vực chính với các công cụ AI:</p>
          <ul>
            <li>Đang tải các chức năng...</li>
          </ul>
        </div>
      );
    }

    return (
      <div>
        <p>Đây là khu vực chức năng chính của hệ thống.</p>
        <p><em>Tiếp theo chúng ta sẽ tìm hiểu chi tiết từng chức năng...</em></p>
      </div>
    );
  };

  // Tạo các step cho từng chức năng riêng lẻ
  const generateFeatureSteps = () => {
    if (!bookTypes || bookTypes.length === 0) {
      return [];
    }

    const sortedFeatures = bookTypes
      .sort((a, b) => (a.priority || 0) - (b.priority || 0))
      .slice(0, 8); // Giới hạn số lượng để không làm tour quá dài

    return sortedFeatures.map((feature) => ({
      title: `${feature.name}`,
      description: (
        <div>
          <p><strong>Mô tả:</strong> {feature.description || "Chức năng hỗ trợ giảng dạy"}</p>
          {(feature.tokenCostPerQuery === 0 || !feature.tokenCostPerQuery) && (
            <p>
              <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Dùng thử miễn phí</span>
            </p>
          )}
          <p>Click vào thẻ này để bắt đầu sử dụng chức năng!</p>
        </div>
      ),
      target: () => document.querySelector(`[data-tour="feature-${feature.id}"]`) as HTMLElement,
    }));
  };

  const steps: TourProps["steps"] = [
    {
      title: "Chào mừng đến với PlanBook!",
      description: (
        <div>
          <p>
            Chúng tôi sẽ hướng dẫn bạn khám phá các tính năng chính của trang
            chủ.
          </p>
          <p>Hãy cùng bắt đầu tour hướng dẫn nhé!</p>
        </div>
      ),
      target: null, // Tour bắt đầu ở giữa màn hình
    },
    {
      title: "Logo và Trang chủ",
      description: (
        <div>
          <p>
            <strong>Logo PlanBook:</strong> Click vào logo để quay về trang chủ
            bất cứ lúc nào.
          </p>
          <p>Đây là điểm khởi đầu cho tất cả các hoạt động của bạn.</p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="logo"]') as HTMLElement,
    },
    {
      title: "Menu Điều hướng",
      description: (
        <div>
          <p>
            <strong>Trợ lý:</strong> Trang chủ với các công cụ AI
          </p>
          <p>
            <strong>Kho tài liệu:</strong> Quản lý tài liệu cá nhân
          </p>
          <p>
            <strong>Gói dịch vụ:</strong> Xem và nâng cấp gói dịch vụ
          </p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="navigation"]') as HTMLElement,
    },
    {
      title: "Năm học",
      description: (
        <div>
          <p>Chọn năm học hiện tại để làm việc.</p>
          <p>Tất cả dữ liệu sẽ được lọc theo năm học được chọn.</p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="academic-year"]') as HTMLElement,
    },
    {
      title: "Số dư token",
      description: (
        <div>
          <p>Hiển thị số dư token hiện tại trong tài khoản của bạn.</p>
          <p>Click để xem chi tiết và nạp thêm token.</p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="wallet"]') as HTMLElement,
    },
    {
      title: "Thông tin cá nhân",
      description: (
        <div>
          <p>Click vào avatar để:</p>
          <ul>
            <li>Xem thông tin cá nhân</li>
            <li>Chỉnh sửa hồ sơ</li>
            <li>Đăng xuất</li>
          </ul>
        </div>
      ),
      target: () => document.querySelector('[data-tour="user-menu"]') as HTMLElement,
    },
    // {
    //   title: "Banner Chào mừng 🌟",
    //   description: (
    //     <div>
    //       <p>Khu vực chào mừng với tên của bạn.</p>
    //       <p>Có thể tìm kiếm nhanh các tính năng từ đây.</p>
    //     </div>
    //   ),
    //   target: () => document.querySelector('[data-tour="banner"]'),
    // },
    {
      title: "Các Chức năng chính của hệ thống",
      description: generateFeaturesDescription(),
      target: () => document.querySelector('[data-tour="features"]') as HTMLElement,
    },
    // Chèn các step cho từng chức năng riêng lẻ
    ...generateFeatureSteps(),
    // {
    //   title: "Hình ảnh minh họa 🖼️",
    //   description: (
    //     <div>
    //       <p>Các hình ảnh minh họa cho các tính năng chính:</p>
    //       <ul>
    //         <li>Tạo giáo án</li>
    //         <li>Tạo đề thi</li>
    //         <li>Tạo slide thuyết trình</li>
    //       </ul>
    //     </div>
    //   ),
    //   target: () => document.querySelector('[data-tour="illustrations"]'),
    // },
    {
      title: "Lịch sử hoạt động",
      description: (
        <div>
          <p>Xem lại tất cả các hoạt động đã thực hiện:</p>
          <ul>
            <li>Giáo án đã tạo</li>
            <li>Đề thi đã tạo</li>
            <li>Slide đã tạo</li>
            <li>Các tài liệu khác</li>
          </ul>
        </div>
      ),
      target: () => document.querySelector('[data-tour="history"]') as HTMLElement,
    },
    {
      title: "Danh sách lịch sử",
      description: (
        <div>
          <p>Các tài liệu được hiển thị dưới dạng thẻ.</p>
          <p>Click vào bất kỳ thẻ nào để xem chi tiết hoặc chỉnh sửa.</p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="history-list"]') as HTMLElement,
    },
    {
      title: "Phân trang",
      description: (
        <div>
          <p>Điều hướng qua các trang khi có nhiều tài liệu.</p>
          <p>
            Sử dụng các nút Trang trước/Trang sau hoặc click trực tiếp vào số trang.
          </p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="pagination"]') as HTMLElement,
    },
    {
      title: "ChatBox",
      description: (
        <div>
          <p>ChatBox là nơi bạn có thể trò chuyện với AI Assistant.</p>
          <p>Bạn có thể hỏi bất kỳ câu hỏi nào về giảng dạy.</p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="chat-box"]') as HTMLElement,
    },
    {
      title: "Hoàn thành!",
      description: (
        <div>
          <p>Bạn đã hoàn thành tour hướng dẫn!</p>
          <p>
            Bây giờ bạn có thể bắt đầu sử dụng PlanBook để tạo ra những tài liệu
            giảng dạy tuyệt vời.
          </p>
          <p>
            <strong>Chúc bạn có trải nghiệm tốt! </strong>
          </p>
        </div>
      ),
      target: null,
    },
  ];

  // Kiểm tra xem user đã xem tour chưa
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("home-tour-completed");
    if (!hasSeenTour) {
      // Delay một chút để đảm bảo DOM đã render
      setTimeout(() => {
        setOpen(true);
      }, 1000);
    }
  }, []);

  // Auto-advance tour steps every 2 seconds
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      } else {
        // Tự động finish tour khi đến step cuối
        handleTourClose();
      }
    }, 2000); // 2 giây

    return () => clearTimeout(timer);
  }, [open, current]);

  const handleTourClose = () => {
    setOpen(false);
    localStorage.setItem("home-tour-completed", "true");
    onTourComplete?.();
  };

  const resetTour = () => {
    localStorage.removeItem("home-tour-completed");
    setCurrent(0);
    setOpen(true);
  };

  return (
    <>
      {/* Nút để khởi động lại tour */}
      <Button
        type="primary"
        icon={<QuestionCircleOutlined />}
        onClick={resetTour}
        className="tour-help-button"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Xem lại hướng dẫn"
      />

      <Tour
        open={open}
        onClose={handleTourClose}
        steps={steps}
        current={current}
        onChange={setCurrent}
        // indicatorsRender={(current, total) => (
        //   <span style={{ color: "#1890ff", fontWeight: "bold" }}>
        //     {current + 1} / {total}
        //   </span>
        // )}
        type="primary"
        arrow={true}
        placement="bottom"
        mask={{
          style: {
            boxShadow: "inset 0 0 15px #333",
          },
        }}
        zIndex={1001}
      />
    </>
  );
};

export default HomeTour;
