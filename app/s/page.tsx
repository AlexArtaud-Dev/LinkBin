// app/page.tsx
"use client";

import React from "react";

import DynamicInput from "@/components/DynamicInput";

export default function HomePage() {
  return (
    <div className="pt-24 flex items-center justify-center">
      <DynamicInput />
    </div>
  );
}
