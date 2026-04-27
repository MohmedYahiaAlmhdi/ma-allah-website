# Ma Allah Flutter App — Worklog

---

## Task 4: Service Layer (storage_service, calculation_service, notification_service)

**Date**: 2025
**Files created**:
- `/lib/services/storage_service.dart`
- `/lib/services/calculation_service.dart`
- `/lib/services/notification_service.dart`

### storage_service.dart
- `StorageService extends GetxService` using GetStorage with box name `ma_allah`.
- CRUD methods: `saveDailyRecord()`, `getDailyRecord(date)`, `getAllDailyRecords()`, `getWeeklyRecords(weekStart)`, `getMonthlyRecords(month)`, `deleteDailyRecord(date)`, `clearAllData()`.
- Records stored with key format `record_2024-01-15`; `getAllDailyRecords()` returns sorted newest-first.
- Date formatting uses `yyyy-MM-dd`; corrupted records are silently skipped.
- `init()` method returns `Future<StorageService>` for GetX lazyPut compatibility.

### calculation_service.dart
- `CalculationService` with private constructor and static methods only (stateless, no side effects).
- `calculatePrayerScore(PrayerStatus, maxScore)`: jamaah=max, onTime=75%, late=50%, qada=0, missed=-max.
- `calculateSunnahScore(PrayerStatus, maxScore)`: delegates to same prayer logic.
- `calculateKhushooTotal(KhushooModel)`: sum of 4 positions, max 100.
- `calculateAdhkarTotal(AdhkarModel)`: sum of 5 prayer adhkar, max 100.
- `calculateQuranTotal(QuranModel)`: memorization + contemplation, max 100.
- `calculateIstiqamaScore(IstiqamaModel)`: 100 minus gaze/hearing deductions.
- `calculateHeartDiseasesScore(HeartDiseasesModel)`: 100 minus 25 per disease (4 diseases).
- `calculateTongueDiseasesScore(TongueDiseasesModel)`: 100 minus 25 per disease (4 diseases).
- `calculateParentsScore(ParentsModel)`: 50 per completed item (duaForParents, humility).
- `calculateNightPrayerScore(NightPrayerModel)`: rakahs × 10 (max 100).
- `calculateTahajjudScore(TahajjudModel)`: rakahs × 10 (max 100).
- `calculateDayTotal(DailyRecord)`: sum of all 11 category scores.
- `calculateDayPercentage(total)`: (total / 1000) × 100.
- `getDayStatus(total)`: returns Arabic status string from AppConstants based on percentage thresholds.

### notification_service.dart
- Singleton `NotificationService` using `FlutterLocalNotificationsPlugin`.
- `init()`: initializes plugin + creates 5 Android notification channels (prayers, adhkar, quran, shortfall, motivation).
- `schedulePrayerReminder(prayerName, time, {prayerIndex})`: daily repeating notification per Fard prayer; IDs 100–104.
- `scheduleSunnahReminder(prayerName, time, {prayerIndex})`: fires 15 min after Fard prayer; IDs 200–204.
- `scheduleAdhkarReminder(time)`: daily adhkar reminder; ID 300.
- `scheduleQuranReminder(time)`: daily Quran engagement reminder; ID 400.
- `showShortfallNotification(category, details)`: immediate shortfall alert; ID 500.
- `showMotivationalNotification()`: random Quranic message from `AppConstants.motivationalMessages`; ID 600.
- `cancelAllNotifications()` / `cancelNotification(id)`: cancellation methods.
- Time helpers: `_nextInstanceOfTime()` and `_addMinutes()` for scheduling math.

---

## Task 5: Controller Layer (14 controllers)

**Date**: 2025
**Files created** (13 new + 1 existing):
- `/lib/controllers/daily_controller.dart` (already existed from earlier work)
- `/lib/controllers/prayer_controller.dart`
- `/lib/controllers/sunnah_controller.dart`
- `/lib/controllers/khushoo_controller.dart`
- `/lib/controllers/adhkar_controller.dart`
- `/lib/controllers/quran_controller.dart`
- `/lib/controllers/istiqama_controller.dart`
- `/lib/controllers/heart_diseases_controller.dart`
- `/lib/controllers/tongue_diseases_controller.dart`
- `/lib/controllers/parents_controller.dart`
- `/lib/controllers/night_prayer_controller.dart`
- `/lib/controllers/tahajjud_controller.dart`
- `/lib/controllers/reports_controller.dart`
- `/lib/controllers/settings_controller.dart`

### Architecture & Patterns
- All controllers extend `GetxController` from GetX.
- Storage access via `Get.find<StorageService>()`.
- Reactive UI via `Rx`, `RxInt`, `RxDouble`, `RxBool`, `RxString`, `RxList` observables.
- Category controllers interact with `DailyController` (via `Get.find`) to update the central `DailyRecord` and trigger a combined save + score refresh.
- Models imported from `../models/`, services from `../services/`, constants from `../utils/constants.dart`.

### daily_controller.dart (pre-existing)
- Manages today's `DailyRecord` via `Rx<DailyRecord?> currentRecord`.
- `loadTodayRecord()`: loads from storage or creates default with all 11 sub-models.
- `refreshScore()`: recalculates totalScore/percentage/dayStatus via `CalculationService`.
- `updateRecord()`: sets new record, refreshes score, saves to storage.
- `saveRecord()` / `resetDay()` for persistence and reset.
- `_createDefaultRecord()`: builds fresh `DailyRecord` with 5 PrayerModels (Fajr 40, Dhuhr 10, Asr 10, Maghrib 10, Isha 30), 5 SunnahModels (20 each), and default sub-models for all other categories.

### prayer_controller.dart
- `RxList<PrayerModel> prayers` with 5 Fard prayers.
- `updatePrayerStatus(int index, PrayerStatus status)`: updates a prayer's status, recalculates total, persists to DailyRecord.
- `resetAllPrayers()`: resets all to `PrayerStatus.qada`.
- `getPrayerScore(index)` / `getPrayerBaseScore(index)`: score accessors.
- `reload()`: re-reads from DailyController after date change.

### sunnah_controller.dart
- `RxList<SunnahModel> sunnahs` with 5 Sunnah prayers (20 pts each).
- `updateSunnahStatus(int index, PrayerStatus status)`: same pattern as PrayerController.
- `resetAllSunnahs()`, `getSunnahScore(index)`, `reload()`.

### khushoo_controller.dart
- `Rx<KhushooModel> khushoo` + individual `Rx<KhushooLevel>` for standing/ruku/sujud/tashahhud.
- `updateStanding/updateRuku/updateSujud/updateTashahhud(KhushooLevel)`: sets level, rebuilds model, persists.
- `getPositionScore(position)`: returns per-position score (Standing 25, Ruku 20, Sujud 35, Tashahhud 20).
- `resetAll()`: all to `KhushooLevel.neglected`.

### adhkar_controller.dart
- `Rx<AdhkarModel> adhkar` + individual `RxInt` per prayer (fajr/dhuhr/asr/maghrib/isha, 0–20 each).
- `updateFajrAdhkar/updateDhuhrAdhkar/updateAsrAdhkar/updateMaghribAdhkar/updateIshaAdhkar(int)`: clamped to 0–20.
- `getAdhkarForPrayer(prayerName)`: accessor by name.
- `resetAll()`: all to 0.

### quran_controller.dart
- `Rx<QuranModel> quran` + `RxInt memorization` (0–50) + `RxInt contemplation` (0–50).
- `updateMemorization(int)` / `updateContemplation(int)`: clamped to respective max.
- `memorizationPercentage` / `contemplationPercentage`: computed 0–100%.
- `resetAll()`: both to 0.

### istiqama_controller.dart
- `Rx<IstiqamaModel> istiqama` + `RxBool` toggles: gazeIntentional, gazeAccidental, hearingIntentional, hearingAccidental.
- `toggle*()` / `set*(bool)`: toggle or set violation flags.
- Penalties: gaze intentional -50, gaze accidental -10, hearing intentional -50, hearing accidental -10. Score can go negative.
- `gazeDeduction` / `hearingDeduction`: computed getters.
- `resetAll()`: all false (clean state, score = 100).

