"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ lang }) {
  const pathname = usePathname();
  const targetLang = lang === "ar" ? "en" : "ar";

  // استبدال كود اللغة الحالي في الرابط بكود اللغة الأخرى
  const getTargetUrl = () => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split("/");
    segments[1] = targetLang;
    return segments.join("/");
  };

  return (
    <Link
      href={getTargetUrl()}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <span>{lang === "ar" ? "EN" : "العربية"}</span>
    </Link>
  );
}