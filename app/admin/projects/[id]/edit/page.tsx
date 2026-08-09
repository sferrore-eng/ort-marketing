import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: project, error } =
    await supabase
      .from("projects")
      .select(
        "id, title, slug, brand_id, description, cover_url, published, featured"
      )
      .eq("id", id)
      .single();

  if (error || !project) {
    notFound();
  }

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  const { data: teamMembers } =
    await supabase
      .from("team_members")
      .select("id, name, role")
      .eq("published", true)
      .order("name");

  const { data: projectTeam } =
    await supabase
      .from("project_team")
      .select("team_member_id, role")
      .eq("project_id", id);

  return (
    <main className="projects-page">
      <header className="projects-page-header">
        <div>
          <span className="cms-header-eyebrow">
            ORT MARKETING / PROJECTS
          </span>

          <h1>Edit project</h1>

          <p className="brands-page-description">
            Update {project.title} and its
            creative team.
          </p>
        </div>

        <Link
          href="/admin/projects"
          className="back-link"
        >
          ← All projects
        </Link>
      </header>

      <ProjectForm
        project={project}
        brands={brands || []}
        teamMembers={teamMembers || []}
        projectTeam={projectTeam || []}
      />
    </main>
  );
}