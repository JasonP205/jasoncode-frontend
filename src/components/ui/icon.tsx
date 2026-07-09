"use client";

import { Icon } from "@iconify/react";
import { useMounted } from "@/hooks/useMounted";

const Icons = (props: React.ComponentProps<typeof Icon>) => {
  const mounted = useMounted();
  if (!mounted) return null;
  return <Icon {...props} />;
};

export default Icons;
