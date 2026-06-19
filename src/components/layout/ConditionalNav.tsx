"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { BookingBar } from "./BookingBar";

const HIDDEN_ON = ["/book", "/admin"];

export function ConditionalNav() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;
  return (
    <>
      <Navbar />
      <BookingBar />
    </>
  );
}
