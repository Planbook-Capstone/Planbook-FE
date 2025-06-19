"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const PartnerSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1340px] mx-auto relative rounded-4xl border bg-[url('/images/background/box.png')] bg-cover bg-center flex flex-col md:flex-row items-center justify-between p-10 md:p-16 py-20">
        <div className="max-w-xl mb-12 md:mb-0">
          <span className="inline-block text-white bg-[#00CFF3] text-base px-4 py-1 rounded-full mb-4">
            Cộng tác cùng Planbook
          </span>
          <h2 className="text-[40px] md:text-[56px] font-calsans leading-tight mb-4">
            Đồng hành cùng <br /> Planbook
          </h2>
          <p className="text-base mb-6">
            Hợp tác với Planbook để tạo ra những giải pháp giáo dục hiệu quả,
            hiện đại và đột phá. Cùng nhau, chúng ta nâng tầm trải nghiệm dạy
            học.
          </p>
          <Button className="h-12 rounded-full px-6 text-base bg-[#00C767] text-white">
            Bắt đầu ngay
          </Button>
        </div>

        <div className="w-full md:w-[480px] absolute bottom-0 right-20">
          <Image
            src="/images/illustration/phone.svg"
            alt="Ảnh mockup Planbook"
            width={480}
            height={480}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};
