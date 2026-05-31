"use client";
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Anh Minh",
    company: "CEO, Tech Startup",
    quote: "Jason đã mang đến một website vượt ngoài mong đợi. Giao diện hiện đại, tốc độ nhanh và UX tuyệt vời. Chắc chắn sẽ hợp tác trong các dự án tương lai.",
    avatar: "/avatars/avatar1.png",
  },
  {
    id: 2,
    name: "Chị Lan",
    company: "Marketing Manager, E-commerce",
    quote: "Sự chuyên nghiệp và tận tâm của Jason thật đáng kinh ngạc. Cậu ấy không chỉ code mà còn tư vấn rất nhiều giải pháp hay để tối ưu hóa trải nghiệm khách hàng.",
    avatar: "/avatars/avatar2.png",
  },
  {
    id: 3,
    name: "Anh Tuấn",
    company: "Founder, Design Agency",
    quote: "Là một người làm thiết kế, tôi rất khó tính về mặt thẩm mỹ. Jason đã biến những bản thiết kế của chúng tôi thành hiện thực một cách hoàn hảo.",
    avatar: "/avatars/avatar3.png",
  },
  {
    id: 4,
    name: "Chị Hà",
    company: "Chủ cửa hàng thời trang",
    quote: "Nhờ có website do Jason làm, doanh thu online của cửa hàng tôi đã tăng 50%. Rất dễ sử dụng và quản lý. Cảm ơn bạn rất nhiều!",
    avatar: "/avatars/avatar4.png",
  },
  {
    id: 5,
    name: "Anh Hùng",
    company: "Product Manager",
    quote: "Tốc độ làm việc và khả năng giải quyết vấn đề của Jason là điểm cộng rất lớn. Một đối tác đáng tin cậy cho bất kỳ dự án công nghệ nào.",
    avatar: "/avatars/avatar5.png",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section data-anchor="testimonials" className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <h2 className="text-4xl sm:text-5xl font-serif mb-12 text-center">Khách hàng nói gì?</h2>
        <div className="w-full max-w-3xl h-64 relative">
            <AnimatePresence custom={index}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-black rounded-2xl shadow-lg"
                >
                    <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 mb-6">"{testimonials[index].quote}"</p>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonials[index].name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonials[index].company}</div>
                </motion.div>
            </AnimatePresence>
        </div>
    </section>
  );
};

export default Testimonials;
