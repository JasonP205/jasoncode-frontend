"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { motion } from 'motion/react';

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const monitorVideo = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (duration > 0) {
        // Fade in over 0.5s at the start
        if (currentTime < 0.5) {
          setOpacity(currentTime / 0.5);
        } 
        // Fade out over 0.5s before the end
        else if (currentTime > duration - 0.5) {
          setOpacity((duration - currentTime) / 0.5);
        } 
        else {
          setOpacity(1);
        }
      }

      rafId = requestAnimationFrame(monitorVideo);
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(console.error);
        }
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    rafId = requestAnimationFrame(monitorVideo);

    return () => {
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6" style={{ paddingTop: 'calc(6rem - 75px)', paddingBottom: '6rem' }}>
      {/* Background Video Layer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: opacity }}
        transition={{ duration: 0.1, ease: "linear" }}
        className="absolute z-0 w-full" 
        style={{ 
          top: '35%', 
          inset: 'auto 0 0 0', 
          height: '65%',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-7xl md:text-8xl font-serif font-normal text-black leading-[1.1] sm:leading-[0.95] tracking-tight sm:tracking-[-2.46px] px-2"
        >
          Vượt qua <span className="italic text-[#6F6F6F]">sự im lặng,</span><br className="hidden sm:block" />
          chúng tôi xây dựng <span className="italic text-[#6F6F6F]">sự vĩnh cửu.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg text-[#6F6F6F] max-w-2xl mt-6 sm:mt-8 leading-relaxed px-4"
        >
          Chào tôi là <span className="text-black font-medium">Phan Hoàng Phúc</span>. 
          Một kỹ sư phần mềm chuyên tâm vào việc xây dựng những nền tảng kỹ thuật số tinh tế cho những tâm hồn sáng tạo và những nhà làm sản phẩm can trường.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10 sm:mt-12"
        >
          <Button size="lg">
            Bắt đầu hành trình
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
