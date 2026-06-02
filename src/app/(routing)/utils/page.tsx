import React from 'react';
import MotionDiv from '@/components/ui/motionDiv';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tiện ích",
  description: "Khám phá các công cụ tiện ích sắp ra mắt trên trang web của tôi! Từ bộ đếm thời gian đến các tính năng tương tác, mình đang chuẩn bị những tiện ích hữu ích để nâng cao trải nghiệm của bạn. Hãy đếm ngược cùng Jason và sẵn sàng trải nghiệm những công cụ mới mẻ này khi chúng chính thức được kích hoạt!"
};

const UtilsPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center py-10">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 flex flex-col items-center max-w-3xl mx-auto"
      >
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-4">
          <Clock className="w-10 h-10" />
        </div>
        
        <div className="inline-block px-4 py-1.5 bg-default-100 dark:bg-default-50 border border-default-200 text-default-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
          Coming Soon
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-tight">
          Các Công Cụ Tiện Ích
        </h1>
        
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Tính năng này đang trong giai đoạn chuẩn bị và sẽ chính thức được kích hoạt. Hãy đếm ngược cùng Jason nhé!
        </p>

        {/* Countdown Timer Component Target Date: 2026-09-02 */}
        <CountdownTimer targetDate="2026-09-02T00:00:00" />
        
        <div className="pt-8">
          <Button 
            className="font-bold px-8 rounded-full group/home-btn"
            size="lg"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 group-hover/home-btn:-translate-x-1 transition-transform" />
              Quay lại trang chủ
            </Link>
          </Button>
        </div>
      </MotionDiv>
    </div>
  );
}

export default UtilsPage;