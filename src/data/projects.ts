import type { Locale } from "@/i18n/routing";

type LocalizedText = Record<Locale, string>;

export interface Project {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  fullDescription: LocalizedText;
  image: {
    src: string;
    alt?: string;
  }[];
  tags: string[];
  liveUrl?: string;
  isDone: boolean;
}

/** A project with its localized fields already resolved to plain strings. */
export interface LocalizedProject {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: {
    src: string;
    alt?: string;
  }[];
  tags: string[];
  liveUrl?: string;
  isDone: boolean;
}

export const projects: Project[] = [
  {
    id: "restaurant-ordering-platform",
    isDone: true,
    title: {
      vi: "Nền tảng Đặt món Nhà hàng",
      en: "Restaurant Ordering Platform",
    },
    description: {
      vi: "Giúp nhà hàng tiếp nhận đơn hàng trực tuyến nhanh chóng, giảm thời gian chờ của khách hàng và tối ưu quy trình phục vụ.",
      en: "Helping restaurants streamline online ordering, reduce customer waiting time, and improve operational efficiency.",
    },
    fullDescription: {
      vi: `
Nền tảng đặt món được xây dựng nhằm mang đến trải nghiệm đặt món trực tuyến nhanh chóng, tiện lợi cho khách hàng, đồng thời giúp nhà hàng quản lý đơn hàng hiệu quả hơn.

Khách hàng có thể dễ dàng khám phá thực đơn, xem thông tin chi tiết từng món ăn, tùy chỉnh lựa chọn theo nhu cầu và hoàn tất đơn hàng chỉ với vài thao tác. Sau khi đặt món, trạng thái đơn hàng được cập nhật liên tục giúp khách hàng chủ động theo dõi quá trình xử lý.

Đối với nhà hàng, hệ thống hỗ trợ quản lý thực đơn, đơn hàng và dữ liệu sản phẩm trên một giao diện trực quan, giúp giảm thao tác thủ công, hạn chế sai sót và nâng cao tốc độ phục vụ, đặc biệt trong các khung giờ cao điểm.
      `.trim(),
      en: `
This restaurant ordering platform is designed to provide customers with a fast and convenient online ordering experience while helping restaurants manage orders more efficiently.

Customers can browse menus, view detailed dish information, customize their orders, and complete purchases in just a few steps. Order status is updated in real time, allowing customers to track the progress of their orders effortlessly.

For restaurant owners, the platform centralizes menu, product, and order management in a single dashboard, reducing manual work, minimizing mistakes, and improving service efficiency during busy hours.
      `.trim(),
    },
    image: [
      {
        src: "/project-screenshots/bamboo/bamboohouse.png",
        alt: "",
      },
      {
        src: "/project-screenshots/bamboo/login.png",
        alt: "",
      },
      {
        src: "/project-screenshots/bamboo/cashier.png",
        alt: "",
      },
      {
        src: "/project-screenshots/bamboo/menu.png",
        alt: "",
      },
      {
        src: "/project-screenshots/bamboo/manager.png",
        alt: "",
      },
      {
        src: "/project-screenshots/bamboo/order.png",
        alt: "",
      },
    ],
    tags: ["React.JS", "TailwindCSS", "Node.JS", "Express.JS", "MongoDB"],
    liveUrl: "https://bamboohouse.hwagfu.dev",
  },

  {
    id: "real-time-chat-app",
    title: {
      vi: "Moji Chat - Ứng dụng Chat Thời gian Thực",
      en: "Moji Chat - Real-time Chat App",
    },
    description: {
      vi: "Mang đến trải nghiệm nhắn tin thời gian thực nhanh chóng, mượt mà và kết nối mọi người ở bất kỳ đâu.",
      en: "Delivering a fast, seamless, and real-time messaging experience.",
    },
    fullDescription: {
      vi: `
Moji Chat được phát triển nhằm giúp người dùng kết nối và trao đổi thông tin nhanh chóng với trải nghiệm trò chuyện theo thời gian thực.

Ứng dụng cho phép tạo phòng trò chuyện, gửi tin nhắn văn bản, hình ảnh và emoji với tốc độ phản hồi gần như tức thì, mang lại cảm giác giao tiếp tự nhiên và liền mạch.

Người dùng có thể theo dõi trạng thái hoạt động của bạn bè, xem lại lịch sử hội thoại và tiếp tục cuộc trò chuyện trên giao diện trực quan, thân thiện và dễ sử dụng.
      `.trim(),
      en: `
Moji Chat is built to provide users with a smooth and engaging real-time communication experience.

The application allows users to create chat rooms, exchange text messages, images, and emojis with near-instant delivery, making conversations feel natural and responsive.

Users can view friends' online status, access conversation history, and continue chatting through a clean, intuitive interface designed for everyday communication.
      `.trim(),
    },
    image: [
      {
        src: "/project-screenshots/mojichat.png",
      },
    ],
    tags: ["React.JS", "MongoDB", "Express.JS", "Socket.IO"],
    liveUrl: "https://mojichat.hwagfu.dev/signin",
    isDone: true,
  },

  {
    id: "tlux-pos-system",
    isDone: false,
    title: {
      vi: "Tlux POS - Hệ thống Quản lý Bán hàng & Kho hàng",
      en: "Tlux POS - Point of Sale & Inventory Management System",
    },
    description: {
      vi: "Giúp cửa hàng bán lẻ quản lý bán hàng, kho hàng và khách hàng trên một nền tảng thống nhất, nâng cao hiệu quả vận hành và chất lượng phục vụ.",
      en: "Helping retail stores manage sales, inventory, and customer relationships through a unified business management platform.",
    },
    fullDescription: {
      vi: `
Tlux POS được phát triển nhằm giúp các cửa hàng bán lẻ quản lý toàn bộ hoạt động kinh doanh trên một hệ thống duy nhất, từ bán hàng tại quầy đến theo dõi doanh thu và quản lý kho.

Nhân viên có thể tạo đơn hàng nhanh chóng bằng quét mã vạch, xử lý thanh toán và xuất hóa đơn chỉ trong vài thao tác, giúp rút ngắn thời gian chờ và mang đến trải nghiệm mua sắm thuận tiện hơn cho khách hàng.

Hệ thống quản lý kho theo thời gian thực giúp chủ cửa hàng luôn nắm rõ số lượng tồn, giá nhập, giá bán, ngày nhập và hạn sử dụng của từng sản phẩm, từ đó hạn chế thất thoát và chủ động trong việc bổ sung hàng hóa.

Tlux POS còn tích hợp chương trình khách hàng thân thiết với tính năng tích điểm, mã giảm giá và lịch sử giao dịch, giúp xây dựng mối quan hệ lâu dài với khách hàng và khuyến khích họ quay lại mua sắm.

Cơ chế phân quyền theo vai trò (Admin, Quản lý, Thu ngân và Thủ kho) giúp mỗi nhân viên chỉ truy cập vào các chức năng phù hợp, đảm bảo quy trình làm việc rõ ràng và an toàn.

Dashboard thống kê trực quan tổng hợp doanh thu, lợi nhuận, sản phẩm bán chạy và tình trạng tồn kho theo thời gian thực, giúp chủ cửa hàng nhanh chóng nắm bắt tình hình kinh doanh và đưa ra quyết định dựa trên dữ liệu.
      `.trim(),
      en: `
Tlux POS is designed to help retail businesses manage every aspect of their daily operations through a single, easy-to-use platform.

Staff can quickly create orders using barcode scanning, process payments, and generate invoices in just a few clicks, reducing checkout time and providing customers with a faster shopping experience.

Real-time inventory management keeps store owners informed about stock levels, cost prices, selling prices, import dates, and expiration dates, making inventory control more accurate and efficient.

The built-in customer loyalty program includes reward points, discount coupons, and purchase history, helping businesses improve customer retention and encourage repeat purchases.

Role-based access control allows administrators to assign permissions for Admins, Managers, Cashiers, and Warehouse Staff, ensuring secure and organized daily operations.

A visual analytics dashboard provides real-time insights into revenue, profit, top-selling products, and inventory status, enabling business owners to make faster and more informed decisions.
      `.trim(),
    },
    image: [
      {
        src: "/project-screenshots/tlux/tlux.png",
      },
    ],
    tags: [
      "Next.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "Tailwind CSS",
      "PayOS",
      "Barcode Scanner",
      "JWT",
    ],
    liveUrl: "https://tlux.hwagfu.dev",
  },
];

/** Resolve a project's localized text fields for the given locale. */
export function localizeProject(
  project: Project,
  locale: Locale,
): LocalizedProject {
  return {
    id: project.id,
    title: project.title[locale],
    description: project.description[locale],
    fullDescription: project.fullDescription[locale],
    image: project.image,
    tags: project.tags,
    liveUrl: project.liveUrl,
    isDone: project.isDone
  };
}
