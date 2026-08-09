import Link from "next/link";

export default function AdminWebsiteDesign() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <span>WEBSITE / 04</span>
          <h1>Design</h1>
          <p>ORT visual direction and design system.</p>
        </div>
        <Link href="/" className="button-secondary">View website ↗</Link>
      </div>

      <section className="dashboard-grid">
        <article>
          <span>01</span>
          <h3>Typography</h3>
          <p>Large editorial typography with strong contrast.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Color</h3>
          <p>Black, off-white and acid green accent.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Layout</h3>
          <p>Editorial grids, large imagery and minimal navigation.</p>
        </article>
        <article>
          <span>04</span>
          <h3>Motion</h3>
          <p>Simple transitions and image interactions.</p>
        </article>
      </section>
    </main>
  );
}
