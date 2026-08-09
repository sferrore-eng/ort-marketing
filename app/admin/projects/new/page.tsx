import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default async function NewProjectPage() {
  const supabase = await createClient();

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("id, name, role")
    .eq("published", true)
    .order("name");

  return (
    <main className="admin-page">
      <div className="admin-inner">
        <div className="admin-inner-header">
          <div>
            <span className="eyebrow">
              PROJECTS / NEW
            </span>

            <h1>Create project</h1>

            <p>
              Create a campaign and connect everyone
              who worked on it.
            </p>
          </div>
        </div>

        <ProjectForm
          brands={brands || []}
          teamMembers={teamMembers || []}
        />
      </div>
    </main>
  );
}