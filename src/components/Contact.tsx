"use client";

import React, { useState } from 'react';
import { Mail, Send, CheckCircle, User } from 'lucide-react';
import { Input, TextArea, Button, TextField, InputGroup, Label } from "@heroui/react";
import { motion, AnimatePresence } from 'motion/react';


export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-black rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start"
        >
          <div className="flex-1 w-full">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-6xl font-serif text-white mb-6 sm:mb-8"
            >
              Cùng nhau kiến tạo <br className="hidden sm:block" />
              <span className="italic text-[#6F6F6F]">tương lai số.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-12 max-w-md"
            >
              Bạn có một ý tưởng tuyệt vời hay một dự án cần thực hiện? Hãy để lại lời nhắn, tôi sẽ phản hồi trong vòng 24h.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4 text-white"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Email trực tiếp</p>
                <p className="text-base sm:text-lg break-all">phuc20513@gmail.com</p>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:max-w-sm">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-75 sm:h-100 flex flex-col items-center justify-center text-center bg-white/5 rounded-3xl border border-white/10 p-6"
                >
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mb-6" />
                  <h3 className="text-xl sm:text-2xl text-white font-serif mb-2">Đã gửi tin nhắn!</h3>
                  <p className="text-sm sm:text-base text-gray-400">Cảm ơn bạn đã liên hệ. Tôi sẽ sớm phản hồi.</p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  onSubmit={handleSubmit} 
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">Họ và tên</label>
                    <Input 
                      required
                      fullWidth
                      placeholder="Nguyễn Văn A"
                      className="bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">Email liên hệ</label>
                    <Input 
                      required
                      fullWidth
                      type="email" 
                      className="bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 font-sans"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">Lời nhắn</label>
                    <TextArea 
                      required
                      rows={4}
                      fullWidth
                      className="resize-none bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 font-sans"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    />
                  </div>
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-white rounded-full text-black hover:bg-white/90"
                  >
                    Gửi yêu cầu <Send className="w-4 h-4 ml-2" />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
