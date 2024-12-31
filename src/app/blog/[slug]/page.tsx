import Link from "next/link";
import { getBlogPost } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title };
}

export default async function Page({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <article className="prose prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 max-w-none prose-lg">
        <header className="not-prose mb-12 pb-8 border-b border-gray-800">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-400 text-lg">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span className="mx-2">•</span>
            by {post.author}
          </div>
        </header>

        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="space-y-6"
        />
      </article>

      <div className="mt-16 pt-8 border-t border-gray-800">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-gray-300 inline-flex items-center"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>
      </div>
    </main>
  );
}
