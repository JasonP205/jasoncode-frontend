import type { Metadata } from "next";
import Script from "next/script";
import { Card, Button } from "@heroui/react";
import { Check } from "lucide-react";
import Link from "next/link";
import MotionDiv from "@/components/ui/motionDiv";
import ThreeDCard from "@/components/ThreeDCard";
import { CursorEffect } from "@hwagfu/cursor";

export const metadata: Metadata = {
  title: "Dịch vụ freelance thiết kế hệ thống, SEO và lập trình web",
  description:
    "Dịch vụ cá nhân của Jason Dev dành cho khách hàng cần xây dựng website, tối ưu SEO, cải thiện website hiện có hoặc thiết kế hệ thống Database. Báo giá minh bạch, nội dung rõ ràng và tập trung vào giá trị thực tế bạn nhận được.",
  alternates: {
    canonical: "/services",
  },
  keywords: [
    "freelance web developer",
    "dịch vụ làm website cá nhân",
    "tối ưu SEO website",
    "tối ưu code website",
    "thiết kế hệ thống database",
    "lập trình website mới",
    "Jason Dev",
    "Phan Hoàng Phúc",
  ],
  openGraph: {
    title: "Dịch vụ freelance thiết kế hệ thống, SEO và lập trình web",
    description:
      "Các dịch vụ cá nhân từ Jason Dev gồm thiết kế hệ thống Database, tối ưu SEO, tối ưu website hiện có và lập trình website mới.",
    url: "https://hwagfu.dev/services",
  },
};

const servicePlans = [
  {
    name: "Thiết kế hệ thống Database",
    description:
      "Phù hợp khi bạn đã có ý tưởng sản phẩm và cần một nền tảng dữ liệu rõ ràng để triển khai website hoặc ứng dụng ổn định hơn.",
    price: "Từ 1.500.000đ",
    note: "Dành cho nhu cầu phân tích luồng dữ liệu, cấu trúc lưu trữ và định hướng vận hành hệ thống.",
    features: [
      "Xác định rõ dữ liệu cần lưu trữ và mối liên kết giữa các phần trong hệ thống",
      "Giảm rủi ro thiếu chức năng quan trọng trong quá trình phát triển về sau",
      "Thuận tiện cho việc bàn giao, mở rộng hoặc tích hợp thêm tính năng mới",
      "Có tài liệu mô tả ngắn gọn, dễ theo dõi và dễ sử dụng khi làm việc tiếp",
    ],
    buttonText: "Trao đổi nhu cầu",
    featured: false,
    href: "/contact",
  },
  {
    name: "Tối ưu SEO website",
    description:
      "Dành cho website đã vận hành nhưng khả năng hiển thị trên Google chưa tốt, nội dung chưa rõ ràng hoặc chưa truyền tải đúng dịch vụ bạn cung cấp.",
    price: "Từ 1.500.000đ",
    note: "Phù hợp cho landing page, portfolio, website giới thiệu dịch vụ và website bán hàng quy mô nhỏ.",
    features: [
      "Nội dung được trình bày rõ ràng hơn để khách hàng và công cụ tìm kiếm đều dễ tiếp cận",
      "Tiêu đề, mô tả và cấu trúc trang được điều chỉnh để cải thiện khả năng hiển thị tìm kiếm",
      "Tối ưu tốc độ tải trang và trải nghiệm trên thiết bị di động",
      "Có định hướng cụ thể về phần nội dung nên giữ, chỉnh sửa hoặc bổ sung thêm",
    ],
    buttonText: "Ưu tiên cải thiện SEO",
    featured: true,
    href: "/contact",
  },
  {
    name: "Tối ưu code website có sẵn",
    description:
      "Phù hợp khi website hiện tại tải chậm, khó bảo trì, hiển thị chưa tốt trên thiết bị di động hoặc cần được chuẩn hóa lại để vận hành ổn định hơn.",
    price: "Từ 2.000.000đ",
    note: "Chi phí thực tế phụ thuộc vào hiện trạng mã nguồn và phạm vi công việc cần tối ưu.",
    features: [
      "Website vận hành ổn định hơn, hạn chế lỗi phát sinh và mượt hơn trên nhiều thiết bị",
      "Mã nguồn được sắp xếp gọn gàng hơn để thuận tiện cho việc chỉnh sửa hoặc mở rộng",
      "Giảm các điểm gây chậm, nặng trang hoặc ảnh hưởng đến trải nghiệm người dùng",
      "Có báo cáo rõ phần đã xử lý và những hạng mục nên tiếp tục cải thiện",
    ],
    buttonText: "Xem web hiện tại",
    featured: false,
    href: "/contact",
  },
  {
    name: "Lập trình website mới",
    description:
      "Dành cho khách hàng cần xây dựng website mới để giới thiệu dịch vụ, phát triển thương hiệu cá nhân hoặc triển khai hoạt động kinh doanh trực tuyến bài bản hơn.",
    price: "Từ 3.500.000đ",
    note: "Mức giá sẽ điều chỉnh theo số lượng trang, tính năng cần triển khai và khối lượng nội dung cần chuẩn bị.",
    features: [
      "Sở hữu một website chỉn chu, rõ ràng và phù hợp với mục tiêu sử dụng thực tế",
      "Khách truy cập dễ dàng hiểu bạn cung cấp dịch vụ gì và nên thực hiện bước tiếp theo ra sao",
      "Hiển thị tốt trên điện thoại, tablet và màn hình lớn",
      "Có sẵn nền tảng phù hợp để tiếp tục phát triển SEO hoặc mở rộng thêm sau này",
    ],
    buttonText: "Bắt đầu làm web mới",
    featured: false,
    href: "/contact",
  },
];

