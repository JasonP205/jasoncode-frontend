import { Button } from "@heroui/react";
const Hero = () => {
  return (
    <section data-anchor="hero">
      <div className="relative w-full aspect-video">
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          />
        </div>

        <div className="w-full h-full absolute top-0 left-0 bg-linear-to-t from-white via-transparent to-white flex flex-col justify-center items-center text-center px-4" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center p-8">
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-serif font-normal text-black leading-snug tracking-tight sm:tracking-[-2.46px] px-2 text-center">
            Một chút <span className="italic text-muted">thiết kế</span>,
            <br className="hidden sm:block" />
            một chút <span className="italic text-muted">lập trình</span>, và
            những điều thú vị.{" "}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mt-6 sm:mt-8 leading-relaxed text-center px-4">
            Chào, tôi là{" "}
            <span className="text-black font-medium">Phan Hoàng Phúc</span>. Một
            freelancer Web Developer đam mê tạo ra những sản phẩm đơn giản, hữu
            ích và chỉn chu.
          </p>
          <div className="mt-10 sm:mt-12">
            <Button size="lg">Bắt đầu hành trình</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
