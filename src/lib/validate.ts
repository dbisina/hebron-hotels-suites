import { z } from "zod";
import { NextResponse } from "next/server";

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

export const enquirySchema = z.object({
  checkIn: z.string().min(1).max(20),
  checkOut: z.string().min(1).max(20),
  guests: z.number().int().min(1).max(20),
  name: z.string().max(120).optional().default(""),
  email: z.string().email().max(255).optional().default(""),
  phone: z.string().max(20).optional().default(""),
  message: z.string().max(1000).optional().default(""),
});

export const roomSchema = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(120),
  description: z.string().max(500),
  size: z.string().max(20),
  occupancy: z.string().max(30),
  image: z.string().max(500).optional().default(""),
  amenities: z.array(z.string().max(80)).optional().default([]),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional(),
});

export const packageSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500),
  highlight: z.string().max(40),
  image: z.string().max(500).optional().default(""),
  includes: z.array(z.string().max(80)).optional().default([]),
  order: z.number().int().optional(),
});

export const settingsSchema = z.object({
  phone: z.string().max(20).optional(),
  email: z.string().email().max(255).optional(),
  address: z.string().max(300).optional(),
  checkIn: z.string().max(20).optional(),
  checkOut: z.string().max(20).optional(),
  facebook: z.string().url().max(300).optional().or(z.literal("")),
  instagram: z.string().url().max(300).optional().or(z.literal("")),
});

export const eventEnquirySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().default(""),
  eventType: z.string().min(1).max(80),
  eventDate: z.string().max(30).optional().default(""),
  guestCount: z.string().max(20).optional().default(""),
  message: z.string().max(1500).optional().default(""),
});

export const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().default(""),
  subject: z.string().max(150).optional().default(""),
  message: z.string().min(1).max(2000),
});

export function validationError(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
