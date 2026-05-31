import Icon from "@/components/ui/icon";
import { JasonCode } from "hwagfu-link";
const Footer = () => {
  const socialLinks = [
    {
      id: 1,
      name: "GitHub",
      url: "https://github.com/JasonP205",
      icon: "mdi:github"
    },
    {
      id: 2,
      name: "Facebook",
      url: "https://facebook.com/hoangphuc05",
      icon: "mdi:facebook"
    },
    {
      id: 3,
      name: "Zalo",
      url: "https://zalo.me/0798020513",
      icon: "simple-icons:zalo"
    }
  ];

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center flex flex-col gap-4 w-full pb-4 pt-6">
        <div className="max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:items-start items-center gap-2">
            <h3 className=" font-bold text-md text-muted">Đối tác</h3>
            <JasonCode
              url="https://www.hugowishpax.studio"
              className="bg-white rounded-full px-0"
              classNames={{ image: "rounded-full w-8 h-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg", content: "text-black hover:underline decoration-1 underline-offset-2" }}
            />
          </div>
          <div className="flex gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="text-sm text-muted flex items-center hover:text-black transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon={link.icon} className="w-5 h-5 inline-block mr-1" />
                {link.name}
              </a>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted">
          ©{new Date().getFullYear()} Jason Dev. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;