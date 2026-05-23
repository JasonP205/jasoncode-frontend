import React from "react";
import MotionDiv from "./ui/motionDiv";
import { Chip, ScrollShadow } from "@heroui/react";
import Icon from "./ui/icon";
import GreenwichLogo from "./ui/GreenwichLogo";
import THPTLogo from "./ui/THPTLogo";
import ExternalLink from "./ui/externalLink";

const Skills = () => {
  const techStack = [
    {
      name: "Next.js",
      color: "bg-black text-white",
      icon: "devicon:nextjs",
      level: 40,
    },
    {
      name: "React.js",
      color: "bg-blue-500 text-white",
      icon: "devicon:react",
      level: 80,
    },
    {
      name: "Node.js",
      color: "bg-green-600 text-white",
      icon: "material-icon-theme:nodejs",
      level: 70,
    },
    {
      name: "Express.js",
      color: "bg-gray-800 text-white",
      icon: "devicon:express",
      level: 60,
    },
    {
      name: "TailwindCSS",
      color: "bg-cyan-500 text-white",
      icon: "devicon:tailwindcss",
      level: 85,
    },
    {
      name: "PHP",
      color: "bg-indigo-600 text-white",
      icon: "material-icon-theme:php",
      level: 50,
    },
  ];
  const educationData = [
    {
      id: 0,
      degree: "Tốt nghiệp Trung Học Phổ Thông",
      school: {
        name: "Trường THPT Cây Dương",
        link: "https://thptcayduong.edu.vn/",
      },
      startDate: "09/2020",
      endDate: "06/2023",
      description:
        "Tôi đã hoàn thành chương trình học tại Trường THPT Cây Dương với thành tích HSG trong 3 năm với hạnh kiểm tốt.Trong suốt thời gian học, Tôi được rèn luyện kỹ năng lãnh đạo, giải quyết vấn đề và làm việc nhóm với vai trò là lớp trưởng. Đồng thời tôi cũng tham gia các hoạt động do trường tổ chức để phát triển kỹ năng mềm và mở rộng kiến thức xã hội.",
    },
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      school: {
        name: "University of Greenwich",
        logo: <GreenwichLogo className="w-6 h-6" />,
        link: "https://www.greenwich.edu.vn/",
      },
      startDate: "08/2023",
      endDate: "Hiện tại",
      description:
        "Tập trung vào phát triển phần mềm, thiết kế hệ thống và phát triển ứng dụng web và ứng dụng di động hiện đại.",
    },
  ];
  return (
    <section id="skill" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT */}
          <MotionDiv
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="uppercase tracking-[0.25em] text-xs text-zinc-500">
                Education
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
              Học vấn & Chuyên môn
            </h2>

            <ScrollShadow className="mb-6 h-65.5 p-4 overflow-y-auto scrollbar-none">
              {educationData.map((item) => (
                <div
                  key={item.id}
                  className="relative pl-6 border-l border-zinc-200"
                >
                  <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-black" />
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {item.school.logo && item.school.logo}
                        <ExternalLink
                          url={item.school.link}
                          label={item.school.name}
                          className="text-zinc-800 hover:text-blue-600 font-semibold text-xl"
                        />
                      </h3>
                      <span className="flex items-center gap-2 text-zinc-600">
                        {item.degree}
                      </span>
                    </div>

                    <span className="min-w-fit rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 text-center">
                      {item.startDate} — {item.endDate}
                    </span>
                  </div>

                  <p className="mt-3 text-zinc-600 leading-7 pb-3">
                    {item.description}
                  </p>
                </div>
              ))}
            </ScrollShadow>

            <p className="text-zinc-600 leading-8 text-lg">
              Tôi thích xây dựng những sản phẩm mà mọi người có thể sử dụng mỗi
              ngày. Từ giao diện, API cho đến cơ sở dữ liệu, tôi luôn cố gắng
              tạo ra các giải pháp gọn gàng, dễ bảo trì và mang lại trải nghiệm
              mượt mà.
            </p>
          </MotionDiv>

          {/* RIGHT */}
          <MotionDiv
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="uppercase tracking-[0.25em] text-xs text-zinc-500">
                Tech Stack
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-3">
              {techStack.map((tech, index) => (
                <MotionDiv
                  key={tech.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                >
                  <div
                    className="
          group
          flex
          flex-col
          md:flex-row
          md:items-center
          md:gap-4
          items-center
          gap-3
          rounded-2xl
          border
          border-zinc-200
          bg-white
          px-4
          py-3
          transition-all
          duration-300
          hover:border-zinc-900
          hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          hover:-translate-y-1
        "
                  >
                    <div
                      className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-zinc-100
            transition-transform
            duration-300
            group-hover:scale-110
          "
                    >
                      <Icon
                        icon={tech.icon}
                        className="h-6 w-6 text-zinc-800"
                      />
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                      <p className="font-medium text-zinc-900">{tech.name}</p>

                      <p className="text-xs text-zinc-500">
                        {tech.level}% thông thạo
                      </p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Skills;
