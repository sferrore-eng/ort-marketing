import Link from "next/link";

export default function AdminWebsiteAbout() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <span>WEBSITE / 02</span>
          <h1>About</h1>
          <p>About section and company information.</p>
        </div>
        <Link href="/" className="button-secondary">View website ↗</Link>
      </div>

      <section className="admin-empty-state">
        <strong>About page</strong>
        <p>The public website currently focuses on the ORT work, brands, team and production story.</p>
        <Link href="/" className="button-primary">View current website ↗</Link>
      </section>
    </main>
  );
}