### heart_diseases_controller.dart
- `Rx<HeartDiseasesModel> heartDiseases` + `RxBool` toggles: envy, pride, riyaa, grudge.
- `toggle*()` / `set*(bool)`: toggle or set each disease.
- Each disease = -25 penalty. 4 diseases max = -100 deduction.
- `diseaseCount`: number of committed diseases.
- `isClean`: true if no diseases committed.
- `resetAll()`: all false (clean heart, score = 100).

### tongue_diseases_controller.dart
- `Rx<TongueDiseasesModel> tongueDiseases` + `RxBool` toggles: backbiting, gossip, loudVoice, badSpeech.
- `toggle*()` / `set*(bool)`: toggle or set each disease.
- Each disease = -25 penalty. 4 diseases max = -100 deduction.
- `diseaseCount` / `isClean` / `resetAll()`: same pattern as heart diseases.

### parents_controller.dart
- `Rx<ParentsModel> parents` + `RxBool duaForParents` + `RxBool humility`.
- `toggleDuaForParents()` / `toggleHumility()` / `set*(bool)`.
- duaForParents = +50, humility = +50. Max = 100.
- `resetAll()`: both false.

### night_prayer_controller.dart
- `Rx<NightPrayerModel> nightPrayer` + `RxInt rakahs` (0–10).
- `setRakahs(int)`: clamped to 0–10.
- `incrementRakahs()` / `decrementRakahs()`: +1/-1 with bounds.
- 10 pts per rakah, max 100.
- `isComplete`: true if rakahs >= 10.
- `remainingRakahs`: computed getter.
- `resetAll()`: rakahs to 0.

### tahajjud_controller.dart
- `Rx<TahajjudModel> tahajjud` + `RxInt rakahs` (0–10).
- Identical pattern to NightPrayerController.
- `setRakahs(int)`, `incrementRakahs()`, `decrementRakahs()`, `isComplete`, `remainingRakahs`, `resetAll()`.

### reports_controller.dart
- Helper classes: `CategoryAverage` (name, arabicName, average, maxPossible, percentage) and `DaySummary` (date, dayName, totalScore, percentage, status, categoryScores map).
- `selectedWeekStart` / `selectedMonth`: Rx<DateTime> for navigation.
- `loadWeeklyReport()`: fetches weekly records via StorageService, builds DaySummary list, category averages, average score, and trend.
- `loadMonthlyReport()`: same for monthly window.
- `previousWeek()` / `nextWeek()` / `previousMonth()` / `nextMonth()`: navigation.
- `getWeeklyBestDay()` / `getWeeklyWorstDay()`: best/worst day retrieval.
- `weeklyPercentage` / `monthlyPercentage`: computed averages / 1000 × 100.
- `getTrendLabel(trend)`: Arabic labels for improving/declining/stable.
- `_calculateTrend(scores)`: compares first-half average vs second-half average with 20-point threshold.
- `_buildSummaries()` / `_buildCategoryAverages()`: private helpers for data transformation across all 11 categories.

### settings_controller.dart
- Uses a separate GetStorage box (`ma_allah_settings`) from daily records.
- **Notification toggles**: prayerNotifications, sunnahNotifications, adhkarNotifications, quranNotifications, shortfallNotifications, motivationalNotifications (all `RxBool`, default true). Individual setters + `enableAllNotifications()` / `disableAllNotifications()`.
- **Theme**: `themeMode` (`RxString`, 'light'/'dark'/'system', default 'system').
- **General**: `onboardingCompleted` (`RxBool`), `appLanguage` (`RxString`, 'ar'/'en', default 'ar').
- **Data status**: `totalRecordsCount` (`RxInt`), `isProcessing` (`RxBool`).
- **Export**: `exportData()` → JSON string with version, exportDate, totalRecords, records array.
- **Import**: `importData(jsonString)` → parses JSON, imports records (skipping existing dates), returns import count.
- **Clear**: `clearAllData()` (records + settings), `clearRecordsOnly()` (records only).
- All settings persisted via `_settingsBox.write()`.

---

## Task 6a: Shared Widget Layer (7 reusable widgets)

**Date**: 2025
**Files created**:
- `/lib/widgets/progress_ring.dart`
- `/lib/widgets/score_card.dart`
- `/lib/widgets/section_card.dart`
- `/lib/widgets/status_badge.dart`
- `/lib/widgets/prayer_status_selector.dart`
- `/lib/widgets/slider_input.dart`
- `/lib/widgets/counter_widget.dart`

### Design Principles
- All widgets import from `package:flutter/material.dart` and `package:google_fonts/google_fonts.dart`.
- Theme colors: primaryDark=#1A2332, primaryGold=#D4A843, primaryGreen=#2D6A4F.
- Google Fonts: Amiri for display text, Cairo for body text.
- RTL-compatible layout (Arabic-first design).
- Cards use rounded corners (16px) with subtle shadows (`Colors.black.withOpacity(0.04–0.2)`).
- Stateless where possible; stateful only when animation is needed (ProgressRing, CounterWidget, SliderInput).

