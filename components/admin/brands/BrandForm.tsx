"use client";

import MediaField from "@/components/admin/media/MediaField";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "./ImageUpload";

interface Brand {
  id?: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  short_description: string | null;
  description: string | null;
  website_url: string | null;
  instagram_url: string | null;
  featured: boolean;
  published: boolean;
}

interface BrandFormProps {
  brand?: Brand;
}

export default function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");

  const [logoUrl, setLogoUrl] = useState(
    brand?.logo_url || "",
  );

  const [coverUrl, setCoverUrl] = useState(
    brand?.cover_url || "",
  );

  const [shortDescription, setShortDescription] = useState(
    brand?.short_description || "",
  );

  const [description, setDescription] = useState(
    brand?.description || "",
  );

  const [websiteUrl, setWebsiteUrl] = useState(
    brand?.website_url || "",
  );

  const [instagramUrl, setInstagramUrl] = useState(
    brand?.instagram_url || "",
  );

  const [featured, setFeatured] = useState(
    brand?.featured ?? false,
  );

  const [published, setPublished] = useState(
    brand?.published ?? true,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!brand?.id) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const payload = {
      name,
      slug,
      logo_url: logoUrl || null,
      cover_url: coverUrl || null,
      short_description: shortDescription || null,
      description: description || null,
      website_url: websiteUrl || null,
      instagram_url: instagramUrl || null,
      featured,
      published,
    };

    const result = brand?.id
      ? await supabase
          .from("brands")
          .update(payload)
          .eq("id", brand.id)
      : await supabase.from("brands").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/brands");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="brand-form"
    >
      <div className="form-section">
        <div className="form-section-title">
          <span>01</span>
          <h2>Brand identity</h2>
        </div>

        <div className="form-grid">
          <label>
            Brand name

            <input
              value={name}
              onChange={(e) =>
                handleNameChange(e.target.value)
              }
              placeholder="Noly Radiance"
              required
            />
          </label>

          <label>
            URL slug

            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              placeholder="noly-radiance"
              required
            />
          </label>
        </div>

        <ImageUpload
          label="Brand logo"
          value={logoUrl}
          onChange={setLogoUrl}
          folder="brands/logos"
        />

        <ImageUpload
          label="Brand cover"
          value={coverUrl}
          onChange={setCoverUrl}
          folder="brands/covers"
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>02</span>
          <h2>About the brand</h2>
        </div>

        <label>
          Short description

          <input
            value={shortDescription}
            onChange={(e) =>
              setShortDescription(e.target.value)
            }
            placeholder="A short introduction..."
          />
        </label>

        <label>
          Description

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Tell the story of this brand..."
            rows={6}
          />
        </label>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>03</span>
          <h2>Links</h2>
        </div>

        <label>
          Website

          <input
            value={websiteUrl}
            onChange={(e) =>
              setWebsiteUrl(e.target.value)
            }
            placeholder="https://..."
          />
        </label>

        <label>
          Instagram

          <input
            value={instagramUrl}
            onChange={(e) =>
              setInstagramUrl(e.target.value)
            }
            placeholder="https://instagram.com/..."
          />
        </label>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>04</span>
          <h2>Visibility</h2>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Published</strong>
            <span>
              Show this brand on the website.
            </span>
          </div>

          <button
            type="button"
            className={`toggle ${
              published ? "active" : ""
            }`}
            onClick={() =>
              setPublished(!published)
            }
          >
            <span />
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Featured</strong>
            <span>
              Highlight this brand on the homepage.
            </span>
          </div>

          <button
            type="button"
            className={`toggle ${
              featured ? "active" : ""
            }`}
            onClick={() =>
              setFeatured(!featured)
            }
          >
            <span />
          </button>
        </div>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/brands")
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="primary-button"
        >
          {saving
            ? "Saving..."
            : brand
              ? "Save changes"
              : "Create brand"}
        </button>
      </div>
    </form>
  );
}