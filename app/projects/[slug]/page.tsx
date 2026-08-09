import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(
      "id,brand_id,title,slug,description,cover_url,featured,published,created_at"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  const [
    { data: brand },
    { data: projectMedia },
    { data: projectPeople },
    { data: projectTeam },
    { data: allProjects },
  ] = await Promise.all([
    project.brand_id
      ? supabase
          .from("brands")
          .select("id,name,slug,logo_url")
          .eq("id", project.brand_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),

    supabase
      .from("project_media")
      .select(
        `
          id,
          media_id,
          media:media_id (
            id,
            url,
            title,
            type,
            thumbnail_url
          )
        `
      )
      .eq("project_id", project.id),

    supabase
      .from("project_people")
      .select(
        `
          id,
          person_id,
          people:person_id (
            id,
            name,
            slug,
            role,
            profile_url,
            bio
          )
        `
      )
      .eq("project_id", project.id),

    supabase
      .from("project_team")
      .select(
        `
          id,
          team_member_id,
          team_members:team_member_id (
            id,
            name,
            slug,
            role,
            profile_url,
            bio
          )
        `
      )
      .eq("project_id", project.id),

    supabase
      .from("projects")
      .select("id,title,slug,cover_url")
      .eq("published", true)
      .neq("id", project.id)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const mediaItems = (projectMedia ?? [])
    .map((item: any) => item.media)
    .filter(Boolean);

  const people = (projectPeople ?? [])
    .map((item: any) => item.people)
    .filter(Boolean);

  const team = (projectTeam ?? [])
    .map((item: any) => item.team_members)
    .filter(Boolean);

  const nextProject =
    (allProjects ?? []).length > 0
      ? allProjects![0]
      : null;

  return (
    <main className="project-page">

      {/* HEADER */}

      <header className="project-header">
        <Link href="/" className="project-header-logo">
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
          className="project-header-cta"
        >
          Start a project ↗
        </Link>
      </header>


      {/* HERO */}

      <section className="project-hero">

        {project.cover_url ? (
          <img
            src={project.cover_url}
            alt={project.title}
            className="project-hero-image"
          />
        ) : (
          <div className="project-hero-placeholder">
            <span>ORT.</span>
          </div>
        )}

        <div className="project-hero-overlay" />

        <div className="project-hero-content">

          <div className="project-hero-top">

            <span>
              PROJECT / SELECTED WORK
            </span>

            <Link href="/projects">
              ← ALL PROJECTS
            </Link>

          </div>

          <div className="project-hero-bottom">

            <div>
              <span className="project-kicker">
                {brand?.name ?? "ORT MARKETING"}
              </span>

              <h1>
                {project.title}
              </h1>
            </div>

            <span className="project-index">
              SELECTED WORK
            </span>

          </div>

        </div>

      </section>


      {/* INTRO */}

      <section className="project-intro">

        <div className="project-intro-label">
          ABOUT THE PROJECT
        </div>

        <div className="project-intro-content">

          <div>
            <p className="project-description">
              {project.description ||
                "A creative project by ORT Marketing."}
            </p>

            {brand && (
              <Link
                href={`/brands/${brand.slug}`}
                className="project-brand-link"
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                  />
                ) : (
                  <span>{brand.name}</span>
                )}

                <span>VIEW BRAND ↗</span>
              </Link>
            )}
          </div>

          <div className="project-meta">

            <span>CREATIVE PRODUCTION</span>
            <span>VISUAL STORYTELLING</span>
            <span>CAMPAIGN</span>

          </div>

        </div>

      </section>


      {/* MEDIA */}

      {mediaItems.length > 0 && (
        <section className="project-gallery">

          <div className="project-section-heading">

            <div>
              <span>01 / PROJECT GALLERY</span>

              <h2>
                The work
                <br />
                <em>in focus.</em>
              </h2>
            </div>

            <span>
              {String(mediaItems.length).padStart(2, "0")} MEDIA
            </span>

          </div>

          <div className="project-media-grid">

            {mediaItems.map(
              (media: any, index: number) => {

                const imageUrl =
                  media.url ||
                  media.thumbnail_url;

                return (
                  <div
                    className={`project-media-item ${
                      index === 0
                        ? "project-media-large"
                        : ""
                    }`}
                    key={media.id}
                  >

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          media.title ||
                          project.title
                        }
                        loading={
                          index === 0
                            ? "eager"
                            : "lazy"
                        }
                      />
                    ) : (
                      <div className="project-media-placeholder">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </section>
      )}


      {/* PEOPLE */}

      {people.length > 0 && (
        <section className="project-people">

          <div className="project-section-heading">

            <div>
              <span>02 / CONTRIBUTORS</span>

              <h2>
                People behind
                <br />
                <em>the project.</em>
              </h2>
            </div>

          </div>

          <div className="project-people-grid">

            {people.map((person: any) => (
              <Link
                href={`/team/${person.slug}`}
                key={person.id}
                className="project-person-card"
              >

                {person.profile_url ? (
                  <img
                    src={person.profile_url}
                    alt={person.name}
                  />
                ) : (
                  <div className="project-person-placeholder">
                    {person.name?.charAt(0)}
                  </div>
                )}

                <div>
                  <h3>{person.name}</h3>
                  <span>{person.role}</span>
                </div>

              </Link>
            ))}

          </div>

        </section>
      )}


      {/* TEAM */}

      {team.length > 0 && (
        <section className="project-team">

          <div className="project-section-heading">

            <div>
              <span>03 / ORT TEAM</span>

              <h2>
                Made by
                <br />
                <em>our people.</em>
              </h2>
            </div>

          </div>

          <div className="project-team-list">

            {team.map((member: any) => (
              <Link
                href={`/team/${member.slug}`}
                key={member.id}
                className="project-team-row"
              >

                <div className="project-team-person">

                  {member.profile_url ? (
                    <img
                      src={member.profile_url}
                      alt={member.name}
                    />
                  ) : (
                    <div className="project-team-avatar">
                      {member.name?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>

                </div>

                <span>VIEW PROFILE ↗</span>

              </Link>
            ))}

          </div>

        </section>
      )}


      {/* NEXT PROJECT */}

      {nextProject && (
        <section className="project-next">

          <span>NEXT PROJECT</span>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="project-next-card"
          >

            {nextProject.cover_url && (
              <img
                src={nextProject.cover_url}
                alt={nextProject.title}
              />
            )}

            <div className="project-next-overlay">

              <div>
                <small>NEXT / PROJECT</small>

                <h2>
                  {nextProject.title}
                </h2>
              </div>

              <span>↗</span>

            </div>

          </Link>

        </section>
      )}


      {/* CTA */}

      <section className="project-cta">

        <span>
          HAVE A PROJECT IN MIND?
        </span>

        <h2>
          Let&apos;s create
          <br />
          something <em>bold.</em>
        </h2>

        <Link href="/#contact">
          Start a conversation ↗
        </Link>

      </section>


      {/* FOOTER */}

      <footer className="project-footer">

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
