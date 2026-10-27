import fs from "fs";
import path from "path";

const authorsFilePath = path.join(process.cwd(), "content", "authors.json");

const defaultAuthors = {
  ahmed: {
    id: "ahmed",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    ar: {
      name: "أحمد المنصور",
      role: "مهندس برمجيات أول وكاتب تقني",
      bio: "مطور Full-Stack شغوف ببناء تطبيقات الويب الحديثة باستخدام React و Next.js، أشارك هنا خلاصة تجاربي العملية في هندسة البرمجيات.",
    },
    en: {
      name: "Ahmed Al-Mansour",
      role: "Senior Software Engineer & Tech Writer",
      bio: "Full-Stack developer passionate about modern web architecture with React and Next.js, sharing practical software engineering lessons.",
    },
  },
  sara: {
    id: "sara",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    ar: {
      name: "سارة العلي",
      role: "مطورة واجهات أمامية (UI/UX)",
      bio: "متخصصة في بناء واجهات مستخدم سريعة ومتجاوبة وتجربة مستخدم سلسة باستخدام Tailwind CSS و JavaScript الحديث.",
    },
    en: {
      name: "Sara Al-Ali",
      role: "Frontend Architect & UI/UX Specialist",
      bio: "Specialized in crafting fast, accessible, and responsive user interfaces using Tailwind CSS and modern JavaScript.",
    },
  },
};

export function readAuthorsMap() {
  try {
    if (fs.existsSync(authorsFilePath)) {
      const raw = fs.readFileSync(authorsFilePath, "utf8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading authors.json:", e);
  }
  return defaultAuthors;
}

export function getAuthorById(authorId = "ahmed", lang = "ar") {
  const all = readAuthorsMap();
  const author = all[authorId] || all.ahmed || Object.values(all)[0];
  const localized = author[lang] || author.ar;

  return {
    id: author.id,
    avatar: author.avatar,
    ...localized,
  };
}

export function getAllAuthors(lang = "ar") {
  const all = readAuthorsMap();
  return Object.keys(all).map((id) => getAuthorById(id, lang));
}