const deliverables = [
  "Báo giá minh bạch ngay từ đầu, hạn chế tối đa việc sử dụng thuật ngữ gây khó hiểu.",
  "Website hoặc tài liệu được xây dựng theo mục tiêu thực tế, không áp dụng mẫu rập khuôn.",
  "Giao diện thân thiện, dễ sử dụng trên thiết bị di động để người không chuyên vẫn tiếp cận thuận tiện.",
  "Có hướng dẫn hoặc ghi chú rõ ràng để bạn nắm được mình đang nhận lại những gì và sử dụng vào mục đích nào.",
];

const workingSteps = [
  "Bạn gửi nhu cầu, website hiện có hoặc mô tả ý tưởng ban đầu.",
  "Mình rà soát tổng quan và đề xuất hướng triển khai phù hợp với ngân sách của bạn.",
  "Thống nhất phạm vi công việc, thời gian thực hiện và các hạng mục cụ thể.",
  "Sau khi hoàn thành sẽ bàn giao rõ ràng, kèm hỗ trợ để bạn dễ tiếp nhận và sử dụng.",
];

export default function PricingPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Phan Hoàng Phúc",
    alternateName: "Jason Dev",
    url: "https://hwagfu.dev",
    jobTitle: "Freelance Web Developer",
    knowsAbout: [
      "Thiết kế hệ thống Database",
      "Tối ưu SEO website",
      "Tối ưu code website",
      "Lập trình website mới",
    ],
    makesOffer: servicePlans.map((plan) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: plan.name,
        description: plan.description,
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "VND",
        price: plan.price.replace(/[^\d]/g, "") || undefined,
      },
      url: "https://hwagfu.dev/services",
    })),
  };

  return (
    <div className="w-full relative py-16 sm:py-24">
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <CursorEffect />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-black leading-snug tracking-tight px-2">
          Dịch vụ website{" "}
          <span className="italic text-muted">rõ ràng, chuyên nghiệp</span>.
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mt-6 sm:mt-8 leading-relaxed">
          Các dịch vụ được xây dựng dành cho nhu cầu phát triển website mới,
          tối ưu website hiện có và cải thiện hiệu quả hiển thị trên công cụ
          tìm kiếm. Nội dung được trình bày rõ ràng theo từng hạng mục để bạn
          dễ đánh giá phạm vi công việc và giá trị nhận được trước khi bắt đầu.
        </p>
      </MotionDiv>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 sm:gap-8">
        <ThreeDCard>
          <Card className="p-6 sm:p-8">
            <Card.Header className="p-0 flex flex-col items-start gap-3">
              <span className="text-xs uppercase tracking-[0.24em] text-muted">
                Bạn nhận lại được gì
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-black">
                Mọi thứ được trình bày theo mục tiêu thực tế
              </h2>
            </Card.Header>
            <Card.Content className="p-0 mt-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliverables.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-gray-200/70 p-4 text-sm sm:text-base text-foreground/80 leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </ThreeDCard>

        <ThreeDCard>
          <Card className="p-6 sm:p-8 h-full">
            <Card.Header className="p-0 flex flex-col items-start gap-3">
              <span className="text-xs uppercase tracking-[0.24em] text-muted">
                Cách làm việc
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-black">
                Quy trình gọn, dễ theo dõi
              </h2>
            </Card.Header>
            <Card.Content className="p-0 mt-6">
              <ol className="flex flex-col gap-4">
                {workingSteps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </Card.Content>
          </Card>
        </ThreeDCard>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pb-16">
        {servicePlans.map((plan, index) => (
          <MotionDiv
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col h-full ${plan.featured ? "md:-translate-y-3" : ""}`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-medium tracking-wide z-20 whitespace-nowrap shadow-md">
                ĐƯỢC QUAN TÂM NHIỀU
              </div>
            )}
            <ThreeDCard>
              <Card
                className={`w-full flex-1 flex flex-col p-6 sm:p-8 ${
                  plan.featured
                    ? "ring-2 ring-black shadow-xl relative z-10 bg-zinc-50"
                    : ""
                }`}
              >
                <Card.Header className="flex flex-col items-start gap-2 p-0 mb-6 border-b border-gray-200/50 pb-6 shrink-0">
                  <Card.Title className="text-2xl font-serif text-black">
                    {plan.name}
                  </Card.Title>
                  <Card.Description className="text-muted leading-relaxed sm:min-h-[72px]">
                    {plan.description}
                  </Card.Description>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-black">
                      {plan.price}
                    </span>
                  </div>
                  {plan.note && (
                    <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">
                      {plan.note}
                    </p>
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
                        <span className="text-sm font-medium text-foreground/80 leading-relaxed">
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

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-4xl mx-auto px-4 sm:px-8 text-center"
      >
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Nếu bạn chưa chắc nên bắt đầu từ hạng mục nào, chỉ cần gửi mục tiêu
          hiện tại hoặc website đang có. Mình sẽ hỗ trợ phân tách công việc theo
          mức độ ưu tiên để tối ưu ngân sách và tránh triển khai dàn trải.
        </p>
        <div className="mt-6">
          <Link href="/contact">
            <Button size="lg" variant="primary" className="font-medium">
              Nhận tư vấn miễn phí
            </Button>
          </Link>
        </div>
      </MotionDiv>
    </div>
  );
}
