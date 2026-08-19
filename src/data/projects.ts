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

/**
 * Every project shown on the site, edited here by hand.
 *
 * Each project used to publish this entry itself at `<origin>/copyrights` and
 * the site fetched all of them at render time. That coupled the portfolio to
 * four deployments staying up and to asset URLs it did not control, so the
 * content moved here and the screenshots into `public/project-screenshots/`.
 *
 * `id` is the project's URL (`/library/projects/<id>`) — renaming one breaks
 * every shared link, so add a redirect in `next.config.ts` if you must.
 */
export const projects: Project[] = [
  {
    id: "bamboo-house-restaurant",
    isDone: true,
    title: {
      vi: `Nhà Hàng Bamboo House`,
      en: `Bamboo House Restaurant`,
    },
    description: {
      vi: `Nền tảng quản lý nhà hàng đa chi nhánh song ngữ với đặt món qua mã QR tại bàn và theo dõi đơn hàng thời gian thực.`,
      en: `A bilingual, multi-branch restaurant management platform with QR table ordering and realtime order tracking.`,
    },
    fullDescription: {
      vi: `Hệ thống quản lý nhà hàng Bamboo House là một nền tảng full-stack số hóa các hoạt động hằng ngày của một chuỗi nhà hàng nhiều chi nhánh. Quản lý điều hành chi nhánh, bàn, thực đơn và nhân viên trong cùng một không gian làm việc; nhân viên theo dõi đơn hàng đến trên bảng điều khiển thời gian thực; khách hàng đặt món ngay tại bàn bằng cách quét mã QR riêng của bàn. Giao diện được xây dựng bằng React 19, TypeScript và Vite, thiết kế với HeroUI v3 và Tailwind CSS v4, dùng Zustand cho quản lý trạng thái, react-hook-form và Zod để kiểm tra dữ liệu, cùng i18next cho song ngữ Anh/Việt. Phía máy chủ dùng Express 5 với MongoDB và Mongoose, xác thực JWT kèm phiên làm mới, đăng nhập Google OAuth 2.0 qua Passport, Cloudinary để lưu trữ hình ảnh, DeepL cho nội dung thực đơn song ngữ và Socket.IO để đồng bộ giỏ hàng của khách, màn hình theo dõi của nhân viên và trạng thái đơn hàng.`,
      en: `The Bamboo House Restaurant Management System is a full-stack platform that digitizes daily operations of a multi-branch restaurant. Managers administer branches, tables, menus and staff from one workspace, staff monitor incoming orders on a realtime dashboard, and customers order straight from their table by scanning a table-specific QR link. The frontend is built with React 19, TypeScript and Vite, styled with HeroUI v3 and Tailwind CSS v4, with Zustand for state slices, react-hook-form and Zod for validation, and i18next for full English/Vietnamese localization. The backend runs on Express 5 with MongoDB and Mongoose, JWT authentication backed by refresh sessions, Google OAuth 2.0 via Passport, Cloudinary for image storage, DeepL for bilingual menu content, and Socket.IO to keep customer carts, staff monitors and order statuses in sync.`,
    },
    image: [
      {
        src: "/project-screenshots/bamboo/hero-section.jpg",
        alt: "Bamboo House landing page hero section",
      },
      {
        src: "/project-screenshots/bamboo/flycam.jpg",
        alt: "Aerial view of the Bamboo House restaurant",
      },
      {
        src: "/project-screenshots/bamboo/signature-dishes.jpg",
        alt: "Signature dishes showcased on the menu",
      },
      {
        src: "/project-screenshots/bamboo/indoor-space.jpg",
        alt: "Indoor dining space of the restaurant",
      },
      {
        src: "/project-screenshots/bamboo/menu.png",
        alt: "Customer-facing menu with dish details",
      },
      {
        src: "/project-screenshots/bamboo/order.png",
        alt: "Order tracking screen",
      },
      {
        src: "/project-screenshots/bamboo/cashier.png",
        alt: "Staff table map with live occupancy",
      },
      {
        src: "/project-screenshots/bamboo/manager.png",
        alt: "Manager dashboard",
      },
      {
        src: "/project-screenshots/bamboo/login.png",
        alt: "Staff sign in screen",
      },
    ],
    tags: [
      "React",
      "TypeScript",
      "Vite",
      "HeroUI",
      "Tailwind CSS",
      "Zustand",
      "i18next",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "Cloudinary",
      "JWT",
    ],
    liveUrl: "https://bamboohouse.hwagfu.dev",
  },

  {
    id: "l3go-coffee",
    isDone: true,
    title: {
      vi: `L3GO Coffee`,
      en: `L3GO Coffee`,
    },
    description: {
      vi: `Website cho quán cà phê bốn tầng ở Tân An, Cần Thơ — thực đơn 68 món chọn theo mood, chia sẻ được bằng đường dẫn.`,
      en: `A site for a four-floor coffee shop in Tân An, Cần Thơ — a 68-drink menu you pick by mood and can share as a link.`,
    },
    fullDescription: {
      vi: `Trang được dựng trên Next.js App Router với hệ thiết kế riêng lấy từ chính vật liệu của quán: thép vàng, gạch kính màu và những khối brick xếp chồng. Điều hướng là một thanh brick trượt trên máy tính và một khay brick ở cạnh dưới trên điện thoại. Thực đơn lọc theo mood, cách uống và ngân sách; mọi bộ lọc nằm trong query string còn từng món có đường dẫn riêng, nên một đường dẫn gửi đi luôn mở ra đúng thứ người gửi đang xem. Toàn bộ giao diện có hai chế độ sáng và tối, kèm dữ liệu có cấu trúc, sitemap và canonical cho tìm kiếm.`,
      en: `Built on the Next.js App Router with a design system drawn from the shop's own materials: yellow structural steel, coloured glass block, and stacked bricks. Navigation is a sliding brick rail on desktop and a brick dock on phones. The menu filters by mood, preparation and budget; every filter lives in the query string and every drink has its own link, so a shared URL always opens on what the sender was looking at. The whole interface ships in light and dark, with structured data, a sitemap and canonicals for search.`,
    },
    image: [
      {
        src: "/project-screenshots/l3go/home.png",
        alt: "Trang chủ Chính thức của LegoCoffee",
      },
      {
        src: "/project-screenshots/l3go/glass-wall.jpg",
        alt: "Tường gạch kính màu uốn cong trong quán",
      },
      {
        src: "/project-screenshots/l3go/exterior-night.jpg",
        alt: "Mặt tiền L3GO Coffee về đêm",
      },
      {
        src: "/project-screenshots/l3go/entrance-night.jpg",
        alt: "Bảng hiệu và lối vào buổi tối",
      },
      {
        src: "/project-screenshots/l3go/mesh-screen.jpg",
        alt: "Vách lưới thép cắt hình logo tại khu làm việc",
      },
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Design System",
      "Responsive",
      "Dark mode",
      "SEO",
      "Accessibility",
    ],
    liveUrl: "https://legocoffee.hwagfu.dev",
  },

  {
    id: "go-hike",
    title: {
      vi: "Go Hike",
      en: "Go Hike",
    },
    description: {
      vi: "App nhật ký hiking chạy trọn vẹn khi mất sóng. Miễn phí, không tài khoản, không quảng cáo.",
      en: "A hiking journal that works with no signal at all. Free, no account, no ads.",
    },
    fullDescription: {
      vi: "Go Hike ra đời từ một chuyến đi bỗng dưng im bặt: giữa thung lũng, không còn vạch sóng nào, ba app hiking đang mở đều chỉ hiện một vòng xoay. Nên mình làm lại từ đầu kia — nếu app không bao giờ cần internet thì sao?\n\nMọi thứ bạn ghi xuống đều nằm sẵn trong máy và ở lại đó: cung đường, ảnh, ghi chú, quan sát dọc trail. App tự gắn nơi chốn, thời tiết và nhiệt độ vào từng mục, để một năm sau tấm ảnh vẫn kể được cả câu chuyện chứ không phải một nửa. Không có server nào hỏi bạn là ai, nên cũng không cần đăng ký, không thuê bao, không bảng xếp hạng.\n\nTám tính năng chính: nhật ký quan sát, lên kế hoạch cung đường, thống kê quãng đường, thành tích, bản đồ, thời tiết, tìm kiếm và sao lưu — bảy trong tám chạy hoàn toàn offline.",
      en: "Go Hike started with a hike that went quiet. Mid-valley, no bars left, three hiking apps open and all three showing nothing but a spinner. So I started again from the other end: what if the app never needed the internet?\n\nEverything you write down already lives on your phone and stays there — routes, photos, notes, what you spotted along the trail. The app attaches place, weather and temperature to each entry, so a year later the photo still tells the whole story instead of half of it. No server ever asks who you are, which means no sign-up, no subscription, no leaderboards.\n\nEight core features: trail observations, hike planning, distance analytics, achievements, maps, weather, search and backup — seven of the eight run fully offline.",
    },
    image: [
      {
        src: "/project-screenshots/gohike/home.png",
        alt: "Trang chủ Chính thức của Go Hiking",
      },
      {
        src: "/project-screenshots/gohike/home-beautified.png",
      },
      { src: "/project-screenshots/gohike/observation-beautified.png" },
      { src: "/project-screenshots/gohike/hikes-beautified.png" },
      { src: "/project-screenshots/gohike/analytics-beautified.png" },
      { src: "/project-screenshots/gohike/map-beautified.png" },
      { src: "/project-screenshots/gohike/achievement-beautified.png" },
    ],
    tags: ["React Native", "Expo", "SQLite", "Offline-first", "iOS", "Android"],
    liveUrl: "https://gohike.hwagfu.dev",
    isDone: true,
  },

  {
    id: "chap-app",
    isDone: true,
    title: {
      vi: `Chap - Ứng Dụng Nhắn Tin Thời Gian Thực`,
      en: `Chap - Realtime Chat App`,
    },
    description: {
      vi: `Ứng dụng nhắn tin thời gian thực với trò chuyện riêng và nhóm, hệ thống kết bạn cùng trạng thái trực tuyến và đã xem.`,
      en: `A realtime messaging app with direct and group chats, a friend system, and presence and seen indicators.`,
    },
    fullDescription: {
      vi: `Chap là một ứng dụng nhắn tin thời gian thực full-stack. Người dùng đăng ký, tìm kiếm người khác theo tên đăng nhập, gửi và phản hồi lời mời kết bạn, sau đó bắt đầu trò chuyện riêng hoặc tạo nhóm chat. Tin nhắn, số tin chưa đọc, trạng thái trực tuyến và dấu đã xem được đẩy tức thì qua Socket.IO, còn lịch sử hội thoại được tải theo cơ chế cuộn vô hạn. Giao diện được xây dựng bằng React 19, TypeScript và Vite, thiết kế với Tailwind CSS v4 và các thành phần shadcn/ui dựa trên Radix UI, dùng Zustand cho quản lý trạng thái, react-hook-form và Zod để kiểm tra dữ liệu, emoji-mart cho bộ chọn biểu tượng cảm xúc và sonner cho thông báo. Phía máy chủ dùng Express 5 với MongoDB và Mongoose, xác thực JWT kèm phiên làm mới lưu trong cơ sở dữ liệu, mã hóa mật khẩu bằng bcrypt, Multer và Cloudinary để tải ảnh đại diện, cùng Socket.IO cho việc truyền tin thời gian thực.`,
      en: `Chap is a full-stack realtime chat application. Users sign up, search for other people by username, send and answer friend requests, then start direct conversations or create group chats. Messages, unread counters, online presence and seen receipts are pushed instantly over Socket.IO, while conversation history loads through infinite scroll. The frontend is built with React 19, TypeScript and Vite, styled with Tailwind CSS v4 and shadcn/ui components on top of Radix UI primitives, with Zustand for state, react-hook-form and Zod for validation, emoji-mart for the emoji picker and sonner for toasts. The backend runs on Express 5 with MongoDB and Mongoose, JWT access tokens with refresh sessions stored in the database, bcrypt password hashing, Multer and Cloudinary for avatar uploads, and Socket.IO for realtime delivery.`,
    },
    image: [
      {
        src: "/project-screenshots/chap/home.png",
        alt: "Chap sign in screen",
      },
    ],
    tags: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "Radix UI",
      "Zustand",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "Cloudinary",
      "JWT",
    ],
    liveUrl: "https://mojichat.hwagfu.dev",
  },

  {
    id: "tlux",
    isDone: true,
    title: {
      vi: `TLUX`,
      en: `TLUX`,
    },
    description: {
      vi: `Hệ thống quản lý bán hàng và tồn kho theo lô — POS đa hoá đơn, xuất hàng FEFO theo hạn sử dụng, quét mã vạch bằng camera điện thoại.`,
      en: `A retail POS and batch-inventory system — multi-invoice checkout, FEFO stock allocation by expiry date, and barcode scanning from a phone camera.`,
    },
    fullDescription: {
      vi: `Nền tảng vận hành nội bộ cho cửa hàng bán lẻ, dựng trên Next.js App Router và Express + MongoDB. Tồn kho không lưu trên sản phẩm mà là tổng số còn lại của các lô nhập, nên mỗi lần thanh toán hệ thống trừ hàng theo FEFO — lô hết hạn sớm nhất đi trước — trong một transaction và ghi lại chính xác đã lấy từ lô nào. Thu ngân mở nhiều hoá đơn song song, mỗi hoá đơn là một đơn nháp lưu ở server nên tải lại trang vẫn còn nguyên. Mã vạch quét được bằng đầu đọc USB hoặc bằng camera điện thoại ghép cặp qua QR và socket.io; tiền tố mã cho biết đang quét sản phẩm, tem giảm giá theo dòng, mã khuyến mãi hay thẻ thành viên. Có màn hình phụ hướng về khách hiển thị giỏ hàng và QR chuyển khoản PayOS theo thời gian thực, tìm kiếm mờ tiếng Việt không dấu bằng Elasticsearch, phân quyền bốn vai trò, tích điểm khách hàng, và hoá đơn in khổ 80mm.`,
      en: `An internal operations platform for retail stores, built on the Next.js App Router with Express and MongoDB. Stock is never stored on the product — it is the sum of what remains across intake batches — so every checkout draws down stock FEFO, earliest expiry first, inside a transaction that records exactly which batches were consumed. Cashiers keep several invoices open at once; each one is a draft order held server-side, so parked carts survive a page reload. Barcodes come from a USB reader or from a phone camera paired over QR and socket.io, and the code's prefix tells the register whether it is a product, a per-line discount label, a promo code or a member card. It also ships a customer-facing second screen that mirrors the cart and the PayOS transfer QR in realtime, accent-insensitive Vietnamese fuzzy search via Elasticsearch, four-role access control, a loyalty-points ledger, and 80mm thermal receipts.`,
    },
    image: [
      { src: "/project-screenshots/tlux/screenshot.png", alt: "Logo TLUX" },
      {
        src: "/project-screenshots/tlux/tlux.png",
        alt: "Overview dashboard with revenue and stock",
      },
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Express",
      "MongoDB",
      "Socket.IO",
      "Elasticsearch",
      "TanStack Query",
      "Tailwind CSS",
      "POS",
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
    isDone: project.isDone,
  };
}
