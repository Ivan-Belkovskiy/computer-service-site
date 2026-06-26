import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import SVGIcon from "@/components/SVGIcon/SVGIcon";
import SiteNavigation from "@/components/UI/SiteNavigation/SiteNavigation";
import SiteFooter from "@/components/Site/SiteFooter/SiteFooter";
import SiteLayout from "@/components/AppLayout";
import { loadMetadata } from "./actions";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadMetadata();
  return {
    title: meta?.data?.title || "Компьютерный Сервис",
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="ru"
    >

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>

        <SiteLayout>{children}</SiteLayout>

      </body>
    </html >
  );
}
