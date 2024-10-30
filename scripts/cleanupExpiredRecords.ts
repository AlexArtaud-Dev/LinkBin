import prisma from "@/lib/prisma";

export async function cleanupExpiredRecords() {
  const now = new Date();

  // Delete expired short URLs
  await prisma.shortUrl.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  // Delete expired pastes
  await prisma.paste.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  console.log("Expired records cleaned up.");
}
