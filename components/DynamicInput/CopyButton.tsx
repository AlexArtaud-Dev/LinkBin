// app/paste/[pasteCode]/CopyButton.tsx

"use client";

import React from "react";
import { FaClipboard } from "react-icons/fa";
import { Button } from "@nextui-org/button";

import { copyTextToClipboard } from "@/lib/utils";

interface CopyButtonProps {
  content: string;
}

export default function CopyButton({ content }: CopyButtonProps) {
  return (
    <Button
      color="primary"
      size="sm"
      startContent={<FaClipboard />}
      onPress={() => {
        copyTextToClipboard(content);
      }}
    >
      Copy
    </Button>
  );
}
