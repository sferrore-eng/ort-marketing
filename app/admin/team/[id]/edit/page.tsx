import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeamMemberForm from "@/components/admin/team/TeamMemberForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: member, error } =
    await supabase
      .from("team_members")
      .select(
        "id, name, slug, role, profile_url, bio, instagram_url, website_url, published, featured"
      )
      .eq("id", id)
      .single();

  if (error || !member) {
    notFound();
  }

  return (
    <main className="projects-page">
      <header className="projects-page-header">
        <div>
          <span className="cms-header-eyebrow">
            ORT MARKETING / TEAM
          </span>

          <h1>Edit profile</h1>

          <p className="brands-page-description">
            Update {member.name}&apos;s profile,
            links and visibility.
          </p>
        </div>

        <Link
          href="/admin/team"
          className="back-link"
        >
          ← All team
        </Link>
      </header>

      <TeamMemberForm member={member} />
    </main>
  );
}