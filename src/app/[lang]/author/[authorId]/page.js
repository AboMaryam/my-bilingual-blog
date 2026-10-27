import { getDictionary, locales } from "@/lib/dictionaries";
import { getAuthorById, getAllAuthors } from "@/lib/authors";
import { getPostsByAuthor } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import { FileText } from "lucide-react";

export async function generateStaticParams() {
  const paramsList = [];
  for (const lang of locales) {
    const authorsList = getAllAuthors(lang);
    for (const author of authorsList) {
      paramsList.push({ lang, authorId: author.id });
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }) {
  const { lang, authorId } = await params;
  const author = getAuthorById(authorId, lang);
  return {
    title: author.name,
    description: author.bio,
  };
}

export default async function AuthorProfilePage({ params }) {
  const { lang, authorId } = await params;
  const dict = getDictionary(lang);
  const author = getAuthorById(authorId, lang);
  const authorPosts = getPostsByAuthor(lang, author.id);
  const isRtl = lang === "ar";

  return (
    <div className="py-10 space-y-12">
      {/* بطاقة التعريف الرئيسية بالكاتب */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-start shadow-xs">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-blue-600/15"
        />

        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>
              {authorPosts.length}{" "}
              {isRtl ? "مقالات منشورة" : "Published Articles"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {author.name}
          </h1>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {author.role}
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            {author.bio}
          </p>
        </div>
      </section>

      {/* مقالات الكاتب */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isRtl
            ? `جميع مقالات ${author.name}`
            : `All Articles by ${author.name}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorPosts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} dict={dict} />
          ))}
        </div>
      </section>
    </div>
  );
}