import React from "react";
import Icon from "@/components/ui/icon";
import dynamic from "next/dynamic";
import { JasonCode } from "hwagfu-link";
const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center flex flex-col gap-4 w-full pb-4 pt-6">
        <div className="max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-start gap-2">
            <h3 className=" font-bold text-md text-muted">Đối tác</h3>
            <JasonCode
              url="https://hugowishpax.studio"
              className="bg-white rounded-full"
              type="link"
              classNames={{ image: "rounded-full", content: "text-black" }}
            />
          </div>
          <div className="flex gap-8">
            <a
              href="https://github.com/JasonP205"
              className="text-sm text-muted flex items-center hover:text-black transition-colors"
            >
              <Icon icon="mdi:github" className="w-5 h-5 inline-block mr-1" />
              GitHub
            </a>
            <a
              href="https://facebook.com/hoangphuc05"
              className="text-sm text-muted flex items-center hover:text-black transition-colors"
            >
              <Icon icon="mdi:facebook" className="w-5 h-5 inline-block mr-1" />
              Facebook
            </a>
            <a
              href="https://zalo.me/0798020513"
              className="text-sm text-muted flex items-center hover:text-black transition-colors"
            >
              <Icon
                icon="simple-icons:zalo"
                className="w-5 h-5 inline-block mr-1"
              />
              Zalo
            </a>
          </div>
        </div>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} jasoncode. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
