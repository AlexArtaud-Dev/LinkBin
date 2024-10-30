// app/paste/[pasteCode]/page.tsx

import { redirect } from "next/navigation"; // Import redirect
import { FaEye, FaClock, FaLink, FaExternalLinkAlt } from "react-icons/fa";
import { headers } from "next/headers"; // Import headers
import React from "react";

import prisma from "@/lib/prisma";
import CopyableText from "@/components/DynamicInput/CopyableText";

interface PageProps {
  params: { shortCode: string };
}

export default async function PasteCodePage({ params }: PageProps) {
  const { shortCode } = params;

  const shortUrl = await prisma.shortUrl.findUnique({
    where: { shortCode },
  });

  if (!shortUrl) {
    // Redirect to home if short URL not found
    redirect("/");
  }

  // Get the origin from request headers
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  return (
    <div className="max-w-[70vw] mx-auto px-4 pt-24">
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">URL Information</h1>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {/* Origin URL Card */}
        <div className="flex gap-6 items-center bg-gray-100 dark:bg-[#27272a] shadow px-4 py-2 rounded flex-1">
          <FaExternalLinkAlt className="text-gray-500 w-16 h-16" />
          <div>
            <div className="text-sm text-gray-500">Origin URL</div>
            <CopyableText text={shortUrl.originalUrl} />
          </div>
        </div>

        {/* Shortened URL Card */}
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-[#27272a] shadow px-4 py-2 rounded flex-1">
          <FaLink className="text-gray-500 w-16 h-16" />
          <div>
            <div className="text-sm text-gray-500">Shortened URL</div>
            <CopyableText text={`${origin}/r/${shortUrl.shortCode}`} />
          </div>
        </div>
      </div>

      {/* Additional Cards Section */}
      <div className="mt-6 flex flex-wrap gap-4">
        {/* Views Card */}
        <div className="flex gap-6 items-center bg-gray-100 dark:bg-[#27272a] shadow px-4 py-2 rounded flex-1">
          <FaEye className="text-gray-500 w-16 h-16" />
          <div>
            <div className="text-sm text-gray-500">Views</div>
            <div className="text-lg font-semibold">{shortUrl.usageCount}</div>
          </div>
        </div>

        {/* Creation and Expiration Card */}
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-[#27272a] shadow px-4 py-2 rounded flex-1">
          <FaClock className="text-gray-500 w-16 h-16" />
          <div className="w-full flex flex-row justify-around">
            <div className="flex flex-col">
              <div className="text-sm text-gray-500">Created</div>
              <div className="text-lg font-semibold">
                {new Date(shortUrl.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm text-gray-500">Expires</div>
              <div className="text-lg font-semibold">
                {shortUrl.expiresAt
                  ? new Date(shortUrl.expiresAt).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
