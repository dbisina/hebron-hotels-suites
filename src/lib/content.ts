// CMS-READY: Replace static exports with API calls when CMS is connected.
// Each export maps 1:1 to a CMS document/collection.

export const siteConfig = {
  name: "Hebron Hotels & Suites",
  tagline: "Home of Comfort & Relaxation",
  location: "Owerri, Nigeria",
  phone: "+2347071259011",
  email: "hebron.hotels@yahoo.com",
  address: "Plot 12 Umuoshigo Umuanunu, Obinze Owerri, Nigeria",
  checkIn: "12:00 PM",
  checkOut: "10:00 AM",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61553201672579",
    instagram: "https://www.instagram.com/hebronhotelandsuitsowerri/",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Accommodation", href: "/#accommodation" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
] as const;

export const heroContent = {
  eyebrow: "Owerri · Nigeria",
  headline: "Where Luxury\nMeets Serenity",
  subheadline: "Dive into ultimate luxury at Hebron Hotels and Suites",
  cta: { label: "Explore the Hotel", href: "#about" },
  frameCount: 101,
} as const;

export const aboutContent = {
  eyebrow: "Our Story",
  headline: "True Luxury\nRedefined",
  body: "With an unwavering commitment to hospitality, Hebron Hotels and Suites has elevated the travel experience for countless guests in the heart of Owerri. The hotel features state-of-the-art amenities serving both leisure and business travelers — a sanctuary where every detail whispers perfection.",
  quote: "An escape from reality, crafted for those who seek the extraordinary.",
  stats: [
    { value: "4", label: "Room Categories" },
    { value: "24/7", label: "Concierge Service" },
    { value: "∞", label: "Memories Made" },
  ],
} as const;

export const facilitiesContent = {
  eyebrow: "Amenities",
  headline: "Elegant Comfort\nat Every Turn",
  subheadline: "Experience comfort and relaxation with our world-class free amenities.",
  items: [
    {
      icon: "wifi",
      title: "High-Speed Wi-Fi",
      description: "Seamless connectivity throughout the property.",
    },
    {
      icon: "pool",
      title: "Swimming Pool",
      description: "A pristine outdoor pool for relaxation and leisure.",
    },
    {
      icon: "gym",
      title: "Fitness Centre",
      description: "State-of-the-art gym equipment for the health-conscious.",
    },
    {
      icon: "breakfast",
      title: "Daily Breakfast",
      description: "Complimentary breakfast with local and continental options.",
    },
    {
      icon: "spa",
      title: "Massage & Spa",
      description: "Rejuvenating treatments by certified therapists.",
    },
    {
      icon: "car",
      title: "Car Wash",
      description: "Premium vehicle care during your stay.",
    },
    {
      icon: "dining",
      title: "In-Room Dining",
      description: "Curated menu available around the clock.",
    },
    {
      icon: "concierge",
      title: "Concierge Service",
      description: "Personalized assistance for every need.",
    },
  ],
} as const;

