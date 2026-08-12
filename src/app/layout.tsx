import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter is the only loaded face. Display type is Georgia, a system serif —
// see --font-serif in globals.css. Both mirror ethos-design.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Executive Ethos",
  description:
    "AI-powered executive communication coaching. Honest feedback, a measurable baseline, and a 1:1 human coach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
