import { NextResponse } from "next/server";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  download_count: number;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
  draft: boolean;
  prerelease: boolean;
}

interface ReleaseResponse {
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

// الحصول على الإصدار الحالي من متغير البيئة أو استخدام قيمة افتراضية
const CURRENT_VERSION = process.env.NEXT_PUBLIC_CURRENT_VERSION || "1.0.0";

// مقارنة الإصدارات
function isNewerVersion(latest: string, current: string): boolean {
  const latestParts = latest.replace(/^v/, "").split(".").map(Number);
  const currentParts = current.replace(/^v/, "").split(".").map(Number);

  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const latestPart = latestParts[i] || 0;
    const currentPart = currentParts[i] || 0;
    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }
  return false;
}

// التخزين المؤقت المحلي
let cachedData: ReleaseResponse | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // ٥ دقائق

export async function GET(): Promise<NextResponse<ReleaseResponse>> {
  try {
    // التحقق من التخزين المؤقت
    const now = Date.now();
    if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
    if (!repo) {
      return NextResponse.json({
        success: false,
        version: "غير متوفر",
        name: "غير متوفر",
        downloadUrl: null,
        downloadCount: 0,
        releaseNotes: "لم يتم تكوين مستودع GitHub. يرجى تعيين NEXT_PUBLIC_GITHUB_REPO في ملف .env.local",
        publishDate: "",
        releaseUrl: "",
        isNewer: false,
      });
    }

    // جلب جميع الإصدارات (بما فيها التجريبية) واختيار الأحدث
    const response = await fetch(
      `https://api.github.com/repos/${repo}/releases?per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "ma-allah-website",
        },
        next: { revalidate: 300 }, // إعادة التحقق كل ٥ دقائق
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        version: CURRENT_VERSION,
        name: "مع الله",
        downloadUrl: null,
        downloadCount: 0,
        releaseNotes: "تعذر جلب معلومات الإصدار من GitHub",
        publishDate: "",
        releaseUrl: `https://github.com/${repo}`,
        isNewer: false,
      });
    }

    const releases: GitHubRelease[] = await response.json();

    // اختيار أحدث إصدار غير مسودة (يقبل التجريبي أيضاً)
    const release = releases.find((r) => !r.draft) || releases[0];

    // البحث عن ملف APK
    const apkAsset = release.assets.find(
      (asset) =>
        asset.name.endsWith(".apk") ||
        asset.name.endsWith(".aab") ||
        asset.name.includes("android")
    );

    // إذا لم يتم العثور على APK، استخدام أول ملف متاح
    const downloadAsset = apkAsset || release.assets[0] || null;

    const totalDownloads = release.assets.reduce(
      (sum, asset) => sum + asset.download_count,
      0
    );

    const data: ReleaseResponse = {
      success: true,
      version: release.tag_name,
      name: release.name || release.tag_name,
      downloadUrl: downloadAsset?.browser_download_url || release.html_url,
      downloadCount: totalDownloads,
      releaseNotes: release.body || "لا توجد ملاحظات إصدار متوفرة",
      publishDate: release.published_at,
      releaseUrl: release.html_url,
      isNewer: isNewerVersion(release.tag_name, CURRENT_VERSION),
    };

    // تحديث التخزين المؤقت
    cachedData = data;
    cacheTimestamp = now;

    return NextResponse.json(data);
  } catch (error) {
    console.error("خطأ في جلب معلومات الإصدار:", error);
    return NextResponse.json({
      success: false,
      version: CURRENT_VERSION,
      name: "مع الله",
      downloadUrl: null,
      downloadCount: 0,
      releaseNotes: "حدث خطأ أثناء جلب معلومات الإصدار",
      publishDate: "",
      releaseUrl: "",
      isNewer: false,
    });
  }
}
