"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export default function Newsletter({ dict }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "subscribe", email }),
    });

    setLoading(false);
    if (res.ok) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 my-16">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-10 text-white shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-full bg-white/15 mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {dict.newsletter.title}
          </h2>
          <p className="text-blue-100 mb-6 text-sm sm:text-base">
            {dict.newsletter.subtitle}
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-3 rounded-xl font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>{dict.newsletter.success}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.newsletter.placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold transition cursor-pointer disabled:opacity-50"
              >
                {dict.newsletter.button}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}