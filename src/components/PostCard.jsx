import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

export default function PostCard({ post, lang, dict }) {
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const formattedDate = new Date(post.date).toLocaleDateString(
    isRtl ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-500/40 transition-all duration-300">
      <div>
        {/* صورة غلاف المقال */}
        <Link
          href={`/${lang}/blog/${post.slug}`}
          className="block relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
        >
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 start-3 px-3 py-1 rounded-full bg-blue-600/95 text-white text-xs font-semibold shadow-sm">
            {post.category}
          </span>
        </Link>

        <div className="p-6 pb-4">
          {/* التاريخ + وقت القراءة */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingMinutes} {dict.blog.readingTime}
            </span>
          </div>

          {/* عنوان المقال */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-2.5 line-clamp-2">
            <Link href={`/${lang}/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          {/* الملخص */}
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* شريط الكاتب + رابط اقرأ المزيد */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link
          href={`/${lang}/author/${post.author.id}`}
          className="flex items-center gap-2.5 group/author"
        >
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
          <div className="text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200 group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition">
              {post.author.name}
            </p>
            <p className="text-slate-400 dark:text-slate-500 line-clamp-1">
              {post.author.role}
            </p>
          </div>
        </Link>

        <Link
          href={`/${lang}/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all"
        >
          <span>{dict.blog.readMore}</span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}