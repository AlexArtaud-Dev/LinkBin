// app/api/paste/route.ts

import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import prisma from "@/lib/prisma";
import { ErrorCodes } from "@/constants/errorCodes";
import { ApiError } from "@/types/apiError";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      const errorResponse: ApiError = {
        code: ErrorCodes.ContentRequired.toString(),
        message: "Content is required.",
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const pasteCode = nanoid(6);

    // Get PURGE_PERIOD from environment variables and calculate expiresAt
    const purgePeriod = parseInt(process.env.PURGE_PERIOD || "30", 10);
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + purgePeriod);

    const paste = await prisma.paste.create({
      data: {
        content,
        pasteCode,
        expiresAt,
      },
    });

    return NextResponse.json({ pasteCode: paste.pasteCode }, { status: 201 });
  } catch (error) {
    const errorResponse: ApiError = {
      code: ErrorCodes.InternalServerError.toString(),
      message: "An unexpected error occurred.",
      details:
        process.env.NODE_ENV === "development" ? String(error) : undefined,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET() {
  return new Response("Method GET Not Allowed", { status: 405 });
}

export async function PUT() {
  return new Response("Method PUT Not Allowed", { status: 405 });
}

export async function DELETE() {
  return new Response("Method DELETE Not Allowed", { status: 405 });
}

export async function PATCH() {
  return new Response("Method PATCH Not Allowed", { status: 405 });
}

export async function OPTIONS() {
  return new Response("Method OPTIONS Not Allowed", { status: 405 });
}

export async function HEAD() {
  return new Response("Method HEAD Not Allowed", { status: 405 });
}
