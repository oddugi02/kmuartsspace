import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Seoul Arts Space Archive",
  description: "국민대 시각디자인 학생들을 위한 서울 문화예술 공간 큐레이션",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Arts Archive",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground selection:bg-black selection:text-white leading-[1.6] tracking-tight pb-20 md:pb-0`}>
        {children}
      </body>
    </html>
  );
}
