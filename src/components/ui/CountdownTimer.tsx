'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CountdownTimer({ targetDate }: { targetDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Prevent hydration mismatch by not rendering the times until mounted
  if (!mounted) {
    return (
      <div className="flex gap-4 md:gap-6 justify-center mt-8 mb-4 h-24"></div>
    );
  }

  const timeUnits = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-6 justify-center mt-8 mb-4">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-default-100 dark:bg-default-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl font-black text-primary shadow-sm border border-default-200 overflow-hidden tabular-nums">
            {String(unit.value).padStart(2, '0').split('').map((digit, i) => (
              <div key={i} className="relative w-[1ch] h-full flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={digit}
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                    className="absolute"
                  >
                    {digit}
                  </motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
          <span className="text-xs md:text-sm text-muted mt-3 font-bold uppercase tracking-widest text-default-500">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}