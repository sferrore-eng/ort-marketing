import { notFound } from "next/navigation";
import BTSForm from "@/components/admin/bts/BTSForm";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBTSPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("bts")
    .select(
      "id, title, slug, description, cover_url, published, featured"
    )
    .eq("id", id)
    .single();

  if (error || !item) {
    notFound();
  }

  return (
    <main className="admin-page">
      <header className="brands-page-header">
        <div>
          <span className="eyebrow">
            ORT MARKETING / CONTENT
          </span>

          <h1>Edit Behind the Scenes</h1>

          <p className="brands-page-description">
            Update this behind-the-scenes entry.
          </p>
        </div>
      </header>

      <BTSForm item={item} />
    </main>
  );
}
