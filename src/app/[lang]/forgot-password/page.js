"use client";

import { useState, use } from "react";
import Link from "next/link";
import { KeyRound, Mail, Lock, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage({ params }) {
  const { lang } = use(params);
  const isRtl = lang === "ar";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "resetPassword",
        email,
        newPassword,
      }),
    });

    if (!res.ok) {
      setError(
        isRtl
          ? "لم يتم العثور على حساب مرتبط بهذا البريد الإلكتروني"
          : "No account found with this email address"
      );
      return;
    }

    setDone(true);
  };

  return (
    <div className="py-16 max-w-md mx-auto">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center mx-auto">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold">
            {isRtl ? "استعادة كلمة المرور" : "Reset Password"}
          </h1>
          <p className="text-xs text-slate-500">
            {isRtl
              ? "أدخل بريدك الإلكتروني المسجّل لتعيين كلمة مرور جديدة"
              : "Enter your registered email to set a new password"}
          </p>
        </div>

        {done ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-emerald-600">
              {isRtl
                ? "تم استعادة وتغيير كلمة المرور بنجاح!"
                : "Your password has been reset successfully!"}
            </p>
            <Link
              href={`/${lang}/login`}
              className="inline-block w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold"
            >
              {isRtl ? "العودة لتسجيل الدخول" : "Back to Sign In"}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {error && (
              <p className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 p-3 rounded-xl text-center">
                {error}
              </p>
            )}

            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "البريد الإلكتروني المسجّل" : "Registered Email"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "كلمة المرور الجديدة" : "New Password"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer"
            >
              {isRtl ? "حفظ كلمة المرور الجديدة" : "Reset Password"}
            </button>

            <div className="text-center pt-2">
              <Link
                href={`/${lang}/login`}
                className="text-xs text-slate-500 hover:text-blue-600 font-bold"
              >
                {isRtl ? "العودة لصفحة الدخول" : "Back to Login"}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}