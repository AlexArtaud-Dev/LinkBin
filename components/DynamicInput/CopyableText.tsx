// components/CopyableText.tsx

"use client"; // Designate this as a Client Component

import React from "react";
import toast from "react-hot-toast";

import { copyTextToClipboard } from "@/lib/utils";

interface CopyableTextProps {
  text: string;
}

const CopyableText: React.FC<CopyableTextProps> = ({ text }) => {
  const handleCopy = async () => {
    try {
      copyTextToClipboard(text);
    } catch (err) {
      toast.error("Failed to copy text");
      // Optionally, handle the error (e.g., show a notification)
    }
  };

  return (
    <button
      className="text-lg font-semibold cursor-pointer flex items-center"
      title="Click to copy"
      onClick={handleCopy}
    >
      {text}
    </button>
  );
};

export default CopyableText;
