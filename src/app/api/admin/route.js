import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { readAuthorsMap } from "@/lib/authors";

const contentRoot = path.join(process.cwd(), "content", "posts");
const authorsFilePath = path.join(process.cwd(), "content", "authors.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads");

function readRawPostsForLang(lang) {
  const dir = path.join(contentRoot, lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, fileName), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        lang,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split("T")[0],
        category: data.category || "General",
        excerpt: data.excerpt || "",
        featured: Boolean(data.featured),
        coverImage: data.coverImage || "",
        authorId: data.authorId || "ahmed",
        content: content.trim(),
      };
    });
}

export async function GET() {
  const arPosts = readRawPostsForLang("ar");
  const enPosts = readRawPostsForLang("en");
  const authors = readAuthorsMap();

  return NextResponse.json({
    arPosts,
    enPosts,
    authors,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // 1. رفع صورة من جهاز المستخدم إلى مجلد public/uploads
    if (action === "uploadImage") {
      const { fileName, base64Data } = body;
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync(
        path.join(uploadsDir, safeName),
        Buffer.from(base64Clean, "base64")
      );

      return NextResponse.json({ url: `/uploads/${safeName}` });
    }

    // 2. إنشاء أو تعديل مقال (عربي و/أو إنجليزي)
    if (action === "savePost") {
      const { slug, date, category, featured, coverImage, authorId, ar, en } = body;
      const cleanSlug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-");

      const saveLangFile = (langCode, postData) => {
        if (!postData || !postData.title) return;
        const langDir = path.join(contentRoot, langCode);
        if (!fs.existsSync(langDir)) {
          fs.mkdirSync(langDir, { recursive: true });
        }

        const frontmatter = {
          title: postData.title,
          date: date || new Date().toISOString().split("T")[0],
          category: category || "General",
          excerpt: postData.excerpt || "",
          featured: Boolean(featured),
          coverImage:
            coverImage ||
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
          authorId: authorId || "ahmed",
          
        };

        const fileString = matter.stringify(postData.content || "", frontmatter);
        fs.writeFileSync(
          path.join(langDir, `${cleanSlug}.mdx`),
          fileString,
          "utf8"
        );
      };

      saveLangFile("ar", ar);
      saveLangFile("en", en);

      return NextResponse.json({ success: true, slug: cleanSlug });
    }

    // 3. حذف مقال
    if (action === "deletePost") {
      const { slug } = body;
      ["ar", "en"].forEach((langCode) => {
        const mdxFile = path.join(contentRoot, langCode, `${slug}.mdx`);
        const mdFile = path.join(contentRoot, langCode, `${slug}.md`);
        if (fs.existsSync(mdxFile)) fs.unlinkSync(mdxFile);
        if (fs.existsSync(mdFile)) fs.unlinkSync(mdFile);
      });
      return NextResponse.json({ success: true });
    }

    // 4. إضافة أو تعديل كاتب في content/authors.json
    if (action === "saveAuthor") {
      const { author } = body;
      const currentAuthors = readAuthorsMap();
      const id = author.id
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "");

      currentAuthors[id] = {
        id,
        avatar: author.avatar,
        ar: {
          name: author.arName,
          role: author.arRole,
          bio: author.arBio,
        },
        en: {
          name: author.enName,
          role: author.enRole,
          bio: author.enBio,
        },
      };

      const contentDir = path.join(process.cwd(), "content");
      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
      }
      fs.writeFileSync(
        authorsFilePath,
        JSON.stringify(currentAuthors, null, 2),
        "utf8"
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}