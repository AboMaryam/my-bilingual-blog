import Link from "next/link";
import { Clock, Calendar, ArrowLeft, ArrowRight, Layers } from "lucide-react";

export default function CategoryShowcase({
  category,
  posts,
  layoutIndex,
  lang,
  dict,
}) {
  if (!posts || posts.length === 0) return null;

  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // نحدد نوع التخطيط تلقائياً حسب ترتيب التصنيف (0: ثلاث أعمدة | 1: عمودي مقسوم | 2: أربع أعمدة)
  const layoutType = layoutIndex % 3;

  const badgeColors = [
    "from-blue-600 to-indigo-600",
    "from-emerald-600 to-teal-600",
    "from-amber-500 to-orange-600",
  ];
  const activeGradient = badgeColors[layoutType];

  return (
    <section className="space-y-6 pt-6">
      {/* رأس التصنيف المنفصل مع خط لوني مميز */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <span
            className={`p-2 rounded-xl bg-gradient-to-br ${activeGradient} text-white shadow-xs`}
          >
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {category}
            </h2>
            <p className="text-xs text-slate-500">
              {posts.length}{" "}
              {isRtl ? "مقالات في هذا القسم" : "articles in this section"}
            </p>
          </div>
        </div>

        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>{isRtl ? "عرض الكل" : "View All"}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* النمط الأول (0): شبكة من 3 أعمدة */}
      {layoutType === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="block h-44 overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </Link>
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingMinutes} {dict.blog.readingTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2">
                    <Link href={`/${lang}/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {post.author?.name || post.author}
                </span>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1"
                >
                  <span>{dict.blog.readMore}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* النمط الثاني (1): تخطيط عمودي مقسوم (مقال كبير + قائمة عمودية جانبية) */}
      {layoutType === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* البطاقة الرئيسية للتصنيف */}
          <article className="lg:col-span-7 group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between">
            <div>
              <Link
                href={`/${lang}/blog/${posts[0].slug}`}
                className="block h-64 overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={posts[0].coverImage}
                  alt={posts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </Link>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {posts[0].date} • {posts[0].readingMinutes}{" "}
                  {dict.blog.readingTime}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  <Link href={`/${lang}/blog/${posts[0].slug}`}>
                    {posts[0].title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {posts[0].excerpt}
                </p>
              </div>
            </div>
          </article>

          {/* العمود الجانبي الرأسي لبقية مقالات التصنيف */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {(posts.length > 1 ? posts.slice(1) : posts).map((post) => (
              <article
                key={post.slug}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 hover:border-blue-500/40 transition"
              >
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </Link>
                <div className="space-y-1.5 flex-1">
                  <span className="text-[11px] text-slate-400 block">
                    {post.date}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2">
                    <Link href={`/${lang}/blog/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {post.author?.name || post.author}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* النمط الثالث (2): شبكة رباعية الأعمدة (4 Columns) */}
      {layoutType === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="block h-36 overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </Link>
                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-amber-600 font-bold block">
                    {post.date}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2">
                    <Link href={`/${lang}/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-blue-600">
                <Link href={`/${lang}/blog/${post.slug}`}>
                  {dict.blog.readMore}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}