"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareButtons({ title, lang }) {
  const [copied, setCopied] = useState(false);
  const isRtl = lang === "ar";

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>{isRtl ? "شارك هذا المقال:" : "Share this article:"}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isRtl ? "تم نسخ الرابط!" : "Link Copied!"}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{isRtl ? "نسخ الرابط" : "Copy Link"}</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareX}
          className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          {isRtl ? "مشاركة على X" : "Share on X"}
        </button>
      </div>
    </div>
  );
}