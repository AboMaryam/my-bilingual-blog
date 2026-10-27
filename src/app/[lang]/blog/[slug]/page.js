import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getDictionary, locales } from "@/lib/dictionaries";
import { getAllPosts, getPostBySlug, slugifyHeading } from "@/lib/posts";
import TableOfContents from "@/components/TableOfContents";
import Comments from "@/components/Comments";
import { Calendar, Clock, User, ArrowRight, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const paramsList = [];

  for (const lang of locales) {
    const posts = getAllPosts(lang);
    for (const post of posts) {
      paramsList.push({ lang, slug: post.slug });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const post = getPostBySlug(lang, slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

const mdxComponents = {
  h2: ({ children }) => {
    const id = slugifyHeading(String(children));
    return (
      <h2 id={id} className="scroll-mt-24">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugifyHeading(String(children));
    return (
      <h3 id={id} className="scroll-mt-24">
        {children}
      </h3>
    );
  },
};

export default async function SinglePostPage({ params }) {
  const { lang, slug } = await params;
  const dict = getDictionary(lang);
  const post = getPostBySlug(lang, slug);

  if (!post) {
    notFound();
  }

  const isRtl = lang === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const authorObj =
    typeof post.author === "object" && post.author !== null
      ? post.author
      : {
          id: "ahmed",
          name: post.author || (isRtl ? "أحمد المنصور" : "Ahmed Al-Mansour"),
          role: isRtl ? "مهندس برمجيات وكاتب تقني" : "Senior Software Engineer",
          bio: isRtl
            ? "مطور Full-Stack شغوف ببناء تطبيقات الويب الحديثة باستخدام React و Next.js."
            : "Full-Stack developer passionate about modern web architecture with React and Next.js.",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        };

  const coverImage =
    post.coverImage ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80";

  const formattedDate = new Date(post.date).toLocaleDateString(
    isRtl ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="py-10">
      <Link
        href={`/${lang}/blog`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition"
      >
        <BackArrow className="w-4 h-4" />
        <span>{dict.nav.blog}</span>
      </Link>

      <header className="max-w-4xl space-y-5 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-semibold">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readingMinutes} {dict.blog.readingTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <Link
          href={`/${lang}/author/${authorObj.id}`}
          className="inline-flex items-center gap-3 pt-2 group"
        >
          <img
            src={authorObj.avatar}
            alt={authorObj.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-600/20"
          />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {authorObj.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {authorObj.role}
            </p>
          </div>
        </Link>
      </header>

      {/* صورة الغلاف الكبيرة */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-10 max-h-[440px] bg-slate-100 dark:bg-slate-900">
        <img
          src={coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <article className="lg:col-span-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-xs">
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-pre:bg-slate-950 prose-pre:text-slate-100">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* بطاقة تعريف الكاتب أسفل المقال */}
          <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
            <img
              src={authorObj.avatar}
              alt={authorObj.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-sm shrink-0"
            />
            <div className="flex-1 space-y-2">
              <Link
                href={`/${lang}/author/${authorObj.id}`}
                className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition block"
              >
                {authorObj.name}
              </Link>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {authorObj.role}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {authorObj.bio}
              </p>
            </div>
          </div>

          <Comments lang={lang} />
        </article>

        <div className="lg:col-span-4">
          <TableOfContents headings={post.headings} title={dict.blog.toc} />
        </div>
      </div>
    </div>
  );
}