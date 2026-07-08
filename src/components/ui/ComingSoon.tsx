"use client";

import React from 'react';
import { Button } from '@heroui/react';
import { Pickaxe, MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import MotionDiv from './motionDiv';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  const t = useTranslations('comingSoon');
  const router = useRouter();
  const heading = title ?? t('defaultTitle');
  const body = description ?? t('defaultDescription');

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
          <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-20"></div>
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center relative z-10">
            <Pickaxe className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>

        {/* Nôi dung chữ */}
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          {heading}
        </h2>

        <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed max-w-md">
          {body}
        </p>

        {/* Nút hành động */}
        <Button
          onPress={() => router.back()}
          className="bg-foreground text-background px-8 font-medium rounded-full shadow-md hover:bg-foreground/80"
          size="lg"
        >
          <MoveLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
      </MotionDiv>
    </div>
  );
};

export default ComingSoon;