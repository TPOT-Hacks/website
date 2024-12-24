import Link from "next/link";
import { getHackPost } from "@/lib/markdown";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default function HackPage({ params }: Props) {
  const hack = getHackPost(params.slug);

  if (!hack) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 max-w-2xl mx-auto">
      <nav className="mb-16 pt-8">
        <ul className="flex space-x-6 text-sm">
          <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
          <li><Link href="/hacks" className="hover:text-gray-400">Hacks</Link></li>
          <li><Link href="/blog" className="hover:text-gray-400">Blog</Link></li>
        </ul>
      </nav>

      <main>
        <article className="prose prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 max-w-none">
          <header className="not-prose mb-8 pb-8 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{hack.title}</h1>
              <span 
                className={`
                  px-3 py-1 text-xs rounded-full
                  ${hack.status === 'upcoming' ? 'bg-blue-900 text-blue-200' : ''}
                  ${hack.status === 'active' ? 'bg-green-900 text-green-200' : ''}
                  ${hack.status === 'completed' ? 'bg-gray-800 text-gray-200' : ''}
                `}
              >
                {hack.status.charAt(0).toUpperCase() + hack.status.slice(1)}
              </span>
            </div>
            <div className="text-gray-400">
              {new Date(hack.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </header>

          <div 
            dangerouslySetInnerHTML={{ __html: hack.content }}
            className="space-y-6"
          />
        </article>

        <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between items-center">
          <Link 
            href="/hacks"
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
            Back to Hacks
          </Link>

          {hack.status === 'active' && (
            <Link
              href={`/blog?hack=${hack.slug}`}
              className="text-sm text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              View Solutions →
            </Link>
          )}
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-800 text-gray-400 text-sm">
        <p>Built with Next.js and ❤️</p>
      </footer>
    </div>
  );
} 