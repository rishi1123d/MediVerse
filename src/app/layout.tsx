import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import Image from "next/image";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MediVerse",
  description: "Pre-surgical assistance application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full`}
      >
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
