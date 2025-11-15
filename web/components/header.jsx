import Image from "next/image";
import Link from "next/link";

const navItems = [
  { linkText: "Home", href: "/" },
  { linkText: "Tools", href: "/tools" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="site-branding">
        <Link href="/" className="logo">
          <Image src="/assets/brand/parlios-logo.svg" alt="Netlify" width={120} height={30} />
        </Link>
      </div>

      <nav className="site-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.linkText}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-external">
        <a href="https://github.com/Minot-Prod" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Image src="/images/github-mark-white.svg" alt="GitHub" width={24} height={24} />
        </a>
      </div>
    </header>
  );
}

