// app/api/shorten/route.ts

import { URL } from "url";

import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import prisma from "@/lib/prisma";
import { ErrorCodes } from "@/constants/errorCodes";
import { ApiError } from "@/types/apiError";

export async function POST(request: Request) {
  try {
    let { url } = await request.json();

    if (!url) {
      const errorResponse: ApiError = {
        code: ErrorCodes.UrlRequired,
        message: "URL is required.",
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Normalize and validate URL
    try {
      const parsedUrl = new URL(url);

      url = parsedUrl.toString();
    } catch (error) {
      const errorResponse: ApiError = {
        code: ErrorCodes.InvalidUrlFormat,
        message: "Invalid URL format.",
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if the URL already exists in the database
    const existingUrl = await prisma.shortUrl.findFirst({
      where: {
        originalUrl: url,
      },
    });

    if (existingUrl) {
      // If it exists, return the existing short code
      return NextResponse.json(
        { shortCode: existingUrl.shortCode },
        { status: 200 },
      );
    }

    const shortCode = nanoid(6);

    // Get PURGE_PERIOD from environment variables and calculate expiresAt
    const purgePeriod = parseInt(process.env.PURGE_PERIOD || "30", 10);
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + purgePeriod);

    // Create a new short URL entry
    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl: url,
        shortCode,
        expiresAt,
      },
    });

    return NextResponse.json(
      { shortCode: shortUrl.shortCode },
      { status: 201 },
    );
  } catch (error) {
    const errorResponse: ApiError = {
      code: ErrorCodes.InternalServerError,
      message: "An unexpected error occurred.",
      // Optionally include error details in development
      details:
        process.env.NODE_ENV === "development" ? String(error) : undefined,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
