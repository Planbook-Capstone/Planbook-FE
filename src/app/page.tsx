import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  // Dữ liệu tính năng AI
  const aiFeatures = [
    {
      id: 1,
      title: "Lập kế hoạch thông minh",
      description:
        "AI phân tích sở thích của bạn để tạo lịch trình chuyến đi phù hợp nhất",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Gợi ý cá nhân hóa",
      description:
        "AI học từ lựa chọn trước đây để đề xuất điểm đến và trải nghiệm phù hợp",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Phân tích đánh giá",
      description:
        "AI xử lý hàng nghìn đánh giá để đưa ra thông tin chính xác về điểm đến",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      ),
    },
  ];

  // Dữ liệu điểm đến được AI khuyên dùng
  const aiRecommendedDestinations = [
    {
      id: 1,
      name: "Kyoto",
      country: "Nhật Bản",
      description:
        "Được AI đề xuất cho người yêu thích văn hóa truyền thống và nghệ thuật",
      matchScore: 97,
      imageUrl: "/images/kyoto.jpg", // Thay bằng đường dẫn thực tế
    },
    {
      id: 2,
      name: "Barcelona",
      country: "Tây Ban Nha",
      description:
        "Phù hợp với các nhà thám hiểm đô thị thích kiến trúc và ẩm thực",
      matchScore: 95,
      imageUrl: "/images/barcelona.jpg", // Thay bằng đường dẫn thực tế
    },
    {
      id: 3,
      name: "Bali",
      country: "Indonesia",
      description:
        "Điểm đến cân bằng giữa thư giãn và phiêu lưu cho người thích khám phá",
      matchScore: 94,
      imageUrl: "/images/bali.jpg", // Thay bằng đường dẫn thực tế
    },
    {
      id: 4,
      name: "Cape Town",
      country: "Nam Phi",
      description:
        "Sự kết hợp hoàn hảo của phong cảnh thiên nhiên và văn hóa đô thị sôi động",
      matchScore: 92,
      imageUrl: "/images/capetown.jpg", // Thay bằng đường dẫn thực tế
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section với Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <div className=" mb-6 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 bg-opacity-20 backdrop-blur-sm text-black text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
              <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
            </svg>
            Dự án Capstone - FPT University
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            <span className="block">PlanBookAI</span>
            <span className="block mt-2 text-blue-300">
              Công nghệ AI cho trải nghiệm du lịch
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-10">
            Hệ thống lập kế hoạch du lịch thông minh sử dụng trí tuệ nhân tạo để
            tạo lịch trình cá nhân hóa, khám phá điểm đến phù hợp và tối ưu trải
            nghiệm của bạn.
          </p>
        </div>
      </div>

      {/* AI Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="block text-blue-600 font-semibold mb-2">
              TRÍ TUỆ NHÂN TẠO TRONG DU LỊCH
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cách PlanBookAI Cách Mạng Hóa Trải Nghiệm Du Lịch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi kết hợp công nghệ AI tiên tiến và dữ liệu du lịch để
              mang lại trải nghiệm du lịch tuyệt vời nhất
            </p>
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {aiFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Button
                  variant="outline"
                  className="w-full justify-center border-blue-500 text-blue-700 hover:bg-blue-50"
                >
                  Tìm hiểu thêm
                </Button>
              </div>
            ))}
          </div>

          {/* AI Technology Visualization */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 mb-20">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <span className="text-blue-600 font-semibold mb-2 block">
                  CÔNG NGHỆ CỦA CHÚNG TÔI
                </span>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  AI Thông Minh Hơn Mọi Hướng Dẫn Viên Du Lịch
                </h3>
                <p className="text-gray-600 mb-6">
                  PlanBookAI sử dụng các thuật toán học máy tiên tiến để phân
                  tích hàng triệu điểm dữ liệu từ đánh giá, xu hướng du lịch,
                  thời tiết, và sở thích cá nhân để tạo lịch trình hoàn hảo cho
                  từng người dùng.
                </p>
                <div className="space-y-4">
                  {[
                    "Phân tích dữ liệu lớn từ +50 triệu điểm du lịch",
                    "Mô hình ngôn ngữ lớn được huấn luyện với dữ liệu du lịch",
                    "Học tăng cường từ phản hồi người dùng",
                    "Cập nhật liên tục với xu hướng du lịch mới nhất",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        ✓
                      </div>
                      <p className="ml-3 text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 bg-white rounded-xl shadow-lg p-4 relative">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    [Hình ảnh minh họa cho công nghệ AI]
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                  Công nghệ ML tiên tiến
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended Destinations */}
          <div className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="block text-blue-600 font-semibold mb-2">
                  KHUYẾN NGHỊ THÔNG MINH
                </span>
                <h2 className="text-3xl font-bold text-gray-900">
                  Điểm Đến Được AI Đề Xuất
                </h2>
              </div>
              <Link
                href="/destinations"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
              >
                Xem tất cả điểm đến
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiRecommendedDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      {/* Replace with actual image */}
                      <span className="text-gray-500">
                        Hình ảnh: {destination.name}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 text-white z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="px-2 py-1 bg-blue-600/80 text-xs font-medium rounded-full backdrop-blur-sm">
                        AI Đề Xuất
                      </span>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        {destination.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {destination.country}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          AI
                        </div>
                        <span className="ml-1 text-sm font-medium">
                          Match: {destination.matchScore}%
                        </span>
                      </div>
                      <Button variant="outline" className="text-xs py-1.5">
                        Khám phá
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <span className="block text-blue-600 font-semibold mb-2">
                TRẢI NGHIỆM NGƯỜI DÙNG
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Người Dùng Nói Gì Về PlanBookAI
              </h2>
              <p className="text-gray-600">
                Trải nghiệm thực tế từ người dùng đã sử dụng hệ thống của chúng
                tôi
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    T
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Trần Minh</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "PlanBookAI đã tạo một lịch trình hoàn hảo cho kỳ nghỉ của tôi
                  ở Đà Nẵng. AI đề xuất những địa điểm phù hợp với sở thích của
                  tôi mà chính bản thân tôi cũng không nghĩ tới!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xl">
                    H
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Hoàng Linh</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Hệ thống gợi ý thông minh của PlanBookAI giúp tôi tiết kiệm
                  rất nhiều thời gian khi lập kế hoạch cho chuyến đi châu Âu.
                  Điều tuyệt nhất là nó liên tục cải thiện qua mỗi lần sử dụng!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                    N
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Nguyễn Thành</p>
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Tôi đánh giá cao khả năng của PlanBookAI trong việc điều
                  chỉnh lịch trình khi có thay đổi bất ngờ. Trợ lý AI đã giúp
                  tôi tìm phương án thay thế nhanh chóng khi gặp vấn đề."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white mb-2">
              Sẵn sàng để AI biến đổi trải nghiệm du lịch của bạn?
            </h2>
            <p className="text-blue-100">
              Tạo tài khoản miễn phí ngay hôm nay và khám phá sức mạnh của AI
              trong việc lập kế hoạch du lịch.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50"
            >
              Đăng ký miễn phí
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 text-white border-white hover:bg-blue-500"
            >
              Xem demo
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
