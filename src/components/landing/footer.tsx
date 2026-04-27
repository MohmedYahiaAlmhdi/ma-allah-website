"use client";

import { ExternalLink, Github, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-foreground border-t border-border">
      {/* القسم الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* معلومات التطبيق */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gold/30 shadow-md">
                <img
                  src="/ma-allah-website/icon.png"
                  alt="مع الله"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-foreground text-xl font-bold font-arabic">
                مع الله
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-arabic max-w-xs">
              تطبيق إسلامي متكامل يساعدك على محاسبة النفس وتتبع تقدمك الروحي
              اليومي عبر ١١ فئة بإجمالي ١٠٠٠ نقطة.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-gold font-bold mb-4 font-arabic">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { href: "#features", label: "المميزات" },
                { href: "#how-it-works", label: "كيف يعمل" },
                { href: "#download", label: "التحميل" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-gold transition-colors duration-200 text-sm font-arabic flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* المطور */}
          <div>
            <h3 className="text-gold font-bold mb-4 font-arabic">المشروع</h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-arabic mb-4">
              تطبيق مع الله هو مشروع مفتوح المصدر يهدف لخدمة المسلمين في
              محاسبة أنفسهم وتحسين مستواهم الروحي.
            </p>
            <a
              href="https://github.com/MohmedYahiaAlmhdi/ma-allah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors duration-200 text-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* القسم السفلي */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm font-arabic">
              © {currentYear} مع الله. جميع الحقوق محفوظة.
            </p>
            <p className="text-muted-foreground text-sm font-arabic flex items-center gap-1">
              صنع بـ
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              لخدمة الإسلام والمسلمين
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
