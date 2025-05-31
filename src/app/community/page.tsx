import MainLayout from "@/components/layout/MainLayout";
import Banner from "@/components/organisms/banner";
import React from "react";

function CommunityPage() {
  return (
    <MainLayout>
      <Banner
        backgroundImage="/images/background/bgDocument.png"
        sideImage="/images/banner/bannerDocument.svg"
        title="Tài liệu cộng đồng"
        subtitle="Lưu tài liệu cá nhân theo cách của bạn"
        width="w-full"
        heightBanner="h-[220px]"
      />
    </MainLayout>
  );
}

export default CommunityPage;
