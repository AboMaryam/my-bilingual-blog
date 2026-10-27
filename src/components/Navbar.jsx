"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  FilePlus2,
  UserCog,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "./AuthProvider";

export default function Navbar({ lang, dict }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthorized, logout } = useAuth();
  const isRtl = lang === "ar";

  const publicLinks = [
    { name: dict.nav.home, href: `/${lang}` },
    { name: dict.nav.blog, href: `/${lang}/blog` },
    { name: dict.nav.about, href: `/${lang}/about` },
  ];

  const staffLinks = [
    {
      name: isRtl ? "لوحة التحكم" : "Dashboard",
      href: `/${lang}/admin?tab=posts`,
      icon: LayoutDashboard,
    },
    {
      name: isRtl ? "مقال جديد" : "New Post",
      href: `/${lang}/admin?tab=editor`,
      icon: FilePlus2,
    },
    {
      name: isRtl ? "تعديل البروفايل" : "Edit Profile",
      href: `/${lang}/admin?tab=profile`,
      icon: UserCog,
    },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push(`/${lang}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* الشعار */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white shrink-0"
        >
          <span className="p-2 rounded-xl bg-blue-600 text-white">
            <BookOpen className="w-5 h-5" />
          </span>
          <span>{dict.siteName}</span>
        </Link>

        {/* روابط سطح المكتب */}
        <nav className="hidden lg:flex items-center gap-5">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition"
            >
              {link.name}
            </Link>
          ))}

          {isAuthorized && (
            <div className="flex items-center gap-2 ps-3 border-s border-slate-200 dark:border-slate-800">
              {staffLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold hover:opacity-85 transition"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* أزرار الحساب: إذا كان مسجلاً يظهر فقط الخروج، وإذا لم يكن مسجلاً يظهر الدخول + التسجيل */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                {isRtl ? user.arName : user.enName}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isRtl ? "خروج" : "Logout"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href={`/${lang}/login`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>{isRtl ? "دخول" : "Login"}</span>
              </Link>

              <Link
                href={`/${lang}/register`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isRtl ? "حساب جديد" : "Register"}</span>
              </Link>
            </div>
          )}

          <LanguageSwitcher lang={lang} />
          <ThemeToggle />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال المنسدلة */}
      {isOpen && (
        <nav className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}

          {isAuthorized &&
            staffLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40"
              >
                {item.name}
              </Link>
            ))}

          {!user ? (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/${lang}/login`}
                onClick={() => setIsOpen(false)}
                className="text-center py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                {isRtl ? "تسجيل الدخول" : "Login"}
              </Link>
              <Link
                href={`/${lang}/register`}
                onClick={() => setIsOpen(false)}
                className="text-center py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                {isRtl ? "حساب جديد" : "Register"}
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-start px-3 py-2 rounded-lg text-sm font-bold text-red-600"
            >
              {isRtl ? "تسجيل الخروج" : "Logout"}
            </button>
          )}
        </nav>
      )}
    </header>
  );
}