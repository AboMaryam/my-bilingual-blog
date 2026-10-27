import Link from "next/link";
import { UserCheck, ArrowLeft, ArrowRight } from "lucide-react";

export default function AuthorCard({ author, lang }) {
  if (!author) return null;
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
      <Link href={`/${lang}/author/${author.id}`} className="shrink-0">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-sm"
        />
      </Link>

      <div className="flex-1 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Link
              href={`/${lang}/author/${author.id}`}
              className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {author.name}
            </Link>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {author.role}
            </p>
          </div>

          <Link
            href={`/${lang}/author/${author.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{isRtl ? "ملف الكاتب ومقالاته" : "Author Profile & Posts"}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {author.bio}
        </p>
      </div>
    </div>
  );
}