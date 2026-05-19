export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'e-commerce-platform',
    title: 'Nền tảng Thương mại Điện tử',
    description: 'Một nền tảng thương mại điện tử hiện đại xây dựng với Nextjs và Nodejs.',
    fullDescription: 'Nền tảng này được thiết kế để xử lý hàng ngàn giao dịch mỗi giây với kiến trúc microservices. Nó bao gồm hệ thống quản lý kho, tích hợp thanh toán đa phương thức và trang quản trị mạnh mẽ.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
    tags: ['Nextjs', 'Tailwind', 'Nodejs', 'PostgreSQL'],
    liveUrl: 'https://example.com'
  },
  {
    id: 'management-system',
    title: 'Hệ thống Quản lý Doanh nghiệp',
    description: 'Hệ thống quản lý nội bộ dành cho doanh nghiệp vừa và nhỏ.',
    fullDescription: 'Giải pháp quản trị nguồn lực doanh nghiệp (ERP) tinh gọn, giúp tối ưu hóa quy trình làm việc, quản lý nhân sự và theo dõi tiến độ dự án theo thời gian thực.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Express', 'MySQL', 'Prisma'],
    liveUrl: 'https://example.com'
  },
  {
    id: 'portfolio-design',
    title: 'Thiết kế Portfolio Điện ảnh',
    description: 'Thiết kế và phát triển giao diện portfolio cá nhân đậm chất điện ảnh.',
    fullDescription: 'Một trải nghiệm web độc đáo tập trung vào chuyển động và nghệ thuật thị giác. Sử dụng Framer Motion để tạo ra các hiệu ứng chuyển cảnh mượt mà và video background tối ưu.',
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Motion', 'Tailwind', 'Vite'],
    liveUrl: 'https://example.com'
  },
  {
    id: 'mobile-app-fintech',
    title: 'Ứng dụng Fintech',
    description: 'Giải pháp tài chính cá nhân thông minh trên thiết bị di động.',
    fullDescription: 'Ứng dụng giúp người dùng quản lý chi tiêu, tiết kiệm và đầu tư một cách khoa học với các biểu đồ trực quan và gợi ý từ AI.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    tags: ['React Native', 'Firebase', 'Redux'],
    liveUrl: 'https://example.com'
  }
];
