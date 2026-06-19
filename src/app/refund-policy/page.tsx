import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Refund Policy | Hebron Hotels & Suites Owerri",
  description:
    "Cancellation and refund policy for room reservations, event bookings, and hotel services at Hebron Hotels and Suites Owerri.",
};

const SECTIONS = [
  {
    number: "01",
    title: "Reservation Cancellations",
    subsections: [
      {
        heading: "Standard Room Bookings",
        body: [
          "Guests may cancel their reservation up to 12 hours before the scheduled check-in date to qualify for a full refund.",
          "Cancellations made less than 12 hours before check-in may attract a cancellation fee equivalent to one night's stay.",
          "No-shows are non-refundable.",
        ],
      },
      {
        heading: "Non-Refundable or Promotional Rates",
        body: [
          "Reservations made under promotional, discounted, or non-refundable rates are not eligible for refunds after payment confirmation.",
        ],
      },
    ],
  },
  {
    number: "02",
    title: "Event and Conference Bookings",
    subsections: [
      {
        heading: null,
        body: [
          "Event or conference cancellations made at least 2 days before the scheduled event date may qualify for a partial or full refund, subject to management approval.",
          "Cancellations made within 2 days of the event may result in forfeiture of deposit payments already made.",
        ],
      },
    ],
  },
  {
    number: "03",
    title: "Refund Processing",
    subsections: [
      {
        heading: null,
        body: [
          "Approved refunds will be processed within 1–5 business days after confirmation and approval by management.",
          "Refund timelines may vary depending on the customer's bank or payment service provider.",
        ],
      },
    ],
  },
  {
    number: "04",
    title: "Refund Method",
    subsections: [
      {
        heading: null,
        body: [
          "All refunds must be made strictly to the same bank account, card, or payment method from which the original payment was made.",
          "Hebron Hotels Owerri will not process refunds to third-party accounts under any circumstance.",
          "Guests may be required to provide proof of payment and valid identification before refunds are processed.",
        ],
      },
    ],
  },
  {
    number: "05",
    title: "Service Dissatisfaction",
    subsections: [
      {
        heading: null,
        body: [
          "Complaints regarding room conditions or hotel services must be reported immediately to hotel management during the guest's stay to allow prompt resolution.",
          "Refund requests arising from dissatisfaction will be reviewed on a case-by-case basis.",
        ],
      },
    ],
  },
  {
    number: "06",
    title: "Force Majeure",
    subsections: [
      {
        heading: null,
        body: [
          "Hebron Hotels Owerri shall not be liable for refunds or compensation arising from circumstances beyond its control, including but not limited to natural disasters, government restrictions, civil unrest, pandemics, or utility disruptions.",
        ],
      },
    ],
  },
  {
    number: "07",
    title: "Contact Information",
    subsections: [
      {
        heading: null,
        body: [
          "For refund requests or inquiries, guests should contact hotel management directly through the official customer service channels below.",
        ],
      },
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div style={{ background: "#0D0704", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="pt-36 pb-16 px-6 md:px-16 max-w-screen-lg mx-auto">
        <p
          className="text-[10px] tracking-[0.45em] uppercase mb-6 font-sans"
          style={{ color: "#C9A84C" }}
        >
          Legal · Policies
        </p>
        <h1
          className="font-display text-cream-100 leading-[0.9] tracking-[-0.02em] mb-6"
          style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300 }}
        >
          Refund Policy
        </h1>
        <p className="font-sans text-cream-100/40 text-sm leading-relaxed max-w-lg mb-4">
          Hebron Hotels and Suites Owerri — Home of Comfort and Relaxation
        </p>
        <div
          className="h-px mt-10"
          style={{ background: "linear-gradient(to right, rgba(201,168,76,0.25), transparent)" }}
        />
      </section>

      {/* Policy Sections */}
      <section className="px-6 md:px-16 pb-20 max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-0">
          {SECTIONS.map((section) => (
            <div
              key={section.number}
              className="grid lg:grid-cols-[120px_1fr] gap-6 lg:gap-16 py-10"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* Number */}
              <div className="flex-shrink-0">
                <span
                  className="font-display text-5xl leading-none"
                  style={{ color: "rgba(201,168,76,0.15)", fontWeight: 300 }}
                >
                  {section.number}
                </span>
              </div>

              {/* Content */}
              <div>
                <h2
                  className="font-display text-cream-100 text-xl mb-6"
                  style={{ fontWeight: 300 }}
                >
                  {section.title}
                </h2>

                {section.subsections.map((sub, i) => (
                  <div key={i} className={i > 0 ? "mt-6" : ""}>
                    {sub.heading && (
                      <p
                        className="text-[9px] tracking-[0.3em] uppercase font-sans mb-3"
                        style={{ color: "#C9A84C" }}
                      >
                        {sub.heading}
                      </p>
                    )}
                    <ul className="flex flex-col gap-3">
                      {sub.body.map((line, j) => (
                        <li key={j} className="flex gap-3">
                          <span
                            className="mt-[6px] flex-shrink-0 w-1 h-1 rounded-full"
                            style={{ background: "rgba(201,168,76,0.4)" }}
                          />
                          <p className="text-sm text-cream-100/55 font-sans leading-relaxed">
                            {line}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Contact block for last section */}
                {section.number === "07" && (
                  <div
                    className="mt-6 p-6 flex flex-col gap-4"
                    style={{
                      background: "rgba(201,168,76,0.04)",
                      border: "1px solid rgba(201,168,76,0.15)",
                    }}
                  >
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-white/25 mb-1.5 font-sans">Email</p>
                      <a
                        href="mailto:hebron.hotels@yahoo.com"
                        className="text-sm font-sans transition-colors hover:text-[#C9A84C]"
                        style={{ color: "#C9A84C" }}
                      >
                        hebron.hotels@yahoo.com
                      </a>
                    </div>
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-white/25 mb-1.5 font-sans">Phone</p>
                      <div className="flex flex-col gap-1">
                        <a href="tel:07071259011" className="text-sm font-sans text-cream-100/60 hover:text-[#C9A84C] transition-colors">
                          0707 125 9011 (Nigeria)
                        </a>
                        <a href="tel:+2347071259011" className="text-sm font-sans text-cream-100/60 hover:text-[#C9A84C] transition-colors">
                          +234 707 125 9011 (International)
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Acceptance notice */}
        <div
          className="mt-12 p-8"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs font-sans text-cream-100/40 leading-relaxed">
            By making a reservation or payment at Hebron Hotels and Suites Owerri, guests acknowledge
            that they have read, understood, and agreed to this Refund Policy.
          </p>
        </div>

        {/* Back links */}
        <div className="mt-10 flex flex-wrap gap-6">
          <Link
            href="/"
            className="text-[10px] tracking-[0.3em] uppercase font-sans text-white/30 hover:text-[#C9A84C] transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/contact"
            className="text-[10px] tracking-[0.3em] uppercase font-sans text-white/30 hover:text-[#C9A84C] transition-colors"
          >
            Contact Us →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
