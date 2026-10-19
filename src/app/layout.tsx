import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans, Newsreader } from "next/font/google";
import "./globals.css";

// Brand faces, self-hosted by next/font and exposed as CSS variables that
// globals.css maps to font-sans/heading, font-identifier and font-signature.
const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

// Only the signature italic, and rarely on screen, so it isn't preloaded.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: "Executive Ethos", template: "%s — Executive Ethos" },
  description:
    "AI-powered executive communication coaching. Honest feedback, a measurable baseline, and a 1:1 human coach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnelSans.variable} ${funnelDisplay.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
