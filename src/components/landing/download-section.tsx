"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDownToLine,
  Bell,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Github,
  HardDrive,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ReleaseData {
  success: boolean;
  version: string;
  name: string;
  downloadUrl: string | null;
  downloadCount: number;
  releaseNotes: string;
  publishDate: string;
  releaseUrl: string;
  isNewer: boolean;
}

export default function DownloadSection() {
  const [release, setRelease] = useState<ReleaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRelease = useCallback(async () => {
    try {
      const response = await fetch("/api/releases");
      const data: ReleaseData = await response.json();
      setRelease(data);
    } catch (error) {
      console.error("خطأ في جلب معلومات الإصدار:", error);
      setRelease({
        success: false,
        version: "1.0.0",
        name: "مع الله",
        downloadUrl: null,
        downloadCount: 0,
        releaseNotes: "",
        publishDate: "",
        releaseUrl: "",
        isNewer: false,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRelease();
  }, [fetchRelease]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRelease();
  };

  // تنسيق التاريخ بالعربية
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // تنسيق عدد التحميلات
  const formatDownloadCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString("ar-SA");
  };

  return (
    <section id="download" className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-arabic">
            حمّل التطبيق
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-2xl">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <p className="text-muted-foreground text-lg sm:text-xl font-arabic">
            احصل على أحدث إصدار من تطبيق مع الله
          </p>
        </motion.div>

        {/* بطاقة التحميل */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="islamic-card overflow-hidden bg-card border-border">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              {isLoading ? (
                /* حالة التحميل */
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
                  <p className="text-muted-foreground font-arabic">
                    جارٍ جلب معلومات الإصدار...
                  </p>
                </div>
              ) : release ? (
                <>
                  {/* رأس البطاقة */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
                        <ArrowDownToLine className="w-7 h-7 text-navy" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground font-arabic">
                            {release.name}
                          </h3>
                          {release.isNewer && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-arabic">
                              <Bell className="w-3 h-3 ml-1" />
                              إصدار جديد!
                            </Badge>
                          )}
                          {release.success && (
                            <Badge variant="outline" className="font-mono">
                              v{release.version}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm font-arabic mt-1">
                          تطبيق مع الله - أندرويد
                        </p>
                      </div>
                    </div>

                    {/* زر التحديث */}
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="self-start sm:self-auto text-muted-foreground hover:text-gold p-2 rounded-lg transition-colors duration-200"
                      aria-label="تحديث معلومات الإصدار"
                    >
                      <RefreshCw
                        className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                    </button>
                  </div>

                  {/* معلومات الإصدار */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <Clock className="w-5 h-5 text-gold mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground font-arabic mb-1">
                        تاريخ النشر
                      </p>
                      <p className="text-sm font-medium text-foreground font-arabic">
                        {release.publishDate
                          ? formatDate(release.publishDate)
                          : "—"}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <Download className="w-5 h-5 text-gold mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground font-arabic mb-1">
                        عدد التحميلات
                      </p>
                      <p className="text-sm font-medium text-foreground font-arabic">
                        {formatDownloadCount(release.downloadCount)}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                      <HardDrive className="w-5 h-5 text-gold mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground font-arabic mb-1">
                        المنصة
                      </p>
                      <p className="text-sm font-medium text-foreground font-arabic">
                        أندرويد (APK)
                      </p>
                    </div>
                  </div>

                  {/* أزرار التحميل */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    {release.downloadUrl && (
                      <Button
                        asChild
                        size="lg"
                        className="flex-1 bg-gold hover:bg-gold-dark text-navy font-bold text-lg rounded-xl h-14 gold-glow gold-glow-hover transition-all duration-300 font-arabic"
                      >
                        <a
                          href={release.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-5 h-5 ml-2" />
                          تحميل APK
                        </a>
                      </Button>
                    )}

                    {release.releaseUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="flex-1 border-border hover:border-gold/40 rounded-xl h-14 transition-all duration-300 font-arabic"
                          style={{
                            color: '#D4A843',
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(229, 224, 213, 0.5)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#E8C975';
                            e.currentTarget.style.borderColor = 'rgba(212, 168, 67, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#D4A843';
                            e.currentTarget.style.borderColor = 'rgba(229, 224, 213, 0.5)';
                          }}
                      >
                        <a
                          href={release.releaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-5 h-5 ml-2" />
                          صفحة الإصدار على GitHub
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* ملاحظات الإصدار */}
                  {release.releaseNotes && (
                    <div className="border-t border-border pt-6">
                      <h4 className="text-foreground font-bold mb-4 font-arabic flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-gold" />
                        ملاحظات الإصدار
                      </h4>
                      <div className="bg-secondary/30 rounded-xl p-5 max-h-64 overflow-y-auto custom-scrollbar">
                        <div className="prose prose-sm dark:prose-invert max-w-none font-arabic text-foreground/80 text-sm leading-loose">
                          <ReactMarkdown>{release.releaseNotes}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* رسالة التنبيه */}
                  {release.isNewer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-emerald-700 dark:text-emerald-400 font-bold font-arabic text-sm">
                            إصدار جديد متوفر!
                          </p>
                          <p className="text-emerald-600/80 dark:text-emerald-400/80 font-arabic text-sm mt-1">
                            الإصدار {release.version} متاح الآن للتحميل. حمّل أحدث
                            الإصدار للاستفادة من الميزات الجديدة.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!release.success && (
                    <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <ExternalLink className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-700 dark:text-amber-400 font-bold font-arabic text-sm">
                            ملاحظة
                          </p>
                          <p className="text-amber-600/80 dark:text-amber-400/80 font-arabic text-sm mt-1">
                            تأكد من تعيين متغير NEXT_PUBLIC_GITHUB_REPO في ملف
                            .env.local لتفعيل جلب معلومات الإصدارات تلقائياً.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        {/* تعليمات التثبيت */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-6 sm:p-8">
              <h4 className="text-foreground font-bold mb-4 font-arabic flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                كيفية التثبيت
              </h4>
              <ol className="space-y-3 font-arabic text-muted-foreground text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ١
                  </span>
                  <span>
                    حمّل ملف APK من الرابط أعلاه أو من صفحة GitHub Releases
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ٢
                  </span>
                  <span>
                    افتح ملف APK على هاتفك الأندرويد واسمح بالتثبيت من مصادر
                    خارجية
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ٣
                  </span>
                  <span>
                    بعد التثبيت، افتح التطبيق وابدأ رحلتك الروحية مع الله
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
