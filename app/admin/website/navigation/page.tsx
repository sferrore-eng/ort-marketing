import Link from "next/link";

const links = [
  ["Projects", "/projects"],
  ["Brands", "/brands"],
  ["Team", "/team"],
  ["Behind the Scenes", "/bts"],
];

export default function AdminWebsiteNavigation() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <span>WEBSITE / 03</span>
          <h1>Navigation</h1>
          <p>Current public website navigation.</p>
        </div>
      </div>

      <section className="admin-list">
        {links.map(([label, href], index) => (
          <div className="admin-list-row" key={href}>
            <span>0{index + 1}</span>
            <strong>{label}</strong>
            <Link href={href}>Open ↗</Link>
          </div>
        ))}
      </section>
    </main>
  );
}
