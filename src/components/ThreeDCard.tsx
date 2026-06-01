"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function ThreeDCardDemo({children}: {children?: React.ReactNode}) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="relative group/card h-auto  ">
        {children}
      </CardBody>
    </CardContainer>
  );
}
