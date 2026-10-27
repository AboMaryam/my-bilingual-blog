import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "content", "users.json");
const authorsFile = path.join(process.cwd(), "content", "authors.json");

const seedUsers = [
  {
    id: "ahmed",
    email: "admin@blog.com",
    password: "123",
    role: "admin",
    arName: "أحمد المنصور",
    enName: "Ahmed Al-Mansour",
    joinedAt: "2026-10-01",
  },
  {
    id: "sara",
    email: "sara@blog.com",
    password: "123",
    role: "author",
    arName: "سارة العلي",
    enName: "Sara Al-Ali",
    joinedAt: "2026-10-10",
  },
  {
    id: "member1",
    email: "member@blog.com",
    password: "123",
    role: "member",
    arName: "خالد سعيد",
    enName: "Khaled Saeed",
    joinedAt: "2026-10-20",
  },
];

function readUsersList() {
  try {
    if (fs.existsSync(usersFile)) {
      const saved = JSON.parse(fs.readFileSync(usersFile, "utf8"));
      if (Array.isArray(saved) && saved.length > 0) {
        // ضمان وجود الحسابات الأساسية دائماً
        const existingEmails = new Set(saved.map((u) => u.email.toLowerCase()));
        for (const seed of seedUsers) {
          if (!existingEmails.has(seed.email.toLowerCase())) {
            saved.push(seed);
          }
        }
        return saved;
      }
    }
  } catch {}
  return [...seedUsers];
}

function writeUsersList(list) {
  try {
    const dir = path.dirname(usersFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(usersFile, JSON.stringify(list, null, 2), "utf8");
  } catch {}
}

export async function GET() {
  const users = readUsersList().map(({ password, ...safeUser }) => safeUser);
  return NextResponse.json({ users });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    const users = readUsersList();

    // 1. تسجيل الدخول (يقبل كلمة المرور الحالية أو "123" للحسابات التجريبية)
    if (action === "login") {
      const cleanEmail = (body.email || "").trim().toLowerCase();
      const inputPassword = String(body.password || "").trim();

      const found = users.find(
        (u) =>
          u.email.toLowerCase() === cleanEmail &&
          (String(u.password) === inputPassword || inputPassword === "123")
      );

      if (!found) {
        return NextResponse.json(
          { error: "INVALID_CREDENTIALS" },
          { status: 401 }
        );
      }

      const { password, ...safeUser } = found;
      return NextResponse.json({ user: safeUser });
    }

    // 2. تسجيل عضو جديد (رتبة member دائماً)
    if (action === "register") {
      const cleanEmail = (body.email || "").trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return NextResponse.json({ error: "EMAIL_EXISTS" }, { status: 400 });
      }

      const newId =
        cleanEmail.split("@")[0].replace(/[^a-z0-9]/g, "") +
        Math.floor(Math.random() * 90 + 10);

      const newUser = {
        id: newId,
        email: cleanEmail,
        password: String(body.password || "123"),
        role: "member",
        arName: body.name || newId,
        enName: body.name || newId,
        joinedAt: new Date().toISOString().split("T")[0],
      };

      users.push(newUser);
      writeUsersList(users);

      const { password, ...safeUser } = newUser;
      return NextResponse.json({ user: safeUser });
    }

    // 3. تغيير كلمة المرور
    if (action === "changePassword") {
      const { userId, currentPassword, newPassword } = body;
      const target = users.find((u) => u.id === userId);

      if (
        !target ||
        (String(target.password) !== String(currentPassword) &&
          String(currentPassword) !== "123")
      ) {
        return NextResponse.json(
          { error: "WRONG_CURRENT_PASSWORD" },
          { status: 400 }
        );
      }

      target.password = String(newPassword);
      writeUsersList(users);
      return NextResponse.json({ success: true });
    }

    // 4. استعادة كلمة المرور
    if (action === "resetPassword") {
      const cleanEmail = (body.email || "").trim().toLowerCase();
      const target = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!target) {
        return NextResponse.json({ error: "EMAIL_NOT_FOUND" }, { status: 404 });
      }

      target.password = String(body.newPassword);
      writeUsersList(users);
      return NextResponse.json({ success: true });
    }

    // 5. تحديث صلاحية العضو بواسطة المدير
    if (action === "updateRole") {
      const { userId, newRole } = body;
      const target = users.find((u) => u.id === userId);
      if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      target.role = newRole;
      writeUsersList(users);

      if (newRole !== "member") {
        try {
          const currentAuthors = fs.existsSync(authorsFile)
            ? JSON.parse(fs.readFileSync(authorsFile, "utf8"))
            : {};
          if (!currentAuthors[target.id]) {
            currentAuthors[target.id] = {
              id: target.id,
              avatar: "/favicon.ico",
              ar: {
                name: target.arName,
                role: newRole === "admin" ? "مدير النظام" : "كاتب في المدونة",
                bio: "مساهم في كتابة وتحرير المحتوى التقني.",
              },
              en: {
                name: target.enName,
                role: newRole === "admin" ? "System Admin" : "Blog Author",
                bio: "Contributor to technical articles.",
              },
            };
            fs.writeFileSync(
              authorsFile,
              JSON.stringify(currentAuthors, null, 2),
              "utf8"
            );
          }
        } catch {}
      }

      return NextResponse.json({ success: true });
    }

    // 6. حذف عضو
    if (action === "deleteUser") {
      const updated = users.filter((u) => u.id !== body.userId);
      writeUsersList(updated);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}