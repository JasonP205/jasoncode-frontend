"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
const Icons = (props: React.ComponentProps<typeof Icon>) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <Icon {...props} />;
};

export default Icons;
