import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BrandForm from "@/components/admin/brands/BrandForm";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: brand, error } = await supabase
    .from("brands")
    .select(
      "id, name, slug, logo_url, cover_url, short_description, description, website_url, instagram_url, featured, published"
    )
    .eq("id", id)
    .single();

  if (error || !brand) {
    notFound();
  }

  return (
    <main className="brands-page">
      <header className="brands-page-header">
        <div>
          <span className="cms-header-eyebrow">
            ORT MARKETING / BRANDS
          </span>

          <h1>Edit brand</h1>

          <p className="brands-page-description">
            Update the information and visibility of {brand.name}.
          </p>
        </div>

        <Link
          href="/admin/brands"
          className="back-link"
        >
          ← All brands
        </Link>
      </header>

      <BrandForm brand={brand} />
    </main>
  );
}