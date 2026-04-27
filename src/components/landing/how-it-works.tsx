"use client";

import { motion } from "framer-motion";
import { ClipboardList, TrendingUp, Award } from "lucide-react";

// بيانات الخطوات
const steps = [
  {
    number: "١",
    title: "سجّل",
    description:
      "سجّل أداءك اليومي في كل فئة من الفئات الإحدى عشرة بسهولة ويسر. واجهة بسيطة ومريحة تساعدك على المحاسبة اليومية.",
    icon: ClipboardList,
    color: "from-gold to-gold-dark",
    bgColor: "bg-gold/10",
    iconColor: "text-gold",
  },
  {
    number: "٢",
    title: "تتبّع",
    description:
      "راقب تقدمك الروحي عبر تقارير مفصلة ورسوم بيانية واضحة. تابع تطورك في كل فئة وتعرّف على نقاط القوة والضعف.",
    icon: TrendingUp,
    color: "from-purple to-purple-dark",
    bgColor: "bg-purple/10",
    iconColor: "text-purple",
  },
  {
    number: "٣",
    title: "تحسّن",
    description:
      "حدد أهدافك الروحية وعمل على التحسن المستمر. استفد من التحليلات والتنبيهات لتعزيز مستواك الروحي يوماً بعد يوم.",
    icon: Award,
    color: "from-navy to-navy",
    bgColor: "bg-navy/10",
    iconColor: "text-foreground",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-secondary/30">
      {/* حدود زخرفية */}
      <div className="border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {/* العنوان */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-arabic">
              كيف يعمل التطبيق؟
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
              <span className="text-gold text-2xl">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
            </div>
            <p className="text-muted-foreground text-lg sm:text-xl font-arabic max-w-2xl mx-auto">
              ثلاث خطوات بسيطة لبدء رحلتك الروحية
            </p>
          </motion.div>

          {/* الخطوات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  {/* خط الرابط */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-0 w-full h-px">
                      <div className="w-full h-full bg-gradient-to-l from-gold/40 via-gold/20 to-gold/40" />
                    </div>
                  )}

                  {/* الرقم والأيقونة */}
                  <div className="relative inline-block mb-6">
                    <div
                      className={`w-24 h-24 rounded-2xl ${step.bgColor} flex items-center justify-center mx-auto`}
                    >
                      <Icon className={`w-10 h-10 ${step.iconColor}`} />
                    </div>
                    <div
                      className={`absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-cream font-bold text-lg shadow-lg`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* العنوان */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 font-arabic">
                    {step.title}
                  </h3>

                  {/* الوصف */}
                  <p className="text-muted-foreground leading-relaxed font-arabic max-w-sm mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* دعوة للعمل */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-lg sm:text-xl text-foreground/80 font-arabic">
              ابدأ رحلتك الروحية اليوم واطلب الأجر من الله
            </p>
            <p className="text-gold text-2xl sm:text-3xl font-bold font-arabic mt-2">
              ﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
