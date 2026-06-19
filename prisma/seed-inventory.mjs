import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rooms = await prisma.room.findMany({ orderBy: { order: "asc" } });
  if (rooms.length === 0) {
    console.log("No rooms found — run seed.mjs first");
    return;
  }

  const [deluxe, deluxeDouble, deluxeSuite, twoBed] = rooms;

  const inventory = [
    // Deluxe Rooms — floor 1 & 2
    ...(deluxe ? [
      { roomId: deluxe.id, roomNumber: "101", floor: 1, notes: "Garden view" },
      { roomId: deluxe.id, roomNumber: "102", floor: 1, notes: "" },
      { roomId: deluxe.id, roomNumber: "103", floor: 1, notes: "" },
      { roomId: deluxe.id, roomNumber: "201", floor: 2, notes: "Pool view" },
      { roomId: deluxe.id, roomNumber: "202", floor: 2, notes: "" },
    ] : []),
    // Deluxe Double — floor 2 & 3
    ...(deluxeDouble ? [
      { roomId: deluxeDouble.id, roomNumber: "203", floor: 2, notes: "" },
      { roomId: deluxeDouble.id, roomNumber: "301", floor: 3, notes: "Corner room" },
      { roomId: deluxeDouble.id, roomNumber: "302", floor: 3, notes: "" },
      { roomId: deluxeDouble.id, roomNumber: "303", floor: 3, notes: "" },
    ] : []),
    // Deluxe Suite — floor 4
    ...(deluxeSuite ? [
      { roomId: deluxeSuite.id, roomNumber: "401", floor: 4, notes: "City panoramic view" },
      { roomId: deluxeSuite.id, roomNumber: "402", floor: 4, notes: "City view" },
      { roomId: deluxeSuite.id, roomNumber: "403", floor: 4, notes: "" },
    ] : []),
    // Two Bedroom Suite — floor 5 (penthouse)
    ...(twoBed ? [
      { roomId: twoBed.id, roomNumber: "501", floor: 5, notes: "Penthouse — panoramic views" },
      { roomId: twoBed.id, roomNumber: "502", floor: 5, notes: "Penthouse — garden terrace" },
    ] : []),
  ];

  let created = 0;
  for (const inv of inventory) {
    const exists = await prisma.roomInventory.findUnique({ where: { roomNumber: inv.roomNumber } });
    if (!exists) {
      await prisma.roomInventory.create({ data: inv });
      created++;
    }
  }

  console.log(`✓ ${created} inventory units created (${inventory.length - created} already existed)`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
