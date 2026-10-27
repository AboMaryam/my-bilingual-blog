"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Lock, Mail, LogIn } from "lucide-react";

export default function LoginPage({ params }) {
  const { lang } = use(params);
  const isRtl = lang === "ar";
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // تسجيل الدخول بالبريد وكلمة المرور
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res || !res.ok) {
      setError(
        isRtl
          ? "بيانات الدخول غير صحيحة، تأكد من البريد وكلمة المرور"
          : "Invalid email or password"
      );
      return;
    }

    if (res.user.role === "member") {
      router.push(`/${lang}/blog`);
    } else {
      router.push(`/${lang}/admin`);
    }
  };

  // الدخول والتسجيل الفوري بواسطة Google أو Facebook
  const handleSocialLogin = async (provider) => {
    setError("");
    setLoading(true);

    const isGoogle = provider === "google";
    const socialEmail = isGoogle
      ? "google.user@gmail.com"
      : "fb.user@facebook.com";
    const socialName = isGoogle
      ? isRtl
        ? "مستخدم Google"
        : "Google User"
      : isRtl
      ? "مستخدم Facebook"
      : "Facebook User";

    try {
      // إنشاء الحساب تلقائياً في الخادم إذا كانت أول مرة يدخل فيها
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: socialName,
          email: socialEmail,
          password: "123",
        }),
      });

      // تسجيل الدخول بالحساب وتوجيهه
      const res = await login(socialEmail, "123");
      setLoading(false);

      if (res && res.ok) {
        if (res.user.role === "member") {
          router.push(`/${lang}/blog`);
        } else {
          router.push(`/${lang}/admin`);
        }
      }
    } catch {
      setLoading(false);
      setError(
        isRtl
          ? "تعذر الاتصال بمزود الخدمة حالياً"
          : "Social login failed, please try again"
      );
    }
  };

  const quickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("123");
    setError("");
  };

  return (
    <div className="py-12 max-w-md mx-auto">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xs">
        {/* عنوان الصفحة */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isRtl ? "تسجيل الدخول" : "Sign In"}
          </h1>
          <p className="text-xs text-slate-500">
            {isRtl
              ? "مرحباً بعودتك! ادخل بحسابك أو عبر شبكات التواصل"
              : "Welcome back! Sign in with your account or social network"}
          </p>
        </div>

        {/* أزرار الدخول والتسجيل بواسطة Google و Facebook */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        {/* فاصل نصي أنيق */}
        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="shrink mx-3 text-[11px] text-slate-400">
            {isRtl ? "أو عبر البريد الإلكتروني" : "or with email"}
          </span>
          <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* أزرار التعبئة السريعة للتجربة */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => quickFill("admin@blog.com")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-600 font-bold cursor-pointer"
          >
            {isRtl ? "مدير (Admin)" : "Admin"}
          </button>
          <button
            type="button"
            onClick={() => quickFill("sara@blog.com")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-600 font-bold cursor-pointer"
          >
            {isRtl ? "كاتب (Author)" : "Author"}
          </button>
          <button
            type="button"
            onClick={() => quickFill("member@blog.com")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-600 font-bold cursor-pointer"
          >
            {isRtl ? "عضو (Member)" : "Member"}
          </button>
        </div>

        {error && (
          <p className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 p-3 rounded-xl text-center">
            {error}
          </p>
        )}

        {/* نموذج البريد وكلمة المرور */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">
              {isRtl ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold">
                {isRtl ? "كلمة المرور" : "Password"}
              </label>
              <Link
                href={`/${lang}/forgot-password`}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {isRtl ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition cursor-pointer disabled:opacity-50"
          >
            {loading
              ? isRtl
                ? "جاري الدخول..."
                : "Signing in..."
              : isRtl
              ? "دخول الآن"
              : "Sign In"}
          </button>
        </form>

        {/* رابط ليس لديك حساب؟ سجل الآن */}
        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          {isRtl ? "ليس لديك حساب؟ " : "Don't have an account? "}
          <Link
            href={`/${lang}/register`}
            className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline"
          >
            {isRtl ? "سجّل الآن" : "Register now"}
          </Link>
        </p>
      </div>
    </div>
  );
}