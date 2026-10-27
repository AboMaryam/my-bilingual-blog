import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const commentsFile = path.join(process.cwd(), "content", "comments.json");

function readAllComments() {
  try {
    if (fs.existsSync(commentsFile)) {
      return JSON.parse(fs.readFileSync(commentsFile, "utf8"));
    }
  } catch {}
  return {};
}

function writeAllComments(data) {
  const dir = path.dirname(commentsFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(commentsFile, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "";
  const all = readAllComments();
  return NextResponse.json({ comments: all[slug] || [] });
}

export async function POST(request) {
  const body = await request.json();
  const { action, slug } = body;
  const all = readAllComments();

  if (!all[slug]) all[slug] = [];

  if (action === "add") {
    const newComment = {
      id: Date.now().toString(),
      authorId: body.authorId,
      authorName: body.authorName,
      authorRole: body.authorRole || "member",
      text: body.text,
      date: new Date().toISOString().split("T")[0],
    };
    all[slug].unshift(newComment);
    writeAllComments(all);
    return NextResponse.json({ comments: all[slug] });
  }

  if (action === "delete") {
    all[slug] = all[slug].filter((c) => c.id !== body.commentId);
    writeAllComments(all);
    return NextResponse.json({ comments: all[slug] });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}