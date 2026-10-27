"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage({ params }) {
  const { lang } = use(params);
  const isRtl = lang === "ar";
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ name, email, password });

    if (!res.ok) {
      setError(
        isRtl
          ? "هذا البريد الإلكتروني مسجّل بالفعل!"
          : "This email is already registered!"
      );
      return;
    }

    router.push(`/${lang}/blog`);
  };

  return (
    <div className="py-14 max-w-md mx-auto">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold">
            {isRtl ? "إنشاء حساب عضو جديد" : "Create Member Account"}
          </h1>
          <p className="text-xs text-slate-500">
            {isRtl
              ? "سجّل الآن للمشاركة في التعليقات والتفاعل مع المقالات"
              : "Sign up to comment and interact with articles"}
          </p>
        </div>

        {error && (
          <p className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 p-3 rounded-xl text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">
              {isRtl ? "الاسم الكامل" : "Full Name"}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
          </div>

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
                className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              {isRtl ? "كلمة المرور" : "Password"}
            </label>
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
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition cursor-pointer"
          >
            {isRtl ? "إنشاء الحساب" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          {isRtl ? "لديك حساب بالفعل؟ " : "Already have an account? "}
          <Link
            href={`/${lang}/login`}
            className="text-blue-600 font-bold hover:underline"
          >
            {isRtl ? "تسجيل الدخول" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}