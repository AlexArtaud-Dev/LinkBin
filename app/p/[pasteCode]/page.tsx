// app/paste/[pasteCode]/page.tsx

import { redirect } from "next/navigation"; // Import redirect
import { FaEye, FaClock } from "react-icons/fa";

import CopyButton from "@/components/DynamicInput/CopyButton"; // Ensure this is a client component
import prisma from "@/lib/prisma";

interface PageProps {
  params: { pasteCode: string };
}

export default async function PasteCodePage({ params }: PageProps) {
  const { pasteCode } = params;

  const paste = await prisma.paste.findUnique({
    where: { pasteCode },
  });

  if (!paste) {
    // Redirect to home if paste not found
    redirect("/");
  }

  // Increment usage count
  await prisma.paste.update({
    where: { pasteCode },
    data: { usageCount: { increment: 1 } },
  });

  // Split the content into lines
  const lines = paste.content.split("\n");

  return (
    <div className="max-w-[70vw] mx-auto p-4">
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Paste Content</h1>
        <CopyButton content={paste.content} /> {/* Client Component */}
      </div>
      <div className="!text-primary bg-gray-100 dark:bg-[#27272a] p-4 shadow rounded max-w-[70vw] overflow-y-auto min-h-[60vh] max-h-[60vh] whitespace-pre-wrap break-words font-mono text-sm">
        {lines.map((line, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 select-none w-8 text-right pr-3">
              {index + 1}
            </span>
            <span className="text-black dark:text-white">{line}</span>
          </div>
        ))}
      </div>

      {/* Cards Section */}
      <div className="mt-6 flex flex-wrap gap-4">
        {/* Consultation Card */}
        <div className="flex gap-6 items-center bg-gray-100 dark:bg-[#27272a] shadow px-4 py-2 rounded flex-1">
          <FaEye className="text-gray-500 w-16 h-16" />
          <div>
            <div className="text-sm text-gray-500">Views</div>
            <div className="text-lg font-semibold">{paste.usageCount}</div>
          </div>
        </div>

        {/* Creation and Expiration Card */}
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-[#27272a] shadow px-4 py-2 rounded flex-1">
          <FaClock className="text-gray-500 w-16 h-16" />
          <div className="w-full flex flex-row justify-around">
            <div className="flex flex-col">
              <div className="text-sm text-gray-500">Created</div>
              <div className="text-lg font-semibold">
                {new Date(paste.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm text-gray-500">Expires</div>
              <div className="text-lg font-semibold">
                {paste.expiresAt
                  ? new Date(paste.expiresAt).toLocaleString()
                  : "Never"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
