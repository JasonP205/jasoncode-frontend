"use client";

import React from 'react';
import { Button } from '@heroui/react';
import { Pickaxe, MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MotionDiv from './motionDiv';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon = ({ 
  title = "Tính năng đang phát triển", 
  description = "Chúng tôi đang nỗ lực hoàn thiện và sẽ sớm ra mắt tính năng này. Cảm ơn bạn đã quan tâm và vui lòng quay lại sau nhé!" 
}: ComingSoonProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center w-full">
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center max-w-lg w-full"
      >
        {/* Biểu tượng (Icon) */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gray-200 rounded-full animate-ping opacity-20"></div>
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center relative z-10">
            <Pickaxe className="w-12 h-12 text-[#6F6F6F]" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Nôi dung chữ */}
        <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
          {title}
        </h2>
        
        <p className="text-[#6F6F6F] text-base md:text-lg mb-10 leading-relaxed max-w-md">
          {description}
        </p>

        {/* Nút hành động */}
        <Button
          onPress={() => router.back()}
          className="bg-black text-white px-8 font-medium rounded-full shadow-md hover:bg-black/80"
          size="lg"
        >
          <MoveLeft className="w-4 h-4 mr-2" />
          Trở lại trang trước
        </Button>
      </MotionDiv>
    </div>
  );
};

export default ComingSoon;