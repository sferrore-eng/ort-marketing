import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="ort-list-page">
      <header className="ort-detail-header">
        <Link href="/">ORT.</Link>
        <span>PROJECTS</span>
      </header>

      <section className="ort-list-intro">
        <span>01 / SELECTED WORK</span>
        <h1>Projects.</h1>
      </section>

      <section className="ort-list-grid">
        {(projects ?? []).map((project: any) => (
          <Link
            href={`/projects/${project.slug}`}
            className="ort-list-card"
            key={project.id}
          >
            {project.cover_url ? (
              <img src={project.cover_url} alt={project.title} />
            ) : (
              <div className="ort-list-placeholder" />
            )}

            <div>
              <span>PROJECT</span>
              <h2>{project.title}</h2>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
