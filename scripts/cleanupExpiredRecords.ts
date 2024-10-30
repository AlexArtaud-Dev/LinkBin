// scripts/cleanupExpiredRecords.ts
import prisma from "@/lib/prisma";

async function cleanupExpiredRecords() {
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

cleanupExpiredRecords()
  .catch((error) => {
    console.error("Error cleaning up expired records:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
