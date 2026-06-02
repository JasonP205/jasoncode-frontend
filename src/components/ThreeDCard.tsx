"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";

export default function ThreeDCardDemo({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <CardContainer className={"inter-var w-full h-full"} containerClassName={containerClassName}>
      <CardBody className={cn("relative group/card w-full h-full", className)}>
        {children}
      </CardBody>
    </CardContainer>
  );
}
