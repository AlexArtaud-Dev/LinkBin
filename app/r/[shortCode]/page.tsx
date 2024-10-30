// app/[shortCode]/page.tsx
export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";

import prisma from "@/lib/prisma";

interface PageProps {
  params: { shortCode: string };
}

export default async function ShortCodePage({ params }: PageProps) {
  const { shortCode } = params;

  const shortUrl = await prisma.shortUrl.findUnique({
    where: { shortCode },
  });

  if (shortUrl) {
    await prisma.shortUrl.update({
      where: { shortCode },
      data: { usageCount: { increment: 1 } },
    });
    redirect(shortUrl.originalUrl);
  } else {
    notFound();
  }
}
