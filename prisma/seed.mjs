import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ─────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? "admin@hebron.com.ng";
  const password = process.env.ADMIN_PASSWORD ?? "Hebron@Admin2024";
  const hashed = hashSync(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed, name: "Hebron Admin", role: "admin" },
  });

  // ── Clear stale placeholder data (delete in FK order) ────────────────────
  await prisma.booking.deleteMany({});
  await prisma.roomInventory.deleteMany({});
  await prisma.room.deleteMany({
    where: { slug: { in: ["deluxe-room", "deluxe-double", "deluxe-suite", "two-bedroom-suite"] } },
  });

  // ── Real room types ────────────────────────────────────────────────────────
  const rooms = [
    {
      slug: "standard-room",
      name: "Standard Room",
      description: "Comfortable and well-appointed for the traveler who values simplicity. Clean lines, modern fittings, and restful ambience.",
      size: "24 m²",
      occupancy: "2 guests",
      image: "/images/rooms/deluxe.jpg",
      amenities: JSON.stringify(["Air Conditioning", "Free Wi-Fi", "32\" LED TV", "En-suite Bathroom", "Daily Housekeeping"]),
      pricePerNight: 20000,
      featured: false,
      order: 0,
    },
    {
      slug: "standard-royal",
      name: "Standard Royal",
      description: "An elevated take on the standard experience — refined furnishings, premium linen, and a warm sense of arrival.",
      size: "28 m²",
      occupancy: "2 guests",
      image: "/images/rooms/deluxe.jpg",
      amenities: JSON.stringify(["Air Conditioning", "Free Wi-Fi", "32\" LED TV", "En-suite Bathroom", "In-room Safe", "Daily Housekeeping"]),
      pricePerNight: 25000,
      featured: false,
      order: 1,
    },
    {
      slug: "classic-room",
      name: "Classic Room",
      description: "Spacious and thoughtfully designed for comfort. Ideal for business and leisure alike — quiet, cool, and impeccably kept.",
      size: "32 m²",
      occupancy: "2 guests",
      image: "/images/rooms/deluxe-double.jpg",
      amenities: JSON.stringify(["Air Conditioning", "Free Wi-Fi", "32\" LED TV", "En-suite Bathroom", "In-room Dining", "Coffee Maker", "Daily Housekeeping"]),
      pricePerNight: 30000,
      featured: false,
      order: 2,
    },
    {
      slug: "classic-royal",
      name: "Classic Royal",
      description: "Our most sought-after mid-tier room. Generous space, premium décor, and signature Hebron hospitality.",
      size: "36 m²",
      occupancy: "2 guests",
      image: "/images/rooms/deluxe-double.jpg",
      amenities: JSON.stringify(["Air Conditioning", "Free Wi-Fi", "40\" LED TV", "En-suite Bathroom", "In-room Dining", "Coffee Maker", "In-room Safe", "Daily Breakfast", "Daily Housekeeping"]),
      pricePerNight: 35000,
      featured: false,
      order: 3,
    },
    {
      slug: "executive-room",
      name: "Executive Room",
      description: "Crafted for the discerning professional. Superior finishes, a dedicated work zone, and elevated in-room amenities.",
      size: "42 m²",
      occupancy: "2–3 guests",
      image: "/images/rooms/suite.jpg",
      amenities: JSON.stringify(["Air Conditioning", "Free Wi-Fi", "40\" LED TV", "En-suite Bathroom with Tub", "In-room Dining", "Coffee Maker", "Mini Bar", "Work Desk", "In-room Safe", "Daily Breakfast"]),
      pricePerNight: 40000,
      featured: true,
      order: 4,
    },
    {
      slug: "executive-royal",
      name: "Executive Royal",
      description: "A statement in refined living. Sweeping interiors, premium bath, and the full breadth of Hebron executive privileges.",
      size: "50 m²",
      occupancy: "2–3 guests",
      image: "/images/rooms/suite.jpg",
      amenities: JSON.stringify(["Air Conditioning", "Free Wi-Fi", "48\" LED TV", "En-suite Bathroom with Jacuzzi", "In-room Dining", "Coffee Maker", "Mini Bar", "Work Desk", "In-room Safe", "Daily Breakfast", "City View"]),
      pricePerNight: 45000,
      featured: true,
      order: 5,
    },
    {
      slug: "presidential-suite",
      name: "Presidential Suite",
      description: "The pinnacle of Hebron luxury. An expansive suite with living quarters, private dining, personal butler service, and every comfort imaginable.",
      size: "85 m²",
      occupancy: "4–6 guests",
      image: "/images/rooms/two-bedroom.jpg",
      amenities: JSON.stringify(["Air Conditioning", "Free Wi-Fi", "55\" LED TV", "Living Room", "Private Dining Area", "En-suite Bathroom with Jacuzzi", "Personal Butler", "Mini Bar", "Kitchenette", "Daily Breakfast", "Late Checkout", "Airport Pickup"]),
      pricePerNight: 70000,
      featured: true,
      order: 6,
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({ where: { slug: room.slug }, update: room, create: room });
  }

  // Build slug → id map
  const roomMap = {};
  for (const { slug } of rooms) {
    const r = await prisma.room.findUnique({ where: { slug } });
    if (r) roomMap[slug] = r.id;
  }

  // ── Room inventory (25 actual rooms) ───────────────────────────────────────
  const inventory = [
    // 2nd floor
    { roomNumber: "201", floor: 2, slug: "standard-royal" },
    { roomNumber: "202", floor: 2, slug: "classic-royal" },
    { roomNumber: "203", floor: 2, slug: "executive-royal" },
    // 3rd floor
    { roomNumber: "301", floor: 3, slug: "classic-room" },
    { roomNumber: "302", floor: 3, slug: "executive-royal" },
    { roomNumber: "303", floor: 3, slug: "classic-room" },
    { roomNumber: "304", floor: 3, slug: "classic-royal" },
    { roomNumber: "305", floor: 3, slug: "classic-royal" },
    { roomNumber: "306", floor: 3, slug: "classic-royal" },
    { roomNumber: "307", floor: 3, slug: "standard-room" },
    { roomNumber: "308", floor: 3, slug: "classic-royal" },
    { roomNumber: "309", floor: 3, slug: "standard-room" },
    { roomNumber: "310", floor: 3, slug: "presidential-suite" },
    // 4th floor
    { roomNumber: "401", floor: 4, slug: "classic-room" },
    { roomNumber: "402", floor: 4, slug: "executive-room" },
    { roomNumber: "403", floor: 4, slug: "classic-room" },
    { roomNumber: "404", floor: 4, slug: "executive-room" },
    { roomNumber: "405", floor: 4, slug: "executive-room" },
    { roomNumber: "406", floor: 4, slug: "executive-room" },
    { roomNumber: "407", floor: 4, slug: "executive-room" },
    { roomNumber: "408", floor: 4, slug: "classic-room" },
    { roomNumber: "409", floor: 4, slug: "classic-room" },
    { roomNumber: "410", floor: 4, slug: "classic-room" },
    { roomNumber: "411", floor: 4, slug: "executive-room" },
    { roomNumber: "412", floor: 4, slug: "executive-room" },
  ];

  for (const inv of inventory) {
    const roomId = roomMap[inv.slug];
    if (!roomId) { console.warn(`Room not found: ${inv.slug}`); continue; }
    await prisma.roomInventory.upsert({
      where: { roomNumber: inv.roomNumber },
      update: { roomId, floor: inv.floor },
      create: { roomNumber: inv.roomNumber, floor: inv.floor, roomId, active: true },
    });
  }

  // ── Packages ───────────────────────────────────────────────────────────────
  const packages = [
    {
      name: "Premium Weekend Escape",
      description: "2 nights in a Classic Royal or Executive Room with daily breakfast, late checkout, welcome drinks, and full facility access.",
      highlight: "Most Popular",
      image: "/images/packages/premium-weekend-escape.jpg",
      includes: JSON.stringify(["2 Nights Stay", "Daily Breakfast", "Late Checkout", "Welcome Drinks", "Full Facility Access"]),
      order: 0,
    },
    {
      name: "Exclusive Lifestyle Voucher",
      description: "Gift the extraordinary. A curated experience voucher redeemable across all Hebron services — rooms, dining, spa, and events.",
      highlight: "Perfect Gift",
      image: "/images/packages/exclusive-lifestyle-voucher.jpg",
      includes: JSON.stringify(["Flexible Redemption", "All Hotel Services", "Valid 12 Months", "Personalized Card"]),
      order: 1,
    },
    {
      name: "Romantic Getaway",
      description: "Complimentary wine, rose petal turndown service, private dining experience, and a couples spa session.",
      highlight: "For Couples",
      image: "/images/packages/romantic-getaway.jpg",
      includes: JSON.stringify(["Complimentary Wine", "Rose Petal Turndown", "Private Dining", "Couples Spa Session"]),
      order: 2,
    },
  ];

  for (const pkg of packages) {
    const existing = await prisma.package.findFirst({ where: { name: pkg.name } });
    if (existing) {
      await prisma.package.update({ where: { id: existing.id }, data: pkg });
    } else {
      await prisma.package.create({ data: pkg });
    }
  }

  // ── Gallery ────────────────────────────────────────────────────────────────
  const gallery = [
    { src: "/images/gallery/pool.jpg", alt: "Swimming pool", category: "Facilities", order: 0 },
    { src: "/images/gallery/lobby.jpg", alt: "Hotel lobby", category: "Rooms", order: 1 },
    { src: "/images/gallery/exterior.jpg", alt: "Hotel exterior", category: "Exterior", order: 2 },
    { src: "/images/gallery/dining.jpg", alt: "In-room dining", category: "Dining", order: 3 },
    { src: "/images/gallery/event.jpg", alt: "Event space", category: "Events", order: 4 },
    { src: "/images/gallery/spa.jpg", alt: "Spa and wellness", category: "Facilities", order: 5 },
    { src: "/images/gallery/suite-ext.jpg", alt: "Suite exterior view", category: "Rooms", order: 6 },
    { src: "/images/gallery/gallery-1.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 7 },
    { src: "/images/gallery/gallery-2.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 8 },
    { src: "/images/gallery/gallery-3.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 9 },
    { src: "/images/gallery/gallery-4.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 10 },
    { src: "/images/gallery/gallery-5.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 11 },
    { src: "/images/gallery/gallery-6.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 12 },
    { src: "/images/gallery/gallery-7.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 13 },
    { src: "/images/gallery/gallery-8.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 14 },
    { src: "/images/gallery/gallery-9.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 15 },
    { src: "/images/gallery/gallery-10.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 16 },
    { src: "/images/gallery/gallery-11.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 17 },
    { src: "/images/gallery/gallery-12.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 18 },
    { src: "/images/gallery/gallery-13.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 19 },
    { src: "/images/gallery/gallery-14.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 20 },
    { src: "/images/gallery/gallery-15.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 21 },
    { src: "/images/gallery/gallery-17.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 22 },
    { src: "/images/gallery/gallery-18.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 23 },
    { src: "/images/gallery/gallery-20.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 24 },
    { src: "/images/gallery/gallery-21.jpg", alt: "Hebron Hotels room", category: "Rooms", order: 25 },
  ];

  for (const img of gallery) {
    await prisma.galleryImage.upsert({ where: { src: img.src }, update: img, create: img });
  }

  // ── Site Settings ──────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      phone: "+2347071259011",
      email: "hebron.hotels@yahoo.com",
      address: "Plot 12 Umuoshigo Umuanunu, Obinze Owerri, Nigeria",
      checkIn: "12:00 PM",
      checkOut: "10:00 AM",
      facebook: "https://www.facebook.com/profile.php?id=61553201672579",
      instagram: "https://www.instagram.com/hebronhotelandsuitsowerri/",
    },
  });

  // ── CMS Defaults (only create, never overwrite admin edits) ───────────────
  const cmsDefaults = [
    { id: "hero", data: JSON.stringify({ eyebrow: "Owerri · Nigeria", headline: "Where Luxury\nMeets Serenity", subheadline: "Dive into ultimate luxury at Hebron Hotels and Suites", desktopMode: "frames", mobileMode: "frames" }) },
    { id: "about", data: JSON.stringify({ eyebrow: "Our Story", headline: "True Luxury\nRedefined", body: "With an unwavering commitment to hospitality, Hebron Hotels and Suites has elevated the travel experience for countless guests in the heart of Owerri. The hotel features state-of-the-art amenities serving both leisure and business travelers — a sanctuary where every detail whispers perfection.", stats: [{ value: "7", label: "Room Categories" }, { value: "25", label: "Rooms Available" }, { value: "24/7", label: "Concierge Service" }] }) },
    { id: "facilities", data: JSON.stringify({ eyebrow: "Amenities", headline: "Elegant Comfort\nat Every Turn" }) },
    { id: "gallery", data: JSON.stringify({ eyebrow: "Photography", headline: "Every Detail,\nImmaculately\nObserved" }) },
    { id: "events", data: JSON.stringify({ eyebrow: "Events", headline: "The Ideal Venue\nfor Every Occasion", items: [{ type: "Weddings", description: "Create timeless memories in our exquisite wedding spaces, tailored to your vision." }, { type: "Conferences", description: "Fully equipped meeting rooms and business facilities for corporate excellence." }, { type: "Parties", description: "Private celebrations curated with precision — every detail elevated." }] }) },
    { id: "membership", data: JSON.stringify({ eyebrow: "Membership", headline: "Luxury Privileges\nFor the Select Few", body: "Priority access to luxury stays, personalized service, complimentary upgrades, late check-out, private lounge access, and special dining privileges.", cta: "Become a Member" }) },
    { id: "footer", data: JSON.stringify({ tagline: "Home of Comfort & Relaxation", address: "Plot 12 Umuoshigo Umuanunu, Obinze Owerri, Nigeria", phone: "+2347071259011", email: "hebron.hotels@yahoo.com", copyright: "2026 Hebron Hotels & Suites. All rights reserved." }) },
    { id: "seo", data: JSON.stringify({ title: "Hebron Hotels & Suites — Owerri, Nigeria", description: "Experience true luxury at Hebron Hotels and Suites in Owerri, Nigeria. World-class amenities, elegant rooms, and exceptional hospitality.", keywords: "hebron hotels, owerri hotel, nigeria luxury hotel, hebron suites" }) },
  ];

  for (const cms of cmsDefaults) {
    await prisma.siteContent.upsert({ where: { id: cms.id }, update: {}, create: cms });
  }

  console.log("Seed complete: 7 room types, 25 inventory rooms");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
