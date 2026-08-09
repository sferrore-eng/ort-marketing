import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BTSManager from "@/components/admin/bts/BTSManager";

export default async function BTSPage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("bts")
    .select(
      "id, title, slug, description, cover_url, published, featured, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <main className="admin-page">
      <header className="brands-page-header">
        <div>
          <span className="eyebrow">
            ORT MARKETING / CONTENT
          </span>

          <h1>Behind the Scenes</h1>

          <p className="brands-page-description">
            Manage your behind-the-scenes content.
          </p>
        </div>

        <Link
          href="/admin/bts/new"
          className="primary-button"
        >
          + New BTS
        </Link>
      </header>

      {error ? (
        <div className="form-error">
          Unable to load BTS: {error.message}
        </div>
      ) : !items || items.length === 0 ? (
        <section className="brands-empty">
          <div>
            <span className="brands-empty-number">
              00
            </span>

            <h2>No BTS content yet.</h2>

            <p>
              Add your first behind-the-scenes story.
            </p>

            <Link
              href="/admin/bts/new"
              className="primary-button"
            >
              Create first BTS
            </Link>
          </div>
        </section>
      ) : (
        <BTSManager items={items} />
      )}
    </main>
  );
}
