import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: member } = await supabase
    .from("team_members")
    .select("id,name,slug,role,profile_url,bio,featured")
    .eq("slug", slug)
    .maybeSingle();

  if (!member) notFound();

  const { data: memberMedia } = await supabase
    .from("team_member_media")
    .select(`
      id,
      media_id,
      media:media_id (
        id,
        url,
        title,
        type,
        thumbnail_url
      )
    `)
    .eq("team_member_id", member.id);

  const media = (memberMedia ?? [])
    .map((item: any) => item.media)
    .filter(Boolean);

  const { data: projects } = await supabase
    .from("project_team")
    .select(`
      project_id,
      projects:project_id (
        id,
        title,
        slug,
        cover_url,
        published
      )
    `)
    .eq("team_member_id", member.id);

  const memberProjects = (projects ?? [])
    .map((item: any) => item.projects)
    .filter((project: any) => project?.published);

  return (
    <main className="person-page">

      <header className="person-header">
        <Link href="/" className="person-logo">ORT.</Link>

        <nav>
          <Link href="/projects">Projects</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/team">People</Link>
          <Link href="/bts">BTS</Link>
        </nav>

        <Link href="/#contact" className="person-header-cta">
          Start a project ↗
        </Link>
      </header>

      <section className="person-hero">

        <div className="person-hero-image">
          {member.profile_url ? (
            <img src={member.profile_url} alt={member.name} />
          ) : (
            <div className="person-placeholder">
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="person-hero-content">

          <span>ORT / PEOPLE</span>

          <div>
            <small>{member.role || "CREATIVE"}</small>
            <h1>{member.name}</h1>
          </div>

        </div>

      </section>

      <section className="person-intro">

        <div className="person-label">
          ABOUT
        </div>

        <div className="person-intro-content">

          <p>
            {member.bio ||
              `${member.name} is part of the ORT creative team.`}
          </p>

          <Link href="/#contact">
            WORK WITH US ↗
          </Link>

        </div>

      </section>

      {media.length > 0 && (
        <section className="person-media">

          <div className="person-section-title">
            <span>01 / SELECTED MEDIA</span>
            <h2>
              Work in
              <br />
              <em>motion.</em>
            </h2>
          </div>

          <div className="person-media-grid">

            {media.map((item: any, index: number) => {

              const image =
                item.url || item.thumbnail_url;

              return (
                <div
                  className={`person-media-card ${
                    index === 0 ? "featured" : ""
                  }`}
                  key={item.id}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.title || member.name}
                    />
                  ) : (
                    <div className="person-media-placeholder">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  )}
                </div>
              );
            })}

          </div>

        </section>
      )}

      {memberProjects.length > 0 && (
        <section className="person-projects">

          <div className="person-section-title">

            <span>02 / PROJECTS</span>

            <h2>
              Selected
              <br />
              <em>work.</em>
            </h2>

          </div>

          <div className="person-project-grid">

            {memberProjects.map((project: any) => (
              <Link
                href={`/projects/${project.slug}`}
                className="person-project-card"
                key={project.id}
              >

                {project.cover_url ? (
                  <img
                    src={project.cover_url}
                    alt={project.title}
                  />
                ) : (
                  <div className="person-project-placeholder">
                    ORT.
                  </div>
                )}

                <div>
                  <span>PROJECT</span>
                  <h3>{project.title}</h3>
                </div>

              </Link>
            ))}

          </div>

        </section>
      )}

      <section className="person-cta">

        <span>LET&apos;S WORK TOGETHER</span>

        <h2>
          Make something
          <br />
          <em>impossible to ignore.</em>
        </h2>

        <Link href="/#contact">
          Start a conversation ↗
        </Link>

      </section>

      <footer className="person-footer">
        <Link href="/">ORT.</Link>
        <span>Creative production & marketing.</span>
        <span>© {new Date().getFullYear()} ORT Marketing</span>
      </footer>

    </main>
  );
}
