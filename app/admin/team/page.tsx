import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function TeamPage() {
  const supabase = await createClient();

  const { data: teamMembers, error } =
    await supabase
      .from("team_members")
      .select(
        "id, name, role, bio, image_url, published"
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

        <Link
          href="/admin/team/new"
          className="primary-button"
        >
          + New member
        </Link>
      </header>

      {error ? (
        <div className="form-error">
          Unable to load team members:{" "}
          {error.message}
        </div>
      ) : (
        <section className="brands-table-wrapper">
          <div className="brands-table-head">
            <span>MEMBER</span>
            <span>ROLE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          <div className="brands-list">
            {teamMembers?.map((member) => (
              <article
                key={member.id}
                className="brand-row"
              >
                <div className="brand-row-main">
                  <div className="brand-cover">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                      />
                    ) : (
                      <div className="brand-cover-placeholder">
                        ORT
                      </div>
                    )}
                  </div>

                  <div className="brand-row-info">
                    <h2>{member.name}</h2>

                    {member.bio && (
                      <span>
                        {member.bio}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="status-badge">
                    {member.role}
                  </span>
                </div>

                <div>
                  <span
                    className={
                      member.published
                        ? "status-badge published"
                        : "status-badge draft"
                    }
                  >
                    {member.published
                      ? "Published"
                      : "Draft"}
                  </span>
                </div>

                <div className="brand-actions">
                  <Link
                    href={`/admin/team/${member.id}/edit`}
                    className="table-action"
                  >
                    Edit ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {(!teamMembers ||
            teamMembers.length === 0) && (
            <section className="brands-empty">
              <div>
                <span className="brands-empty-number">
                  00
                </span>

                <h2>No team members yet.</h2>

                <p>
                  Add your first creative team
                  member.
                </p>

                <Link
                  href="/admin/team/new"
                  className="primary-button"
                >
                  Add member
                </Link>
              </div>
            </section>
          )}
        </section>
      )}
    </main>
  );
}