export const roomsContent = {
  eyebrow: "Accommodation",
  headline: "A Perfect Blend of\nComfort and Luxury",
  rooms: [
    {
      slug: "deluxe-room",
      name: "Deluxe Room",
      description: "An elegant retreat designed for the discerning traveler. Understated luxury meets modern comfort.",
      size: "32 m²",
      occupancy: "2 guests",
      image: "/images/rooms/deluxe.jpg",
      amenities: [
        "Daily Breakfast",
        "32\" LED TV",
        "Air Conditioning",
        "In-room Dining",
        "Bath Tub",
        "Coffee Machine",
      ],
    },
    {
      slug: "deluxe-double",
      name: "Deluxe Double Room",
      description: "Ideal for couples or business travel. Spacious, serene, and impeccably appointed.",
      size: "40 m²",
      occupancy: "2–3 guests",
      image: "/images/rooms/deluxe-double.jpg",
      amenities: [
        "Daily Breakfast",
        "32\" LED TV",
        "Air Conditioning",
        "In-room Dining",
        "Bath Tub",
        "Coffee Machine",
      ],
    },
    {
      slug: "deluxe-suite",
      name: "Deluxe Suite",
      description: "A statement of refined living. Sweeping city views, private kitchenette, and exclusive privileges.",
      size: "65 m²",
      occupancy: "2–3 guests",
      image: "/images/rooms/suite.jpg",
      amenities: [
        "Daily Breakfast",
        "42\" LED TV",
        "Air Conditioning",
        "In-room Dining",
        "Bath Tub",
        "Coffee Machine",
        "City Scape View",
        "Kitchenette",
      ],
      featured: true,
    },
    {
      slug: "two-bedroom-suite",
      name: "Two Bedroom Suite",
      description: "The pinnacle of Hebron luxury. Your private butler, panoramic views, and unmatched space.",
      size: "95 m²",
      occupancy: "4–5 guests",
      image: "/images/rooms/two-bedroom.jpg",
      amenities: [
        "Daily Breakfast",
        "48\" LED TV",
        "Air Conditioning",
        "Personal Butler",
        "Bath Tub",
        "Coffee Machine",
        "City Scape View",
        "Kitchenette",
      ],
      featured: true,
    },
  ],
} as const;

export const eventsContent = {
  eyebrow: "Events",
  headline: "The Ideal Venue\nfor Every Occasion",
  subheadline: "From intimate gatherings to grand celebrations, Hebron provides the perfect setting.",
  items: [
    {
      type: "Weddings",
      description: "Create timeless memories in our exquisite wedding spaces, tailored to your vision.",
      icon: "rings",
    },
    {
      type: "Conferences",
      description: "Fully equipped meeting rooms and business facilities for corporate excellence.",
      icon: "conference",
    },
    {
      type: "Parties",
      description: "Private celebrations curated with precision — every detail elevated.",
      icon: "celebration",
    },
  ],
} as const;

export const packagesContent = {
  eyebrow: "Packages",
  headline: "Your Search for\nTrue Luxury Ends Here",
  packages: [
    {
      name: "Premium Weekend Escape",
      description: "2 nights in a Deluxe or Executive Room with daily breakfast, late checkout, welcome drinks, and full facility access.",
      highlight: "Most Popular",
      includes: ["2 Nights Stay", "Daily Breakfast", "Late Checkout", "Welcome Drinks", "Full Facility Access"],
    },
    {
      name: "Exclusive Lifestyle Voucher",
      description: "Gift the extraordinary. A curated experience voucher redeemable across all Hebron services.",
      highlight: "Perfect Gift",
      includes: ["Flexible Redemption", "All Services", "Valid 12 Months", "Personalized Card"],
    },
    {
      name: "Romantic Getaway",
      description: "Complimentary wine bottle, rose petal turndown service, and a private dining experience.",
      highlight: "For Couples",
      includes: ["Complimentary Wine", "Rose Petal Turndown", "Private Dining", "Couples Spa"],
    },
  ],
} as const;

export const galleryContent = {
  eyebrow: "Photography",
  headline: "Every Detail,\nImmaculately\nObserved",
  images: [
    { src: "/images/gallery/hero.jpg", alt: "Hebron Hotels lobby", category: "interior" },
    { src: "/images/gallery/pool.jpg", alt: "Swimming pool", category: "facilities" },
    { src: "/images/gallery/suite.jpg", alt: "Deluxe suite interior", category: "rooms" },
    { src: "/images/gallery/dining.jpg", alt: "In-room dining experience", category: "dining" },
    { src: "/images/gallery/exterior.jpg", alt: "Hotel exterior at night", category: "exterior" },
    { src: "/images/gallery/event.jpg", alt: "Event & conference space", category: "events" },
  ],
} as const;

export const membershipContent = {
  eyebrow: "Membership",
  headline: "Luxury Privileges\nFor the Select Few",
  body: "Priority access to luxury stays, personalized service, complimentary upgrades, late check-out, private lounge access, and special dining privileges.",
  cta: "Become a Member",
} as const;
