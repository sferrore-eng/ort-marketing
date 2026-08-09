import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectsManager from "@/components/admin/projects/ProjectsManager";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        title,
        slug,
        brand_id,
        cover_url,
        published,
        featured,
        sort_order,
        brands (
          name
        )
      `
    )
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="projects-page">
      <header className="projects-page-header">
        <div>
          <span className="cms-header-eyebrow">
            ORT MARKETING / CONTENT
          </span>

          <h1>Projects</h1>

          <p className="brands-page-description">
            Manage campaigns, productions and
            creative projects across the ORT
            portfolio.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="primary-button"
        >
          + New project
        </Link>
      </header>

      {error ? (
        <div className="form-error">
          Unable to load projects:{" "}
          {error.message}
        </div>
      ) : (
        <ProjectsManager
          projects={projects || []}
        />
      )}
    </main>
  );
}