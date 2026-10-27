"use client";

import { useState, useEffect } from "react";
import { Upload, Users, UserCog, KeyRound } from "lucide-react";

export default function ProfileManager({
  user,
  isAdmin,
  authors,
  mode,
  isRtl,
  onSaved,
}) {
  const [form, setForm] = useState({
    id: "",
    avatar: "/favicon.ico",
    arName: "",
    arRole: "",
    arBio: "",
    enName: "",
    enRole: "",
    enBio: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    if (mode === "profile" && user) {
      const myData = authors[user.id] || {};
      setForm({
        id: user.id,
        avatar: myData.avatar || "",
        arName: myData.ar?.name || user.arName || "",
        arRole: myData.ar?.role || "",
        arBio: myData.ar?.bio || "",
        enName: myData.en?.name || user.enName || "",
        enRole: myData.en?.role || "",
        enBio: myData.en?.bio || "",
      });
    }
  }, [mode, user, authors]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "uploadImage",
          fileName: file.name,
          base64Data: reader.result,
        }),
      });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, avatar: data.url }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "saveAuthor", author: form }),
    });
    if (res.ok) {
      onSaved(
        isRtl ? "تم حفظ بيانات البروفايل بنجاح!" : "Profile saved successfully!"
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "changePassword",
        userId: user.id,
        currentPassword,
        newPassword,
      }),
    });

    if (!res.ok) {
      setPwdError(
        isRtl
          ? "كلمة المرور الحالية غير صحيحة!"
          : "Current password is incorrect!"
      );
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    onSaved(
      isRtl
        ? "تم تغيير كلمة المرور بنجاح!"
        : "Password updated successfully!"
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {isAdmin && mode === "authors" && (
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{isRtl ? "قائمة الكُتّاب الحالية" : "All Authors"}</span>
            </h3>
            {Object.values(authors).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.id}
                    className="w-11 h-11 rounded-xl object-cover bg-slate-200"
                  />
                  <div>
                    <p className="font-bold text-sm">
                      {isRtl ? item.ar?.name : item.en?.name}
                    </p>
                    <p className="text-xs text-slate-400">@{item.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      id: item.id,
                      avatar: item.avatar || "",
                      arName: item.ar?.name || "",
                      arRole: item.ar?.role || "",
                      arBio: item.ar?.bio || "",
                      enName: item.en?.name || "",
                      enRole: item.en?.role || "",
                      enBio: item.en?.bio || "",
                    })
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
                >
                  {isRtl ? "تعديل" : "Edit"}
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmitProfile}
          className={`${
            isAdmin && mode === "authors"
              ? "lg:col-span-7"
              : "lg:col-span-12 max-w-3xl mx-auto w-full"
          } rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5`}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <UserCog className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold">
              {mode === "profile"
                ? isRtl
                  ? "تعديل بياناتي الشخصية"
                  : "Edit My Profile"
                : isRtl
                ? "إضافة أو تعديل كاتب"
                : "Add or Edit Author"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "معرّف الكاتب (ID)" : "Author ID"}
              </label>
              <input
                type="text"
                required
                disabled={mode === "profile"}
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "الصورة الشخصية" : "Avatar Image"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer flex items-center gap-1">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>{isRtl ? "رفع" : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3" dir="rtl">
              <p className="text-xs font-bold text-blue-600">البيانات بالعربية</p>
              <input
                type="text"
                required
                placeholder="الاسم بالعربية"
                value={form.arName}
                onChange={(e) => setForm({ ...form, arName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
              <input
                type="text"
                required
                placeholder="المسمى الوظيفي بالعربية"
                value={form.arRole}
                onChange={(e) => setForm({ ...form, arRole: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
              <textarea
                rows={3}
                placeholder="النبذة التعريفية بالعربية..."
                value={form.arBio}
                onChange={(e) => setForm({ ...form, arBio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>

            <div className="space-y-3" dir="ltr">
              <p className="text-xs font-bold text-indigo-600">English Details</p>
              <input
                type="text"
                required
                placeholder="Name in English"
                value={form.enName}
                onChange={(e) => setForm({ ...form, enName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
              <input
                type="text"
                required
                placeholder="Role in English"
                value={form.enRole}
                onChange={(e) => setForm({ ...form, enRole: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Short bio in English..."
                value={form.enBio}
                onChange={(e) => setForm({ ...form, enBio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition cursor-pointer"
          >
            {isRtl ? "حفظ بيانات البروفايل" : "Save Profile Info"}
          </button>
        </form>
      </div>

      {/* قسم تغيير كلمة المرور (يظهر في تبويب تعديل البروفايل الشخصي) */}
      {mode === "profile" && (
        <form
          onSubmit={handleChangePassword}
          className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold">
              {isRtl ? "تغيير كلمة المرور" : "Change Password"}
            </h3>
          </div>

          {pwdError && (
            <p className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 p-3 rounded-xl">
              {pwdError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "كلمة المرور الحالية" : "Current Password"}
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isRtl ? "كلمة المرور الجديدة" : "New Password"}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
          >
            {isRtl ? "تحديث كلمة المرور" : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}