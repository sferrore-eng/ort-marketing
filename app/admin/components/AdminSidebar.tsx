"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    title: "CONTENT",
    items: [
      { label: "Overview", href: "/admin" },
      { label: "Brands", href: "/admin/brands" },
      { label: "Projects", href: "/admin/projects" },
      { label: "Team", href: "/admin/team" },
      { label: "Behind the Scenes", href: "/admin/bts" },
    ],
  },
  {
    title: "WEBSITE",
    items: [
      { label: "Homepage", href: "/admin/website/home" },
      { label: "About", href: "/admin/website/about" },
      { label: "Navigation", href: "/admin/website/navigation" },
      { label: "Design", href: "/admin/website/design" },
    ],
  },
  {
    title: "MEDIA",
    items: [
      { label: "Media Library", href: "/admin/media" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="cms-sidebar">
      <div className="cms-sidebar-logo">
        ORT<span>.</span>
      </div>

      <nav>
        {navigation.map((section) => (
          <div
            key={section.title}
            className="cms-nav-section"
          >
            <span className="cms-nav-label">
              {section.title}
            </span>

            <div className="cms-nav-links">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(
                    `${item.href}/`
                  );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "cms-nav-link active"
                        : "cms-nav-link"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="cms-sidebar-bottom">
        <Link href="/" className="cms-view-site">
          View website ↗
        </Link>
      </div>
    </aside>
  );
}