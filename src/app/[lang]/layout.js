import AuthProvider from "@/components/AuthProvider";
import { Cairo, Inter } from "next/font/google";
import "../globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { getDictionary, locales } from "@/lib/dictionaries";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: {
      default: dict.siteName,
      template: `%s | ${dict.siteName}`,
    },
    description: dict.siteDescription,
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const isRtl = lang === "ar";

  return (
    <html
      lang={lang}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${cairo.variable} ${inter.variable}`}
    >
      <body
        className={`${
          isRtl ? "font-cairo" : "font-inter"
        } bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased min-h-screen flex flex-col transition-colors duration-200`}
      >
        <ThemeProvider>
  <AuthProvider>
    <Navbar lang={lang} dict={dict} />
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
      {children}
    </main>
    <Newsletter dict={dict} />
    <Footer lang={lang} dict={dict} />
  </AuthProvider>
</ThemeProvider>
      </body>
    </html>
  );
}