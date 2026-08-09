"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/bts", label: "BTS" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        ORT<span>.</span>
      </div>

      <nav className="admin-sidebar-nav">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" &&
              pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/">View website ↗</Link>

        <form action="/auth/signout" method="POST">
          <button type="submit">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
