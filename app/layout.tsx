import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coolify environment demo",
  description: "Server-side environment variable deployment demo",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
