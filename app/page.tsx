import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: brands }, { data: projects }, { data: team }, { data: bts }] =
    await Promise.all([
      supabase
        .from("brands")
        .select("id,name,slug,logo_url,cover_url,description,featured")
        .eq("published", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("projects")
        .select("id,brand_id,title,slug,description,cover_url,featured")
        .eq("published", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("team")
        .select("id,name,slug,role,profile_url,bio,featured")
        .eq("published", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("bts")
        .select("id,title,slug,description,cover_url,featured")
        .eq("published", true)
        .order("created_at", { ascending: false }),
    ]);

  const featuredProjects = (projects ?? []).filter((item) => item.featured).slice(0, 6);
  const featuredBrands = (brands ?? []).filter((item) => item.featured).slice(0, 8);
  const featuredTeam = (team ?? []).filter((item) => item.featured).slice(0, 6);
  const featuredBts = (bts ?? []).filter((item) => item.featured).slice(0, 3);

  return (
    <main className="ort-site">
      <header className="ort-header">
        <Link href="/" className="ort-logo">ORT.</Link>

        <nav>
          <Link href="/projects">Projects</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/team">Team</Link>
          <Link href="/bts">BTS</Link>
        </nav>

        <Link href="#contact" className="ort-header-cta">Start a project ↗</Link>
      </header>

      <section className="ort-hero">
        <div className="ort-hero-kicker">ORT MARKETING / CREATIVE PRODUCTION</div>
        <h1>
          We make brands
          <br />
          <span>impossible to ignore.</span>
        </h1>
        <p>
          Creative production, visual storytelling and campaigns built to move
          culture forward.
        </p>
        <div className="ort-hero-actions">
          <Link href="/projects" className="ort-button">Explore our work ↗</Link>
          <Link href="#contact" className="ort-button ort-button-light">Work with us</Link>
        </div>
      </section>

      <section className="ort-marquee">
        <span>CREATIVE</span>
        <span>PRODUCTION</span>
        <span>BRANDING</span>
        <span>CONTENT</span>
        <span>CAMPAIGNS</span>
      </section>

      <section className="ort-section">
        <div className="ort-section-head">
          <div>
            <small>01 / SELECTED WORK</small>
            <h2>Projects that<br />speak for themselves.</h2>
          </div>
          <Link href="/projects">View all projects ↗</Link>
        </div>

        <div className="ort-project-grid">
          {(featuredProjects.length ? featuredProjects : (projects ?? []).slice(0, 6)).map((project: any, index) => (
            <Link href={`/projects/${project.slug}`} className={`ort-project-card ${index === 0 ? "large" : ""}`} key={project.id}>
              {project.cover_url ? (
                <img src={project.cover_url} alt={project.title} />
              ) : (
                <div className="ort-image-placeholder">{String(index + 1).padStart(2, "0")}</div>
              )}
              <div className="ort-card-overlay">
                <span>PROJECT / {String(index + 1).padStart(2, "0")}</span>
                <h3>{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="ort-dark-section">
        <div className="ort-section-head">
          <div>
            <small>02 / CLIENTS</small>
            <h2>Brands we<br />build with.</h2>
          </div>
          <Link href="/brands">View all brands ↗</Link>
        </div>

        <div className="ort-brands-grid">
          {(featuredBrands.length ? featuredBrands : (brands ?? []).slice(0, 8)).map((brand: any) => (
            <Link href={`/brands/${brand.slug}`} className="ort-brand-card" key={brand.id}>
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} />
              ) : (
                <strong>{brand.name}</strong>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="ort-section">
        <div className="ort-section-head">
          <div>
            <small>03 / THE PEOPLE</small>
            <h2>The people<br />behind the work.</h2>
          </div>
          <Link href="/team">Meet the team ↗</Link>
        </div>

        <div className="ort-team-grid">
          {(featuredTeam.length ? featuredTeam : (team ?? []).slice(0, 6)).map((person: any) => (
            <Link href={`/team/${person.slug}`} className="ort-person-card" key={person.id}>
              {person.profile_url ? (
                <img src={person.profile_url} alt={person.name} />
              ) : (
                <div className="ort-person-placeholder">{person.name.charAt(0)}</div>
              )}
              <h3>{person.name}</h3>
              <span>{person.role}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ort-bts-section">
        <div className="ort-section-head">
          <div>
            <small>04 / BEHIND THE SCENES</small>
            <h2>See what happens<br />before the final cut.</h2>
          </div>
          <Link href="/bts">More BTS ↗</Link>
        </div>

        <div className="ort-bts-grid">
          {(featuredBts.length ? featuredBts : (bts ?? []).slice(0, 3)).map((item: any) => (
            <Link href={`/bts/${item.slug}`} className="ort-bts-card" key={item.id}>
              {item.cover_url && <img src={item.cover_url} alt={item.title} />}
              <span>BEHIND THE SCENES</span>
              <h3>{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="ort-contact" id="contact">
        <small>LET&apos;S MAKE SOMETHING.</small>
        <h2>Have a project<br />in mind?</h2>
        <a href="mailto:hello@ortmarketing.com">hello@ortmarketing.com ↗</a>
      </section>

      <footer className="ort-footer">
        <strong>ORT.</strong>
        <span>Creative production & marketing.</span>
        <span>© {new Date().getFullYear()} ORT Marketing</span>
      </footer>
    </main>
  );
}
