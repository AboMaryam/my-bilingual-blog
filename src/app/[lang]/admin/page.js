"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ProfileManager from "@/components/ProfileManager";
import UsersRoleManager from "@/components/UsersRoleManager";
import SubscribersManager from "@/components/SubscribersManager";
import {
  LayoutDashboard,
  FilePlus2,
  UserCog,
  Users,
  ShieldCheck,
  Mail,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
  Tag,
} from "lucide-react";

export default function AdminDashboardPage({ params }) {
  const { lang } = use(params);
  const isRtl = lang === "ar";
  const { user, isAuthorized, canEditAllPosts, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState("posts");
  const [arPosts, setArPosts] = useState([]);
  const [enPosts, setEnPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [statusMsg, setStatusMsg] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const emptyPost = {
    slug: "",
    date: new Date().toISOString().split("T")[0],
    category: "Next.js",
    tagsText: "Next.js, React",
    featured: false,
    coverImage: "",
    authorId: user?.id || "ahmed",
    arTitle: "",
    arExcerpt: "",
    arContent: "",
    enTitle: "",
    enExcerpt: "",
    enContent: "",
  };

  const [postForm, setPostForm] = useState(emptyPost);

  // استخراج جميع التصنيفات والوسوم الموجودة لعرضها في القوائم المنسدلة والأزرار
  const existingCategories = useMemo(() => {
    const set = new Set(["Next.js", "JavaScript", "CSS", "AI"]);
    arPosts.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [arPosts]);

  const existingTags = useMemo(() => {
    const set = new Set(["React", "App Router", "SEO", "Clean Code", "Web"]);
    arPosts.forEach((p) => {
      if (Array.isArray(p.tags)) p.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [arPosts]);

 useEffect(() => {
  if (typeof window === "undefined") return;
  const tabParam = new URLSearchParams(window.location.search).get("tab");
  if (tabParam === "editor") {
    setPostForm({ ...emptyPost, authorId: user?.id || "ahmed" });
    setIsCustomCategory(false);
    setActiveTab("editor");
  } else if (tabParam === "profile") {
    setActiveTab("profile");
  } else if (tabParam === "posts") {
    setActiveTab("posts");
  }
  }, [user]);

  const loadData = async () => {
    const res = await fetch("/api/admin");
    const data = await res.json();
    setArPosts(data.arPosts || []);
    setEnPosts(data.enPosts || []);
    setAuthors(data.authors || {});
  };

  useEffect(() => {
    if (isAuthorized) loadData();
  }, [isAuthorized]);

  const notify = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  if (!isAuthorized) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-2xl font-extrabold">
          {isRtl ? "غير مصرح لك بالدخول" : "Access Denied"}
        </h1>
        <Link
          href={`/${lang}/login`}
          className="inline-block px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold"
        >
          {isRtl ? "تسجيل الدخول" : "Sign In"}
        </Link>
      </div>
    );
  }

  const visiblePosts =
    canEditAllPosts || isAdmin
      ? arPosts
      : arPosts.filter((post) => post.authorId === user?.id);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "uploadImage",
          fileName: file.name,
          base64Data: reader.result,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setPostForm((prev) => ({ ...prev, coverImage: data.url }));
        notify(isRtl ? "تم رفع صورة الغلاف!" : "Cover uploaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  // إضافة وسم سريع عند الضغط عليه
  const toggleTagInForm = (tag) => {
    const current = postForm.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setPostForm({ ...postForm, tagsText: updated.join(", ") });
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    const parsedTags = postForm.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "savePost",
        slug: postForm.slug,
        date: postForm.date,
        category: postForm.category,
        tags: parsedTags,
        featured: postForm.featured,
        coverImage: postForm.coverImage,
        authorId: isAdmin ? postForm.authorId : user.id,
        ar: {
          title: postForm.arTitle,
          excerpt: postForm.arExcerpt,
          content: postForm.arContent,
        },
        en: {
          title: postForm.enTitle,
          excerpt: postForm.enExcerpt,
          content: postForm.enContent,
        },
      }),
    });

    if (res.ok) {
      notify(isRtl ? "تم حفظ ونشر المقال!" : "Article published!");
      await loadData();
      setActiveTab("posts");
    }
  };

  const handleEditClick = (slug) => {
    const ar = arPosts.find((p) => p.slug === slug) || {};
    const en = enPosts.find((p) => p.slug === slug) || {};
    setIsCustomCategory(false);
    setPostForm({
      slug: ar.slug || slug,
      date: ar.date || "",
      category: ar.category || "Next.js",
      tagsText: Array.isArray(ar.tags) ? ar.tags.join(", ") : "",
      featured: Boolean(ar.featured),
      coverImage: ar.coverImage || "",
      authorId: ar.authorId || user.id,
      arTitle: ar.title || "",
      arExcerpt: ar.excerpt || "",
      arContent: ar.content || "",
      enTitle: en.title || "",
      enExcerpt: en.excerpt || "",
      enContent: en.content || "",
    });
    setActiveTab("editor");
  };

  const handleDeleteClick = async (slug) => {
    if (!window.confirm(isRtl ? "تأكيد حذف المقال؟" : "Delete this article?"))
      return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deletePost", slug }),
    });
    notify(isRtl ? "تم حذف المقال" : "Article deleted");
    loadData();
  };

  return (
    <div className="py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <span>
              {isRtl ? "لوحة الإدارة والتحرير" : "Editorial Dashboard"}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRtl
              ? `الحساب الحالي: ${user.arName} (${user.role})`
              : `Logged in as: ${user.enName} (${user.role})`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              activeTab === "posts"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isRtl ? "المقالات" : "Articles"}</span>
          </button>

          <button
            onClick={() => {
              setPostForm({ ...emptyPost, authorId: user.id });
              setIsCustomCategory(false);
              setActiveTab("editor");
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              activeTab === "editor"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>{isRtl ? "مقال جديد" : "New Post"}</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <UserCog className="w-3.5 h-3.5" />
            <span>{isRtl ? "تعديل البروفايل" : "My Profile"}</span>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "users"
                    ? "bg-amber-500 text-white"
                    : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isRtl ? "صلاحيات الأعضاء" : "Members & Roles"}</span>
              </button>

              <button
                onClick={() => setActiveTab("subscribers")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "subscribers"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isRtl ? "القائمة البريدية" : "Newsletter"}</span>
              </button>

              <button
                onClick={() => setActiveTab("authors")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTab === "authors"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isRtl ? "الكُتّاب" : "Authors"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {activeTab === "posts" && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm text-start">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs">
              <tr>
                <th className="p-4 text-start">{isRtl ? "العنوان" : "Title"}</th>
                <th className="p-4 text-start">{isRtl ? "الكاتب" : "Author"}</th>
                <th className="p-4 text-start">{isRtl ? "التصنيف" : "Category"}</th>
                <th className="p-4 text-end">{isRtl ? "تحكم" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {visiblePosts.map((post) => (
                <tr key={post.slug}>
                  <td className="p-4 font-bold">{post.title}</td>
                  <td className="p-4 text-xs text-slate-500">{post.authorId}</td>
                  <td className="p-4 text-xs">{post.category}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(post.slug)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-blue-600 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post.slug)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* محرر المقالات المطور: قائمة منسدلة للتصنيفات + إضافة تصنيف جديد + الوسوم */}
      {activeTab === "editor" && (
        <form
          onSubmit={handleSavePost}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "الرابط (Slug)" : "Slug"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. react-performance"
                value={postForm.slug}
                onChange={(e) =>
                  setPostForm({ ...postForm, slug: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>

            {/* القائمة المنسدلة للتصنيفات + خيار كتابة تصنيف جديد */}
            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "التصنيف (اختر أو أضف جديداً)" : "Category"}
              </label>
              {!isCustomCategory ? (
                <select
                  value={postForm.category}
                  onChange={(e) => {
                    if (e.target.value === "__NEW__") {
                      setIsCustomCategory(true);
                      setPostForm({ ...postForm, category: "" });
                    } else {
                      setPostForm({ ...postForm, category: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold"
                >
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__NEW__">
                    {isRtl ? "+ كتابة تصنيف جديد..." : "+ Add New Category..."}
                  </option>
                </select>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder={isRtl ? "اكتب التصنيف الجديد..." : "New category..."}
                    value={postForm.category}
                    onChange={(e) =>
                      setPostForm({ ...postForm, category: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(false);
                      setPostForm({
                        ...postForm,
                        category: existingCategories[0] || "Next.js",
                      });
                    }}
                    className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    {isRtl ? "القائمة" : "List"}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "صورة الغلاف" : "Cover Image"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={isRtl ? "رابط أو ارفع صورة" : "Cover URL"}
                  value={postForm.coverImage}
                  onChange={(e) =>
                    setPostForm({ ...postForm, coverImage: e.target.value })
                  }
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer flex items-center">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {isAdmin && (
              <div>
                <label className="block text-xs font-bold mb-1">
                  {isRtl ? "الكاتب" : "Author"}
                </label>
                <select
                  value={postForm.authorId}
                  onChange={(e) =>
                    setPostForm({ ...postForm, authorId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                >
                  {Object.values(authors).map((a) => (
                    <option key={a.id} value={a.id}>
                      {isRtl ? a.ar?.name : a.en?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* قسم الوسوم (Tags): كتابة وسوم أو النقر على الوسوم المقترحة */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {isRtl
                  ? "الوسوم (Tags) — افصل بينها بفاصلة أو اضغط على الوسوم الجاهزة أدناه:"
                  : "Tags — comma separated or click existing tags below:"}
              </span>
            </label>
            <input
              type="text"
              placeholder="React, Next.js, Performance..."
              value={postForm.tagsText}
              onChange={(e) =>
                setPostForm({ ...postForm, tagsText: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {existingTags.map((tag) => {
                const selected = postForm.tagsText
                  .split(",")
                  .map((t) => t.trim())
                  .includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTagInForm(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3" dir="rtl">
              <input
                type="text"
                required
                placeholder="عنوان المقال بالعربية"
                value={postForm.arTitle}
                onChange={(e) =>
                  setPostForm({ ...postForm, arTitle: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold"
              />
              <textarea
                rows={2}
                placeholder="ملخص المقال بالعربية"
                value={postForm.arExcerpt}
                onChange={(e) =>
                  setPostForm({ ...postForm, arExcerpt: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
              <textarea
                rows={10}
                required
                placeholder="محتوى المقال بالعربية (MDX)..."
                value={postForm.arContent}
                onChange={(e) =>
                  setPostForm({ ...postForm, arContent: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
              />
            </div>

            <div className="space-y-3" dir="ltr">
              <input
                type="text"
                required
                placeholder="English Title"
                value={postForm.enTitle}
                onChange={(e) =>
                  setPostForm({ ...postForm, enTitle: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold"
              />
              <textarea
                rows={2}
                placeholder="English Excerpt"
                value={postForm.enExcerpt}
                onChange={(e) =>
                  setPostForm({ ...postForm, enExcerpt: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
              <textarea
                rows={10}
                required
                placeholder="English Content (MDX)..."
                value={postForm.enContent}
                onChange={(e) =>
                  setPostForm({ ...postForm, enContent: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer"
          >
            {isRtl ? "حفظ ونشر المقال" : "Save & Publish"}
          </button>
        </form>
      )}

      {(activeTab === "profile" || activeTab === "authors") && (
        <ProfileManager
          user={user}
          isAdmin={isAdmin}
          authors={authors}
          mode={activeTab}
          isRtl={isRtl}
          onSaved={(msg) => {
            notify(msg);
            loadData();
          }}
        />
      )}

      {isAdmin && activeTab === "users" && (
        <UsersRoleManager
          isRtl={isRtl}
          currentAdminId={user.id}
          onUpdated={(msg) => {
            notify(msg);
            loadData();
          }}
        />
      )}

      {isAdmin && activeTab === "subscribers" && (
        <SubscribersManager isRtl={isRtl} onNotify={(msg) => notify(msg)} />
      )}
    </div>
  );
}