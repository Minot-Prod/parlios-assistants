"use client";

import * as React from "react";

type AppShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Catalogue", href: "/#catalogue" },
  { label: "Explorer", href: "/explorer" },
  { label: "À propos", href: "/about" },
];

export function AppShell({ children }: AppShellProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) close();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-shell">
      <header className="app-nav-wrap">
        <div className="app-nav">
          <a href="/" className="app-logo">
            <span className="app-logo-badge">P</span>
            <span className="app-logo-text">Parlios</span>
          </a>

          <nav className="app-nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="app-nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="app-nav-right">
            <button className="app-nav-cta">Commencer</button>

            <button
              className="app-nav-toggle"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={toggle}
            >
              <span className="app-nav-toggle-icon">
                {open ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>

        <div className={`app-nav-mobile ${open ? "is-open" : ""}`}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="app-nav-mobile-link"
              onClick={close}
            >
              {item.label}
            </a>
          ))}
          <button className="app-nav-mobile-cta" onClick={close}>
            Lancer un assistant
          </button>
        </div>
      </header>

      <main className="app-shell-main">{children}</main>
    </div>
  );
}

export default AppShell;
