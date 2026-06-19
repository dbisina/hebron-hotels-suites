import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "adebisiruthadegoke@gmail.com";
  const password = process.env.ADMIN_PASSWORD ?? "Hebron@Admin2024";

  const hashed = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed, name: "Hebron Admin", role: "admin" },
  });

  // Seed rooms
  const rooms = [
    {
      slug: "deluxe-room",
      name: "Deluxe Room",
      description: "An elegant retreat designed for the discerning traveler.",
      size: "32 m²",
      occupancy: "2 guests",
      image: "/images/rooms/deluxe.jpg",
      amenities: JSON.stringify(["Daily Breakfast", "32\" LED TV", "Air Conditioning", "In-room Dining", "Bath Tub", "Coffee Machine"]),
      featured: false,
      order: 0,
    },
    {
      slug: "deluxe-double",
      name: "Deluxe Double Room",
      description: "Ideal for couples or business travel. Spacious, serene, and impeccably appointed.",
      size: "40 m²",
      occupancy: "2–3 guests",
      image: "/images/rooms/deluxe-double.jpg",
      amenities: JSON.stringify(["Daily Breakfast", "32\" LED TV", "Air Conditioning", "In-room Dining", "Bath Tub", "Coffee Machine"]),
      featured: false,
      order: 1,
    },
    {
      slug: "deluxe-suite",
      name: "Deluxe Suite",
      description: "A statement of refined living. Sweeping city views, private kitchenette, and exclusive privileges.",
      size: "65 m²",
      occupancy: "2–3 guests",
      image: "/images/rooms/suite.jpg",
      amenities: JSON.stringify(["Daily Breakfast", "42\" LED TV", "Air Conditioning", "In-room Dining", "Bath Tub", "Coffee Machine", "City Scape View", "Kitchenette"]),
      featured: true,
      order: 2,
    },
    {
      slug: "two-bedroom-suite",
      name: "Two Bedroom Suite",
      description: "The pinnacle of Hebron luxury. Your private butler, panoramic views, and unmatched space.",
      size: "95 m²",
      occupancy: "4–5 guests",
      image: "/images/rooms/two-bedroom.jpg",
      amenities: JSON.stringify(["Daily Breakfast", "48\" LED TV", "Air Conditioning", "Personal Butler", "Bath Tub", "Coffee Machine", "City Scape View", "Kitchenette"]),
      featured: true,
      order: 3,
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({ where: { slug: room.slug }, update: {}, create: room });
  }

  // Seed packages
  const packages = [
    {
      name: "Premium Weekend Escape",
      description: "2 nights in a Deluxe or Executive Room with daily breakfast, late checkout, welcome drinks, and full facility access.",
      highlight: "Most Popular",
      image: "/images/packages/weekend.jpg",
      includes: JSON.stringify(["2 Nights Stay", "Daily Breakfast", "Late Checkout", "Welcome Drinks", "Full Facility Access"]),
      order: 0,
    },
    {
      name: "Exclusive Lifestyle Voucher",
      description: "Gift the extraordinary. A curated experience voucher redeemable across all Hebron services.",
      highlight: "Perfect Gift",
      image: "/images/packages/voucher.jpg",
      includes: JSON.stringify(["Flexible Redemption", "All Services", "Valid 12 Months", "Personalized Card"]),
      order: 1,
    },
    {
      name: "Romantic Getaway",
      description: "Complimentary wine bottle, rose petal turndown service, and a private dining experience.",
      highlight: "For Couples",
      image: "/images/packages/romantic.jpg",
      includes: JSON.stringify(["Complimentary Wine", "Rose Petal Turndown", "Private Dining", "Couples Spa"]),
      order: 2,
    },
  ];

  for (const [i, pkg] of packages.entries()) {
    const existing = await prisma.package.findFirst({ where: { name: pkg.name } });
    if (!existing) await prisma.package.create({ data: { ...pkg, order: i } });
  }

  // Seed gallery
  const gallery = [
    { src: "/images/gallery/hero.jpg", alt: "Hebron Hotels lobby", category: "interior", order: 0 },
    { src: "/images/gallery/pool.jpg", alt: "Swimming pool", category: "facilities", order: 1 },
    { src: "/images/gallery/suite.jpg", alt: "Deluxe suite interior", category: "rooms", order: 2 },
    { src: "/images/gallery/dining.jpg", alt: "In-room dining experience", category: "dining", order: 3 },
    { src: "/images/gallery/exterior.jpg", alt: "Hotel exterior at night", category: "exterior", order: 4 },
    { src: "/images/gallery/event.jpg", alt: "Event & conference space", category: "events", order: 5 },
  ];

  for (const img of gallery) {
    const existing = await prisma.galleryImage.findFirst({ where: { src: img.src } });
    if (!existing) await prisma.galleryImage.create({ data: img });
  }

  // Seed site settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      phone: "+2347071259011",
      email: "adebisiruthadegoke@gmail.com",
      address: "Plot 12 Umuoshigo Umuanunu, Obinze Owerri, Nigeria",
      checkIn: "12:00 PM",
      checkOut: "10:00 AM",
      facebook: "https://www.facebook.com/profile.php?id=61553201672579",
      instagram: "https://www.instagram.com/hebronhotelandsuitsowerri/",
    },
  });

  console.log("✓ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
