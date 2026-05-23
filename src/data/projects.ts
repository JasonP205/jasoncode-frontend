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
    id: 'restaurant-ordering-platform',
    title: 'Nền tảng Đặt món Nhà hàng',
    description: 'Một nền tảng đặt món nhà hàng hiện đại xây dựng với Nextjs và Nodejs.',
    fullDescription: 'Nền tảng này được thiết kế để xử lý hàng ngàn đơn đặt món mỗi giây với kiến trúc microservices. Nó bao gồm hệ thống quản lý kho, tích hợp thanh toán đa phương thức và trang quản trị mạnh mẽ.',
    image: '/project-screenshots/bamboohouse.png',
    tags: ['React.JS', 'TailwindCSS', 'Node.JS','Express.JS', 'MongoDB'],
    liveUrl: 'https://bamboohouse.hwagfu.dev'
  },
  {
    id: 'huytruong-management-system',
    title: 'Hệ thống Quản lý Huy Trưởng Liên Đoàn',
    description: 'Hệ thống quản lý nội bộ dành cho Liên Đoàn, tại đây các liên đoàn có thể quản lý thông tin và hoạt động của các Xứ Đoàn và Liên Đoàn.',
    fullDescription: 'Giải pháp quản lý và số hóa toàn bộ các ghi chép của Liên Đoàn, bao gồm quản lý thành viên, sự kiện, tài liệu và báo cáo. Hệ thống này giúp tăng cường hiệu quả quản lý và kết nối giữa các thành viên trong tổ chức.',
    image: '/project-screenshots/huynhtruong.png',
    tags: ['Next.js', 'Nest.JS', 'PostgreSQL', 'TypeORM'],
    liveUrl: 'https://tnttgiaophanmytho.online/'
  },
  {
    id: 'real-time-chat-app',
    title: 'Moji Chat - Ứng dụng Chat Thời gian Thực',
    description: 'Ứng dụng chat thời gian thực với giao diện thân thiện và tích hợp emoji đa dạng.',
    fullDescription: 'Moji Chat sử dụng WebSocket để cung cấp trải nghiệm chat mượt mà và nhanh chóng. Người dùng có thể tạo phòng chat riêng, gửi tin nhắn văn bản, hình ảnh và sử dụng hàng trăm emoji khác nhau để thể hiện cảm xúc. Có thể xem được trái thái online của bạn bè và lịch sử trò chuyện.',
    image: '/project-screenshots/mojichat.png',
    tags: ['React.JS', 'MongoDB', 'Express.JS', 'Socket.IO'],
    liveUrl: 'https://mojichat.hwagfu.dev/signin'
  }
];
