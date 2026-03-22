import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070708",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Edogawa Vintage — Premium Camera Atelier",
    template: "%s · Edogawa Vintage",
  },
  description:
    "A curated vintage and premium camera boutique—digital, film, camcorders, and accessories with honest condition notes.",
  openGraph: {
    title: "Edogawa Vintage",
    description: "Enter a premium camera universe—curated, tested, and beautifully presented.",
    url: siteUrl,
    siteName: "Edogawa Vintage",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-dvh flex flex-col antialiased">{children}</body>
    </html>
  );
}
