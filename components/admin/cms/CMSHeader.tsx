"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string) {
  if (pathname === "/admin") {
    return "Overview";
  }

  if (pathname.includes("/brands")) {
    return "Brands";
  }

  if (pathname.includes("/projects")) {
    return "Projects";
  }

  if (pathname.includes("/team")) {
    return "Team";
  }

  if (pathname.includes("/bts")) {
    return "Behind the Scenes";
  }

  if (pathname.includes("/media")) {
    return "Media Library";
  }

  if (pathname.includes("/website")) {
    return "Website";
  }

  return "Admin";
}

export default function CMSHeader() {
  const pathname = usePathname();

  return (
    <header className="cms-header">
      <div>
        <span className="cms-header-eyebrow">
          ORT MARKETING / CMS
        </span>

        <h1>{getPageTitle(pathname)}</h1>
      </div>

      <div className="cms-header-actions">
        <Link
          href="/"
          className="cms-header-site"
        >
          View site ↗
        </Link>
      </div>
    </header>
  );
}