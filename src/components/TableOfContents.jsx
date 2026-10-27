import { List } from "lucide-react";

export default function TableOfContents({ headings, title }) {
  if (!headings || headings.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sticky top-24">
      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <List className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>{title}</span>
      </div>

      <ul className="space-y-2.5 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "ps-4" : ""}
          >
            <a
              href={`#${heading.id}`}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition block line-clamp-1"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}