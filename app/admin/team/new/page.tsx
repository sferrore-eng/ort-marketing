import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeamMemberForm from "@/components/admin/team/TeamMemberForm";

export default async function NewTeamMemberPage() {
  const supabase = await createClient();

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="admin-page">
      <div className="admin-inner">
        <div className="admin-inner-header">
          <div>
            <span className="eyebrow">
              TEAM / NEW
            </span>

            <h1>New profile</h1>

            <p>
              Add a model, photographer, director,
              editor or creative collaborator.
            </p>
          </div>
        </div>

        <TeamMemberForm />
      </div>
    </main>
  );
}