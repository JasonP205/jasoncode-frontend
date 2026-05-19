import React from "react";

import { Chip } from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react/webgpu";
import ShortLinkForm from "@/components/ui/ShortLinkForm";

const page = () => {
  return (
    <div className="w-full min-h-screen flex relative items-center justify-center">
      <div className="bg-grid-sphere w-full flex-1 flex justify-center overflow-hidden">
        <div className="mt-20 sm:mt-0 w-full px-4 flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-5">
          <div className="md:flex-1 flex flex-col gap-4 max-w-2xl">
            <div>
              <Chip>Trình rút gọn URL miễn phí</Chip>
            </div>
            <h2 className="text-2xl sm:text-4xl font-gelasio-700 font-bold text-[#2D3748]">
              Rút gọn liên kết nhanh chóng và dễ dàng với{" "}
              Jason Short Link
            </h2>
            <p className="text-xs sm:text-sm mb-6 text-balance font-semibold text-[#718096]">
              Biến những URL dài và rối rắm thành liên kết ngắn gọn, dễ chia sẻ
              chỉ trong vài giây. Miễn phí, nhanh chóng và tiện lợi!
            </p>
            <ShortLinkForm />
          </div>
          <div className="flex-1 max-w-md md:max-w-xl aspect-square rounded-md overflow-hidden">
            <DotLottieReact src="/lotties/hero.lottie" autoplay loop />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
