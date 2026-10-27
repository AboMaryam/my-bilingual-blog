import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import CategoryShowcase from "@/components/CategoryShowcase";
import { Sparkles, Clock, Calendar, Flame } from "lucide-react";

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const posts = getAllPosts(lang);
  const categories = getAllCategories(lang);
  const isRtl = lang === "ar";

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const sideHeroPosts = posts
    .filter((p) => p.slug !== featuredPost?.slug)
    .slice(0, 3);

  return (
    <div className="py-8 space-y-14">
      {/* 1. شريط الترحيب السريع وأزرار التصنيفات */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {dict.siteName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {dict.siteDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat}`}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:border-blue-600 hover:text-blue-600 transition"
            >
              #{cat}
            </a>
          ))}
        </div>
      </section>

      {/* 2. واجهة المجلة العلوية (المقال المميز الرئيسي + عمود أحدث المختارات) */}
      {featuredPost && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* المقال الرئيسي العريض */}
          <div className="lg:col-span-8 group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[380px] flex items-end">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative p-6 sm:p-10 text-white space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {dict.blog.featured}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs font-bold">
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3.5 h-3.5" />
                  {featuredPost.date}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                <Link
                  href={`/${lang}/blog/${featuredPost.slug}`}
                  className="hover:text-blue-300 transition"
                >
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-200 line-clamp-2">
                {featuredPost.excerpt}
              </p>
            </div>
          </div>

          {/* العمود الجانبي: أحدث المقالات السريعة */}
          <div className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>{dict.blog.latestPosts}</span>
            </div>

            <div className="space-y-4 flex-1">
              {(sideHeroPosts.length > 0 ? sideHeroPosts : posts).map((item) => (
                <div
                  key={item.slug}
                  className="group flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60 last:border-none"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2">
                      <Link href={`/${lang}/blog/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readingMinutes} {dict.blog.readingTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${lang}/blog`}
              className="block text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-bold transition"
            >
              {isRtl ? "تصفح الأرشيف الكامل" : "Explore Full Archive"}
            </Link>
          </div>
        </section>
      )}

      {/* 3. عرض كل تصنيف في قسم منفصل وبتخطيط أعمدة مختلف عن الآخر */}
      <div className="space-y-14">
        {categories.map((category, index) => {
          const categoryPosts = posts.filter((p) => p.category === category);
          return (
            <div key={category} id={`cat-${category}`} className="scroll-mt-20">
              <CategoryShowcase
                category={category}
                posts={categoryPosts}
                layoutIndex={index}
                lang={lang}
                dict={dict}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}