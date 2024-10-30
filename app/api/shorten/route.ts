// app/api/shorten/route.ts
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format (optional but recommended)
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    ); // fragment locator

    if (!urlPattern.test(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    const shortCode = nanoid(6);

    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl: url,
        shortCode,
      },
    });

    return NextResponse.json(
      { shortCode: shortUrl.shortCode },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 },
    );
  }
}
