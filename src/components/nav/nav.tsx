import Link from "next/link";

export function Nav() {
  const routes = [
    { name: "Home", href: "/" },
    { name: "Hacks", href: "/hacks" },
    { name: "Blog", href: "/blog" },
    { name: "Contributors", href: "/contributors" },
  ];

  return (
    <nav className="mb-16 pt-8">
      <div className="flex space-x-6 text-sm">
        {routes.map((route) => (
          <Link
            key={route.name}
            href={route.href}
            className="hover:text-gray-400"
          >
            {route.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
