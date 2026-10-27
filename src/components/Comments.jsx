"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { MessageSquare, Send, Trash2, LogIn } from "lucide-react";

export default function Comments({ lang, slug }) {
  const params = useParams();
  const activeSlug = slug || params?.slug || "general";
  const isRtl = lang === "ar";
  const { user, isAdmin } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${activeSlug}`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments || []));
  }, [activeSlug]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add",
        slug: activeSlug,
        authorId: user.id,
        authorName: isRtl ? user.arName : user.enName,
        authorRole: user.role,
        text: text.trim(),
      }),
    });

    const data = await res.json();
    setComments(data.comments || []);
    setText("");
  };

  const handleDelete = async (commentId) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        slug: activeSlug,
        commentId,
      }),
    });
    const data = await res.json();
    setComments(data.comments || []);
  };

  const roleBadge = (role) => {
    if (role === "admin")
      return {
        label: isRtl ? "مدير" : "Admin",
        cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      };
    if (role === "author")
      return {
        label: isRtl ? "كاتب" : "Author",
        cls: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };
    return {
      label: isRtl ? "عضو" : "Member",
      cls: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    };
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>
            {isRtl ? "التعليقات" : "Comments"} ({comments.length})
          </span>
        </h3>
      </div>

      {/* نموذج كتابة تعليق للأعضاء المسجلين، أو دعوة لتسجيل الدخول للزوار */}
      {user ? (
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            rows={3}
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isRtl
                ? `شاركنا رأيك يا ${user.arName}...`
                : `Write a comment as ${user.enName}...`
            }
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isRtl ? "إرسال التعليق" : "Post Comment"}</span>
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isRtl
              ? "سجّل دخولك أو أنشئ حساباً جديداً للمشاركة في التعليقات."
              : "Sign in or create an account to join the discussion."}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/${lang}/login`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isRtl ? "دخول" : "Login"}</span>
            </Link>
            <Link
              href={`/${lang}/register`}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
            >
              {isRtl ? "حساب جديد" : "Register"}
            </Link>
          </div>
        </div>
      )}

      {/* قائمة التعليقات المنشورة */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            {isRtl
              ? "لا توجد تعليقات بعد. كن أول من يعلّق!"
              : "No comments yet. Be the first to comment!"}
          </p>
        ) : (
          comments.map((item) => {
            const badge = roleBadge(item.authorRole);
            const canDelete = isAdmin || user?.id === item.authorId;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{item.authorName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer"
                      title={isRtl ? "حذف التعليق" : "Delete"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}