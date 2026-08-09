import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: person } = await supabase
    .from("team_members")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!person) notFound();

  return (
    <main className="ort-detail-page">
      <header className="ort-detail-header">
        <Link href="/">ORT.</Link>
        <Link href="/team">The team ↗</Link>
      </header>

      <section className="ort-person-detail">
        {person.profile_url && (
          <img
            src={person.profile_url}
            alt={person.name}
          />
        )}

        <div>
          <span>TEAM</span>
          <h1>{person.name}</h1>

          {person.role && (
            <h2>{person.role}</h2>
          )}

          {person.bio && (
            <p>{person.bio}</p>
          )}
        </div>
      </section>
    </main>
  );
}
