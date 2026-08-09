import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!brand) notFound();

  return (
    <main className="ort-detail-page">
      <header className="ort-detail-header">
        <Link href="/">ORT.</Link>
        <Link href="/brands">All brands ↗</Link>
      </header>

      <section className="ort-brand-detail">
        {brand.cover_url && (
          <img
            src={brand.cover_url}
            alt={brand.name}
          />
        )}

        <div className="ort-brand-detail-info">
          {brand.logo_url && (
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="ort-brand-logo"
            />
          )}

          <h1>{brand.name}</h1>

          {brand.description && (
            <p>{brand.description}</p>
          )}
        </div>
      </section>
    </main>
  );
}
