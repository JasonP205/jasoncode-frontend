"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { CometCard } from "@/components/ui/comet-card";
import { cn } from "@/lib/utils";

export default function ThreeDCardDemo({
  children,
  className,
  containerClassName,
  type = "card",
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  type?: "card" | "comet";
}) {
  if (type === "comet") {
    return (
      <CometCard className={cn("w-full h-full", className)}>
        {children}
      </CometCard>
    );
  }
  return (
    <CardContainer className={"inter-var w-full h-full"} containerClassName={containerClassName}>
      <CardBody className={cn("relative group/card w-full h-full", className)}>
        {children}
      </CardBody>
    </CardContainer>
  );
}
