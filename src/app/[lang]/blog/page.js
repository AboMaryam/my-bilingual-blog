import { getDictionary } from "@/lib/dictionaries";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import BlogFilter from "@/components/BlogFilter";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.nav.blog,
    description: dict.siteDescription,
  };
}

export default async function BlogArchivePage({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const posts = getAllPosts(lang);
  const categories = getAllCategories(lang);

  return (
    <div className="py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {dict.nav.blog}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {dict.siteDescription}
        </p>
      </header>

      <BlogFilter
        posts={posts}
        categories={categories}
        lang={lang}
        dict={dict}
      />
    </div>
  );
}