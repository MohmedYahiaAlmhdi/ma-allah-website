"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState, useSyncExternalStore } from "react";

// روابط التنقل
const navLinks = [
  { href: "#features", label: "المميزات" },
  { href: "#how-it-works", label: "كيف يعمل" },
  { href: "#download", label: "التحميل" },
];

// تتبع حالة التركيب لتجنب مشاكل SSR
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// تتبع حالة التمرير باستخدام useSyncExternalStore
let scrollListeners: (() => void)[] = [];
function subscribeScroll(callback: () => void) {
  scrollListeners.push(callback);
  window.addEventListener("scroll", callback, { passive: true });
  return () => {
    scrollListeners = scrollListeners.filter((l) => l !== callback);
    window.removeEventListener("scroll", callback);
  };
}
function getScrollSnapshot() {
  return window.scrollY > 20;
}
function getServerSnapshot() {
  return false;
}

function useIsScrolled() {
  return useSyncExternalStore(subscribeScroll, getScrollSnapshot, getServerSnapshot);
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useIsMounted();
  const isScrolled = useIsScrolled();
  const { theme, setTheme } = useTheme();

  const scrollToSection = useCallback((href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* الشعار */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gold/30 shadow-md">
              <img
                src="/ma-allah-website/icon.png"
                alt="مع الله"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gold/80 text-xl sm:text-2xl font-bold font-arabic tracking-wide">
              مع الله
            </span>
          </div>

          {/* روابط التنقل - سطح المكتب */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-gold/80 hover:text-gold px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 font-arabic"
              >
                {link.label}
              </button>
            ))}

            {/* زر تبديل السمة */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gold hover:text-gold p-2 rounded-lg transition-colors duration-200 mr-2"
                aria-label="تبديل السمة"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* زر التحميل */}
            <Button
              onClick={() => scrollToSection("#download")}
              className="bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl px-6 font-arabic transition-all duration-200 gold-glow-hover"
            >
              <Download className="w-4 h-4 ml-2" />
              تحميل التطبيق
            </Button>
          </div>

          {/* قائمة الجوال */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gold hover:text-gold p-2 rounded-lg transition-colors duration-200"
                aria-label="تبديل السمة"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-gold p-2 rounded-lg transition-colors duration-200"
              aria-label="فتح القائمة"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* القائمة المنسدلة للجوال */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-card/98 backdrop-blur-md border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-right text-gold hover:text-gold hover:bg-gold/10 px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 font-arabic"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection("#download")}
                className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl mt-2 font-arabic"
              >
                <Download className="w-4 h-4 ml-2" />
                تحميل التطبيق
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
