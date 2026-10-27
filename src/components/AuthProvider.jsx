"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FALLBACK_USERS = {
  "admin@blog.com": {
    id: "ahmed",
    email: "admin@blog.com",
    role: "admin",
    arName: "أحمد المنصور",
    enName: "Ahmed Al-Mansour",
  },
  "sara@blog.com": {
    id: "sara",
    email: "sara@blog.com",
    role: "author",
    arName: "سارة العلي",
    enName: "Sara Al-Ali",
  },
  "member@blog.com": {
    id: "member1",
    email: "member@blog.com",
    role: "member",
    arName: "خالد سعيد",
    enName: "Khaled Saeed",
  },
};

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const active = localStorage.getItem("blog_active_user");
    if (active) {
      try {
        setUser(JSON.parse(active));
      } catch {}
    }
  }, []);

  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: cleanEmail, password }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("blog_active_user", JSON.stringify(data.user));
        return { ok: true, user: data.user };
      }
    } catch {}

    // نظام احتياطي فوري للحسابات التجريبية
    if (FALLBACK_USERS[cleanEmail] && String(password) === "123") {
      const fallbackUser = FALLBACK_USERS[cleanEmail];
      setUser(fallbackUser);
      localStorage.setItem("blog_active_user", JSON.stringify(fallbackUser));
      return { ok: true, user: fallbackUser };
    }

    return { ok: false, error: "INVALID_CREDENTIALS" };
  };

  const register = async ({ name, email, password }) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };

    setUser(data.user);
    localStorage.setItem("blog_active_user", JSON.stringify(data.user));
    return { ok: true, user: data.user };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blog_active_user");
  };

  const isAuthorized = ["author", "editor", "admin"].includes(user?.role);
  const canEditAllPosts = ["editor", "admin"].includes(user?.role);
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthorized,
        canEditAllPosts,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}