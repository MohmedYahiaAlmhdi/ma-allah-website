"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Moon,
  Sun,
  Eye,
  BookOpen,
  Compass,
  Heart,
  MessageCircle,
  Users,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";

// بيانات الفئات الإحدى عشرة
const categories = [
  {
    title: "الصلوات المفروضة",
    description: "تتبع الصلوات الخمس المفروضة في وقتها",
    points: 100,
    icon: Moon,
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
  },
  {
    title: "السنن الرواتب والوتر والضحى",
    description: "السنن الرواتب + الوتر + صلاة الضحى",
    points: 100,
    icon: Sun,
    color: "from-amber-500/20 to-amber-600/20",
    iconColor: "text-amber-400",
  },
  {
    title: "الخشوع في الصلاة",
    description: "تقييم الخشوع لكل صلاة في كل ركن",
    points: 100,
    icon: Eye,
    color: "from-emerald-500/20 to-emerald-600/20",
    iconColor: "text-emerald-400",
  },
  {
    title: "الأذكار",
    description: "أذكار الصباح والمساء وأذكار الصلاة",
    points: 100,
    icon: Sparkles,
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-400",
  },
  {
    title: "القرآن الكريم",
    description: "تتبع قراءة القرآن الكريم ومراجعته",
    points: 100,
    icon: BookOpen,
    color: "from-teal-500/20 to-teal-600/20",
    iconColor: "text-teal-400",
  },
  {
    title: "الاستقامة",
    description: "مراقبة الاستقامة على الطريق والالتزام",
    points: 100,
    icon: Compass,
    color: "from-rose-500/20 to-rose-600/20",
    iconColor: "text-rose-400",
  },
  {
    title: "أمراض القلب",
    description: "محاسبة النفس على أمراض القلب ومعالجتها",
    points: 100,
    icon: Heart,
    color: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-400",
  },
  {
    title: "أمراض اللسان",
    description: "المراقبة على آفات اللسان وحفظه",
    points: 100,
    icon: MessageCircle,
    color: "from-orange-500/20 to-orange-600/20",
    iconColor: "text-orange-400",
  },
  {
    title: "بر الوالدين",
    description: "مراقبة حقوق الوالدين وبرهما",
    points: 100,
    icon: Users,
    color: "from-cyan-500/20 to-cyan-600/20",
    iconColor: "text-cyan-400",
  },
  {
    title: "قيام الليل",
    description: "تتبع قيام الليل والتهجد",
    points: 100,
    icon: Clock,
    color: "from-indigo-500/20 to-indigo-600/20",
    iconColor: "text-indigo-400",
  },
  {
    title: "صلاة التهجد",
    description: "الاهتمام بصلاة التهجد والقيام في الليل",
    points: 100,
    icon: Star,
    color: "from-yellow-500/20 to-yellow-600/20",
    iconColor: "text-yellow-400",
  },
];

// عنوان القسم
const SectionTitle = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-arabic">
      مميزات التطبيق
    </h2>
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
      <span className="text-gold text-2xl">✦</span>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
    </div>
    <p className="text-muted-foreground text-lg sm:text-xl font-arabic max-w-2xl mx-auto">
      ١١ فئة شاملة تغطي جميع جوانب حياتك الروحية بإجمالي ١٠٠٠ نقطة يومية
    </p>
  </motion.div>
);

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle />

        {/* شبكة البطاقات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="islamic-card group h-full bg-card border-border hover:border-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1">
                  <CardContent className="p-5 sm:p-6">
                    {/* الرمز والنقاط */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`w-6 h-6 ${category.iconColor}`} />
                      </div>
                      <span className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full font-arabic">
                        {category.points} نقطة
                      </span>
                    </div>

                    {/* العنوان */}
                    <h3 className="text-foreground font-bold text-base mb-2 font-arabic leading-relaxed">
                      {category.title}
                    </h3>

                    {/* الوصف */}
                    <p className="text-muted-foreground text-sm leading-relaxed font-arabic">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ملخص */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-card text-foreground border border-border rounded-2xl px-8 py-4 sm:px-10 sm:py-5 shadow-sm">
            <div className="text-center">
              <span className="text-gold text-3xl sm:text-4xl font-bold">
                ١٠٠٠
              </span>
              <p className="text-muted-foreground text-xs sm:text-sm font-arabic">
                نقطة يومية
              </p>
            </div>
            <div className="w-px h-12 bg-gold/30" />
            <div className="text-center">
              <span className="text-gold text-3xl sm:text-4xl font-bold">
                ١١
              </span>
              <p className="text-muted-foreground text-xs sm:text-sm font-arabic">
                فئة متكاملة
              </p>
            </div>
            <div className="w-px h-12 bg-gold/30" />
            <div className="text-center">
              <span className="text-gold text-3xl sm:text-4xl font-bold">
                ∞
              </span>
              <p className="text-muted-foreground text-xs sm:text-sm font-arabic">
                الأجر بإذن الله
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
