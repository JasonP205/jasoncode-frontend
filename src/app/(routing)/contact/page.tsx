import React from 'react'
import type { Metadata } from 'next';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với tôi để biết thêm thông tin về các dự án, kỹ năng hoặc cơ hội hợp tác. Tôi luôn sẵn sàng kết nối và trao đổi ý tưởng mới. Hãy gửi tin nhắn hoặc email cho tôi, tôi sẽ phản hồi trong thời gian sớm nhất. Cảm ơn bạn đã ghé thăm trang liên hệ của tôi!",
  alternates: {
    canonical: "/contact",
  },
  keywords: [
    "Liên hệ Jason Dev",
    "Thuê lập trình viên web",
    "Liên hệ Phan Hoàng Phúc",
    "Tư vấn thiết kế web",
    "Tư vấn SEO"
  ],
  openGraph: {
    title: "Liên hệ | Jason Dev",
    description: "Liên hệ với tôi để biết thêm thông tin về các dự án, kỹ năng hoặc cơ hội hợp tác. Tôi luôn sẵn sàng kết nối và trao đổi ý tưởng mới.",
    url: "https://hwagfu.dev/contact",
  }
}

const page = () => {
  return (
    <Contact />
  )
}

export default page