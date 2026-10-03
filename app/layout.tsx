import type { Metadata } from "next";
import "@fontsource-variable/momo-trust-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar CRM — Logistics workspace",
  description: "Bản demo CRM logistics với dữ liệu mẫu.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
