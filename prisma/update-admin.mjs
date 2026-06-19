import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function run() {
  const hashed = hashSync("Hebron@Admin2024", 12);

  await prisma.user.upsert({
    where: { email: "admin@hebron.com.ng" },
    update: { password: hashed },
    create: { email: "admin@hebron.com.ng", password: hashed, name: "Hebron Admin", role: "admin" },
  });

  try {
    await prisma.user.delete({ where: { email: "adebisiruthadegoke@gmail.com" } });
  } catch {
    // may not exist, fine
  }

  console.log("✓ Admin email updated to admin@hebron.com.ng");
  await prisma.$disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
