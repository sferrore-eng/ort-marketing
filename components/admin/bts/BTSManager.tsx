"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type BTSItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
};

type BTSManagerProps = {
  items: BTSItem[];
};

export default function BTSManager({
  items: initialItems,
}: BTSManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function deleteItem(item: BTSItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(item.id);

    const supabase = createClient();

    const { error } = await supabase
      .from("bts")
      .delete()
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      setDeleting(null);
      return;
    }

    setItems((current) =>
      current.filter((entry) => entry.id !== item.id)
    );

    setDeleting(null);
  }

  return (
    <section className="brands-table-wrapper">
      <div className="brands-table-head">
        <span>CONTENT</span>
        <span>STATUS</span>
        <span>FEATURED</span>
        <span>DATE</span>
        <span>ACTION</span>
      </div>

      <div className="brands-list">
        {items.map((item) => (
          <article key={item.id} className="brand-row">
            <div className="brand-row-main">
              <div className="brand-cover">
                {item.cover_url ? (
                  <img src={item.cover_url} alt={item.title} />
                ) : (
                  <div className="brand-cover-placeholder">
                    BTS
                  </div>
                )}
              </div>

              <div className="brand-row-info">
                <h2>{item.title}</h2>
                <span>
                  {item.description ||
                    "No description added yet."}
                </span>
              </div>
            </div>

            <div>
              <span
                className={
                  item.published
                    ? "status-badge published"
                    : "status-badge draft"
                }
              >
                {item.published ? "Published" : "Draft"}
              </span>
            </div>

            <div>
              <span
                className={
                  item.featured
                    ? "featured-badge active"
                    : "featured-badge"
                }
              >
                {item.featured ? "Featured" : "—"}
              </span>
            </div>

            <div>
              {new Date(item.created_at).toLocaleDateString()}
            </div>

            <div className="brand-actions">
              <Link
                href={`/admin/bts/${item.id}/edit`}
                className="table-action"
              >
                Edit ↗
              </Link>

              <button
                type="button"
                className="delete-action"
                disabled={deleting === item.id}
                onClick={() => deleteItem(item)}
              >
                {deleting === item.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
