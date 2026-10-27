import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/dictionaries";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // تجاهل ملفات النظام والصور
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // التحقق مما إذا كان الرابط يحتوي على كود اللغة (/ar أو /en)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // إعادة التوجيه إلى اللغة الافتراضية (/ar)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};