### progress_ring.dart
- `ProgressRing` (StatefulWidget with SingleTickerProviderStateMixin).
- Parameters: `progress` (0.0–1.0), `label`, `score`, `totalScore`, `color`, `size` (default 140), `strokeWidth` (default 12), `animationDuration` (default 800ms).
- Uses `CustomPaint` with `_ProgressRingPainter` to draw gradient arc via `SweepGradient` (color → gold).
- Background track in warm beige (#E8E0D0), rounded stroke caps.
- Center shows animated percentage text (large Cairo font) and "score/totalScore" below.
- Label shown below the ring.
- `AnimatedBuilder` drives smooth transitions when progress changes.
- Inner subtle glow fill when progress > 30%.

### score_card.dart
- `ScoreCard` (StatelessWidget).
- Parameters: `title`, `subtitle`, `score`, `maxScore`, `icon`, `onTap`, `iconColor`.
- Header row: icon in colored container (12px radius), title/subtitle, score "85/100" + percentage.
- Color coding: green (#22C55E) ≥75%, yellow (#EAB308) ≥50%, red (#EF4444) <50%.
- Progress bar: 8px height, rounded, with `LinearProgressIndicator` and `AlwaysStoppedAnimation`.
- White card with 16px radius, subtle shadow.

### section_card.dart
- `SectionCard` (StatelessWidget).
- Parameters: `title`, `icon`, `onTap`, `color` (defaults gold), `trailing`.
- Dark gradient background (#1A2332 → #243447).
- Icon in accent-colored container (12px radius), title in white, trailing text optional.
- RTL arrow (`Icons.arrow_back_ios_new_rounded`) on left side for "View Details".
- 16px radius, box shadow.

### status_badge.dart
- `StatusBadge` (StatelessWidget).
- Parameters: `status`, `showDot` (default true), `padding`, `fontSize`.
- Maps Arabic status strings to colors: ممتاز→green, جيد→lime, متوسط→yellow, ضعيف→orange, يحتاج مراجعة→red, مهمل→red.
- Rounded pill (20px radius), colored dot indicator, subtle border.
- Compact design for inline use.

### prayer_status_selector.dart
- `PrayerStatusSelector` (StatelessWidget).
- Parameters: `currentStatus`, `onChanged`, `enabled`.
- 5 status options in `Wrap` layout: جماعة, حاضر ووقتها, تأخير, قضاء, لم يصلِّ.
- Each chip: icon + Arabic label, color-coded (green/dark-green/yellow/orange/red).
- Selected chip: gold (#D4A843) 2px border + filled background + gold shadow.
- Unselected: beige background with grey border.
- `AnimatedContainer` for smooth 250ms transitions.

### slider_input.dart
- `SliderInput` (StatefulWidget).
- Parameters: `label`, `value`, `maxValue`, `onChanged`, `color`, `enabled`.
- Header row: label + value badge in colored container.
- `Slider` with step=1 (via `divisions: maxValue`), 8px track height, custom thumb (10px radius).
- Styled with `SliderTheme`: colored active track, beige inactive track, colored overlay.
- Min/max/percentage labels below the slider.
- RTL compatible.

### counter_widget.dart
- `CounterWidget` (StatefulWidget with SingleTickerProviderStateMixin).
- Parameters: `value`, `minValue`, `maxValue`, `onChanged`, `label`, `enabled`, `color` (defaults gold).
- Center display: large value in dark container (#1A2332) with gold text + "ركعات" subtitle.
- +/- buttons: 52×52px, rounded (16px), accent-colored border, InkWell tap.
- Scale bounce animation (1.0→1.15, 150ms) on value change via `AnimatedBuilder`.
- Buttons auto-disable at min/max bounds.
- FittedBox for responsive value sizing.

---

## Task 6b: Home Screen (Dashboard)

**Date**: 2025
**File created**:
- `/lib/screens/home/home_screen.dart`

### home_screen.dart
- `HomeScreen` (StatefulWidget) — the main dashboard / landing screen of the app.
- **Architecture**: Uses `DailyController` (via `Get.find` or `Get.put` if not yet registered) for reactive score data. Wraps all score-dependent UI in `Obx()` widgets.
- **Layout**: `Scaffold` with `CustomScrollView` (slivers) for smooth scrolling and a persistent `bottomNavigationBar`.
- **Header** (`_buildHeader`):
  - Dark gradient background (#1A2332 → #243447) with rounded bottom corners (28px).
  - App title "ما الله" with mosque icon on the left, settings gear icon on the right.
  - "بسم الله الرحمن الرحيم" in gold (#D4A843) using `GoogleFonts.amiri` (26px).
  - Decorative divider with star ornament between gold lines.
  - Today's date in Arabic (via `Helpers.formatDateArabic`) in white with 0.75 opacity.
- **Score Section** (`_buildScoreSection`):
  - White card with 20px border radius and subtle shadow.
  - "نقاط اليوم" section title.
  - `ProgressRing` widget (size=180, strokeWidth=14, animationDuration=1200ms) showing progress out of 1000.
  - Color-coded ring: ≥90% deep green (#2D6A4F), ≥75% green (#22C55E), ≥50% yellow (#EAB308), ≥25% orange (#F97316), <25% red (#EF4444).
  - Large score display: "850 / 1000" in 24px Cairo bold.
  - `StatusBadge` widget showing Arabic status (ممتاز/جيد/متوسط/ضعيف/يحتاج مراجعة) with colored dot indicator.
- **Motivational Verse** (`_buildMotivationalVerse`):
  - Container with subtle green-to-gold gradient background and green border.
  - Quote icon on the left, random verse text on the right using `GoogleFonts.amiri`.
  - Verse randomly selected from `AppConstants.motivationalMessages` (14 verses/sayings).
- **Categories Grid** (`_buildCategoriesSection`):
  - "المحاسبة اليومية" header with "١١ فئة" counter.
  - 2-column `GridView.builder` with `childAspectRatio: 1.65/1`, 10px spacing.
  - 11 category cards defined as `_CategoryItem` constants (title, subtitle, icon, route, color):
    1. الصلوات الخمس → AppRoutes.prayers (mosque, #2D6A4F)
    2. السنن الرواتب → AppRoutes.sunnah (access_time, #1B7A5A)
    3. الخشوع في الصلاة → AppRoutes.khushoo (self_improvement, #6B4C9A)
    4. أذكار بعد الصلاة → AppRoutes.adhkar (record_voice_over, #B8860B)
    5. القرآن الكريم → AppRoutes.quran (menu_book, #1565C0)
    6. الاستقامة → AppRoutes.istiqama (verified_user, #00838F)
    7. أمراض القلوب → AppRoutes.heartDiseases (favorite, #C62828)
    8. أمراض اللسان → AppRoutes.tongueDiseases (chat_bubble_outline, #E65100)
    9. بر الوالدين → AppRoutes.parents (family_restroom, #6A1B9A)
    10. قيام الليل → AppRoutes.nightPrayer (nightlight, #1A237E)
    11. التهجد → AppRoutes.tahajjud (dark_mode, #283593)
  - Each card: icon in colored container, score badge (color-coded), title, subtitle, 5px progress bar.
  - Score retrieved from `DailyRecord` sub-score getters (prayerScore, sunnahScore, etc.).
  - Tap navigates via `Get.toNamed(category.route)`.
- **Bottom Navigation Bar** (`_buildBottomNavBar`):
  - White container with top rounded corners (20px) and subtle upward shadow.
  - 4 tabs: الرئيسية (home), التقارير (reports), السجل (daily log), الإعدادات (settings).
  - Active tab highlighted with gold (#D4A843) icon + label + subtle background.
  - Inactive tabs in grey (#9CA3AF).
  - Home tab refreshes record + picks new verse; other tabs navigate via `Get.toNamed`.
- **Helper Methods**:
  - `_pickMotivationalVerse()`: random selection from `AppConstants.motivationalMessages`.
  - `_getCategoryScore(int, DailyRecord?)`: maps category index (0–10) to DailyRecord sub-score getter.
  - `_getScoreColor(double)`: maps percentage to ring color (5-tier).
  - `_getCategoryProgressColor(double)`: maps fraction (0.0–1.0) to green/yellow/red.
- **Orientation**: Portrait-only enforced via `SystemChrome.setPreferredOrientations`.
- **Color Theme**: primaryDark=#1A2332, primaryGold=#D4A843, primaryGreen=#2D6A4F, bgLight=#F8F6F0.
- **Fonts**: `GoogleFonts.amiri` for display/Basmallah, `GoogleFonts.cairo` for body text.
- **Widgets Used**: `ProgressRing`, `StatusBadge` from `../../widgets/`.
- **Routes Used**: All 11 category routes + reports, settings, dailyLog from `AppRoutes`.

---

## Task 7a: Prayer-Related Screens (3 screens)

**Date**: 2025
**Files created**:
- `/lib/screens/prayers/prayer_screen.dart`
- `/lib/screens/prayers/sunnah_screen.dart`
- `/lib/screens/prayers/khushoo_screen.dart`

### Common Design Patterns (all 3 screens)
- All screens are `StatefulWidget` with dark-themed AppBar header (#1A2332 → #243447 gradient, 28px rounded bottom corners).
- Portrait-only orientation via `SystemChrome.setPreferredOrientations`.
- RTL back button (`Icons.arrow_forward_rounded`) on the right, title centered, category icon on the left.
- Decorative gold star divider between title and subtitle in the header.
- GoogleFonts.amiri for display/titles, GoogleFonts.cairo for body text.
- Light background `Color(0xFFF8F6F0)`, white cards with 16px border radius and subtle shadows.
- `CustomScrollView` with slivers for smooth scrolling.
- GetX controllers registered via `Get.put()` in `initState()`.
- Reactive UI via `Obx()` wrapping data-dependent widgets.
- Save button with gradient background and snackbar confirmation.
- Imports from `../../app/routes.dart`, `../../controllers/`, `../../widgets/`, `../../utils/constants.dart`.

### prayer_screen.dart
- Title: "الصلوات الخمس"
- Controller: `PrayerController` via `Get.put(PrayerController())`.
- **Total Score Header**: White card with circular percentage indicator, "المجموع" label, score "X/100", and color-coded status pill (ممتاز/جيد/متوسط/ضعيف/يحتاج مراجعة).
- **5 Prayer Cards** (index 0–4):
  - Prayer names in Arabic: الفجر, الظهر, العصر, المغرب, العشاء.
  - Max scores: 40, 10, 10, 10, 30 (from AppConstants).
  - Each card: colored icon container, prayer name, max score subtitle, calculated score badge (color-coded by status).
  - `PrayerStatusSelector` widget below each card header.
  - Status color mapping: jamaah→green, onTime→darkGreen, late→yellow, qada→orange, missed→red.
- **Status ↔ String Mapping**: Helper methods `_statusToArabic()` and `_arabicToStatus()` bridge `PrayerStatus` enum to the Arabic strings expected by `PrayerStatusSelector`.
- **Save Button**: Gradient (#1A2332 → #2D6A4F), shows success snackbar on tap.
- **Icons per prayer**: wb_twilight (Fajr), light_mode (Dhuhr), wb_sunny (Asr), nights_stay (Maghrib), dark_mode (Isha).
- **Colors per prayer**: deep indigo, orange, amber, red, dark blue.

### sunnah_screen.dart
- Title: "السنن الرواتب"
- Controller: `SunnahController` via `Get.put(SunnahController())`.
- **Design**: Identical layout and structure to `prayer_screen.dart` for visual consistency.
- **Total Score Header**: Same pattern — percentage circle, "المجموع" label, "X/100" score, status pill.
- **5 Sunnah Cards** (index 0–4):
  - Same Arabic prayer names as Fard.
  - Each card shows "سنة مؤكدة — الدرجة القصوى: 20" as subtitle.
  - All max scores are 20 (AppConstants.sunnahPerPrayer).
  - `PrayerStatusSelector` for status selection.
  - Same status color coding as prayer_screen.
- **Save Button**: Gradient (#1A2332 → #1B7A5A), green-themed snackbar.
- **Colors per prayer**: Green spectrum (1B7A5A, 00695C, 00796B, 2E7D32, 1B5E20).
- **Subtitle text**: "السنن الرواتب المحافظة عليها تعد من أعظم القربات".

### khushoo_screen.dart
- Title: "الخشوع في الصلاة"
- Controller: `KhushooController` via `Get.put(KhushooController())`.
- **Total Score Section**: White card with large score display (36px "X / 100"), `StatusBadge` widget showing khushoo level (ممتاز/جيد/متوسط/ضعيف/مهمل).
- **Level badge thresholds** (from KhushooModel): ≥90% → ممتاز, ≥70% → جيد, ≥50% → متوسط, ≥25% → ضعيف, <25% → مهمل.
- **Explanation Card**: Gradient background (purple-to-gold), info icon, hadith about khushoo importance: "إن العبد لينصرف من صلاته ولم يُكتب له منها إلا عُشرها...".
- **4 Position Slider Cards** (using `_PositionData` model):
  1. القيام والقراءة — "حضور القلب أثناء قراءة الفاتحة والسورة" — max 25 — purple accent (#6B4C9A)
  2. الركوع — "الخشوع والطمأنينة في الركوع" — max 20 — light purple (#7C5CBF)
  3. السجود — "أعلى درجات القرب من الله" — max 35 — dark purple (#5B3A8C)
  4. التشهد والطمأنينة — "الدعاء والطمأنينة في التشهد الأخير" — max 20 — light violet (#8B5EC9)
  - Each card: colored icon, position label, description text, max score badge, `SliderInput` widget.
- **Slider ↔ Level Mapping**: `_valueToLevel(int, int)` converts slider value to `KhushooLevel` using same thresholds as KhushooModel (≥90% excellent, ≥70% good, ≥50% fair, ≥25% weak, <25% neglected). `_onSliderChanged()` dispatches to appropriate controller method.
- **Save Button**: Gradient (#1A2332 → #6B4C9A), purple-themed snackbar.
- **Header Quranic verse**: "﴿ قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ ﴾" in gold Amiri font.
- **Widgets Used**: `SliderInput`, `StatusBadge` from `../../widgets/`.

---

## Task 7b: Adhkar & Quran Screens (2 screens)

**Date**: 2025
**Files created**:
- `/lib/screens/adhkar/adhkar_screen.dart`
- `/lib/screens/quran/quran_screen.dart`

### Common Design Patterns (both screens)
- Both screens are `StatefulWidget` with identical AppBar structure as Task 7a screens: dark gradient (#1A2332 → #243447), 28px rounded bottom corners, RTL back button, gold star divider, Quranic verse subtitle.
- Portrait-only orientation via `SystemChrome.setPreferredOrientations`.
- GoogleFonts.amiri for display/titles, GoogleFonts.cairo for body text.
- Light background `Color(0xFFF8F6F0)`, white cards with 16px border radius and subtle shadows.
- `CustomScrollView` with slivers for smooth scrolling.
- GetX controllers registered via `Get.put()` in `initState()`.
- Reactive UI via `Obx()` wrapping all data-dependent widgets.
- Total score section with color-coded large number, progress bar, and `StatusBadge`.
- Save button with gradient background and snackbar confirmation.
- Imports from `../../app/routes.dart`, `../../controllers/`, `../../widgets/`, `../../utils/constants.dart`, `../../utils/helpers.dart`.

### adhkar_screen.dart
- Title: "أذكار بعد الصلاة"
- Controller: `AdhkarController` via `Get.put(AdhkarController())`.
- **AppBar Subtitle**: "﴿ فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ ﴾" in gold Amiri font.
- **Hadith Header Card**: Gradient background (gold-toned), quote icon, hadith: "قال النبي ﷺ: مثل الذي يذكر ربه والذي لا يذكره مثل الحي والميت...".
- **Total Score Section**: "المجموع" label, large color-coded "X/100" display, progress bar, `StatusBadge` (ممتاز/جيد/متوسط/ضعيف/يحتاج مراجعة).
- **5 Prayer Adhkar Slider Cards** (using `_PrayerAdhkarData` model):
  1. أذكار الفجر — "أذكار الصباح والتسبيح والتحميد والتكبير بعد صلاة الفجر" — max 20 — #1E3A5F (deep navy)
  2. أذكار الظهر — "التسبيح والتحميد والتكبير والاستغفار بعد صلاة الظهر" — max 20 — #B8860B (dark goldenrod)
  3. أذكار العصر — "أذكار المساء والحوقلة والصلاة على النبي ﷺ بعد صلاة العصر" — max 20 — #D97706 (amber)
  4. أذكار المغرب — "أذكار المساء ومعوذتين وآية الكرسي وسورة الإخلاص بعد صلاة المغرب" — max 20 — #DC2626 (red)
  5. أذكار العشاء — "التسبيح والتهليل والصلاة على النبي ﷺ والتسبيحات قبل النوم" — max 20 — #1E3A5F (deep navy)
  - Each card: colored icon container, prayer name, description, max score badge, progress indicator (LinearProgressIndicator + "X/20" label), `SliderInput` widget, hadith/tip card below the slider.
  - Icons per prayer: wb_twilight (Fajr), light_mode (Dhuhr), wb_sunny (Asr), nights_stay (Maghrib), dark_mode (Isha).
- **Slider ↔ Controller Mapping**: `_getValueForKey()` reads from `AdhkarController` Rx observables (fajrAdhkar/dhuhrAdhkar/asrAdhkar/maghribAdhkar/ishaAdhkar). `_onSliderChanged()` dispatches to `updateFajrAdhkar()/updateDhuhrAdhkar()/updateAsrAdhkar()/updateMaghribAdhkar()/updateIshaAdhkar()`.
- **Save Button**: Gradient (#1A2332 → #B8860B), gold-themed snackbar: "تم حفظ تقييم الأذكار بنجاح ✅".
- **Widgets Used**: `SliderInput`, `StatusBadge` from `../../widgets/`.

### quran_screen.dart
- Title: "القرآن الكريم"
- Controller: `QuranController` via `Get.put(QuranController())`.
- **AppBar Subtitle**: "﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾" in gold Amiri font.
- **Quran Verse Header Card**: Gradient background (blue-to-gold), `auto_stories` icon, verse: "﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ... ﴾" with reference "سورة الإسراء — الآية ٩".
- **Total Score Section**: Same pattern — "المجموع", color-coded "X/100", progress bar, `StatusBadge`.
- **Tracking Info Card**: White card with `today` icon, "تتبع القراءة اليومية" title, today's suggested page number (computed via day-of-year mod 604), info about khatma pace (~1.65 pages/day for annual completion).
- **Memorization Slider Card** (blue #1565C0):
  - `psychology` icon, "حفظ صفحة" label, description: "عدد الصفحات المحفوظة أو المراجعة في اليوم".
  - Max 50 pages badge, progress bar, `SliderInput` widget.
  - Calls `_controller.updateMemorization(value)`.
- **Contemplation Slider Card** (green #2D6A4F):
  - `visibility` icon, "تدبر صفحة" label, description: "عدد الصفحات المدبّرة مع التفسير والمعاني".
  - Max 50 pages badge, progress bar, `SliderInput` widget.
  - Calls `_controller.updateContemplation(value)`.
- **Tips Section** ("نصائح للحفظ الفعّال"): White card with lightbulb icon header, 4 tip items:
  1. أوقات الحفظ المثالية — "بعد صلاة الفجر وقبل النوم — أفضل أوقات لحفظ القرآن" — #1565C0
  2. المراجعة المستمرة — "راجع ما حفظته يومياً لترسيخه في الذاكرة" — #2D6A4F
  3. فهم المعنى أولاً — "اقرأ تفسير الآيات قبل الحفظ لتسهيل الاستيعاب" — #D4A843
  4. الاستماع والتلاوة — "استمع إلى قراءة شيخ تحب وتابع معه لتقوية الحفظ" — #6B4C9A
- **Save Button**: Gradient (#1A2332 → #1565C0), blue-themed snackbar: "تم حفظ تقييم القرآن الكريم بنجاح ✅".
- **Helper**: `_getTodayPage()` computes a suggested daily page using day-of-year modulo 604 (total Quran pages).
- **Widgets Used**: `SliderInput`, `StatusBadge` from `../../widgets/`.

---

## Task 7c: Category Screens — Istiqama, Heart Diseases, Tongue Diseases, Parents, Night Prayer, Tahajjud (6 screens)

**Date**: 2025
**Files created**:
- `/lib/screens/istiqama/istiqama_screen.dart`
- `/lib/screens/heart_diseases/heart_diseases_screen.dart`
- `/lib/screens/tongue_diseases/tongue_diseases_screen.dart`
- `/lib/screens/parents/parents_screen.dart`
- `/lib/screens/night_prayer/night_prayer_screen.dart`
- `/lib/screens/tahajjud/tahajjud_screen.dart`

### Common Design Patterns (all 6 screens)
- All screens are `StatefulWidget` with identical AppBar structure: dark gradient (#1A2332 → #243447), 28px rounded bottom corners, RTL back button (`Icons.arrow_forward_rounded`), gold star divider, Quranic verse subtitle in Amiri font.
- Portrait-only orientation via `SystemChrome.setPreferredOrientations`.
- GoogleFonts.amiri for display/titles, GoogleFonts.cairo for body text.
- Light background `Color(0xFFF8F6F0)`, white cards with 16px border radius and subtle shadows.
- `CustomScrollView` with slivers for smooth scrolling.
- GetX controllers registered via `Get.put()` in `initState()`.
- Reactive UI via `Obx()` wrapping all data-dependent widgets.
- Total score section with color-coded large number (36px), progress bar, and `StatusBadge`.
- Custom animated toggle switches (52×28px, `AnimatedContainer` + `AnimatedAlign`) with colored active state and glow shadow.
- Save button with gradient background and snackbar confirmation.
- Imports from `../../app/routes.dart`, `../../controllers/`, `../../widgets/`, `../../utils/constants.dart`.

### istiqama_screen.dart
- Title: "الاستقامة"
- Controller: `IstiqamaController` via `Get.put(IstiqamaController())`.
- **AppBar Subtitle**: "﴿ إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا ﴾" in gold Amiri font.
- **Hadith Header Card**: Teal-themed gradient (#00838F), hadith about istiqama from the Prophet ﷺ.
- **Total Score Section**: "المجموع" label, "X/100" display (score can go negative), progress bar, `StatusBadge`.
- **Warning Section**: Conditionally shown red warning card with `Icons.warning_amber_rounded` when any violation toggle is active. Message: "تحذير: تم تسجيل مخالفات! حافظ على جوارحك عن المحرّم واستغفر الله."
- **4 Violation Toggle Cards** (using `_ViolationItem` model):
  1. غض البصر — عمدًا — -50 نقطة — red (#DC2626) toggle — `Icons.visibility_off_rounded`
  2. غض البصر — بالخطأ — -10 نقطة — orange (#F97316) toggle — `Icons.remove_red_eye_rounded`
  3. السماع — عمدًا — -50 نقطة — red (#DC2626) toggle — `Icons.hearing_disabled_rounded`
  4. السماع — بالخطأ — -10 نقطة — orange (#F97316) toggle — `Icons.hearing_rounded`
- Active state: colored background (8% opacity), colored border, colored icon, glow shadow.
- Toggle dispatch: `_controller.toggleGazeIntentional/toggleGazeAccidental/toggleHearingIntentional/toggleHearingAccidental()`.
- **Save Button**: Gradient (#1A2332 → #00838F), teal-themed snackbar.

### heart_diseases_screen.dart
- Title: "أمراض القلوب"
- Controller: `HeartDiseasesController` via `Get.put(HeartDiseasesController())`.
- **AppBar Subtitle**: "﴿ يَوْمَ لَا يَنْفَعُ مَالٌ وَلَا بَنُونَ ۝ إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ ﴾".
- **Hadith Header Card**: Red-themed gradient (#C62828), hadith about arrogance.
- **"سليم الصدر" Badge**: When `isClean` is true (score = 100), shows green badge with `Icons.verified_rounded` and "سليم الصدر" instead of regular `StatusBadge`.
- **4 Disease Toggle Cards** (all red #C62828):
  1. الحسد — "تمني زوال النعمة عن الآخرين" — -25 — `Icons.sentiment_very_dissatisfied_rounded`
  2. الكبر — "التعالي على الناس واحتقارهم" — -25 — `Icons.trending_up_rounded`
  3. الرياء — "إظهار العبادة للناس لا لله" — -25 — `Icons.theater_comedy_rounded`
  4. الحقد — "إضمار البغضاء والكراهية للمسلمين" — -25 — `Icons.gpp_bad_rounded`
- Active deduction badge: "-25 نقطة"; inactive: "0 نقطة".
- **Save Button**: Gradient (#1A2332 → #C62828), red-themed snackbar.

### tongue_diseases_screen.dart
- Title: "أمراض اللسان"
- Controller: `TongueDiseasesController` via `Get.put(TongueDiseasesController())`.
- **AppBar Subtitle**: "﴿ مَا يَلْفِظُ مِنْ قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ ﴾".
- **"سليم اللسان" Badge**: When `isClean` is true, green badge with "سليم اللسان".
- **4 Disease Toggle Cards** (all orange #E65100):
  1. الغيبة — "ذكرك أخاك بما يكره" — -25 — `Icons.chat_bubble_outline_rounded`
  2. النميمة — "نقل الكلام بين الناس للإفساد" — -25 — `Icons.record_voice_over_rounded`
  3. رفع الصوت — "الصوت العالي والفاحش" — -25 — `Icons.volume_up_rounded`
  4. الكلام السيئ — "الفحش والسب واللعن" — -25 — `Icons.do_not_disturb_on_rounded`
- **Save Button**: Gradient (#1A2332 → #E65100), orange-themed snackbar.

### parents_screen.dart
- Title: "بر الوالدين"
- Controller: `ParentsController` via `Get.put(ParentsController())`.
- **AppBar Subtitle**: "﴿ وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا ﴾".
- **Motivational Text Card**: Purple (#EDE9FE) with motivational message about honoring parents today.
- **2 Toggle Cards** (purple #6A1B9A theme, green #22C55E active toggle):
  1. الدعاء لهما — +50 نقطة — `Icons.front_hand_rounded`
  2. خفض جناح الذل لهما — +50 نقطة — `Icons.volunteer_activism_rounded`
- Active toggle uses green to indicate positive achievement.
- **Save Button**: Gradient (#1A2332 → #6A1B9A), purple-themed snackbar.

### night_prayer_screen.dart
- Title: "قيام الليل"
- Controller: `NightPrayerController` via `Get.put(NightPrayerController())`.
- **AppBar Subtitle**: "﴿ إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا ﴾".
- **Counter Section**: `CounterWidget` (0–10 rakahs, 10 pts each). Display: "X ركعة من 10". Color: #1A237E.
- **Info Cards** (3 cards):
  1. ركعتان من قيام الليل — #1A237E — `Icons.mosque_rounded`
  2. فضل الثلث الأخير — #283593 — `Icons.bedtime_rounded`
  3. الوتر سنة مؤكدة — #303F9F — `Icons.star_rounded`
- **Save Button**: Gradient (#1A2332 → #1A237E), indigo-themed snackbar.
- **Widgets Used**: `CounterWidget`, `StatusBadge` from `../../widgets/`.

### tahajjud_screen.dart
- Title: "التهجد"
- Controller: `TahajjudController` via `Get.put(TahajjudController())`.
- **AppBar Subtitle**: "﴿ وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا ﴾".
- **Counter Section**: Identical pattern to night_prayer_screen. Color: #283593.
- **Info Cards** (3 cards):
  1. وقت التهجد — #283593 — `Icons.schedule_rounded`
  2. المقام المحمود — #1A237E — `Icons.emoji_events_rounded`
  3. التهجد والقرآن — #303F9F — `Icons.auto_stories_rounded`
- **Save Button**: Gradient (#1A2332 → #283593), blue-themed snackbar.
- **Widgets Used**: `CounterWidget`, `StatusBadge` from `../../widgets/`.

---

## Task 8: Reports Screen

**Date**: 2025
**File created**:
- `/lib/screens/reports/reports_screen.dart`

### reports_screen.dart
- `ReportsScreen` (StatefulWidget with SingleTickerProviderStateMixin) — the comprehensive reports and analytics screen.
- **Architecture**: Uses `ReportsController` (via `Get.put`) for weekly/monthly data and `DailyController` (via `Get.find`) for daily data. Reactive UI via `Obx()`.
- **Layout**: `Scaffold` with `CustomScrollView` (slivers) for smooth scrolling. No bottom nav (accessed from home nav). `Directionality(textDirection: TextDirection.rtl)` wrapper.
- **Imports**: `fl_chart` for charts, `GetX` for state management, `GoogleFonts.cairo` for body text, `GoogleFonts.amiri` for display text, `AppRoutes` for navigation, `Helpers` for date formatting, `AppConstants` for score constants, `StatusBadge` from `../../widgets/`.
- **Design Theme**: Dark AppBar gradient (#1A2332 → #243447), 28px rounded bottom corners. RTL back button. Light background (#F8F6F0), white cards (16px radius), subtle shadows. Colors: green=#2D6A4F, gold=#D4A843, red=#EF4444, yellow=#EAB308.

### AppBar
- SliverAppBar with 150px expanded height, pinned, dark gradient with rounded bottom corners.
- Title: "التقارير والتحليلات" with bar_chart icon in gold.
- Decorative gold star divider between gold lines.
- Quranic verse subtitle: "﴿ وَاسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ ﴾" in gold Amiri font.
- RTL back button (`Icons.arrow_forward_rounded`).

### Date Range Selector
- White card below AppBar with calendar icon, showing date range text that changes per tab:
  - Daily: `Helpers.formatDateArabic(selectedDay)`
  - Weekly: Start–end date range via `Helpers.formatShortDateArabic()`
  - Monthly: `Helpers.getMonthName(selectedMonth)`
- Navigation arrows (forward/back) dispatch to: `_previousDay()/_nextDay()` for daily, `controller.previousWeek()/nextWeek()` for weekly, `controller.previousMonth()/nextMonth()` for monthly.

### Tab Bar
- Three tabs: يومي | أسبوعي | شهري in a white rounded container.
- Custom indicator: dark (#1A2332) rounded background with white label text.
- TabController with `SingleTickerProviderStateMixin`, 3 tabs.

### DAILY TAB
- Uses `DailyController` reactive data via `Obx()`.
- **Summary Cards** (3 in a row): "درجة اليوم" (gold), "أفضل يوم", "أضعف يوم" — each with icon, large score value, subtitle, and mini progress bar.
- **Horizontal Bar Chart** (`fl_chart BarChart`):
  - 11 `BarChartGroupData` bars (one per category), each with `BarChartRodData` and `BackgroundBarChartRodData`.
  - Y-axis: 0–100. Left titles show Arabic category names. Bottom titles show score values.
  - Color-coded by performance: green ≥75%, gold ≥50%, yellow ≥25%, red <25%.
  - 400px height in a white card.
- **Chart Legend**: Four-color legend (ممتاز, جيد, متوسط, ضعيف) in a white card.
- **Detailed Breakdown Cards**: Categories sorted by score (highest first). Each card: colored icon container, Arabic name, progress bar with `LinearProgressIndicator`, score/max label, `StatusBadge`.
- **Pie Chart** (`fl_chart PieChart`): 11 `PieChartSectionData` sections, one per category with category colors, 50px center radius. Side legend with category names.
- **Strongest/Weakest Sections**: Two bordered containers — green "أكثر بنود قوة" (top 3) and red "أكثر بنود ضعفًا" (bottom 3), each with icon, name, score badge.

### WEEKLY TAB
- Uses `ReportsController.weeklySummaries`, `weeklyCategoryAverages`, `weeklyAverageScore`, etc.
- **Summary Cards**: Average score, best day (name + score), worst day (name + score).
- **Line Chart** (`fl_chart LineChart`):
  - 7 `FlSpot` data points for Monday–Sunday.
  - Builds score map from `DaySummary` list against week start offset.
  - Day names on X-axis (Arabic), score values on Y-axis (0–1000).
  - Curved line with green color, gradient area fill below.
  - Color-coded dots: green ≥750, gold ≥500, red >0, grey for no data.
- **Weekly Average Card**: Dark gradient card showing average score (gold), trend label (تحسّن/تراجع/مستقر) with colored badge, `StatusBadge`.
- **Day Highlight Cards**: Best day (green theme) and worst day (red theme) with icon, day name, score badge.
- **Category Averages Ranking**: Sorted list of all 11 categories with rank number (gold/silver/bronze for top 3), icon, name, progress bar, score/max, percentage badge.
- **Pie Chart**: Same pattern as daily — category distribution via `PieChartSectionData` with category colors.
- **Strongest/Weakest Sections**: Same green/red bordered containers using `CategoryAverage` data with percentage badges.

### MONTHLY TAB
- Uses `ReportsController.monthlySummaries`, `monthlyCategoryAverages`, `monthlyAverageScore`, etc.
- **Summary Cards**: Same 3-card layout (average, best day, worst day).
- **Monthly Bar Chart** (`fl_chart BarChart`):
  - One bar per day of month using `BarChartGroupData` + `BarChartRodData`.
  - Score map from `DaySummary` list indexed by day number.
  - Dynamic bar width based on month length (6px for >20 days, 10px otherwise).
  - Color-coded by performance with background grid lines.
- **Monthly Stats Card**: Dark gradient card showing average score and total tracked days, with `StatusBadge`.
- **Calendar Heatmap**:
  - Dynamically generated calendar grid based on month's first weekday offset and total days.
  - Each day cell: 36px rounded square, color-coded green/yellow/red based on score percentage. White text on green cells.
  - Arabic weekday header row (إث, ثلا, أرب, خمي, جمع, سبت, أحد).
  - Legend: ممتاز (green), متوسط (yellow), ضعيف (red), لا بيانات (light grey).
- **Best Week Card**: Groups days into weeks (by 7-day periods), calculates average per week, displays best week number, average score, and day count. Green themed container with trophy icon.
- **Category Ranking**: Same sorted list widget as weekly tab.
- **Pie Chart**: Same category distribution pattern.
- **Strongest/Weakest Sections**: Same green/red bordered containers.

### Common Elements
- `_buildEmptyState()`: Shown when no data available. Gold icon, "لا توجد بيانات كافية بعد" message, descriptive subtitle, "البدء الآن" button navigating to home.
- `_buildSummaryCards()`: Reusable 3-card summary row with score, best/worst day.
- `_buildSectionTitle()`: Gold icon + Arabic title row.
- `_buildCategoryRanking()`: Sorted category list with rank, icon, progress bar, percentage.
- `_buildCategoryPieChart()`: Pie chart with category colors and side legend.
- `_buildCategoryStrongestWeakest()`: Green/red bordered sections for top/bottom 3.
- `_percentageToStatus()`: Maps percentage to Arabic status string (ممتاز/جيد/متوسط/ضعيف/يحتاج مراجعة).
- `_getScoreColor()`: Maps percentage to Color (green/gold/red).
- `_getBarColor()`: Maps score to Color (green/gold/yellow/red).

### Helper Classes
- `_CategoryInfo`: Category metadata (key, arabicName, icon, color, max).
- `_CategoryScore`: Category with its score for a specific day.
- `_ListFirstOrDefaultOrNull<T>`: Extension to find element or return null.

### fl_chart Usage
- `BarChart` with `BarChartGroupData`, `BarChartRodData`, `BackgroundBarChartRodData`.
- `LineChart` with `LineChartBarData`, `FlSpot`, `FlDotData`, `BarAreaData`.
- `PieChart` with `PieChartSectionData`, `PieTouchData`.
- `FlTitlesData`, `AxisTitles`, `SideTitles` for axis labels.
- `FlGridData`, `FlLine` for grid rendering.
- `FlDotCirclePainter` for custom dot styling.

---

## Task 9: Settings Screen & Daily Log Screen (2 screens)

**Date**: 2025
**Files created**:
- `/lib/screens/settings/settings_screen.dart`
- `/lib/screens/daily_log/daily_log_screen.dart`

### Common Design Patterns (both screens)
- Both screens are `StatefulWidget` with dark-themed SliverAppBar (#1A2332 → #243447 gradient, 28px rounded bottom corners).
- Portrait-only orientation via `SystemChrome.setPreferredOrientations`.
- RTL back button (`Icons.arrow_forward_rounded`), gold star divider.
- GoogleFonts.amiri for display text, GoogleFonts.cairo for body text.
- Light background (#F8F6F0), white cards with 16px border radius and subtle shadows.
- `CustomScrollView` with slivers for smooth scrolling.
- `Directionality(textDirection: TextDirection.rtl)` wrapper.
- Imports from `../../app/routes.dart`, `../../controllers/`, `../../widgets/`, `../../utils/constants.dart`.

### settings_screen.dart
- Title: "الإعدادات"
- Controller: `SettingsController` via `Get.put(SettingsController())`.
- **AppBar**: SliverAppBar (100px expanded height, pinned), settings icon in gold, gold star divider.
- **App Header Card** (`_buildAppHeader`):
  - Gradient logo container (#1A2332 → #2D6A4F) with mosque icon (42px).
  - App name "مع الله" in GoogleFonts.amiri (32px).
  - Subtitle "محاسبة النفس اليومية" in grey Cairo font.
  - Version badge "الإصدار 1.0.0" in gold.
- **Section Header Helper** (`_buildSectionHeader`):
  - Dark container (#1A2332, 12px radius) with colored icon, Arabic title.
  - Used by all 5 settings sections.
- **Section Card Helper** (`_buildSectionCard`):
  - White card (16px radius, subtle shadow) wrapping child widgets.
- **Toggle Switch Helper** (`_buildToggleRow`):
  - Custom animated toggle (52×28px, `AnimatedContainer` + `AnimatedAlign`) with colored active state and glow shadow.
  - Optional icon in colored container, title, subtitle, and reactive `Obx()` wrapper.
  - Accepts `RxBool`, `ValueChanged<bool>`, and optional `activeColor`.
- **Divider Widget** (`_Divider`): Reusable horizontal divider with grey (#E5E7EB) color.
- **أ. إعدادات الإشعارات** (`_buildNotificationSection`):
  - Section header with `Icons.notifications_rounded` (gold).
  - Master toggle: "تفعيل الإشعارات" — enables/disables all notifications via `enableAllNotifications()` / `disableAllNotifications()`.
  - 6 individual notification toggles wrapped in `Obx()`:
    1. تذكير الصلوات → `prayerNotificationsEnabled` (mosque icon, green #2D6A4F)
    2. تذكير السنن → `sunnahNotificationsEnabled` (access_time icon, #1B7A5A)
    3. تذكير الأذكار → `adhkarNotificationsEnabled` (record_voice_over icon, #B8860B)
    4. تذكير القرآن → `quranNotificationsEnabled` (menu_book icon, #1565C0)
    5. تنبيهات التقصير → `shortfallNotificationsEnabled` (warning_amber icon, #F97316)
    6. رسائل تحفيزية → `motivationalNotificationsEnabled` (auto_awesome icon, #6B4C9A)
- **ب. أوقات الصلوات** (`_buildPrayerTimesSection`):
  - Section header with `Icons.schedule_rounded` (green #2D6A4F).
  - 5 prayer time rows (الفجر, الظهر, العصر, المغرب, العشاء), each with:
    - Colored icon container, Arabic prayer name, time picker button.
    - `showTimePicker()` opening Flutter's native time picker themed with app colors (#1A2332 primary).
    - Per-prayer colors: deep navy (#1E3A5F), orange (#F97316), amber (#EAB308), red (#DC2626), dark blue (#1A237E).
    - Per-prayer icons: wb_twilight, light_mode, wb_sunny, nights_stay, dark_mode.
  - "حفظ أوقات الصلوات" button — full-width elevated button (dark #1A2332, 48px height, 12px radius) with save icon.
  - Controllers: 5 `TextEditingController` initialized from `AppConstants.defaultPrayerTimes`.
- **ج. المظهر** (`_buildAppearanceSection`):
  - Section header with `Icons.palette_rounded` (purple #6B4C9A).
  - "الوضع الداكن" toggle — uses `_controller.themeMode.map(mode => mode == 'dark')`.
  - "الرسوم المتحركة" toggle — local `RxBool animationsEnabled`.
- **د. البيانات** (`_buildDataSection`):
  - Section header with `Icons.storage_rounded` (blue #1565C0).
  - Wrapped in `Obx()` for reactive `totalRecordsCount`.
  - Records count display: "عدد الأيام المسجلة: X" in beige container.
  - 3 action buttons (`_buildActionButton` helper):
    1. تصدير البيانات → green (#2D6A4F) — calls `_exportData()` using `Share.share()` from `share_plus`.
    2. استيراد البيانات → blue (#1565C0) — calls `_importData()` using `FilePicker.platform.pickFiles()` from `file_picker`, reads bytes, calls `controller.importData(jsonString)`.
    3. مسح جميع البيانات → RED (#EF4444) — calls `_showClearConfirmation()` dialog.
  - **Clear Confirmation Dialog**: `Get.defaultDialog` with red title "تحذير!", warning message, cancel button (grey), confirm button (red "مسح الكل"). On confirm: calls `controller.clearAllData()`, shows red snackbar.
  - Export/import show colored snackbars (green for success, orange for no data/warnings, red for errors).
- **هـ. حول التطبيق** (`_buildAboutSection`):
  - Section header with `Icons.info_rounded` (teal #00838F).
  - Description card with gradient background (green-to-gold 6% opacity), mosque icon, app name "تطبيق مع الله", subtitle "محاسبة النفس اليومية".
  - Full description paragraph explaining the 11 tracking categories.
  - Quranic verse: "﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَا قَدَّمَتْ لِغَدٍ ﴾".
  - Version display: "الإصدار 1.0.0" in dark container.
- **Imports**: `dart:convert`, `share_plus`, `file_picker`, `AppRoutes`, `SettingsController`, `AppConstants`.

### daily_log_screen.dart
- Title: "السجل اليومي"
- Uses `StorageService` via `Get.find<StorageService>()` to load all daily records.
- **Data Loading**: `_loadRecords()` fetches all records, builds `_recordsMap` (date string → DailyRecord) and `_monthRecords` (filtered by focused month).
- **Color Coding** (`_getDayColor`):
  - ≥90% → Green (#166534) — ممتاز
  - ≥75% → Light green (#22C55E) — جيد
  - ≥50% → Yellow (#EAB308) — متوسط
  - ≥25% → Orange (#F97316) — ضعيف
  - <25% → Red (#EF4444) — يحتاج مراجعة
  - No data → Grey (#D1D5DB)
- **AppBar**: SliverAppBar (100px expanded height, pinned), history icon in gold, gold star divider.
- **Summary Stats** (`_buildSummaryStats`):
  - 3-column white card with vertical dividers.
  - إجمالي الأيام (total days count, blue #1565C0).
  - المتوسط (average score, color-coded by percentage, shows percentage below).
  - أفضل يوم (best day date in Arabic, gold #D4A843).
- **Month/Year Selector** (`_buildMonthSelector`):
  - White card with calendar icon, month name via `Helpers.getMonthName()`.
  - Forward/back navigation arrows (RTL: forward=previous month, back=next month).
  - Updates `_focusedDay`, calls `_filterMonthRecords()`.
- **Calendar View** (`_buildCalendar`):
  - `table_calendar` package (`TableCalendar`) with `CalendarFormat.month` default.
  - Arabic locale (`ar_SA`).
  - Available formats: شهر, أسبوعين, أسبوع.
  - Custom `CalendarBuilders`:
    - `dowBuilder`: Arabic 2-letter day names (إث, ثل, أر, خم, جم, سب, أح).
    - `defaultBuilder`: Rounded day cell (10px radius) with color-coded background from `_recordsMap` lookup. Shows score number below day number. Grey text for no-data days.
    - `todayBuilder`: Gold border (#D4A843), color-coded background, score label.
    - `selectedBuilder`: Dark fill (#1A2332), gold border, white day number, gold score label, subtle shadow.
  - `onDaySelected`: updates `_selectedDay`.
  - `onPageChanged`: updates `_focusedDay` and re-filters month records.
- **Calendar Legend** (`_buildCalendarLegend`):
  - White card with 6 legend items: ممتاز ≥90% (green), جيد ≥75% (light green), متوسط ≥50% (yellow), ضعيف ≥25% (orange), مراجعة <25% (red), لا بيانات (grey).
- **Filter Bar** (`_buildFilterBar`):
  - Shows record count: "سجلات الشهر (X)".
  - Date range filter button using `showDateRangePicker()` (Arabic locale, themed with app colors).
  - Clear filter button (red X icon) when filter is active.
  - On date range selection, re-filters `_monthRecords` by date range.
- **Records List** (`_buildRecordsList`):
  - Empty state: centered inbox icon, "لا توجد سجلات" message.
  - Section header: "تفاصيل السجلات" with count badge in gold.
  - Each record is a `_buildRecordCard`:
    - Main row (tappable): percentage circle (48px, color-coded), date in Arabic, status label with score, expand/collapse arrow.
    - Border color intensifies when expanded.
    - On tap: toggles `_expandedDates` set.
  - **Expanded Breakdown** (`_buildRecordBreakdown`):
    - Shows "تفاصيل الفئات" header.
    - 11 category score rows using `_CategoryInfo` and `_CategoryScore` helpers.
    - Each row: colored icon (28px), Arabic name, score/max label, `LinearProgressIndicator` (5px height, color-coded).
    - Category score retrieval via switch statement on `DailyRecord` sub-score getters.
- **Helper Classes**:
  - `_CategoryInfo`: key, arabicName, icon, color (11 entries matching home screen categories).
  - `_CategoryScore`: info + score.
  - `_VerticalDivider`: 1px wide, 48px tall, grey (#E5E7EB).
- **Imports**: `table_calendar`, `AppRoutes`, `StorageService`, `DailyRecord`, `AppConstants`, `Helpers`, `StatusBadge`.

---

## Task: Per-Prayer Khushoo with 4 Positions (Hybrid Architecture)

**Date**: 2026-04-25
**Files modified** (5 files):
- `/lib/utils/constants.dart`
- `/lib/models/khushoo_model.dart`
- `/lib/controllers/khushoo_controller.dart`
- `/lib/screens/prayers/khushoo_screen.dart`
- `/lib/services/calculation_service.dart`
- `/lib/models/daily_record.dart`

### Summary
Restructured the Khushoo system from a flat 4-position model to a hybrid per-prayer model where each of the 5 daily prayers has its own 4 prayer positions, while keeping the total at 100 points.

### Architecture
- **PrayerKhushooModel**: New sub-model for ONE prayer with 4 positions (Standing=5, Ruku=4, Sujud=7, Tashahhud=4 = 20 max)
- **KhushooModel**: Contains 5 PrayerKhushooModel instances (Fajr, Dhuhr, Asr, Maghrib, Isha) = 100 max
- **KhushooController**: Manages 5 prayer observables, with `updatePosition(prayerIndex, positionKey, level)` for granular updates
- **KhushooScreen**: Expandable prayer cards — tap to reveal 4 position sliders per prayer, with mini score bar overview

### constants.dart changes
- Added: `khushooStandingMax=5`, `khushooRukuMax=4`, `khushooSujudMax=7`, `khushooTashahhudMax=4`
- Kept: `khushooPerPrayer=20`, `totalKhushooScore=100`, `prayerNames` list

### khushoo_model.dart changes
- **KhushooLevel enum**: unchanged (excellent/good/fair/weak/neglected)
- **PrayerKhushooModel** (NEW): immutable model for one prayer's khushoo
  - Fields: standing, ruku, sujud, tashahhud (all KhushooLevel)
  - Static max constants: standingMax=5, rukuMax=4, sujudMax=7, tashahhudMax=4, totalMax=20
  - Score getters: standingScore, rukuScore, sujudScore, tashahhudScore, totalScore
  - Helpers: getLevelByKey(), getMaxByKey(), getScoreByKey(), withPosition()
  - Full fromJson/toJson/copyWith/equality
- **KhushooModel** (REWRITTEN):
  - Fields: date, fajr, dhuhr, asr, maghrib, isha (all PrayerKhushooModel)
  - Accessors: getPrayer(index), prayers list, getScoreByIndex(index)
  - Backward-compatible fromJson: handles old flat format, old simple-prayer format, and new nested format

### khushoo_controller.dart changes
- 5 Rx<PrayerKhushooModel> observables (fajrKhushoo, dhuhrKhushoo, etc.)
- `updatePosition(prayerIndex, positionKey, level)` — updates one position in one prayer
- `getPrayerKhushoo(index)`, `getPrayerScore(index)` — accessors
- `resetAll()` and `resetPrayer(index)` — reset methods
- Auto-persists to DailyRecord on every change

### khushoo_screen.dart changes
- 5 expandable prayer cards (tap to reveal 4 position sliders)
- Each card header shows: prayer icon, name, khushoo level label, score badge, expand arrow
- Expanded section shows:
  - Mini score bar: 4 colored bars showing each position's score/max
  - 4 position slider cards: icon, label, description, score/level badge, SliderInput
- Animation: AnimatedCrossFade for expand/collapse, AnimatedRotation for arrow
- Position colors: purple spectrum (#6B4C9A, #7C5CBF, #5B3A8C, #8B5EC9)
- Prayer colors: same as before (indigo, orange, amber, red, dark blue)

### calculation_service.dart changes
- Updated comment to reflect 5 prayers x 4 positions architecture

### daily_record.dart changes
- Updated breakdown comment for Khushoo category
---
Task ID: 1
Agent: Main Agent
Task: Fix all existing errors in the landing website

Work Log:
- Analyzed all components: navbar, hero, features, how-it-works, download, footer, layout, globals.css
- Built the project to identify compilation errors (none found, but runtime/theme issues detected)
- Fixed navbar: replaced hardcoded text-cream with text-foreground, bg-navy/95 with bg-card/95 for light mode compatibility
- Fixed features summary: replaced bg-navy text-cream with bg-card text-foreground
- Fixed footer: replaced letter "م" with actual app image (icon.png), fixed all hardcoded colors
- Fixed how-it-works step 3 icon: replaced text-navy with text-foreground
- Added metadataBase to layout.tsx for social image resolution
- Verified build passes with no warnings

Stage Summary:
- All theme-related bugs fixed (light/dark mode now works correctly)
- Footer now uses actual app image instead of placeholder letter
- Build passes successfully with 0 warnings
- Files modified: navbar.tsx, features-section.tsx, footer.tsx, how-it-works.tsx, layout.tsx
