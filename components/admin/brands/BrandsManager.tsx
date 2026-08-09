"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Brand {
  id: string;
  name: string;
  slug: string;
  cover_url: string | null;
  short_description: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

interface BrandsManagerProps {
  brands: Brand[];
}

export default function BrandsManager({
  brands: initialBrands,
}: BrandsManagerProps) {
  const [brands, setBrands] = useState(initialBrands);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "published" | "draft" | "featured"
  >("all");

  const [savingOrder, setSavingOrder] = useState<string | null>(
    null
  );

  const [deletingBrand, setDeletingBrand] = useState<string | null>(
    null
  );

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    return brands.filter((brand) => {
      const matchesSearch =
        !query ||
        brand.name.toLowerCase().includes(query) ||
        brand.slug.toLowerCase().includes(query) ||
        (brand.short_description || "")
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "published" && brand.published) ||
        (filter === "draft" && !brand.published) ||
        (filter === "featured" && brand.featured);

      return matchesSearch && matchesFilter;
    });
  }, [brands, search, filter]);

  async function moveBrand(
    brandId: string,
    direction: "up" | "down"
  ) {
    const index = brands.findIndex(
      (brand) => brand.id === brandId
    );

    if (index === -1) return;

    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= brands.length
    ) {
      return;
    }

    const current = brands[index];
    const target = brands[targetIndex];

    setSavingOrder(brandId);

    const supabase = createClient();

    const firstUpdate = await supabase
      .from("brands")
      .update({
        sort_order: target.sort_order,
      })
      .eq("id", current.id);

    if (firstUpdate.error) {
      setSavingOrder(null);
      alert(firstUpdate.error.message);
      return;
    }

    const secondUpdate = await supabase
      .from("brands")
      .update({
        sort_order: current.sort_order,
      })
      .eq("id", target.id);

    if (secondUpdate.error) {
      setSavingOrder(null);
      alert(secondUpdate.error.message);
      return;
    }

    const updated = [...brands];

    updated[index] = {
      ...current,
      sort_order: target.sort_order,
    };

    updated[targetIndex] = {
      ...target,
      sort_order: current.sort_order,
    };

    updated.sort(
      (a, b) => a.sort_order - b.sort_order
    );

    setBrands(updated);
    setSavingOrder(null);
  }

  async function deleteBrand(brand: Brand) {
    const confirmed = window.confirm(
      `Delete "${brand.name}"?\n\n` +
        `This will permanently delete this brand ` +
        `and all Projects and Media connected to it.\n\n` +
        `This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingBrand(brand.id);

    const supabase = createClient();

    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("id", brand.id);

    if (error) {
      alert(error.message);
      setDeletingBrand(null);
      return;
    }

    setBrands((current) =>
      current.filter(
        (item) => item.id !== brand.id
      )
    );

    setDeletingBrand(null);
  }

  return (
    <>
      {/* Toolbar */}

      <div className="brands-toolbar">
        <div className="brands-search">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search brands..."
            aria-label="Search brands"
          />
        </div>

        <div className="brands-filters">
          <button
            type="button"
            className={
              filter === "all" ? "active" : ""
            }
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            type="button"
            className={
              filter === "published"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("published")
            }
          >
            Published
          </button>

          <button
            type="button"
            className={
              filter === "draft" ? "active" : ""
            }
            onClick={() => setFilter("draft")}
          >
            Draft
          </button>

          <button
            type="button"
            className={
              filter === "featured"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("featured")
            }
          >
            Featured
          </button>
        </div>
      </div>

      {/* Results count */}

      <div className="brands-results-count">
        {filteredBrands.length}{" "}
        {filteredBrands.length === 1
          ? "brand"
          : "brands"}
      </div>

      {/* Empty */}

      {filteredBrands.length === 0 ? (
        <section className="brands-empty">
          <div>
            <span className="brands-empty-number">
              00
            </span>

            <h2>No matching brands.</h2>

            <p>
              Try a different search or filter.
            </p>
          </div>
        </section>
      ) : (
        <section className="brands-table-wrapper">

          {/* Table header */}

          <div className="brands-table-head">
            <span>BRAND</span>
            <span>STATUS</span>
            <span>FEATURED</span>
            <span>ORDER</span>
            <span>ACTION</span>
          </div>

          {/* Brands */}

          <div className="brands-list">

            {filteredBrands.map(
              (brand, index) => (
                <article
                  key={brand.id}
                  className="brand-row"
                >

                  {/* Brand */}

                  <div className="brand-row-main">

                    <div className="brand-cover">
                      {brand.cover_url ? (
                        <img
                          src={brand.cover_url}
                          alt={brand.name}
                        />
                      ) : (
                        <div className="brand-cover-placeholder">
                          ORT
                        </div>
                      )}
                    </div>

                    <div className="brand-row-info">

                      <h2>
                        {brand.name}
                      </h2>

                      <span>
                        {brand.short_description ||
                          "No description added yet."}
                      </span>

                    </div>

                  </div>

                  {/* Status */}

                  <div>
                    <span
                      className={
                        brand.published
                          ? "status-badge published"
                          : "status-badge draft"
                      }
                    >
                      {brand.published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  {/* Featured */}

                  <div>
                    <span
                      className={
                        brand.featured
                          ? "featured-badge active"
                          : "featured-badge"
                      }
                    >
                      {brand.featured
                        ? "Featured"
                        : "—"}
                    </span>
                  </div>

                  {/* Order */}

                  <div className="order-controls">

                    <button
                      type="button"
                      disabled={
                        index === 0 ||
                        savingOrder === brand.id
                      }
                      onClick={() =>
                        moveBrand(
                          brand.id,
                          "up"
                        )
                      }
                      aria-label={`Move ${brand.name} up`}
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                          filteredBrands.length - 1 ||
                        savingOrder === brand.id
                      }
                      onClick={() =>
                        moveBrand(
                          brand.id,
                          "down"
                        )
                      }
                      aria-label={`Move ${brand.name} down`}
                    >
                      ↓
                    </button>

                  </div>

                  {/* Actions */}

                  <div className="brand-actions">

                    <Link
                      href={`/admin/brands/${brand.id}/edit`}
                      className="table-action"
                    >
                      Edit ↗
                    </Link>

                    <button
                      type="button"
                      className="delete-action"
                      disabled={
                        deletingBrand === brand.id
                      }
                      onClick={() =>
                        deleteBrand(brand)
                      }
                    >
                      {deletingBrand === brand.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </article>
              )
            )}

          </div>
        </section>
      )}
    </>
  );
}