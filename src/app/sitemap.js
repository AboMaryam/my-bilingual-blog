import { locales } from "@/lib/dictionaries";
import { getAllPosts } from "@/lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap() {
  const staticRoutes = [];
  const postRoutes = [];

  for (const lang of locales) {
    // الصفحات الثابتة لكل لغة
    ["", "/blog", "/about"].forEach((route) => {
      staticRoutes.push({
        url: `${BASE_URL}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });

    // جميع المقالات المنشورة لكل لغة
    const posts = getAllPosts(lang);
    posts.forEach((post) => {
      postRoutes.push({
        url: `${BASE_URL}/${lang}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    });
  }

  return [...staticRoutes, ...postRoutes];
}