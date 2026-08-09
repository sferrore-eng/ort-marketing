import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BrandsManager from "@/components/admin/brands/BrandsManager";

export default async function BrandsPage() {
  const supabase = await createClient();

  const { data: brands, error } = await supabase
    .from("brands")
    .select(
     "id, name, slug, cover_url, short_description, featured, published, sort_order"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <main className="brands-page">
      <header className="brands-page-header">
        <div>
          <span className="cms-header-eyebrow">
            ORT MARKETING / CONTENT
          </span>

          <h1>Brands</h1>

          <p className="brands-page-description">
            Manage the brands and clients displayed across
            the ORT website.
          </p>
        </div>

        <Link
          href="/admin/brands/new"
          className="primary-button"
        >
          + New brand
        </Link>
      </header>

      {error ? (
        <div className="form-error">
          Unable to load brands: {error.message}
        </div>
      ) : !brands || brands.length === 0 ? (
        <section className="brands-empty">
          <div>
            <span className="brands-empty-number">
              01
            </span>

            <h2>No brands yet.</h2>

            <p>
              Add your first client brand to start building
              the ORT portfolio.
            </p>

            <Link
              href="/admin/brands/new"
              className="primary-button"
            >
              Create first brand
            </Link>
          </div>
        </section>
      ) : (
        <BrandsManager brands={brands} />
      )}
    </main>
  );
}