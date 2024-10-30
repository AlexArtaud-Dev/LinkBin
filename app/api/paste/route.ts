// app/api/paste/route.ts
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    const pasteCode = nanoid(6);

    const paste = await prisma.paste.create({
      data: {
        content,
        pasteCode,
      },
    });

    return NextResponse.json({ pasteCode: paste.pasteCode }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create paste" },
      { status: 500 },
    );
  }
}
