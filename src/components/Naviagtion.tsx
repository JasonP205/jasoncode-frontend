"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/projects", label: "Dự án" },
    { to: "/prices", label: "Báo giá" },
    { to: "/contact", label: "Liên hệ" },
    {
      to: "/utils",
      label: "Tiện ích",
    },
  ];

  return (
    <nav className="z-100 sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full relative">
        <Link
          href="/"
          className="text-2xl sm:text-3xl tracking-tight font-serif text-black"
          onClick={() => setIsOpen(false)}
        >
          Phan Hoàng Phúc®
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className="text-sm transition-colors text-[#6F6F6F] hover:text-black font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="/bao-gia">
            <Button>Bắt đầu hành trình</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-[140] p-2 text-black relative"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[125] md:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[70%] sm:w-[320px] bg-white z-[130] shadow-2xl md:hidden flex flex-col p-6 pt-24"
            >
              <div className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.to}
                      className="text-lg font-serif text-black hover:opacity-70 transition-opacity block py-1"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4 pt-6 border-t border-gray-100"
                >
                  <Link
                    href="/bao-gia"
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button className="w-full">Bắt đầu hành trình</Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
