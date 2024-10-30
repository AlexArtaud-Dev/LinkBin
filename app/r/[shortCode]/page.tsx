// app/[shortCode]/page.tsx
import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";

import prisma from "@/lib/prisma";

interface PageProps {
  params: { shortCode: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata | undefined> {
  const { shortCode } = params;

  const shortUrl = await prisma.shortUrl.findUnique({
    where: { shortCode },
  });

  if (!shortUrl) return undefined;

  const metadata = await fetchMetadata(shortUrl.originalUrl);

  return {
    title: metadata?.title || "Link Redirect",
    description: metadata?.description || "Redirecting to another site",
    openGraph: {
      title: metadata?.title,
      description: metadata?.description,
      images: metadata?.image ? [{ url: metadata.image }] : [],
      url: shortUrl.originalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata?.title,
      description: metadata?.description,
      images: metadata?.image ? [metadata.image] : [],
    },
  };
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

async function fetchMetadata(url: string) {
  try {
    const res = await fetch(url);
    const text = await res.text();

    const title = text.match(/<title>([^<]*)<\/title>/)?.[1];
    const description = text.match(
      /<meta name="description" content="([^"]*)"\/?>/i,
    )?.[1];
    const image = text.match(
      /<meta property="og:image" content="([^"]*)"\/?>/i,
    )?.[1];

    return { title, description, image };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);

    return null;
  }
}
