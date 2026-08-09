import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select(
      "id,name,slug,logo_url,cover_url,description,featured,published"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!brand) {
    notFound();
  }

  const { data: projects } = await supabase
    .from("projects")
    .select(
      "id,brand_id,title,slug,description,cover_url,featured,published,created_at"
    )
    .eq("brand_id", brand.id)
    .eq("published", true)
    .order("created_at", {
      ascending: false,
    });

  const brandProjects = projects ?? [];

  return (
    <main className="brand-page">

      {/* HEADER */}

      <header className="brand-header">
        <Link href="/" className="brand-header-logo">
          ORT.
        </Link>

        <nav>
          <Link href="/projects">Projects</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/team">People</Link>
          <Link href="/bts">BTS</Link>
        </nav>

        <Link
          href="/#contact"
          className="brand-header-cta"
        >
          Start a project ↗
        </Link>
      </header>


      {/* HERO */}

      <section className="brand-hero">

        {brand.cover_url ? (
          <img
            src={brand.cover_url}
            alt={brand.name}
            className="brand-hero-image"
          />
        ) : (
          <div className="brand-hero-placeholder">
            <span>
              {brand.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="brand-hero-overlay" />

        <div className="brand-hero-content">

          <div className="brand-hero-meta">
            <span>BRAND / 01</span>

            <Link href="/brands">
              ← ALL BRANDS
            </Link>
          </div>

          <div className="brand-hero-bottom">

            <div className="brand-main-logo">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                />
              ) : (
                <h1>{brand.name}</h1>
              )}
            </div>

            <span className="brand-hero-name">
              {brand.name}
            </span>

          </div>

        </div>
      </section>


      {/* INTRO */}

      <section className="brand-intro">

        <div className="brand-intro-label">
          ABOUT THE BRAND
        </div>

        <div className="brand-intro-content">

          <h2>
            {brand.description ||
              "Building brands that move culture forward."}
          </h2>

          <div className="brand-intro-side">
            <span>
              ORT MARKETING
            </span>

            <p>
              Creative production, visual storytelling
              and campaigns built to make brands
              impossible to ignore.
            </p>
          </div>

        </div>
      </section>


      {/* PROJECTS */}

      <section className="brand-projects">

        <div className="brand-section-heading">

          <div>
            <span>01 / SELECTED WORK</span>

            <h2>
              Work we made
              <br />
              <em>together.</em>
            </h2>
          </div>

          <span>
            {String(brandProjects.length).padStart(2, "0")} PROJECTS
          </span>

        </div>


        {brandProjects.length > 0 ? (
          <div className="brand-project-grid">

            {brandProjects.map(
              (project: any, index: number) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={`brand-project-card ${
                    index === 0
                      ? "brand-project-card-large"
                      : ""
                  }`}
                >

                  <div className="brand-project-image">

                    {project.cover_url ? (
                      <img
                        src={project.cover_url}
                        alt={project.title}
                        loading={
                          index === 0
                            ? "eager"
                            : "lazy"
                        }
                      />
                    ) : (
                      <div className="brand-project-placeholder">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>
                    )}

                  </div>

                  <div className="brand-project-overlay">

                    <div>
                      <span>
                        PROJECT /{" "}
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <h3>
                        {project.title}
                      </h3>
                    </div>

                    <span className="brand-project-arrow">
                      ↗
                    </span>

                  </div>

                </Link>
              )
            )}

          </div>
        ) : (
          <div className="brand-no-projects">
            No published projects for this brand yet.
          </div>
        )}

      </section>


      {/* CTA */}

      <section className="brand-cta">

        <span>
          HAVE A PROJECT IN MIND?
        </span>

        <h2>
          Let&apos;s make
          <br />
          something <em>great.</em>
        </h2>

        <Link href="/#contact">
          Start a conversation ↗
        </Link>

      </section>


      {/* FOOTER */}

      <footer className="brand-footer">

        <Link href="/">
          ORT.
        </Link>

        <span>
          Creative production & marketing.
        </span>

        <span>
          © {new Date().getFullYear()} ORT Marketing
        </span>

      </footer>

    </main>
  );
}
