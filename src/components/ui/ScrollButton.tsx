"use client";

import { Button as HButton } from "@heroui/react";
interface ButtonProps extends React.ComponentPropsWithoutRef<typeof HButton> {
  children: React.ReactNode;
  sectionId: string;
}

const Button = ({ children, sectionId, ...props }: ButtonProps) => {
  const handleClick = () => {
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <HButton
      {...props}
      onClick={handleClick}
    >
      {children}
    </HButton>
  );
};

export default Button;
