import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import SVGIcon from "@/components/SVGIcon/SVGIcon";
import SiteNavigation from "@/components/UI/SiteNavigation/SiteNavigation";
import SiteFooter from "@/components/Site/SiteFooter/SiteFooter";
import AppLayout from "@/components/AppLayout";
import { getSiteSettings, loadMetadata } from "./actions";


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
    title: meta?.data?.title || "Computer-Service-Site",
    description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const response = await getSiteSettings();
  const settings = response.data || {};

  return (
    <html
      lang="ru"
    >

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>

        <AppLayout siteSettings={settings}>{children}</AppLayout>

      </body>
    </html >
  );
}
