import Link from "next/link";
import { getBlogPosts } from "@/lib/markdown";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <nav className="mb-16 pt-8">
          <ul className="flex space-x-6 text-sm">
            <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link href="/hacks" className="hover:text-gray-400">Hacks</Link></li>
            <li><Link href="/blog" className="hover:text-gray-400">Blog</Link></li>
          </ul>
        </nav>

        <main className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Blog</h1>
            <p className="text-gray-400 text-lg">
              Weekly write-ups from our community members about their hack solutions and learnings.
              Want to share your solution? Join us on Discord!
            </p>
          </div>
          
          <div className="space-y-12">
            {posts.map((post) => (
              <article 
                key={post.slug} 
                className="group border border-gray-800 p-6 space-y-4 transition-all hover:border-gray-600"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold group-hover:text-gray-300">
                    {post.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} 
                    <span className="mx-2">•</span> 
                    by {post.author}
                  </div>
                </div>
                
                <p className="text-gray-400 text-lg line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="pt-2">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm text-white hover:text-gray-300"
                  >
                    Read more 
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
                </div>
              </article>
            ))}
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t border-gray-800 text-gray-400 text-sm">
          <p>Built with Next.js. Join our discord to make this site better!</p>
        </footer>
      </div>
    </div>
  );
} 