"use client";

import React from "react";
import { Button } from "@heroui/react";
import { MoveLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center overflow-hidden w-full">
      {/* 404 Neumorphism Lõm Background (Inner Shadow effect) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10">
        <svg width="0" height="0" className="absolute pointer-events-none">
          <filter id="inset-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="18" dy="18" in="SourceAlpha" result="offset-dark" />
            <feGaussianBlur stdDeviation="15" in="offset-dark" result="blur-dark" />
            <feComposite operator="out" in="SourceAlpha" in2="blur-dark" result="inverse-dark" />
            <feFlood floodColor="black" floodOpacity="0.15" result="color-dark" />
            <feComposite operator="in" in="color-dark" in2="inverse-dark" result="shadow-dark" />
            
            <feOffset dx="-18" dy="-18" in="SourceAlpha" result="offset-light" />
            <feGaussianBlur stdDeviation="15" in="offset-light" result="blur-light" />
            <feComposite operator="out" in="SourceAlpha" in2="blur-light" result="inverse-light" />
            <feFlood floodColor="white" floodOpacity="0.8" result="color-light" />
            <feComposite operator="in" in="color-light" in2="inverse-light" result="shadow-light" />
            
            <feComposite operator="over" in="shadow-dark" in2="SourceGraphic" result="step1" />
            <feComposite operator="over" in="shadow-light" in2="step1" />
          </filter>

          <filter id="inset-shadow-dark" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="18" dy="18" in="SourceAlpha" result="offset-dark" />
            <feGaussianBlur stdDeviation="15" in="offset-dark" result="blur-dark" />
            <feComposite operator="out" in="SourceAlpha" in2="blur-dark" result="inverse-dark" />
            <feFlood floodColor="black" floodOpacity="0.7" result="color-dark" />
            <feComposite operator="in" in="color-dark" in2="inverse-dark" result="shadow-dark" />
            
            <feOffset dx="-18" dy="-18" in="SourceAlpha" result="offset-light" />
            <feGaussianBlur stdDeviation="15" in="offset-light" result="blur-light" />
            <feComposite operator="out" in="SourceAlpha" in2="blur-light" result="inverse-light" />
            <feFlood floodColor="white" floodOpacity="0.05" result="color-light" />
            <feComposite operator="in" in="color-light" in2="inverse-light" result="shadow-light" />
            
            <feComposite operator="over" in="shadow-dark" in2="SourceGraphic" result="step1" />
            <feComposite operator="over" in="shadow-light" in2="step1" />
          </filter>
        </svg>

        <h1 className="text-[180px] sm:text-[300px] md:text-[380px] lg:text-[450px] font-black tracking-wider leading-none text-background filter-[url(#inset-shadow)] dark:filter-[url(#inset-shadow-dark)]">  
          4 0 4
        </h1>
      </div>

      <div className="flex flex-col items-center max-w-lg w-full relative z-10">
        <h2 className="text-3xl lg:text-4xl md:text-5xl font-bold text-foreground mb-6">
          Oops! Lạc đường rồi
        </h2>

        <p className="text-default-500 text-base md:text-lg mb-10 max-w-md">
          Trang bạn đang tìm kiếm không tồn tại, đã bị thay đổi đường dẫn hoặc tạm thời không thể truy cập.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
          <Button
            onPress={() => router.back()}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto font-medium"
          >
            <MoveLeft className="w-5 h-5" />
            Trở lại trang trước
          </Button>

          <Button
            onPress={() => router.push("/")}
            size="lg"
            className="w-full sm:w-auto font-medium"
          >
            <Home className="w-5 h-5" />
            Về trang chủ an toàn
          </Button>
        </div>
      </div>
    </div>
  );
}