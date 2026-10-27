export const locales = ["ar", "en"];
export const defaultLocale = "ar";

const dictionaries = {
  ar: {
    siteName: "مدونتي التقنية",
    siteDescription: "مقالات احترافية في البرمجة وتطوير الويب",
    nav: {
      home: "الرئيسية",
      blog: "المقالات",
      about: "عن المدونة",
      searchPlaceholder: "ابحث في المقالات...",
    },
    blog: {
      featured: "مقال مميز",
      latestPosts: "أحدث المقالات",
      readMore: "اقرأ المزيد",
      readingTime: "دقائق للقراءة",
      toc: "جدول المحتويات",
      categories: "التصنيفات",
      allCategories: "الكل",
      noPosts: "لا توجد مقالات مطابقة لبحثك.",
    },
    newsletter: {
      title: "اشترك في النشرة البريدية",
      subtitle: "احصل على أحدث المقالات والشروحات مباشرة في بريدك الإلكتروني.",
      placeholder: "أدخل بريدك الإلكتروني...",
      button: "اشتراك الآن",
      success: "شكراً لاشتراكك معنا!",
    },
    footer: {
      rights: "جميع الحقوق محفوظة",
    },
  },
  en: {
    siteName: "My Tech Blog",
    siteDescription: "Professional articles on programming and web development",
    nav: {
      home: "Home",
      blog: "Articles",
      about: "About",
      searchPlaceholder: "Search articles...",
    },
    blog: {
      featured: "Featured Post",
      latestPosts: "Latest Articles",
      readMore: "Read More",
      readingTime: "min read",
      toc: "Table of Contents",
      categories: "Categories",
      allCategories: "All",
      noPosts: "No articles match your search.",
    },
    newsletter: {
      title: "Subscribe to our Newsletter",
      subtitle: "Get the latest articles and tutorials delivered straight to your inbox.",
      placeholder: "Enter your email address...",
      button: "Subscribe",
      success: "Thank you for subscribing!",
    },
    footer: {
      rights: "All rights reserved",
    },
  },
};

export function getDictionary(lang) {
  return dictionaries[lang] || dictionaries[defaultLocale];
}