import Link from "next/link";
import { getHackPosts } from "@/lib/markdown";

export default async function HacksPage() {
  const hacks = await getHackPosts();

  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Weekly Hacks</h1>
        <p className="text-gray-400 text-lg">
          Browse our collection of weekly programming challenges. Pick one and
          start hacking! Have an idea for a fun challenge? Join our Discord to
          suggest it.
        </p>
      </div>

      <div className="space-y-12">
        {hacks.map((hack) => (
          <article
            key={hack.slug}
            className="group border border-gray-800 p-6 space-y-4 transition-all hover:border-gray-600"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold group-hover:text-gray-300">
                  {hack.title}
                </h2>
                <div className="text-sm text-gray-500">
                  {new Date(hack.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <span
                className={`
                      px-3 py-1 text-xs rounded-full
                      ${hack.status === "upcoming" ? "bg-blue-900 text-blue-200" : ""}
                      ${hack.status === "active" ? "bg-green-900 text-green-200" : ""}
                      ${hack.status === "completed" ? "bg-gray-800 text-gray-200" : ""}
                    `}
              >
                {hack.status.charAt(0).toUpperCase() + hack.status.slice(1)}
              </span>
            </div>

            <p className="text-gray-400 text-lg line-clamp-3">
              {hack.description}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href={`/hacks/${hack.slug}`}
                className="inline-flex items-center text-sm text-white hover:text-gray-300"
              >
                View Details
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              {hack.status === "active" && (
                <Link
                  href={`/blog?hack=${hack.slug}`}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  View Solutions →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
