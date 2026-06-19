import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const SMTP_FROM = process.env.SMTP_FROM ?? "Hebron Hotels & Suites <no-reply@hebronhotels.com>";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "adebisiruthadegoke@gmail.com";

function getTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function send(to: string, subject: string, html: string) {
  const transport = getTransport();
  if (!transport) {
    console.warn("[email] SMTP not configured — skipping send to", to);
    return;
  }
  try {
    await transport.sendMail({ from: SMTP_FROM, to, subject, html });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

const baseStyle = `
  font-family: Georgia, 'Times New Roman', serif;
  background: #0D0704;
  color: #E8DFD0;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 32px;
`;
const goldStyle = "color: #C9A84C;";
const mutedStyle = "color: rgba(232,223,208,0.5); font-size: 13px;";
const hrStyle = "border: none; border-top: 1px solid rgba(201,168,76,0.2); margin: 24px 0;";
const labelStyle = "font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(232,223,208,0.4);";

function wrap(body: string) {
  return `<!DOCTYPE html><html><body><div style="${baseStyle}">${body}</div></body></html>`;
}

function header(eyebrow: string) {
  return `
    <p style="${goldStyle} ${labelStyle} margin-bottom: 8px;">${eyebrow}</p>
    <p style="font-family: Georgia; font-size: 13px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(232,223,208,0.3); margin: 0 0 32px;">Hebron Hotels & Suites</p>
    <hr style="${hrStyle}">
  `;
}

function footer() {
  return `
    <hr style="${hrStyle}">
    <p style="${mutedStyle} margin-top: 24px;">
      Hebron Hotels & Suites · Plot 12 Umuoshigo Umuanunu, Obinze Owerri, Nigeria<br>
      +234 707 125 9011 · <a href="mailto:hebron.hotels@yahoo.com" style="${goldStyle}">hebron.hotels@yahoo.com</a>
    </p>
  `;
}

function row(label: string, value: string) {
  return `
    <div style="margin-bottom: 16px;">
      <div style="${labelStyle}">${label}</div>
      <div style="font-size: 15px; margin-top: 4px;">${value}</div>
    </div>
  `;
}

// ─── Booking ────────────────────────────────────────────────────────────────

interface BookingData {
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: number;
}

export async function sendBookingConfirmation(data: BookingData) {
  const subject = `Booking Confirmed — ${data.bookingRef} | Hebron Hotels & Suites`;
  const html = wrap(`
    ${header("Booking Confirmation")}
    <h2 style="font-family: Georgia; font-weight: 300; font-size: 24px; color: #E8DFD0; margin: 0 0 24px;">Your stay is confirmed.</h2>
    <p style="${mutedStyle} margin-bottom: 24px;">Thank you, ${data.guestName}. We look forward to welcoming you.</p>
    ${row("Booking Reference", `<span style="${goldStyle}">${data.bookingRef}</span>`)}
    ${row("Room", data.roomName)}
    ${row("Check-In", data.checkIn)}
    ${row("Check-Out", data.checkOut)}
    ${row("Nights", String(data.nights))}
    ${row("Guests", String(data.guests))}
    ${row("Amount", `NGN ${data.amount.toLocaleString()}`)}
    ${footer()}
  `);
  await send(data.guestEmail, subject, html);
}

export async function sendBookingAdminAlert(data: BookingData) {
  const subject = `New Booking — ${data.bookingRef} | ${data.guestName}`;
  const html = wrap(`
    ${header("New Booking")}
    ${row("Ref", data.bookingRef)}
    ${row("Guest", data.guestName)}
    ${row("Email", data.guestEmail)}
    ${row("Room", data.roomName)}
    ${row("Check-In", data.checkIn)}
    ${row("Check-Out", data.checkOut)}
    ${row("Nights / Guests", `${data.nights} nights · ${data.guests} guests`)}
    ${row("Amount", `NGN ${data.amount.toLocaleString()}`)}
    ${footer()}
  `);
  await send(NOTIFICATION_EMAIL, subject, html);
}

// ─── Enquiry ─────────────────────────────────────────────────────────────────

interface EnquiryData {
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
}

export async function sendEnquiryConfirmation(data: EnquiryData) {
  const subject = "Enquiry Received | Hebron Hotels & Suites";
  const html = wrap(`
    ${header("Enquiry Received")}
    <h2 style="font-family: Georgia; font-weight: 300; font-size: 24px; color: #E8DFD0; margin: 0 0 24px;">We've received your enquiry.</h2>
    <p style="${mutedStyle} margin-bottom: 24px;">Thank you, ${data.name || "Guest"}. Our team will be in touch shortly.</p>
    ${row("Check-In", data.checkIn)}
    ${row("Check-Out", data.checkOut)}
    ${row("Guests", String(data.guests))}
    ${data.message ? row("Message", data.message) : ""}
    ${footer()}
  `);
  if (data.email) await send(data.email, subject, html);
}

export async function sendEnquiryAdminAlert(data: EnquiryData) {
  const subject = `New Enquiry | ${data.name || "Guest"} — ${data.checkIn}`;
  const html = wrap(`
    ${header("New Enquiry")}
    ${row("Name", data.name || "—")}
    ${row("Email", data.email || "—")}
    ${row("Check-In", data.checkIn)}
    ${row("Check-Out", data.checkOut)}
    ${row("Guests", String(data.guests))}
    ${data.message ? row("Message", data.message) : ""}
    ${footer()}
  `);
  await send(NOTIFICATION_EMAIL, subject, html);
}

// ─── Event Enquiry ────────────────────────────────────────────────────────────

interface EventEnquiryData {
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: string;
  message?: string;
}

export async function sendEventEnquiryConfirmation(data: EventEnquiryData) {
  const subject = "Event Enquiry Received | Hebron Hotels & Suites";
  const html = wrap(`
    ${header("Event Enquiry")}
    <h2 style="font-family: Georgia; font-weight: 300; font-size: 24px; color: #E8DFD0; margin: 0 0 24px;">We've received your event enquiry.</h2>
    <p style="${mutedStyle} margin-bottom: 24px;">Thank you, ${data.name}. Our events team will reach out within 24 hours.</p>
    ${row("Event Type", data.eventType)}
    ${data.eventDate ? row("Preferred Date", data.eventDate) : ""}
    ${data.guestCount ? row("Expected Guests", data.guestCount) : ""}
    ${data.message ? row("Additional Details", data.message) : ""}
    ${footer()}
  `);
  await send(data.email, subject, html);
}

export async function sendEventEnquiryAdminAlert(data: EventEnquiryData) {
  const subject = `New Event Enquiry | ${data.eventType} — ${data.name}`;
  const html = wrap(`
    ${header("New Event Enquiry")}
    ${row("Name", data.name)}
    ${row("Email", data.email)}
    ${data.phone ? row("Phone", data.phone) : ""}
    ${row("Event Type", data.eventType)}
    ${data.eventDate ? row("Date", data.eventDate) : ""}
    ${data.guestCount ? row("Guests", data.guestCount) : ""}
    ${data.message ? row("Message", data.message) : ""}
    ${footer()}
  `);
  await send(NOTIFICATION_EMAIL, subject, html);
}

// ─── Contact ─────────────────────────────────────────────────────────────────

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function sendContactConfirmation(data: ContactData) {
  const sub = "Message Received | Hebron Hotels & Suites";
  const html = wrap(`
    ${header("Message Received")}
    <h2 style="font-family: Georgia; font-weight: 300; font-size: 24px; color: #E8DFD0; margin: 0 0 24px;">Thank you for reaching out.</h2>
    <p style="${mutedStyle} margin-bottom: 24px;">We've received your message and will respond within 24 hours.</p>
    ${data.subject ? row("Subject", data.subject) : ""}
    ${row("Message", data.message)}
    ${footer()}
  `);
  await send(data.email, sub, html);
}

export async function sendContactAdminAlert(data: ContactData) {
  const sub = `New Message | ${data.name}${data.subject ? ` — ${data.subject}` : ""}`;
  const html = wrap(`
    ${header("New Contact Message")}
    ${row("Name", data.name)}
    ${row("Email", data.email)}
    ${data.phone ? row("Phone", data.phone) : ""}
    ${data.subject ? row("Subject", data.subject) : ""}
    ${row("Message", data.message)}
    ${footer()}
  `);
  await send(NOTIFICATION_EMAIL, sub, html);
}
