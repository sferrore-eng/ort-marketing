import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BrandsPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="ort-list-page">
      <header className="ort-detail-header">
        <Link href="/">ORT.</Link>
        <span>BRANDS</span>
      </header>

      <section className="ort-list-intro">
        <span>02 / CLIENTS</span>
        <h1>Brands.</h1>
      </section>

      <section className="ort-brands-list-grid">
        {(brands ?? []).map((brand: any) => (
          <Link
            href={`/brands/${brand.slug}`}
            className="ort-brand-list-card"
            key={brand.id}
          >
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} />
            ) : (
              <h2>{brand.name}</h2>
            )}
          </Link>
        ))}
      </section>
    </main>
  );
}
