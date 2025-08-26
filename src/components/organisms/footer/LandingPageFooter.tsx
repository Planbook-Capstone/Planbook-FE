"use client";

import Link from "next/link";

export const LandingPageFooter = () => {
  return (
    <footer className="bg-white">
      {/* Combined Video Testimonial & CTA Section */}
      <section className="mx-0 md:mx-6 xl:[200px] md:px-[75px] lg:mx-auto space-y-0">
        {/* Video Testimonial Part */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-screen object-cover"
          >
            <source src="/videos/demo_1.mp4" />
          </video>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16 min-h-screen flex flex-col justify-between">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Testimonial Text */}
            <div className="max-w-lg">
              <p className="text-white text-lg md:text-xl leading-relaxed mb-8">
                Sứ mệnh của chúng tôi tại PlanBook là đồng hành cùng giáo viên
                Việt Nam trong hành trình chuyển đổi số giáo dục. Chúng tôi xây
                dựng một nền tảng toàn diện giúp giáo viên tiết kiệm thời gian,
                nâng cao chất lượng dạy học và tiếp cận công nghệ một cách dễ
                dàng.
              </p>

              <p className="text-white text-lg md:text-xl leading-relaxed mb-8">
                Từ việc tạo giáo án, kiểm tra đánh giá, chấm điểm tự động cho
                đến phân tích học tập, mọi công cụ trong PlanBook đều được phát
                triển để phục vụ duy nhất một mục tiêu: hỗ trợ giáo viên giảng
                dạy hiệu quả hơn trong thời đại mới.
              </p>

              {/* Author */}
              <div className="mb-8">
                <p className="text-white font-semibold">Đội ngũ PlanBook</p>
                <p className="text-white/80 text-sm">
                  Nền tảng hỗ trợ chuyển đổi số cho giáo viên Việt Nam
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 md:gap-12">
              <div>
                <p className="text-white/80 text-sm mb-2">
                  Thời gian tạo đề giảm
                </p>
                <p className="text-white text-4xl md:text-5xl font-bold">
                  -80%
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-2">Giáo viên hài lòng</p>
                <p className="text-white text-4xl md:text-5xl font-bold">
                  +95%
                </p>
              </div>
            </div>

            {/* Play Button */}
            <div className="absolute bottom-8 right-8">
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white hover:bg-white/30 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-sm">Play video</span>
              </button>
            </div>
          </div>

          {/* CTA Part */}
          <div className="bg-gradient-to-b from-amber-500 to-amber-600 text-white py-20 rounded-b-3xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              {/* Header */}
              <div className="text-center mb-16 text-white">
                <p className=" text-sm mb-4">Kết nối – Cùng phát triển</p>
                <h2 className="text-4xl md:text-6xl font-calsans mb-8 text-white">
                  Hợp tác cùng PlanBook
                </h2>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text--300">
                  Nếu bạn có sản phẩm hoặc dịch vụ muốn tích hợp vào hệ thống
                  giáo dục, chúng tôi hỗ trợ kết nối nhanh qua API và chia sẻ
                  doanh thu khi người dùng sử dụng – minh bạch và đơn giản.
                </p>
                <button className="bg-neutral-800 text-white px-6 py-3 rounded-full hover:bg-lime-300 transition-colors">
                  Liên hệ để hợp tác
                </button>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div>
                  <p className="text-white text-sm mb-6">Khám phá</p>
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-white hover:text-gray-300">
                        Dịch vụ
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-white hover:text-gray-300">
                        Về chúng tôi
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-white hover:text-gray-300">
                        Liên hệ
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-white text-sm mb-6">Việc làm</p>
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-white hover:text-gray-300">
                        Tuyển dụng
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-white text-sm mb-6">Kết nối</p>
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-white hover:text-gray-300">
                        GitHub
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-white hover:text-gray-300">
                        Linkedin
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-white text-sm mb-6">Thành tích</p>
                  <ul className="space-y-2">
                    <li>
                      <div className="text-white">100+</div>
                      <div className="text-white text-xs">Người dùng</div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Logo lớn nền */}
              <div className="text-center">
                <div className="text-[95px] md:text-[12vw] lg:text-[18vw] -translate-x-[36px] md:-translate-x-[78px] lg:-translate-x-[136px] font-calsans text-white/10">
                  PlanBook
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-2xl font-calsans text-black mb-2">
              Planbook.vn – Nền tảng đồng hành cùng{" "}
              <span className="text-black">giáo viên THPT</span>
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Giáo án & Bài giảng */}
            <div>
              <h3 className="font-calsans text-black mb-6">
                Giáo án & Bài giảng
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Tạo giáo án theo mẫu
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Ngân hàng bài giảng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Công cụ hỗ trợ */}
            <div>
              <h3 className="font-calsans text-black mb-6">Công cụ hỗ trợ</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Tạo nhận xét học sinh
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Chấm điểm trắc nghiệm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quản lý & Phân tích */}
            <div>
              <h3 className="font-calsans text-black mb-6">
                Quản lý & Phân tích
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Theo dõi học tập
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Thống kê điểm số
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Phân tích xu hướng lớp học
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tài nguyên cộng đồng */}
            <div>
              <h3 className="font-calsans text-black mb-6">
                Tài nguyên cộng đồng
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Giáo án chia sẻ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Kho đề kiểm tra
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black hover:text-gray-600">
                    Slide bài giảng mẫu
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-black">Lên đầu trang</span>
              <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
