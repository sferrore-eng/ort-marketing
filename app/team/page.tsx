import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function TeamPage() {
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="ort-list-page">
      <header className="ort-detail-header">
        <Link href="/">ORT.</Link>
        <span>TEAM</span>
      </header>

      <section className="ort-list-intro">
        <span>03 / THE PEOPLE</span>
        <h1>The team.</h1>
      </section>

      <section className="ort-team-list-grid">
        {(team ?? []).map((person) => (
          <Link
            href={`/team/${person.slug}`}
            className="ort-person-list-card"
            key={person.id}
          >
            {person.profile_url ? (
              <img src={person.profile_url} alt={person.name} />
            ) : (
              <div className="ort-person-placeholder">
                {person.name?.charAt(0)}
              </div>
            )}

            <h2>{person.name}</h2>
            <span>{person.role}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
