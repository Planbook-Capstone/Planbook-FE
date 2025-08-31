"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tour, Button } from "antd";
import type { TourProps } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useIsMobile } from "@/hooks/use-mobile";
import "./tour.css";
import { BookTypeResponse } from "@/types";

interface HomeTourProps {
  onTourComplete?: () => void;
  bookTypes?: BookTypeResponse[];
}

const HomeTour: React.FC<HomeTourProps> = ({ onTourComplete, bookTypes }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const isMobile = useIsMobile();

  // Debug function để kiểm tra ChatBox
  const debugChatBox = () => {
    const chatBoxElement = document.querySelector('[data-tour="chat-box"]');
    const allChatBoxElements = document.querySelectorAll('[data-tour="chat-box"]');


    if (chatBoxElement) {
      const rect = chatBoxElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(chatBoxElement);

    }

  };

  // Kiểm tra element có visible và accessible không
  const isElementAccessible = (selector: string) => {
    const element = document.querySelector(selector);
    if (!element) {
      // console.log(`Element not found: ${selector}`);
      return false;
    }

    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;

    // Đối với fixed positioned elements như ChatBox, không cần check viewport strict
    // Chỉ cần check element có visible và không bị ẩn
    const computedStyle = window.getComputedStyle(element);
    const isDisplayed = computedStyle.display !== 'none' &&
                       computedStyle.visibility !== 'hidden' &&
                       computedStyle.opacity !== '0';

    // console.log(`Element ${selector}:`, {
    //   found: !!element,
    //   isVisible,
    //   isDisplayed,
    //   rect: { width: rect.width, height: rect.height },
    //   computedStyle: {
    //     display: computedStyle.display,
    //     visibility: computedStyle.visibility,
    //     opacity: computedStyle.opacity
    //   }
    // });

    return isVisible && isDisplayed;
  };

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
      .slice(0, isMobile ? 4 : 8); // Giới hạn số lượng cho mobile

    return sortedFeatures
      .filter((feature) => isElementAccessible(`[data-tour="feature-${feature.id}"]`))
      .map((feature) => ({
        title: `${feature.name}`,
        description: (
          <div>
            <p><strong>Mô tả:</strong> {feature.description || "Chức năng hỗ trợ giảng dạy"}</p>
            {(feature.tokenCostPerQuery === 0 || !feature.tokenCostPerQuery) && (
              <p>
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Dùng thử miễn phí</span>
              </p>
            )}
            <p>{isMobile ? "Chạm vào thẻ này để sử dụng!" : "Click vào thẻ này để bắt đầu sử dụng chức năng!"}</p>
          </div>
        ),
        target: () => document.querySelector(`[data-tour="feature-${feature.id}"]`) as HTMLElement,
      }));
  };

  // Tạo tất cả steps và filter những cái phù hợp
  const allSteps: TourProps["steps"] = [
    {
      title: "Chào mừng đến với PlanBook!",
      description: (
        <div>
          <p>
            {isMobile
              ? "Chúng tôi sẽ hướng dẫn bạn khám phá các tính năng chính trên điện thoại."
              : "Chúng tôi sẽ hướng dẫn bạn khám phá các tính năng chính của trang chủ."
            }
          </p>
          <p>{isMobile ? "Hãy cùng bắt đầu nhé!" : "Hãy cùng bắt đầu tour hướng dẫn nhé!"}</p>
        </div>
      ),
      target: null, // Tour bắt đầu ở giữa màn hình
    },
    {
      title: "Logo và Trang chủ",
      description: (
        <div>
          <p>
            <strong>Logo PlanBook:</strong> {isMobile ? "Chạm vào logo" : "Click vào logo"} để quay về trang chủ
            bất cứ lúc nào.
          </p>
          <p>Đây là điểm khởi đầu cho tất cả các hoạt động của bạn.</p>
        </div>
      ),
      target: () => document.querySelector('[data-tour="logo"]') as HTMLElement,
    },
    // Navigation step - chỉ hiển thị trên desktop vì mobile có hamburger menu
    ...(isMobile ? [] : [{
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
    }]),

    // Mobile hamburger menu step - chỉ hiển thị trên mobile
    ...(isMobile ? [{
      title: "Menu Điều hướng",
      description: (
        <div>
          <p>
            <strong>Menu hamburger:</strong> Chạm vào biểu tượng 3 gạch để mở menu điều hướng.
          </p>
          <p>Từ đây bạn có thể truy cập:</p>
          <p>• Trợ lý AI • Kho tài liệu • Gói dịch vụ</p>
        </div>
      ),
      target: () => document.querySelector('.md\\:hidden button') as HTMLElement, // Hamburger button
    }] : []),

    // Mobile user info step - hướng dẫn truy cập thông tin user trên mobile
    ...(isMobile ? [{
      title: "Thông tin cá nhân",
      description: (
        <div>
          <p>Trên mobile, thông tin cá nhân và cài đặt được đặt trong menu hamburger.</p>
          <p>Chạm vào menu để truy cập:</p>
          <p>• Thông tin tài khoản • Cài đặt • Đăng xuất</p>
        </div>
      ),
      target: () => document.querySelector('.md\\:hidden button') as HTMLElement, // Hamburger button
    }] : []),
    // User-related steps - chỉ hiển thị trên desktop vì mobile ẩn UserButton
    ...(isMobile ? [] : [
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
        title: "Thông báo đơn hàng",
        description: (
          <div>
            <p>Tại đây bạn sẽ thấy thông báo về các đơn hàng chưa thanh toán, thanh toán thất bại hoặc cần thanh toán lại. Hãy kiểm tra để đảm bảo quyền sử dụng dịch vụ không bị gián đoạn.</p>
            <p>Click để xem chi tiết.</p>
          </div>
        ),
        target: () => document.querySelector('[data-tour="notifications"]') as HTMLElement,
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
    ]),
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
      title: isMobile ? "Các Chức năng chính" : "Các Chức năng chính của hệ thống",
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
          {isMobile ? (
            <p>• Giáo án, đề thi, slide và tài liệu khác</p>
          ) : (
            <ul>
              <li>Giáo án đã tạo</li>
              <li>Đề thi đã tạo</li>
              <li>Slide đã tạo</li>
              <li>Các tài liệu khác</li>
            </ul>
          )}
        </div>
      ),
      target: () => document.querySelector('[data-tour="history"]') as HTMLElement,
    },
    {
      title: "Danh sách lịch sử",
      description: (
        <div>
          <p>Các tài liệu được hiển thị dưới dạng bảng.</p>
          <p>Click vào bất kỳ hàng nào để xem chi tiết.</p>
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
          <p>{isMobile ? "Hỏi bất kỳ câu hỏi nào về giảng dạy." : "Bạn có thể hỏi bất kỳ câu hỏi nào về giảng dạy."}</p>
        </div>
      ),
      target: () => {
        const element = document.querySelector('[data-tour="chat-box"]') as HTMLElement;
        // console.log('ChatBox target element:', element);
        return element;
      },
    },
    {
      title: "Hoàn thành!",
      description: (
        <div>
          <p>Bạn đã hoàn thành tour hướng dẫn!</p>
          <p>
            {isMobile
              ? "Bây giờ bạn có thể bắt đầu sử dụng PlanBook trên điện thoại để tạo tài liệu giảng dạy."
              : "Bây giờ bạn có thể bắt đầu sử dụng PlanBook để tạo ra những tài liệu giảng dạy tuyệt vời."
            }
          </p>
          <p>
            <strong>Chúc bạn có trải nghiệm tốt! </strong>
          </p>
        </div>
      ),
      target: null,
    },
  ];

  // Filter steps dựa trên element accessibility - chỉ filter khi tour đang mở
  const steps: TourProps["steps"] = useMemo(() => {
    if (!open) return allSteps; // Không filter khi tour chưa mở

    return allSteps.filter((step) => {
      // Luôn giữ step đầu và cuối (không có target)
      if (!step.target) return true;

      // Kiểm tra element có accessible không
      try {
        const target = typeof step.target === 'function' ? step.target() : step.target;
        if (!target) {
          // console.warn(`Tour step target not found for step: ${step.title}`);
          return false;
        }

        // Kiểm tra element có visible không
        const rect = target.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;

        // Kiểm tra element không bị ẩn bởi CSS
        const computedStyle = window.getComputedStyle(target);
        const isDisplayed = computedStyle.display !== 'none' &&
                           computedStyle.visibility !== 'hidden' &&
                           computedStyle.opacity !== '0';

        const isAccessible = isVisible && isDisplayed;
        // console.log(`Tour step "${step.title}":`, { isVisible, isDisplayed, isAccessible });

        return isAccessible;
      } catch (error) {
        // Nếu có lỗi khi query element, skip step này
        // console.warn(`Tour step target error for "${step.title}":`, error);
        return false;
      }
    });
  }, [allSteps, open]);

  // Debug ChatBox ngay khi component mount
  useEffect(() => {
    setTimeout(() => {
      debugChatBox();
    }, 500);
  }, [debugChatBox]);

  // Kiểm tra xem user đã xem tour chưa
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("home-tour-completed");
    if (!hasSeenTour) {
      // Delay để đảm bảo DOM đã render hoàn toàn, đặc biệt là ChatBox
      const delay = isMobile ? 1500 : 2000; // Tăng delay cho desktop
      setTimeout(() => {
        // Debug ChatBox trước khi bắt đầu tour
        debugChatBox();
        setOpen(true);
      }, delay);
    }
  }, [isMobile, debugChatBox]);

  // Auto-advance tour steps - faster on mobile
  useEffect(() => {
    if (!open || steps.length === 0) return;

    const timer = setTimeout(() => {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      } else {
        // Tự động finish tour khi đến step cuối
        handleTourClose();
      }
    }, isMobile ? 2500 : 3000); // Nhanh hơn trên mobile

    return () => clearTimeout(timer);
  }, [open, current, isMobile, steps.length]);

  const handleTourClose = () => {
    setOpen(false);
    localStorage.setItem("home-tour-completed", "true");
    onTourComplete?.();

    // Trên mobile, scroll về top sau khi hoàn thành tour
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          bottom: isMobile ? "80px" : "20px", // Tránh bottom navigation trên mobile
          right: isMobile ? "16px" : "20px",
          zIndex: 1000,
          borderRadius: "50%",
          width: isMobile ? "45px" : "50px",
          height: isMobile ? "45px" : "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Xem lại hướng dẫn"
      />

      {/* Debug button để test ChatBox */}
      {/* <Button
        type="default"
        onClick={debugChatBox}
        style={{
          position: "fixed",
          bottom: isMobile ? "140px" : "80px",
          right: isMobile ? "16px" : "20px",
          zIndex: 1000,
        }}
        title="Debug ChatBox"
      >
        Debug
      </Button> */}

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
        placement={isMobile ? "top" : "bottom"} // Placement khác nhau cho mobile
        mask={true}
        // mask={{
        //   style: {
        //     boxShadow: "inset 0 0 15px #333",
        //   },
        // }}
        zIndex={1001}
      />
    </>
  );
};

export default HomeTour;
