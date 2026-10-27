"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import PostCard from "./PostCard";

export default function BlogFilter({ posts, categories, lang, dict }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "ALL" || post.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.nav.searchPlaceholder}
            className="w-full ps-11 pe-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {dict.blog.allCategories}
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} lang={lang} dict={dict} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {dict.blog.noPosts}
          </p>
        </div>
      )}
    </div>
  );
}