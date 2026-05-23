import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(...inputs));

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { cn, delay };