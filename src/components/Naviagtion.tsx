import Link from "next/link";
import { Menu } from "lucide-react";
import { Button, Drawer } from "@heroui/react";
import MotionDiv from "./ui/motionDiv";
import Image from "next/image";
import logo from "@/app/logo.png"
const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/projects", label: "Dự án" },
  { to: "/pricing", label: "Báo giá" },
  {
    to: "/utils",
    label: "Tiện ích",
  },
  { to: "/contact", label: "Liên hệ" },
];
export const Navigation = () => {
  return (
    <nav className="z-50 sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex justify-between items-center px-4 sm:px-8  max-w-7xl mx-auto w-full relative">
        <Link
          href="/"
          className="text-2xl sm:text-3xl tracking-tight font-serif text-black flex items-center gap-2"
        >
          <div className="w-16 h-16 shrink-0 flex items-center justify-center">
            <Image
              src={logo}
              alt="Jason Dev Logo"
              width={64}
              height={64}
              sizes="64px"
              priority
            />
          </div>
          <span className="hidden sm:inline">Jason Dev</span>
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

        <div className="hidden md:flex items-center gap-2">
          <Link href="/sign-up">
            <Button variant="outline">Đăng ký</Button>
          </Link>
          <Link href="/sign-in">
            <Button>Đăng nhập</Button>
          </Link>
        </div>
        <MobileNavation />
      </div>
    </nav>
  );
};

const MobileNavation = () => {
  return (
    <Drawer>
      <Button variant="ghost" isIconOnly className="md:hidden z-140">
        <Menu size={24} />
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content className="z-1000" placement="right">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>
                <Link
                  href="/"
                  className="text-2xl sm:text-3xl tracking-tight font-serif text-black flex items-center gap-2"
                >
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    <Image
                      src="/favicon/logo.png"
                      alt="Jason Dev Logo"
                      width={64}
                      height={64}
                      sizes="64px"
                      priority
                    />
                  </div>
                  <span className="font-sans font-semibold text-base text-shadow-slate-900">
                    Jason Dev
                  </span>
                </Link>
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <div className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <MotionDiv
                    key={link.to}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.to}
                      className="text-lg font-serif text-black hover:opacity-70 transition-opacity block py-1"
                    >
                      {link.label}
                    </Link>
                  </MotionDiv>
                ))}

                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4 pt-6 border-t flex flex-col gap-3 border-gray-100"
                >
                  <Link href="/sign-in" className="block">
                    <Button fullWidth>Đăng nhập</Button>
                  </Link>
                  <Link href="/sign-up" className="block">
                    <Button variant="outline" fullWidth>
                      Đăng ký
                    </Button>
                  </Link>
                </MotionDiv>
              </div>
            </Drawer.Body>
            <Drawer.Footer />
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};
