import React from "react";
import { Card, Button } from "@heroui/react";
import { Check } from "lucide-react";
import Link from "next/link";
import MotionDiv from "@/components/ui/motionDiv";
import ThreeDCard from "@/components/ThreeDCard";

const pricingPlans = [
  {
    name: "Dấu Ấn Cá Nhân",
    description:
      "Tuyệt vời cho cá nhân muốn có trang Portfolio hoặc CV chuyên nghiệp để ghi điểm với đối tác, nhà tuyển dụng.",
    price: "Liên hệ",
    frequency: "",
    note: "(Khoảng 2.5tr - 4.5tr, thêm trang +699k)",
    features: [
      "Thiết kế đẹp mắt, mang đậm phong cách riêng",
      "Giao diện hiển thị cực mượt trên điện thoại",
      "Đã có nút gọi thoại / nhắn tin Zalo, Email",
      "Hướng dẫn bạn tự thay đổi chữ, hình ảnh dễ dàng",
      "Được hỗ trợ thay đổi nội dung miễn phí tháng đầu",
    ],
    buttonText: "Bắt đầu làm quen",
    variant: "default",
    featured: false,
    href: "/contact",
  },
  {
    name: "Khởi Sự Kinh Doanh",
    description:
      "Giải pháp hiệu quả cho cửa hàng nhỏ lẻ cần một trang web uy tín, thu hút để giữ chân người xem.",
    price: "Từ 4.500.000đ",
    frequency: "",
    note: "(Khoảng 4.5tr - 7tr, thêm trang +699k)",
    features: [
      "Thiết kế làm nổi bật phong cách thương hiệu của bạn",
      "Trình bày trực quan danh sách sản phẩm / dịch vụ",
      "Dễ dàng để khách hàng liên hệ hoặc để lại thông tin",
      "Chuẩn hóa để khách dễ dàng tìm thấy bạn trên Google",
      "Miễn phí trọn gói công tải lên hình ảnh nội dung ban đầu",
    ],
    buttonText: "Chọn gói phổ biến nhất",
    variant: "tertiary",
    featured: true,
    href: "/contact",
  },
  {
    name: "Mở Rộng Quy Mô",
    description:
      "Dành cho các doanh nghiệp đang phát triển, cần cửa hàng nhiều mặt hàng, có chức năng đặt lịch hoặc có phần quản trị.",
    price: "Thỏa thuận",
    frequency: "",
    note: "",
    features: [
      "Trang phân loại sản phẩm / giỏ hàng / đặt lịch hẹn",
      "Có phần mềm quản trị (CMS) cực kỳ dễ sử dụng",
      "Tốc độ tải web cực nhanh giúp khách không thoát trang",
      "Thiết kế & Lập trình từ đầu, không dùng các mẫu đại trà",
      "Bảo hành & khắc phục sự cố kỹ thuật trong 6 tháng",
    ],
    buttonText: "Trao đổi nhu cầu cụ thể",
    variant: "default",
    featured: false,
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <div className="w-full relative py-16 sm:py-24">
      {/* Header Section */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-black leading-snug tracking-tight px-2">
          Giải pháp trọn gói.{" "}
          <span className="italic text-muted">Chi phí hợp lý</span>.
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mt-6 sm:mt-8 leading-relaxed">
          Từ lúc có ý tưởng đến lúc thiết kế và lập trình, mình sẽ lo toàn bộ
          cho bạn. Bạn không cần phải rành về công nghệ vẫn sẽ có một trang web
          vừa ý để khoe dự án, hút khách hàng và tăng uy tín.
        </p>
      </MotionDiv>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pb-16">
        {pricingPlans.map((plan, index) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col h-full ${plan.featured ? "md:-translate-y-4" : ""}`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-medium tracking-wide z-20 whitespace-nowrap shadow-md">
                ĐƯỢC CHỌN NHIỀU NHẤT
              </div>
            )}
            <ThreeDCard>
              <Card
                variant={plan.variant as any}
                className={`w-full flex-1 flex flex-col p-6 sm:p-8 ${plan.featured ? "ring-2 ring-black shadow-xl relative z-10" : ""}`}
              >
                <Card.Header className="flex flex-col items-start gap-2 p-0 mb-6 border-b border-gray-200/50 pb-6 shrink-0">
                  <Card.Title className="text-2xl font-serif text-black">
                    {plan.name}
                  </Card.Title>
                  <Card.Description className="text-muted leading-relaxed sm:min-h-[50px] md:min-h-[70px]">
                    {plan.description}
                  </Card.Description>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-black">
                      {plan.price}
                    </span>
                    {plan.frequency && (
                      <span className="text-muted text-sm ml-1">
                        {plan.frequency}
                      </span>
                    )}
                  </div>
                  {plan.note && (
                    <p className="text-muted text-xs mt-1">{plan.note}</p>
                  )}
                </Card.Header>

                <Card.Content className="p-0 flex-1 flex flex-col gap-4">
                  <ul className="flex flex-col gap-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          size={20}
                          className={
                            plan.featured
                              ? "text-black shrink-0"
                              : "text-muted shrink-0"
                          }
                        />
                        <span className="text-sm font-medium text-foreground/80">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card.Content>

                <Card.Footer className="flex p-0 mt-8 shrink-0">
                  <Link href={plan.href} className="w-full">
                    <Button
                      variant={plan.featured ? "primary" : "outline"}
                      className="w-full font-medium"
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </ThreeDCard>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
