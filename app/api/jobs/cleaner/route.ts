// app/api/jobs/cleaner/route.ts

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { ApiError } from "@/types/apiError";
import { ErrorCodes } from "@/constants/errorCodes";
import { cleanupExpiredRecords } from "@/scripts/cleanupExpiredRecords";

// POST Handler
export async function POST(request: Request) {
  // Security: Verify API Key
  const apiKey = request.headers.get("x-api-key");

  if (apiKey !== process.env.CLEANER_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await cleanupExpiredRecords();

    return NextResponse.json(
      { message: "Expired records cleaned up successfully." },
      { status: 200 },
    );
  } catch (error) {
    const errorResponse: ApiError = {
      code: ErrorCodes.CleanupFailed.toString(),
      message: "The cleanup failed.",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  } finally {
    await prisma.$disconnect();
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
