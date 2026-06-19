import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const codes = [
    { code: "HEBRON10", type: "percentage", value: 10, maxUses: 100 },
    { code: "WELCOME20", type: "percentage", value: 20, maxUses: 50, minAmount: 50000 },
    { code: "FLAT5000", type: "fixed", value: 5000, maxUses: 30 },
  ];

  let created = 0;
  for (const c of codes) {
    const exists = await prisma.discountCode.findUnique({ where: { code: c.code } });
    if (!exists) {
      await prisma.discountCode.create({ data: c });
      created++;
    }
  }
  console.log(`✓ ${created} discount codes created`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
