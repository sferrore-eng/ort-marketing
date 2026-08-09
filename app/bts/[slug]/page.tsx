import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BTSPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("bts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!item) notFound();

  return (
    <main className="ort-detail-page">
      <header className="ort-detail-header">
        <Link href="/">ORT.</Link>
        <Link href="/bts">All BTS ↗</Link>
      </header>

      <section className="ort-detail-hero">
        {item.cover_url && (
          <img
            src={item.cover_url}
            alt={item.title}
          />
        )}

        <div className="ort-detail-overlay">
          <span>BEHIND THE SCENES</span>
          <h1>{item.title}</h1>
        </div>
      </section>

      <section className="ort-detail-content">
        {item.description && (
          <p>{item.description}</p>
        )}
      </section>
    </main>
  );
}
