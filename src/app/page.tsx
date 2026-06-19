import React from "react";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { About } from "@/components/sections/About";
import { Facilities } from "@/components/sections/Facilities";
import { Rooms } from "@/components/sections/Rooms";
import { Gallery } from "@/components/sections/Gallery";
import { Events } from "@/components/sections/Events";
import { Membership } from "@/components/sections/Membership";
import Footer from "@/components/layout/Footer";
import { getCmsData, getAllAssets } from "@/lib/cms";
import { prisma } from "@/lib/db";

const DEFAULT_SECTIONS = [
  { key: "about", order: 1, visible: true },
  { key: "facilities", order: 2, visible: true },
  { key: "rooms", order: 3, visible: true },
  { key: "gallery", order: 4, visible: true },
  { key: "events", order: 5, visible: true },
  { key: "membership", order: 6, visible: true },
];

export default async function HomePage() {
  const [
    heroCms, aboutCms, facilitiesCms, galleryCms, eventsCms, membershipCms,
    sectionsCms, assets, dbRooms, dbGallery, dbPackages,
  ] = await Promise.all([
    getCmsData<{
      eyebrow?: string; headline?: string; subheadline?: string;
      desktopMode?: "frames" | "photo"; mobileMode?: "frames" | "photo";
      desktopPhoto?: string; mobilePhoto?: string;
    }>("hero").catch(() => null),
    getCmsData<{ eyebrow?: string; headline?: string; body?: string; image?: string; stats?: Array<{ value: string; label: string }> }>("about").catch(() => null),
    getCmsData<{ eyebrow?: string; headline?: string }>("facilities").catch(() => null),
    getCmsData<{ eyebrow?: string; headline?: string }>("gallery").catch(() => null),
    getCmsData<{ eyebrow?: string; headline?: string; items?: Array<{ type: string; description: string }> }>("events").catch(() => null),
    getCmsData<{ eyebrow?: string; headline?: string; body?: string; cta?: string }>("membership").catch(() => null),
    getCmsData<Array<{ key: string; visible: boolean; order: number }>>("sections").catch(() => null),
    getAllAssets().catch(() => ({} as Record<string, string>)),
    prisma.room.findMany({ orderBy: { order: "asc" } }).catch(() => []),
    prisma.galleryImage.findMany({ where: { active: true }, orderBy: { order: "asc" } }).catch(() => []),
    prisma.package.findMany({ orderBy: { order: "asc" } }).catch(() => []),
  ]);

  // Section order + visibility from CMS
  const sectionsConfig = Array.isArray(sectionsCms) ? sectionsCms : DEFAULT_SECTIONS;
  const activeSections = sectionsConfig
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  // Asset URLs with static fallbacks
  const aboutImage = assets["about-image"];
  const facilityImages: [string, string, string, string] = [
    assets["facility-1"] || "/images/facility-1.jpg",
    assets["facility-2"] || "/images/facility-2.jpg",
    assets["facility-3"] || "/images/facility-3.jpg",
    assets["facility-4"] || "/images/facility-4.jpg",
  ];
  const eventImages: Record<string, string> = {
    weddings: assets["event-weddings"] || "/images/events/weddings.jpg",
    conferences: assets["event-conferences"] || "/images/events/conferences.jpg",
    parties: assets["event-parties"] || "/images/events/parties.jpg",
  };
  const packageImages: Record<string, string> = {
    "pkg-weekend": assets["pkg-weekend"] || "/images/packages/premium-weekend-escape.jpg",
    "pkg-voucher": assets["pkg-voucher"] || "/images/packages/exclusive-lifestyle-voucher.jpg",
    "pkg-romantic": assets["pkg-romantic"] || "/images/packages/romantic-getaway.jpg",
  };

  const sectionMap: Record<string, React.ReactNode> = {
    about: <About cms={aboutCms ? { ...aboutCms, image: aboutImage || aboutCms.image } : aboutImage ? { image: aboutImage } : null} />,
    facilities: <Facilities cms={facilitiesCms} facilityImages={facilityImages} />,
    rooms: <Rooms dbRooms={dbRooms} cms={null} />,
    gallery: <Gallery images={dbGallery} cms={galleryCms} />,
    events: <Events cms={eventsCms} eventImages={eventImages} />,
    membership: <Membership cms={membershipCms} dbPackages={dbPackages} packageImages={packageImages} />,
  };

  return (
    <main>
      <HeroCanvas
        desktopMode={heroCms?.desktopMode ?? "frames"}
        mobileMode={heroCms?.mobileMode ?? "frames"}
        desktopPhoto={heroCms?.desktopPhoto}
        mobilePhoto={heroCms?.mobilePhoto}
      />
      {activeSections.map((s) => (
        <React.Fragment key={s.key}>{sectionMap[s.key]}</React.Fragment>
      ))}
      <Footer />
    </main>
  );
}
