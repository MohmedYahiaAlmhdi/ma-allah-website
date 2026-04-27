"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Sparkles, Star } from "lucide-react";

export default function HeroSection() {
  const scrollToDownload = () => {
    const element = document.querySelector("#download");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* الخلفية */}
      <div className="absolute inset-0 islamic-gradient">
        {/* نمط إسلامي هندسي */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23D4A843' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* نجوم ديناميكية */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              top: `${15 + i * 12}%`,
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <Star
              size={8 + (i % 3) * 4}
              className="text-gold/30 fill-gold/20"
            />
          </div>
        ))}

        {/* دوائر زخرفية */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-gold/5" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full border border-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold/5" />
      </div>

      {/* صورة الخلفية */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* المحتوى */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* النص */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-right"
          >
            {/* شارة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium font-arabic">
                تطبيق إسلامي متكامل
              </span>
            </motion.div>

            {/* العنوان الرئيسي */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
              <span className="text-gold font-arabic">مع الله</span>
            </h1>

            {/* الشعار الفرعي */}
            <p className="text-2xl sm:text-3xl text-cream/90 mb-6 font-arabic">
              حاسوبك الروحي اليومي
            </p>

            {/* الوصف */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-cream/70 text-lg sm:text-xl mb-8 leading-relaxed font-arabic max-w-lg mx-auto lg:mx-0 lg:mr-0"
            >
              تتبع تقدمك الروحي اليومي عبر{" "}
              <span className="text-gold font-bold">١١ فئة</span> بإجمالي{" "}
              <span className="text-gold font-bold">١٠٠٠ نقطة</span>
            </motion.p>

            {/* الآية الكريمة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-gold/20 rounded-2xl p-4 sm:p-5 mb-8 max-w-lg mx-auto lg:mx-0 lg:mr-0"
            >
              <p className="text-cream/80 text-base sm:text-lg leading-loose font-arabic">
                ﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنْظُرْ
                نَفْسٌ مَا قَدَّمَتْ لِغَدٍ ﴾
              </p>
              <p className="text-gold/60 text-sm mt-2 font-arabic">
                سورة الحشر - الآية ١٨
              </p>
            </motion.div>

            {/* أزرار */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={scrollToDownload}
                className="bg-gold hover:bg-gold-dark text-navy font-bold text-lg rounded-2xl px-8 py-6 gold-glow gold-glow-hover transition-all duration-300 font-arabic"
              >
                <Download className="w-5 h-5 ml-2" />
                تحميل التطبيق مجاناً
              </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const el = document.querySelector("#features");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-2xl px-8 py-6 text-lg font-arabic"
                  style={{
                    borderColor: 'rgba(212, 168, 67, 0.4)',
                    color: '#D4A843',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#E8C975';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#D4A843';
                  }}
                >
                  اكتشف المميزات
                </Button>
            </motion.div>
          </motion.div>

          {/* صورة الهاتف */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative animate-float">
              {/* هالة خلفية */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-purple/10 to-gold/20 rounded-[3rem] blur-2xl scale-110" />

              {/* إطار الهاتف */}
              <div className="relative w-56 sm:w-64 lg:w-72 rounded-[2.8rem] bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 border border-gray-600/50 shadow-2xl shadow-gold/10 p-2">
                {/* الحافة العلوية (notch) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />

                {/* الشاشة */}
                <div className="relative rounded-[2.2rem] overflow-hidden bg-black pt-4">
                  {/* شريط الحالة */}
                  <div className="flex items-center justify-between px-5 py-1.5 bg-black">
                    <span className="text-white text-[9px] font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><rect x="0" y="0" width="2" height="8" rx="1" fill="white"/><rect x="3" y="1" width="2" height="6" rx="1" fill="white"/><rect x="6" y="2" width="2" height="4" rx="1" fill="white"/><rect x="9" y="3" width="2" height="2" rx="1" fill="white"/></svg>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 8C3 5 5 3 7 3C9 3 11 5 13 8" stroke="white" strokeWidth="1.2" strokeLinecap="round"/><path d="M3.5 6.5C4.5 5 5.5 4 7 4C8.5 4 9.5 5 10.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="8" r="1" fill="white"/></svg>
                      <svg width="18" height="9" viewBox="0 0 18 9" fill="none"><rect x="0.5" y="0.5" width="15" height="8" rx="1.5" stroke="white" opacity="0.35"/><rect x="1.5" y="1.5" width="11" height="6" rx="1" fill="#22C55E"/><rect x="16" y="2.5" width="1.5" height="4" rx="0.5" fill="white" opacity="0.4"/></svg>
                    </div>
                  </div>

                  {/* محتوى الشاشة (صورة التطبيق) */}
                  <div className="aspect-[9/19] bg-navy">
                    <img
                      src="/hero-phone.png"
                      alt="تطبيق مع الله - حاسوبك الروحي اليومي"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* شريط التنقل السفلي */}
                  <div className="flex items-center justify-center py-2 bg-black">
                    <div className="w-28 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>

              {/* عناصر ديناميكية */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-purple/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-purple-light/30"
              >
                <span className="text-cream text-xs font-bold font-arabic">
                  ١٠٠٠ نقطة
                </span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-gold/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-gold-light/30"
              >
                <span className="text-navy text-xs font-bold font-arabic">
                  ١١ فئة
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* فواصل زخرفية سفلى */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L1440 80L1440 40C1440 40 1200 0 720 0C240 0 0 40 0 40L0 80Z"
            className="fill-cream dark:fill-[#0F1720]"
          />
        </svg>
      </div>
    </section>
  );
}
