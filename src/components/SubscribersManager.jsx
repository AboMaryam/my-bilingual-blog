"use client";

import { useState, useEffect } from "react";
import { Mail, Copy, Check, Trash2, Send, ExternalLink } from "lucide-react";

export default function SubscribersManager({ isRtl, onNotify }) {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [subject, setSubject] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    const [subRes, adminRes] = await Promise.all([
      fetch("/api/newsletter"),
      fetch("/api/admin"),
    ]);
    const subData = await subRes.json();
    const adminData = await adminRes.json();

    setSubscribers(subData.subscribers || []);
    setCampaigns(subData.campaigns || []);

    const loadedPosts = adminData.arPosts || [];
    setPosts(loadedPosts);
    if (loadedPosts.length > 0 && !selectedSlug) {
      setSelectedSlug(loadedPosts[0].slug);
      setSubject(loadedPosts[0].title);
      setExcerpt(loadedPosts[0].excerpt);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPost = (slug) => {
    setSelectedSlug(slug);
    const found = posts.find((p) => p.slug === slug);
    if (found) {
      setSubject(found.title);
      setExcerpt(found.excerpt);
    }
  };

  const handleSendArticleEmail = async (e) => {
    e.preventDefault();
    if (subscribers.length === 0) {
      onNotify(
        isRtl
          ? "لا يوجد مشتركون لإرسال المقال إليهم!"
          : "No subscribers to send to!"
      );
      return;
    }

    setSending(true);
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const postUrl = `${origin}/${isRtl ? "ar" : "en"}/blog/${selectedSlug}`;

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendCampaign",
        subject,
        excerpt,
        postUrl,
      }),
    });

    const data = await res.json();
    setSending(false);

    if (res.ok) {
      setCampaigns(data.campaigns || []);
      onNotify(
        data.sentViaApi
          ? isRtl
            ? "تم إرسال المقال لجميع المشتركين عبر البريد بنجاح!"
            : "Article emailed to all subscribers via Resend API!"
          : isRtl
          ? "تم تجهيز وتسجيل النشرة البريدية بنجاح!"
          : "Newsletter campaign recorded!"
      );
    }
  };

  // خيار إضافي: فتح برنامج البريد المباشر (Gmail/Outlook) بكل المشتركين والمقال جاهزاً
  const handleOpenMailClient = () => {
    if (typeof window === "undefined" || subscribers.length === 0) return;
    const bcc = subscribers.map((s) => s.email).join(",");
    const postUrl = `${window.location.origin}/${
      isRtl ? "ar" : "en"
    }/blog/${selectedSlug}`;
    const bodyText = `${excerpt}\n\n${
      isRtl ? "اقرأ المقال كاملاً على الرابط:" : "Read full article:"
    }\n${postUrl}`;

    window.location.href = `mailto:?bcc=${encodeURIComponent(
      bcc
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      bodyText
    )}`;
  };

  const handleCopyAll = async () => {
    const allEmails = subscribers.map((s) => s.email).join(", ");
    await navigator.clipboard.writeText(allEmails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (email) => {
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", email }),
    });
    loadData();
    onNotify(isRtl ? "تم حذف المشترك" : "Subscriber removed");
  };

  return (
    <div className="space-y-8">
      {/* 1. صندوق إرسال مقال للمشتركين في القائمة البريدية */}
      <form
        onSubmit={handleSendArticleEmail}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Send className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">
            {isRtl
              ? "إرسال مقال إلى مشتركي القائمة البريدية"
              : "Send Article to Newsletter Subscribers"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">
              {isRtl ? "اختر المقال المراد إرساله" : "Select Article"}
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => handleSelectPost(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold"
            >
              {posts.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              {isRtl ? "عنوان الرسالة البريدية (Subject)" : "Email Subject"}
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            {isRtl
              ? "ملخص المقال الذي سيظهر في البريد (مع رابط المقال تلقائياً)"
              : "Email Summary Preview"}
          </label>
          <textarea
            rows={3}
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>
              {sending
                ? isRtl
                  ? "جاري الإرسال..."
                  : "Sending..."
                : isRtl
                ? `إرسال المقال لـ (${subscribers.length}) مشتركين الآن`
                : `Send Article to (${subscribers.length}) Subscribers`}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenMailClient}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span>
              {isRtl
                ? "إرسال عبر تطبيق البريد المباشر (Mailto)"
                : "Open in Mail App"}
            </span>
          </button>
        </div>
      </form>

      {/* 2. جدول المشتركين الحاليين */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">
              {isRtl
                ? `قائمة المشتركين (${subscribers.length})`
                : `Subscribers List (${subscribers.length})`}
            </h3>
          </div>

          {subscribers.length > 0 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isRtl ? "تم النسخ!" : "Copied!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>
                    {isRtl ? "نسخ جميع الإيميلات" : "Copy All Emails"}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        <table className="w-full text-sm text-start">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs">
            <tr>
              <th className="p-4 text-start">
                {isRtl ? "البريد الإلكتروني" : "Email"}
              </th>
              <th className="p-4 text-start">
                {isRtl ? "تاريخ الاشتراك" : "Subscribed Date"}
              </th>
              <th className="p-4 text-end">{isRtl ? "حذف" : "Remove"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {subscribers.map((sub) => (
              <tr key={sub.email}>
                <td className="p-4 font-bold">{sub.email}</td>
                <td className="p-4 text-xs text-slate-500">{sub.date}</td>
                <td className="p-4 text-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(sub.email)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}