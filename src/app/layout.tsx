import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "시디과 여기어때",
  description: "시디과 학생이라면 방문하기 좋은 문화예술공간 추천집",
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
