import type { Locale } from "@/i18n/routing";

/** A short piece of copy available in both supported locales. */
export interface Localized<T = string> {
  vi: T;
  en: T;
}

export interface LibExample {
  title: Localized;
  /** Language tag for the little label on the code block (tsx | bash | html). */
  lang: string;
  code: string;
}

export interface LibProp {
  name: string;
  type: string;
  default?: string;
  desc: Localized;
}

export interface Library {
  slug: string;
  pkg: string;
  version: string;
  /** Accent colour used for the little badge / gradient in the cards. */
  accent: string;
  tagline: Localized;
  description: Localized;
  install: string;
  importLine: string;
  features: Localized<string[]>;
  examples: LibExample[];
  props: LibProp[];
  notes?: Localized<string[]>;
}

export const libraries: Library[] = [
  {
    slug: "hwagfu-link",
    pkg: "@hwagfu/link",
    version: "1.0.0",
    accent: "#38bdf8",
    tagline: {
      vi: "Nút / liên kết tự lấy favicon và tiêu đề từ bất kỳ URL nào.",
      en: "A button / link that auto-fetches the favicon and title of any URL.",
    },
    description: {
      vi: "Component React (dựng trên HeroUI + Tailwind) hiển thị nút, liên kết hoặc icon trỏ tới URL bên ngoài. Nó tự động lấy favicon và tiêu đề Open Graph của trang qua Microlink và Google Favicons.",
      en: "A React component (built on HeroUI + Tailwind) that renders a button, link or standalone icon pointing to an external URL. It automatically pulls the site's favicon and Open Graph title via Microlink and Google Favicons.",
    },
    install: "npm install @hwagfu/link @heroui/react motion",
    importLine: 'import { JasonCode } from "@hwagfu/link";',
    features: {
      vi: [
        "Tự động lấy favicon và tiêu đề (OG) từ URL.",
        "Ba kiểu hiển thị: button, link hoặc icon.",
        "Tùy biến bằng Tailwind qua className / classNames.",
        "Toàn quyền kiểm soát giao diện bằng hàm render.",
      ],
      en: [
        "Auto-fetches the site favicon and OG title from a URL.",
        "Three display types: button, link or icon.",
        "Customizable with Tailwind via className / classNames.",
        "Full UI control through a custom render function.",
      ],
    },
    examples: [
      {
        title: { vi: "Mặc định (Button)", en: "Default (Button)" },
        lang: "tsx",
        code: [
          'import { JasonCode } from "@hwagfu/link";',
          "",
          "export default function App() {",
          '  return <JasonCode url="https://github.com" label="GitHub" />;',
          "}",
        ].join("\n"),
      },
      {
        title: { vi: "Dạng Link", en: "As a link" },
        lang: "tsx",
        code: '<JasonCode type="link" url="https://react.dev" label="React Docs" />',
      },
      {
        title: { vi: "Dạng Icon (nhiều size)", en: "Icon (multiple sizes)" },
        lang: "tsx",
        code: [
          '<div className="flex gap-2">',
          '  <JasonCode type="icon" size="sm" url="https://google.com" />',
          '  <JasonCode type="icon" size="md" url="https://google.com" />',
          '  <JasonCode type="icon" size="lg" url="https://google.com" />',
          '  <JasonCode type="icon" size="xl" url="https://google.com" />',
          "</div>",
        ].join("\n"),
      },
      {
        title: { vi: "Custom render", en: "Custom render" },
        lang: "tsx",
        code: [
          "<JasonCode",
          '  url="https://tailwindcss.com"',
          "  render={({ title, favicon, isLoading }) =>",
          "    isLoading ? (",
          "      <span>Loading...</span>",
          "    ) : (",
          '      <div className="custom-card">',
          '        <img src={favicon} alt="icon" width={24} />',
          "        <h3>{title}</h3>",
          "      </div>",
          "    )",
          "  }",
          "/>",
        ].join("\n"),
      },
    ],
    props: [
      {
        name: "url",
        type: "string",
        default: '"https://hwagfu.dev"',
        desc: {
          vi: "URL đích để lấy meta và trỏ tới.",
          en: "Destination URL to fetch meta info from and link to.",
        },
      },
      {
        name: "label",
        type: "string",
        default: '"Jason Code Space"',
        desc: {
          vi: "Nhãn dự phòng hiển thị trước khi tải xong tiêu đề OG.",
          en: "Fallback label shown before the OG title finishes loading.",
        },
      },
      {
        name: "type",
        type: '"button" | "link" | "icon"',
        default: '"button"',
        desc: {
          vi: "Kiểu hiển thị của component.",
          en: "The visual display style of the component.",
        },
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        desc: {
          vi: 'Chỉ áp dụng khi type="icon". Điều chỉnh kích thước icon.',
          en: 'Only applies when type="icon". Controls the icon size.',
        },
      },
      {
        name: "className",
        type: "string",
        default: '""',
        desc: {
          vi: "Class Tailwind cho lớp bọc ngoài.",
          en: "Tailwind classes for the outer wrapper.",
        },
      },
      {
        name: "classNames",
        type: "{ content?: string; image?: string }",
        default: "{}",
        desc: {
          vi: "Style riêng cho phần nội dung và ảnh.",
          en: "Granular styling for the text content and image slots.",
        },
      },
      {
        name: "render",
        type: "(data) => ReactNode",
        desc: {
          vi: "Hàm render tùy chỉnh. data gồm { title, favicon, url, isLoading }.",
          en: "Custom render function. data contains { title, favicon, url, isLoading }.",
        },
      },
    ],
  },
  {
    slug: "hwagfu-cursor",
    pkg: "@hwagfu/cursor",
    version: "1.2.1",
    accent: "#fb7185",
    tagline: {
      vi: "Hiệu ứng con trỏ animate: vòng theo chuột, chấm giữa và vệt hạt pastel.",
      en: "Animated cursor effect: a spring-following ring, center dot and pastel particle trail.",
    },
    description: {
      vi: "Component React tạo hiệu ứng con trỏ mượt mà với vòng tròn bám theo chuột kiểu spring, một chấm ở giữa và vệt hạt pastel phía sau. Tùy biến sâu qua props, tự ẩn trên mobile và không chặn thao tác click.",
      en: "A React component that adds a smooth cursor effect with a spring-following ring, a center dot and a pastel particle trail. Deeply customizable via props, hides itself on mobile and never blocks clicks.",
    },
    install: "npm install @hwagfu/cursor motion",
    importLine: 'import { CursorEffect } from "@hwagfu/cursor";',
    features: {
      vi: [
        "Vòng tròn bám chuột kiểu spring kèm chấm ở giữa.",
        "Vệt hạt pastel tùy biến màu, số lượng và vòng đời.",
        "Tự động ẩn trên thiết bị cảm ứng / mobile.",
        "Dùng position: fixed + pointer-events: none nên không chặn click.",
        "Cài nhanh qua shadcn registry.",
      ],
      en: [
        "A spring-following ring with a center dot.",
        "A pastel particle trail with customizable colors, count and lifetime.",
        "Automatically hides on touch / mobile devices.",
        "Uses position: fixed + pointer-events: none so it never blocks clicks.",
        "Quick install via the shadcn registry.",
      ],
    },
    examples: [
      {
        title: { vi: "Dùng cơ bản", en: "Basic usage" },
        lang: "tsx",
        code: [
          'import { CursorEffect } from "@hwagfu/cursor";',
          "",
          "export default function App() {",
          "  return (",
          "    <>",
          "      <CursorEffect />",
          "      <main>Your app</main>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
      },
      {
        title: { vi: "Tùy biến", en: "Customization" },
        lang: "tsx",
        code: [
          "<CursorEffect",
          '  colors={["#fda4af", "#fdba74", "#86efac", "#93c5fd"]}',
          "  particleLifetime={900}",
          "  maxParticles={24}",
          "  ringSize={36}",
          "  ringHoverSize={56}",
          '  ringColor="#cbd5e1"',
          '  ringHoverColor="#0f172a"',
          '  dotColor="#0f172a"',
          '  interactiveSelector="a, button, [data-cursor]"',
          "/>",
        ].join("\n"),
      },
      {
        title: { vi: "Cài qua shadcn", en: "Install via shadcn" },
        lang: "bash",
        code: [
          "# Từ GitHub repo công khai có registry.json ở gốc",
          "npx shadcn@latest add <owner>/<repo>/cursor",
          "",
          "import { CursorEffect } from \"@/components/ui/cursor\";",
        ].join("\n"),
      },
    ],
    props: [
      {
        name: "colors",
        type: "string[]",
        default: "pastel palette",
        desc: {
          vi: "Màu dùng cho vệt hạt theo sau con trỏ.",
          en: "Colors used by the particle trail.",
        },
      },
      {
        name: "particleLifetime",
        type: "number",
        default: "1000",
        desc: {
          vi: "Thời gian tồn tại của mỗi hạt (ms).",
          en: "Particle lifetime in milliseconds.",
        },
      },
      {
        name: "particleSpawnChance",
        type: "number",
        default: "0.6",
        desc: {
          vi: "Xác suất sinh hạt mỗi lần di chuột (0–1).",
          en: "Chance to spawn a particle on each mouse move (0–1).",
        },
      },
      {
        name: "maxParticles",
        type: "number",
        default: "40",
        desc: {
          vi: "Số hạt tối đa hiển thị cùng lúc.",
          en: "Maximum visible particles kept at once.",
        },
      },
      {
        name: "particleSize",
        type: "number",
        default: "8",
        desc: { vi: "Kích thước mỗi hạt (px).", en: "Particle size in pixels." },
      },
      {
        name: "ringSize",
        type: "number",
        default: "42",
        desc: {
          vi: "Kích thước vòng ngoài mặc định (px).",
          en: "Default outer ring size in pixels.",
        },
      },
      {
        name: "ringHoverSize",
        type: "number",
        default: "65",
        desc: {
          vi: "Kích thước vòng khi hover phần tử tương tác.",
          en: "Outer ring size while hovering interactive elements.",
        },
      },
      {
        name: "dotSize",
        type: "number",
        default: "10",
        desc: {
          vi: "Kích thước chấm ở giữa (px).",
          en: "Center dot size in pixels.",
        },
      },
      {
        name: "ringColor",
        type: "string",
        default: '"#D3D3D3"',
        desc: {
          vi: "Màu viền vòng ngoài mặc định.",
          en: "Default outer ring border color.",
        },
      },
      {
        name: "ringGlow",
        type: "string",
        default: '"none"',
        desc: {
          vi: "box-shadow CSS để tạo glow cho vòng.",
          en: "CSS box-shadow used to glow the ring.",
        },
      },
      {
        name: "ringHoverColor",
        type: "string",
        default: '"#000000"',
        desc: {
          vi: "Màu viền vòng khi hover.",
          en: "Outer ring border color on hover.",
        },
      },
      {
        name: "dotColor",
        type: "string",
        default: '"rgba(75,85,99,0.6)"',
        desc: { vi: "Màu chấm ở giữa.", en: "Center dot color." },
      },
      {
        name: "zIndex",
        type: "number",
        default: "99999",
        desc: {
          vi: "Thứ tự xếp lớp của hiệu ứng.",
          en: "Stacking order for the cursor effect.",
        },
      },
      {
        name: "interactiveSelector",
        type: "string",
        default: '"a,button,[role=button],..."',
        desc: {
          vi: "Selector các phần tử kích hoạt trạng thái hover.",
          en: "Elements matching this selector trigger the hover state.",
        },
      },
    ],
    notes: {
      vi: [
        "Component tự động return null trên thiết bị cảm ứng / mobile.",
        "Giao diện dùng position: fixed và pointer-events: none nên không chặn click.",
      ],
      en: [
        "The component automatically returns null on touch / mobile devices.",
        "The UI uses position: fixed and pointer-events: none, so it won't block clicks.",
      ],
    },
  },
  {
    slug: "hwagfu-images",
    pkg: "@hwagfu/images",
    version: "1.2.0",
    accent: "#a78bfa",
    tagline: {
      vi: "Thư viện ảnh dạng lưới kèm lightbox — dùng cho React, Next.js hoặc HTML thuần.",
      en: "A grid image gallery with a built-in lightbox — for React, Next.js or plain HTML.",
    },
    description: {
      vi: "Component React hiển thị danh sách ảnh dạng lưới tự sắp xếp theo số lượng, kèm lightbox tích hợp. Hỗ trợ tối ưu ảnh Next.js qua renderImage và có sẵn bản Web Component <multiple-image> cho HTML thuần.",
      en: "A React component that displays a list of images in a self-arranging grid with a built-in lightbox. Supports Next.js image optimization via renderImage and ships a <multiple-image> Web Component for plain HTML.",
    },
    install: "npm install @hwagfu/images",
    importLine: 'import { MultipleImage } from "@hwagfu/images";',
    features: {
      vi: [
        "Lưới ảnh tự sắp xếp theo số lượng (2–5 ảnh).",
        "Lightbox tích hợp, có tùy chọn làm mờ nền.",
        "Tùy chỉnh bo góc và tỉ lệ khung ảnh.",
        "Hỗ trợ Next.js Image qua prop renderImage.",
        "Có bản Web Component <multiple-image> cho HTML thuần.",
      ],
      en: [
        "A self-arranging grid layout for 2–5 images.",
        "Built-in lightbox with an optional background blur.",
        "Customizable corner radius and aspect ratio.",
        "Next.js Image support via the renderImage prop.",
        "Ships a <multiple-image> Web Component for plain HTML.",
      ],
    },
    examples: [
      {
        title: { vi: "React", en: "React" },
        lang: "tsx",
        code: [
          'import { MultipleImage } from "@hwagfu/images";',
          "",
          "const images = [",
          '  { src: "/images/1.jpg", alt: "Image 1" },',
          '  { src: "/images/2.jpg", alt: "Image 2" },',
          '  { src: "/images/3.jpg", alt: "Image 3" },',
          "];",
          "",
          "export function Example() {",
          "  return (",
          "    <MultipleImage",
          "      imgList={images}",
          "      blurBackground",
          '      radius="xl"',
          '      ratio="landscape"',
          "    />",
          "  );",
          "}",
        ].join("\n"),
      },
      {
        title: { vi: "Next.js (next/image)", en: "Next.js (next/image)" },
        lang: "tsx",
        code: [
          '"use client";',
          "",
          'import Image from "next/image";',
          'import { MultipleImage, type RenderImageProps } from "@hwagfu/images";',
          "",
          "function renderNextImage({ image, index, className, style, sizes, priority }: RenderImageProps) {",
          "  return (",
          "    <Image",
          "      src={image.src}",
          "      alt={image.alt ?? `image-${index + 1}`}",
          "      fill",
          "      sizes={sizes}",
          "      priority={priority}",
          "      className={className}",
          "      style={style}",
          "    />",
          "  );",
          "}",
          "",
          "<MultipleImage imgList={images} radius=\"xl\" ratio=\"landscape\" renderImage={renderNextImage} />",
        ].join("\n"),
      },
      {
        title: { vi: "HTML (Web Component)", en: "HTML (Web Component)" },
        lang: "html",
        code: [
          '<script type="module" src="https://cdn.jsdelivr.net/npm/@hwagfu/images/dist/web-component.js"></script>',
          "",
          '<multiple-image radius="xl" ratio="landscape" blur-background>',
          '  <image-item src="/photo-1.jpg" alt="Mountain"></image-item>',
          '  <image-item src="/photo-2.jpg" alt="Forest"></image-item>',
          '  <image-item src="/photo-3.jpg" alt="City"></image-item>',
          "</multiple-image>",
        ].join("\n"),
      },
    ],
    props: [
      {
        name: "imgList",
        type: "{ src: string; alt?: string }[]",
        desc: {
          vi: "Danh sách ảnh cần hiển thị (bắt buộc).",
          en: "The array of images to display (required).",
        },
      },
      {
        name: "blurBackground",
        type: "boolean",
        default: "false",
        desc: {
          vi: "Làm mờ nền trang phía sau lightbox.",
          en: "Blur the page behind the lightbox.",
        },
      },
      {
        name: "radius",
        type: '"none" | "md" | "lg" | "xl"',
        default: '"none"',
        desc: { vi: "Độ bo góc của ảnh.", en: "Corner radius of the images." },
      },
      {
        name: "ratio",
        type: '"square" | "landscape" | "portrait"',
        default: '"landscape"',
        desc: { vi: "Tỉ lệ khung ảnh.", en: "Aspect ratio of the tiles." },
      },
      {
        name: "renderImage",
        type: "(props: RenderImageProps) => ReactNode",
        desc: {
          vi: "Hàm render ảnh tùy chỉnh (dùng cho next/image).",
          en: "Custom image renderer (e.g. for next/image).",
        },
      },
      {
        name: "className",
        type: "string",
        desc: {
          vi: "Class Tailwind cho lớp bọc lưới.",
          en: "Tailwind classes for the grid wrapper.",
        },
      },
    ],
    notes: {
      vi: [
        'Component có "use client" vì lightbox cần tương tác phía client; vẫn pre-render được trên Next.js App Router.',
        "Với Web Component, luôn dùng thẻ đóng tường minh: <image-item ...></image-item>.",
      ],
      en: [
        'The component is marked "use client" because the lightbox needs client interaction; it still pre-renders on the Next.js App Router.',
        "For the Web Component, always use an explicit closing tag: <image-item ...></image-item>.",
      ],
    },
  },
  {
    slug: "hwagfu-url-preview",
    pkg: "@hwagfu/url-preview",
    version: "1.0.0",
    accent: "#34d399",
    tagline: {
      vi: "Thẻ xem trước liên kết — đưa vào một URL, tự lấy metadata và render card đẹp.",
      en: "A link preview card — pass a URL and it fetches metadata and renders a card.",
    },
    description: {
      vi: "Component React hiển thị thẻ xem trước liên kết. Chỉ cần đưa vào một URL, thư viện sẽ tự lấy metadata (tiêu đề, mô tả, ảnh, tên trang, tác giả, ngày đăng...) qua Microlink API và render thành card có thể tùy biến layout và theme. Kèm hook useLinkPreview và hàm fetchLinkPreview để tự dựng UI.",
      en: "A React component that renders a link preview card. Pass in a URL and it fetches metadata (title, description, image, site name, author, date...) via the Microlink API and renders a customizable card. Ships a useLinkPreview hook and a fetchLinkPreview function for building your own UI.",
    },
    install: "npm install @hwagfu/url-preview",
    importLine: 'import LinkPreviewCard from "@hwagfu/url-preview";',
    features: {
      vi: [
        "Tự lấy metadata qua Microlink API — không cần backend riêng.",
        "Ba kiểu layout: large, wide và small.",
        "Bật/tắt mô tả, favicon, tên trang, tác giả và ngày đăng.",
        "Tùy biến theme: màu sắc, font, bo góc, đổ bóng.",
        "Kèm hook useLinkPreview và fetchLinkPreview để tự dựng UI.",
        "Cache theo URL; style inline sẵn, không cần thêm CSS.",
      ],
      en: [
        "Fetches metadata via the Microlink API — no backend needed.",
        "Three layout presets: large, wide and small.",
        "Toggle description, favicon, site name, author and date.",
        "Themeable: colors, fonts, corner radius and shadow.",
        "Ships a useLinkPreview hook and fetchLinkPreview for custom UIs.",
        "Cached per URL; styles are inlined, no extra CSS required.",
      ],
    },
    examples: [
      {
        title: { vi: "Dùng cơ bản", en: "Basic usage" },
        lang: "tsx",
        code: [
          'import LinkPreviewCard from "@hwagfu/url-preview";',
          "",
          "export default function App() {",
          '  return <LinkPreviewCard url="https://react.dev" />;',
          "}",
        ].join("\n"),
      },
      {
        title: { vi: "Ba kiểu layout", en: "Three layouts" },
        lang: "tsx",
        code: [
          '<LinkPreviewCard url="https://react.dev" layout="large" />',
          '<LinkPreviewCard url="https://react.dev" layout="wide" imagePosition="right" />',
          '<LinkPreviewCard url="https://react.dev" layout="small" />',
        ].join("\n"),
      },
      {
        title: { vi: "Theme", en: "Theming" },
        lang: "tsx",
        code: [
          "<LinkPreviewCard",
          '  url="https://react.dev"',
          "  theme={{",
          "    backgroundColor: '#1a1a1a',",
          "    textColor: '#f5f5f5',",
          "    mutedColor: '#a0a0a0',",
          "    borderColor: '#333333',",
          "    borderRadius: '16px',",
          "    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',",
          "  }}",
          "/>",
        ].join("\n"),
      },
      {
        title: { vi: "Dùng hook riêng", en: "Using the hook directly" },
        lang: "tsx",
        code: [
          'import { useLinkPreview } from "@hwagfu/url-preview";',
          "",
          "function CustomPreview({ url }: { url: string }) {",
          "  const state = useLinkPreview(url);",
          "",
          '  if (state.status === "loading") return <p>Loading...</p>;',
          '  if (state.status === "error") return <p>Error: {state.error.message}</p>;',
          "",
          "  return <h3>{state.data.title}</h3>;",
          "}",
        ].join("\n"),
      },
    ],
    props: [
      {
        name: "url",
        type: "string",
        desc: {
          vi: "URL cần xem trước (bắt buộc).",
          en: "URL to preview (required).",
        },
      },
      {
        name: "layout",
        type: '"large" | "wide" | "small"',
        default: '"large"',
        desc: { vi: "Kiểu bố cục card.", en: "Card layout preset." },
      },
      {
        name: "imagePosition",
        type: '"top" | "left" | "right"',
        default: "suy ra từ layout",
        desc: {
          vi: "Ghi đè vị trí ảnh (mặc định suy ra từ layout).",
          en: "Override media position (derived from layout by default).",
        },
      },
      {
        name: "width",
        type: "number | string",
        default: "tùy layout",
        desc: {
          vi: "Bề rộng card (số → px).",
          en: "Card width (numbers → px).",
        },
      },
      {
        name: "mediaHeight",
        type: "number | string",
        default: "tùy layout",
        desc: {
          vi: "Chiều cao vùng ảnh (số → px).",
          en: "Media area height (numbers → px).",
        },
      },
      {
        name: "showDescription",
        type: "boolean",
        default: "true",
        desc: { vi: "Hiện đoạn mô tả.", en: "Show the description." },
      },
      {
        name: "showFavicon",
        type: "boolean",
        default: "true",
        desc: {
          vi: "Hiện favicon/logo trang.",
          en: "Show the site favicon/logo.",
        },
      },
      {
        name: "showSiteName",
        type: "boolean",
        default: "true",
        desc: {
          vi: "Hiện tên trang (publisher).",
          en: "Show the publisher name.",
        },
      },
      {
        name: "showAuthor",
        type: "boolean",
        default: "false",
        desc: { vi: "Hiện tác giả.", en: "Show the author." },
      },
      {
        name: "showDate",
        type: "boolean",
        default: "false",
        desc: { vi: "Hiện ngày đăng.", en: "Show the publish date." },
      },
      {
        name: "fetchOptions",
        type: "FetchLinkPreviewOptions",
        desc: {
          vi: "Tùy chọn gọi Microlink (API key Pro, timeout).",
          en: "Microlink fetch options (Pro API key, timeout).",
        },
      },
      {
        name: "theme",
        type: "LinkPreviewCardTheme",
        desc: {
          vi: "Ghi đè màu sắc, font, bo góc, đổ bóng.",
          en: "Override colors, fonts, radius, shadow.",
        },
      },
    ],
    notes: {
      vi: [
        "LinkPreviewCard là export default duy nhất; useLinkPreview, fetchLinkPreview, invalidateLinkPreview và clearLinkPreviewCache là các named export.",
        "Kết quả được cache theo URL. Dùng invalidateLinkPreview(url) để xóa một URL, hoặc clearLinkPreviewCache() để xóa toàn bộ.",
        "Yêu cầu react và react-dom ^19.2.0 (peer dependencies).",
      ],
      en: [
        "LinkPreviewCard is the sole default export; useLinkPreview, fetchLinkPreview, invalidateLinkPreview and clearLinkPreviewCache are named exports.",
        "Results are cached per URL. Use invalidateLinkPreview(url) to clear one entry, or clearLinkPreviewCache() to clear everything.",
        "Requires react and react-dom ^19.2.0 (peer dependencies).",
      ],
    },
  },
];

export function localize<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.vi;
}

export function getLibrary(slug: string): Library | null {
  return libraries.find((lib) => lib.slug === slug) ?? null;
}
