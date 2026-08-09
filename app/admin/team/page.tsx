import { createClient } from "@/lib/supabase/server";
import TeamManager from "@/components/admin/team/TeamManager";

export default async function TeamPage() {
  const supabase = await createClient();

  const { data: teamMembers, error } =
    await supabase
      .from("team_members")
      .select(
        "id, name, slug, role, profile_url, bio, instagram_url, website_url, published, featured"
      )
      .order("name");

  return (
    <main className="projects-page">
      <header className="projects-page-header">
        <div>
          <span className="cms-header-eyebrow">
            ORT MARKETING / TEAM
          </span>

          <h1>Team</h1>

          <p className="brands-page-description">
            Manage the creative people behind
            ORT Marketing projects.
          </p>
        </div>
      </header>

      {error ? (
        <div className="form-error">
          Unable to load team members:{" "}
          {error.message}
        </div>
      ) : (
        <TeamManager
          members={teamMembers || []}
        />
      )}
    </main>
  );
}