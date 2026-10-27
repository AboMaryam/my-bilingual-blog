import Link from "next/link";

export default function Footer({ lang, dict }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {dict.siteName}
          </span>{" "}
          — © {currentYear} {dict.footer.rights}.
        </div>

        <div className="flex items-center gap-6">
          <Link
            href={`/${lang}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {dict.nav.home}
          </Link>
          <Link
            href={`/${lang}/blog`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {dict.nav.blog}
          </Link>
          <Link
            href={`/${lang}/about`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {dict.nav.about}
          </Link>
        </div>
      </div>
    </footer>
  );
}