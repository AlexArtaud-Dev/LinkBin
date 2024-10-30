import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyTextToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.error("Copied to clipboard!", { icon: "📋" });
}
