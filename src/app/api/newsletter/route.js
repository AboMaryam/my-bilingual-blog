import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subscribersFile = path.join(process.cwd(), "content", "subscribers.json");
const campaignsFile = path.join(process.cwd(), "content", "campaigns.json");

function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch {}
  return [];
}

function writeJsonFile(filePath, list) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
}

export async function GET() {
  return NextResponse.json({
    subscribers: readJsonFile(subscribersFile),
    campaigns: readJsonFile(campaignsFile),
  });
}

export async function POST(request) {
  const body = await request.json();
  const { action } = body;
  const list = readJsonFile(subscribersFile);

  // 1. اشتراك بريد جديد
  if (action === "subscribe") {
    const cleanEmail = (body.email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json({ error: "EMPTY_EMAIL" }, { status: 400 });
    }

    if (!list.some((item) => item.email === cleanEmail)) {
      list.unshift({
        email: cleanEmail,
        date: new Date().toISOString().split("T")[0],
      });
      writeJsonFile(subscribersFile, list);
    }

    return NextResponse.json({ success: true, subscribers: list });
  }

  // 2. حذف مشترك
  if (action === "delete") {
    const updated = list.filter((item) => item.email !== body.email);
    writeJsonFile(subscribersFile, updated);
    return NextResponse.json({ success: true, subscribers: updated });
  }

  // 3. إرسال مقال لجميع المشتركين في القائمة البريدية
  if (action === "sendCampaign") {
    const { subject, excerpt, postUrl } = body;
    const recipientEmails = list.map((s) => s.email);

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: "NO_SUBSCRIBERS" }, { status: 400 });
    }

    let sentViaApi = false;
    const resendKey = process.env.RESEND_API_KEY;

    // إذا كان مفتاح RESEND_API_KEY موجوداً في .env.local يتم الإرسال الفعلي الآلي لكل المشتركين
    if (resendKey) {
      const htmlBody = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px;">
          <h2 style="color:#1e293b;">${subject}</h2>
          <p style="color:#475569;line-height:1.7;">${excerpt}</p>
          <a href="${postUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:bold;">
            اقرأ المقال كاملاً / Read Full Article
          </a>
        </div>
      `;

      const apiRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.NEWSLETTER_FROM_EMAIL || "onboarding@resend.dev",
          to: recipientEmails,
          subject,
          html: htmlBody,
        }),
      });

      sentViaApi = apiRes.ok;
    }

    // حفظ الحملة في سجل الحملات المرسلة
    const campaigns = readJsonFile(campaignsFile);
    campaigns.unshift({
      id: Date.now().toString(),
      subject,
      postUrl,
      recipientsCount: recipientEmails.length,
      date: new Date().toISOString().split("T")[0],
      mode: sentViaApi ? "API (Resend)" : "Recorded / Mail Client",
    });
    writeJsonFile(campaignsFile, campaigns);

    return NextResponse.json({
      success: true,
      sentViaApi,
      campaigns,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}