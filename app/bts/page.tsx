import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BTSPage() {
  const supabase = await createClient();

  const { data: bts } = await supabase
    .from("bts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="ort-list-page">
      <header className="ort-detail-header">
        <Link href="/">ORT.</Link>
        <span>BTS</span>
      </header>

      <section className="ort-list-intro">
        <span>04 / BEHIND THE SCENES</span>
        <h1>Behind the scenes.</h1>
      </section>

      <section className="ort-list-grid">
        {(bts ?? []).map((item: any) => (
          <Link
            href={`/bts/${item.slug}`}
            className="ort-list-card"
            key={item.id}
          >
            {item.cover_url ? (
              <img src={item.cover_url} alt={item.title} />
            ) : (
              <div className="ort-list-placeholder" />
            )}

            <div>
              <span>BEHIND THE SCENES</span>
              <h2>{item.title}</h2>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
