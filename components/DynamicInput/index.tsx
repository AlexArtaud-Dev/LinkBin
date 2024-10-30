// components/DynamicInput/index.tsx
"use client";

import React from "react";
import { Card, Tabs, Tab } from "@nextui-org/react";

import { title } from "@/components/primitives";
import UrlShortenerForm from "@/components/DynamicInput/UrlShortenerForm";
import PastebinForm from "@/components/DynamicInput/PastebinForm";

const DynamicInput: React.FC = () => {
  return (
    <Card className="w-full flex flex-col items-center max-w-lg mx-auto p-6 shadow-lg min-h-[30vh]">
      <span className={title()}>Share your content&nbsp;</span>
      <Tabs aria-label="LinkBin Options" className="mt-6">
        <Tab key="shorten" className="w-full" title="URL Shortener">
          <UrlShortenerForm />
        </Tab>
        <Tab key="paste" className="w-full" title="Pastebin">
          <PastebinForm />
        </Tab>
      </Tabs>
    </Card>
  );
};

export default DynamicInput;
