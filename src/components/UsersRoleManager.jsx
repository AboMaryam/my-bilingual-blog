"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Trash2, UserPlus } from "lucide-react";

export default function UsersRoleManager({ isRtl, currentAdminId, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("123");
  const [newRole, setNewRole] = useState("author");

  const fetchUsers = async () => {
    // مزامنة أي حسابات قديمة مسجلة في المتصفح مع الخادم تلقائياً
    const localRaw = localStorage.getItem("blog_registered_users");
    if (localRaw) {
      try {
        const localObj = JSON.parse(localRaw);
        for (const u of Object.values(localObj)) {
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "register",
              name: u.arName || u.enName || u.id,
              email: u.email,
              password: u.password || "123",
            }),
          });
        }
        localStorage.removeItem("blog_registered_users");
      } catch {}
    }

    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // تغيير صلاحية أي عضو بضغطة واحدة
  const handleRoleChange = async (userId, targetRole) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateRole",
        userId,
        newRole: targetRole,
      }),
    });

    if (res.ok) {
      await fetchUsers();
      onUpdated(
        isRtl
          ? `تم تغيير صلاحية العضو إلى (${targetRole}) بنجاح!`
          : `Role updated to (${targetRole})!`
      );
    }
  };

  // إضافة عضو جديد وتحديد صلاحيته مباشرة من قِبل المدير
  const handleCreateUserByAdmin = async (e) => {
    e.preventDefault();
    const regRes = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        name: newName,
        email: newEmail,
        password: newPassword,
      }),
    });
    const regData = await regRes.json();

    if (regRes.ok && regData.user) {
      if (newRole !== "member") {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateRole",
            userId: regData.user.id,
            newRole,
          }),
        });
      }
      setNewName("");
      setNewEmail("");
      await fetchUsers();
      onUpdated(
        isRtl
          ? "تم إضافة الحساب وتعيين صلاحيته بنجاح!"
          : "User created and role assigned!"
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(isRtl ? "تأكيد حذف هذا العضو؟" : "Delete this user?"))
      return;
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteUser", userId }),
    });
    fetchUsers();
    onUpdated(isRtl ? "تم حذف العضو" : "User deleted");
  };

  const rolesList = [
    { key: "member", ar: "عضو", en: "Member" },
    { key: "author", ar: "كاتب", en: "Author" },
    { key: "editor", ar: "محرر", en: "Editor" },
    { key: "admin", ar: "مدير", en: "Admin" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. نموذج سريع للمدير لإضافة عضو وتحديد رتبته فوراً */}
      <form
        onSubmit={handleCreateUserByAdmin}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
      >
        <h3 className="font-bold text-base flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-600" />
          <span>
            {isRtl
              ? "إضافة عضو جديد وتحديد صلاحيته مباشرة"
              : "Add New User & Assign Role"}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder={isRtl ? "اسم العضو" : "Full Name"}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
          />
          <input
            type="email"
            required
            placeholder={isRtl ? "البريد الإلكتروني" : "Email"}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold"
          >
            {rolesList.map((r) => (
              <option key={r.key} value={r.key}>
                {isRtl ? r.ar : r.en} ({r.key})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
          >
            {isRtl ? "إضافة وتعيين الصلاحية +" : "+ Add User"}
          </button>
        </div>
      </form>

      {/* 2. جدول جميع الأعضاء مع أزرار ترقية الصلاحيات الفورية */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">
            {isRtl
              ? "جميع الأعضاء المسجلين — اضغط على أي رتبة لمنحها للعضو فوراً"
              : "Registered Members — Click a role to grant it immediately"}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs">
              <tr>
                <th className="p-4 text-start">{isRtl ? "العضو" : "Member"}</th>
                <th className="p-4 text-start">{isRtl ? "البريد" : "Email"}</th>
                <th className="p-4 text-start">
                  {isRtl
                    ? "تغيير الصلاحية (اضغط للترقية)"
                    : "Change Role (Click to Assign)"}
                </th>
                <th className="p-4 text-end">{isRtl ? "حذف" : "Delete"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-4 font-bold">
                    {isRtl ? u.arName : u.enName}
                    <span className="block text-xs text-slate-400 font-normal">
                      @{u.id}
                    </span>
                  </td>
                  <td className="p-4 text-xs">{u.email}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {rolesList.map((r) => {
                        const active = u.role === r.key;
                        return (
                          <button
                            key={r.key}
                            type="button"
                            disabled={u.id === currentAdminId}
                            onClick={() => handleRoleChange(u.id, r.key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
                              active
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                            }`}
                          >
                            {isRtl ? r.ar : r.en}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-end">
                    {u.id !== currentAdminId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}