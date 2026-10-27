import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getAuthorById } from "./authors";

const contentRoot = path.join(process.cwd(), "content", "posts");

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80";

export function slugifyHeading(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractHeadings(markdownContent) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdownContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({
      level,
      text,
      id: slugifyHeading(text),
    });
  }

  return headings;
}

export function getAllPosts(lang = "ar") {
  const langDir = path.join(contentRoot, lang);

  if (!fs.existsSync(langDir)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(langDir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, "");
    const fullPath = path.join(langDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);
    const authorId = data.authorId || "ahmed";

    return {
      slug,
      title: data.title || slug,
      date: data.date || "2026-01-01",
      category: data.category || "General",
      excerpt: data.excerpt || "",
      featured: Boolean(data.featured),
      coverImage: data.coverImage || DEFAULT_COVER,
      authorId,
      author: getAuthorById(authorId, lang),
      readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    };
  });

  return posts.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
}

export function getPostBySlug(lang = "ar", slug) {
  const mdxPath = path.join(contentRoot, lang, `${slug}.mdx`);
  const mdPath = path.join(contentRoot, lang, `${slug}.md`);

  const targetPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
    ? mdPath
    : null;

  if (!targetPath) return null;

  const fileContents = fs.readFileSync(targetPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);
  const authorId = data.authorId || "ahmed";

  return {
    slug,
    title: data.title || slug,
    date: data.date || "2026-01-01",
    category: data.category || "General",
    excerpt: data.excerpt || "",
    featured: Boolean(data.featured),
    coverImage: data.coverImage || DEFAULT_COVER,
    authorId,
    author: getAuthorById(authorId, lang),
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    headings: extractHeadings(content),
    content,
  };
}

export function getPostsByAuthor(lang = "ar", authorId) {
  return getAllPosts(lang).filter((post) => post.authorId === authorId);
}

export function getAllCategories(lang = "ar") {
  const posts = getAllPosts(lang);
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}