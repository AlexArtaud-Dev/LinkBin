// app/paste/[pasteCode]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";

interface PageProps {
  params: { pasteCode: string };
}

export default async function PasteCodePage({ params }: PageProps) {
  const { pasteCode } = params;

  const paste = await prisma.paste.findUnique({
    where: { pasteCode },
  });

  if (paste) {
    await prisma.paste.update({
      where: { pasteCode },
      data: { usageCount: { increment: 1 } },
    });

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Paste Content</h1>
        <pre className="bg-gray-100 p-4 rounded">{paste.content}</pre>
      </div>
    );
  } else {
    notFound();
  }
}
