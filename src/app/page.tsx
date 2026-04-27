"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "@/components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import HowItWorksSection from "@/components/landing/how-it-works";
import DownloadSection from "@/components/landing/download-section";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen flex flex-col">
        {/* شريط التنقل */}
        <Navbar />

        {/* المحتوى الرئيسي */}
        <main className="flex-1">
          {/* قسم البطل */}
          <HeroSection />

          {/* قسم المميزات */}
          <FeaturesSection />

          {/* كيف يعمل */}
          <HowItWorksSection />

          {/* قسم التحميل */}
          <DownloadSection />
        </main>

        {/* التذييل */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
