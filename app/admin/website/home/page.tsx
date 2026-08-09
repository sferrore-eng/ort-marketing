import Link from "next/link";

export default function AdminWebsiteHome() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <span>WEBSITE / 01</span>
          <h1>Homepage</h1>
          <p>Manage the main public website experience.</p>
        </div>
        <Link href="/" className="button-secondary">View website ↗</Link>
      </div>

      <section className="dashboard-grid">
        <article>
          <span>HERO</span>
          <h3>Hero section</h3>
          <p>Homepage headline and introduction.</p>
        </article>
        <article>
          <span>WORK</span>
          <h3>Selected projects</h3>
          <p>Featured projects are automatically pulled from Projects.</p>
        </article>
        <article>
          <span>CLIENTS</span>
          <h3>Featured brands</h3>
          <p>Featured brands are automatically displayed.</p>
        </article>
        <article>
          <span>TEAM</span>
          <h3>Featured team</h3>
          <p>Featured team members appear on the homepage.</p>
        </article>
      </section>
    </main>
  );
}
