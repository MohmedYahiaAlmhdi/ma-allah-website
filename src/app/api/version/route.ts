import { NextResponse } from "next/server";

// ============================================================
// API بسيط للتحقق من آخر نسخة — يستخدمه تطبيق Flutter
// ============================================================

// ❗ غيّر هذا الرقم مع كل تحديث ترفعه
const APP_INFO = {
  versionCode: 1,        // يُزاد مع كل تحديث (1, 2, 3, ...)
  versionName: "1.0.0",  // الظاهر للمستخدم
  downloadUrl: "",       // رابط تحميل APK (ضع رابط GitHub أو رفع مباشر)
  releaseNotes: "الإطلاق الأول لتطبيق مع الله\n- ١١ فئة محاسبة يومية\n- عداد عمرك بالثانية\n- جبر الكسر\n- الملاحظات والتقارير",
  forceUpdate: false,    // هل التحديث إجباري؟
};

// التخزين المؤقت
let cacheData: string | null = null;
let cacheTime = 0;
const CACHE_MS = 2 * 60 * 1000; // دقيقتان

export async function GET() {
  try {
    const now = Date.now();

    // التحقق من التخزين المؤقت
    if (cacheData && now - cacheTime < CACHE_MS) {
      return new NextResponse(cacheData, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=120",
        },
      });
    }

    // إذا لم يُحدد رابط تحميل، حاول جلبه من GitHub Releases
    let downloadUrl = APP_INFO.downloadUrl;
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;

    if (!downloadUrl && repo) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo}/releases/latest`,
          {
            headers: { Accept: "application/vnd.github.v3+json" },
            next: { revalidate: 300 },
          }
        );
        if (res.ok) {
          const release = await res.json();
          const apk = release.assets?.find(
            (a: { name: string }) => a.name.endsWith(".apk")
          );
          if (apk) downloadUrl = apk.browser_download_url;
          else if (release.html_url) downloadUrl = release.html_url;
        }
      } catch {
        // تجاهل الأخطاء واستخدم الرابط الافتراضي
      }
    }

    const response = {
      versionCode: APP_INFO.versionCode,
      versionName: APP_INFO.versionName,
      downloadUrl: downloadUrl,
      releaseNotes: APP_INFO.releaseNotes,
      forceUpdate: APP_INFO.forceUpdate,
    };

    cacheData = JSON.stringify(response);
    cacheTime = now;

    return new NextResponse(cacheData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=120",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب معلومات الإصدار" },
      { status: 500 }
    );
  }
}
