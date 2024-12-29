import Link from "next/link";

export default function Home() {
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
          <h1 className="text-4xl font-bold">TPOT Hacks</h1>
          
          <section className="space-y-4">
            <p className="text-gray-300 text-lg">
              Welcome to TPOT Hacks, a weekly gathering where developers come together
              to explore, hack, and learn. Every week, we tackle a new programming
              challenge or mini-project.
            </p>

            <p className="text-gray-300">
              Our format is simple:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>We announce a new hack every week</li>
              <li>Members work on their solutions</li>
              <li>We share and discuss our approaches</li>
              <li>We document our learnings in our blog</li>
            </ul>

            <p className="text-gray-300 mt-4">
              You can find all our previous hacks with links and short descriptions <Link href="/hacks" className="text-white underline underline-offset-4">here</Link>, 
              and a blog post that goes with each hack <Link href="/blog" className="text-white underline underline-offset-4">here</Link>. 
              Each blog post is written by a different member of our community!
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Join Us</h2>
            <p className="text-gray-300">
              Ready to start hacking with us? Join our Discord community where we
              coordinate our weekly hacks and share ideas.
            </p>
            
            <a 
              href="https://discord.gg/dN758wQD" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black px-6 py-3 mt-4 hover:bg-gray-200 transition-colors"
            >
              Join Discord →
            </a>
          </section>
        </main>

        <footer className="mt-16 pt-8 border-t border-gray-800 text-gray-400 text-sm">
          <p>Built with Next.js. Join our discord to make this site better!</p>
        </footer>
      </div>
    </div>
  );
}
