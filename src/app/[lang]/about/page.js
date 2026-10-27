import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { Code2, Globe2, Zap, ArrowLeft, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.nav.about,
    description: dict.siteDescription,
  };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const features = isRtl
    ? [
        {
          icon: Code2,
          title: "محتوى تقني عملي",
          desc: "شروحات معمّقة وأمثلة برمجية حقيقية قابلة للتطبيق المباشر في مشاريعك.",
        },
        {
          icon: Globe2,
          title: "ثنائية اللغة (عربي / إنجليزي)",
          desc: "إتاحة المعرفة البرمجية باللغتين العربية والإنجليزية مع إمكانية التبديل الفوري بينهما.",
        },
        {
          icon: Zap,
          title: "أداء فائق وتجربة قراءة مريحة",
          desc: "بناء حديث يعتمد على Next.js App Router مع دعم الوضع الليلي وجداول المحتويات التفاعلية.",
        },
      ]
    : [
        {
          icon: Code2,
          title: "Practical Tech Content",
          desc: "In-depth tutorials and real-world code examples ready to apply in your projects.",
        },
        {
          icon: Globe2,
          title: "Bilingual (Arabic & English)",
          desc: "Making software engineering knowledge accessible in both Arabic and English seamlessly.",
        },
        {
          icon: Zap,
          title: "Fast & Reader-Friendly",
          desc: "Built on Next.js App Router with dark mode and interactive tables of contents.",
        },
      ];

  return (
    <div className="py-12 max-w-4xl mx-auto space-y-12">
      <header className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          {dict.nav.about}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isRtl
            ? "منصة تقنية مخصصة لمشاركة المعرفة في تطوير الويب الحديث، هندسة البرمجيات، وأفضل الممارسات البرمجية."
            : "A technical platform dedicated to sharing knowledge in modern web development, software engineering, and clean coding practices."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <IconComponent className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {item.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          <span>{isRtl ? "تصفح جميع المقالات" : "Browse All Articles"}</span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}