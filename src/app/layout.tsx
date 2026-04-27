import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// خطوط عربية وجورجية
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ma-allah.vercel.app"
  ),
  title: "مع الله - حاسوبك الروحي اليومي",
  description:
    "تطبيق مع الله يساعدك على تتبع تقدمك الروحي اليومي عبر 11 فئة بإجمالي ١٠٠٠ نقطة. راقب صلواتك، أذكارك، قراءتك للقرآن، والمزيد.",
  keywords: [
    "مع الله",
    "حاسوب روحي",
    "محاسبة النفس",
    "إسلام",
    "صلوات",
    "أذكار",
    "قرآن",
    "تطبيق إسلامي",
  ],
  authors: [{ name: "مع الله" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "مع الله - حاسوبك الروحي اليومي",
    description:
      "تطبيق إسلامي لمحاسبة النفس وتتبع التقدم الروحي اليومي عبر ١١ فئة بإجمالي ١٠٠٠ نقطة",
    type: "website",
    locale: "ar_AR",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "مع الله - حاسوبك الروحي اليومي",
    description:
      "تطبيق إسلامي لمحاسبة النفس وتتبع التقدم الروحي اليومي",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
