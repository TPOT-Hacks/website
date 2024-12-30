import Link from "next/link";

async function getContributors() {
    const res = await fetch("https://api.github.com/repos/TPOT-Hacks/website/contributors", {
    });

    if (!res.ok) {
        throw new Error("Failed to fetch contributors");
    }

    return res.json();
}

export default async function Page() {
    const contributors = await getContributors();

    return (
        <div className="min-h-screen bg-black text-white font-mono">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <nav className="mb-16 pt-8">
                    <ul className="flex space-x-6 text-sm">
                        <li>
                            <Link href="/public" className="hover:text-gray-400">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/hacks" className="hover:text-gray-400">
                                Hacks
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:text-gray-400">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/contributors" className="hover:text-gray-400">
                                Blog
                            </Link>
                        </li>
                    </ul>
                </nav>

                <main>
                    <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between items-center">
                        <Link
                            href="/contributors"
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
                    </div>

                    {/* GitHub Contributors Section */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-4">GitHub Contributors</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {contributors.map((contributor: any) => (
                                <div
                                    key={contributor.id}
                                    className="border border-gray-700 rounded p-4 flex flex-col items-center"
                                >
                                    <img
                                        src={contributor.avatar_url}
                                        alt={contributor.login}
                                        className="w-16 h-16 rounded-full mb-2"
                                    />
                                    <Link
                                        href={contributor.html_url}
                                        className="text-blue-400 hover:underline"
                                    >
                                        {contributor.login}
                                    </Link>
                                    <span className="text-xs text-gray-400 mt-1">
                    Contributions: {contributor.contributions}
                  </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="mt-16 pt-8 border-t border-gray-800 text-gray-400 text-sm">
                    <p>Built with Next.js. Join our discord to make this site better!</p>
                </footer>
            </div>
        </div>
    );
}
