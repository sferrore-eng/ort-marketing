import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHomepageCMS } from "@/lib/cms/homepage";
import CMSVisibility from "@/components/home/CMSVisibility";

import Hero from "@/components/home/Hero";
import BrandGallery from "@/components/home/BrandGallery";
import PeopleStrip from "@/components/home/PeopleStrip";
import BTSSection from "@/components/home/BTSSection";

export default async function Home() {
  const supabase = await createClient();
const { settings, sections } = await getHomepageCMS();

  const [
    { data: brands },
    { data: projects },
    { data: team },
    { data: bts },
  ] = await Promise.all([
    supabase
      .from("brands")
      .select(
        "id,name,slug,logo_url,cover_url,description,featured,published"
      )
      .eq("published", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("projects")
      .select(
        "id,brand_id,title,slug,description,cover_url,featured,published"
      )
      .eq("published", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("team_members")
      .select(
        "id,name,slug,role,profile_url,bio,featured,published"
      )
      .eq("published", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("bts")
      .select(
        "id,title,slug,description,cover_url,featured,published"
      )
      .eq("published", true)
      .order("created_at", { ascending: false }),
  ]);

  const featuredProjects = (projects ?? [])
    .filter((item) => item.featured)
    .slice(0, 6);

  const featuredBrands = (brands ?? [])
    .filter((item) => item.featured)
    .slice(0, 8);

  const featuredTeam = (team ?? [])
    .filter((item) => item.featured)
    .slice(0, 6);

  const featuredBts = (bts ?? [])
    .filter((item) => item.featured)
    .slice(0, 3);

  return (
    <main className="ort-home">

      {/* =========================
          HEADER
      ========================= */}

      <header className="ort-header">
        <Link href="/" className="ort-logo">
          ORT.
        </Link>

        <nav>
          <Link href="/projects">Projects</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/team">People</Link>
          <Link href="/bts">BTS</Link>
          <Link href="#contact">Contact</Link>
        </nav>

        <Link
          href="#contact"
          className="ort-header-cta"
        >
          Start a project ↗
        </Link>
      </header>


      {/* =========================
          HERO
      ========================= */}

      <Hero />


      {/* =========================
          SELECTED WORK
      ========================= */}

      <section className="ort-section">
        <div className="ort-section-head">
          <div>
            <small>01 / SELECTED WORK</small>

            <h2>
              Projects that
              <br />
              speak for themselves.
            </h2>
          </div>

          <Link href="/projects">
            View all projects ↗
          </Link>
        </div>

        <div className="ort-project-grid">
          {(featuredProjects.length
            ? featuredProjects
            : (projects ?? []).slice(0, 6)
          ).map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              className={`ort-project-card ${
                index === 0 ? "large" : ""
              }`}
              key={project.id}
            >
              {project.cover_url ? (
                <img
                  src={project.cover_url}
                  alt={project.title}
                />
              ) : (
                <div className="ort-image-placeholder">
                  {String(index + 1).padStart(2, "0")}
                </div>
              )}

              <div className="ort-card-overlay">
                <span>
                  PROJECT / {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* =========================
          BRANDS
          NEW BRAND GALLERY
      ========================= */}

      <BrandGallery
        brands={
          featuredBrands.length
            ? featuredBrands
            : brands ?? []
        }
      />


      {/* =========================
          PEOPLE
      ========================= */}

      <PeopleStrip
        people={
          featuredTeam.length
            ? featuredTeam
            : team ?? []
        }
      />


      {/* =========================
          BTS
      ========================= */}

      <BTSSection
        items={
          featuredBts.length
            ? featuredBts
            : bts ?? []
        }
      />


      {/* =========================
          CONTACT
      ========================= */}

      <section
        className="ort-contact"
        id="contact"
      >
        <small>
          LET&apos;S MAKE SOMETHING.
        </small>

        <h2>
          Have a project
          <br />
          in mind?
        </h2>

        <a href="mailto:hello@ortmarketing.com">
          {settings?.email ?? "hello@ortmarketing.com"} ↗
        </a>
      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="ort-footer">
        <strong>ORT.</strong>

        <span>
          {settings?.description ?? "Creative production & marketing."}
        </span>

        <span>
          © {new Date().getFullYear()} ORT Marketing
        </span>
      </footer>

    </main>
  );
}