"use client";
import React from 'react';
import { Badge } from '@heroui/react';
import { motion } from 'motion/react';

const techStack = [
  { name: 'Nextjs', color: 'bg-black text-white' },
  { name: 'Reactjs', color: 'bg-blue-500 text-white' },
  { name: 'Nodejs', color: 'bg-green-600 text-white' },
  { name: 'Expressjs', color: 'bg-gray-800 text-white' },
  { name: 'Tailwindcss', color: 'bg-cyan-500 text-white' },
  { name: 'PHP', color: 'bg-indigo-600 text-white' },
];

export const TechStack = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif mb-6">Học vấn & Chuyên môn</h2>
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-medium mb-1">Cử nhân Công nghệ Thông tin</h3>
                <p className="text-sm sm:text-base text-[#6F6F6F]">Đại học - Chuyên ngành Kỹ thuật Phần mềm</p>
              </div>
              <p className="text-sm sm:text-base text-[#6F6F6F] leading-relaxed">
                Tôi là một lập trình viên Fullstack với niềm đam mê xây dựng các ứng dụng web hiện đại, 
                tối ưu hiệu suất và mang lại trải nghiệm người dùng tuyệt vời. Với nền tảng kiến thức vững chắc 
                từ đại học và kinh nghiệm thực chiến qua các dự án đa dạng từ web đến mobile.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-lg font-medium mb-6 sm:mb-8 text-[#6F6F6F] uppercase tracking-widest text-xs sm:text-sm text-center md:text-left">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center md:justify-start">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Badge 
                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all hover:-translate-y-1 hover:shadow-md border-none ${tech.color}`}
                  >
                    {tech.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
