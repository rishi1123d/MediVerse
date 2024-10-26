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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="p-4 bg-transparent flex items-center">
          <h1 className="text-2xl font-bold text-white">MediVerse</h1>
          <Image
            src="/logo.png"
            alt="MediVerse Logo"
            width={40}
            height={40}
            className="mr-2"
          />
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
