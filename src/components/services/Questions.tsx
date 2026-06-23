import { Accordion } from "@heroui/react";

import {
  ChevronDown,
  Globe,
  HandCoins,
  Headset,
  LayoutTemplate,
  Search,
} from "lucide-react";

const faqItems = [
  {
    icon: <HandCoins className="size-4" />,
    title: "Chi phí làm website là bao nhiêu?",
    content:
      "Chi phí phụ thuộc vào số lượng trang, tính năng và mức độ tùy chỉnh. Các dự án website mới hiện có mức giá từ 3.500.000đ và sẽ được báo giá chi tiết sau khi trao đổi yêu cầu.",
  },
  {
    icon: <LayoutTemplate className="size-4" />,
    title: "Tôi chưa có thiết kế thì có làm website được không?",
    content:
      "Có. Bạn chỉ cần mô tả ý tưởng, lĩnh vực kinh doanh hoặc mục tiêu sử dụng. Mình sẽ tư vấn cấu trúc nội dung, bố cục và hướng triển khai phù hợp.",
  },
  {
    icon: <Search className="size-4" />,
    title: "Website có được tối ưu SEO không?",
    content:
      "Có. Website được xây dựng với cấu trúc thân thiện với công cụ tìm kiếm, hỗ trợ tối ưu tốc độ tải trang, metadata, sitemap và các yếu tố SEO kỹ thuật cơ bản.",
  },
  {
    icon: <Globe className="size-4" />,
    title: "Có hỗ trợ domain và hosting không?",
    content:
      "Có thể hỗ trợ tư vấn hoặc triển khai domain, hosting và các dịch vụ liên quan nếu bạn chưa có hạ tầng sẵn.",
  },
  {
    icon: <Headset className="size-4" />,
    title: "Sau khi bàn giao có được hỗ trợ không?",
    content:
      "Có. Sau khi hoàn thành dự án, mình vẫn hỗ trợ hướng dẫn sử dụng, giải đáp thắc mắc và xử lý các lỗi phát sinh trong phạm vi đã thống nhất.",
  },
];

export default function FAQ() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif">Câu hỏi thường gặp</h2>
        <p className="text-muted mt-3">
          Một số thắc mắc phổ biến trước khi bắt đầu dự án.
        </p>
      </div>

      <Accordion className="w-full">
        {faqItems.map((item, index) => (
          <Accordion.Item key={index}>
            <Accordion.Heading>
              <Accordion.Trigger className="group flex items-center">
                <span className="mr-3 flex size-8 items-center justify-center rounded-full bg-default-100 text-default-600">
                  {item.icon}
                </span>

                <span className="flex-1 text-left font-medium">
                  {item.title}
                </span>

                <Accordion.Indicator>
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>

            <Accordion.Panel>
              <Accordion.Body className="pl-11 text-muted leading-relaxed">
                {item.content}
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
}
