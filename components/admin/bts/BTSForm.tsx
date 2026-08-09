"use client";

import MediaField from "@/components/admin/media/MediaField";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/brands/ImageUpload";

type BTSItem = {
  id?: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  featured: boolean;
};

type BTSFormProps = {
  item?: BTSItem;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BTSForm({ item }: BTSFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isEditing = Boolean(item?.id);

  const [title, setTitle] = useState(item?.title || "");
  const [slug, setSlug] = useState(item?.slug || "");
  const [description, setDescription] = useState(item?.description || "");
  const [coverUrl, setCoverUrl] = useState(item?.cover_url || "");
  const [published, setPublished] = useState(item?.published ?? true);
  const [featured, setFeatured] = useState(item?.featured ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!isEditing) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create BTS content.");
      setSaving(false);
      return;
    }

    const payload = {
        user_id: user.id,
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      cover_url: coverUrl || null,
      published,
      featured,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("bts")
        .update(payload)
        .eq("id", item!.id);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("bts")
        .insert(payload);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/bts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-title">
          <span>01</span>
          <h2>Behind the Scenes</h2>
        </div>

        <div className="form-grid">
          <label>
            Title
            <input
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Behind the Scenes title"
              required
            />
          </label>

          <label>
            URL slug
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="behind-the-scenes"
              required
            />
          </label>
        </div>

        <ImageUpload
          label="Cover image"
          value={coverUrl}
          onChange={setCoverUrl}
          folder="bts/covers"
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>02</span>
          <h2>Content</h2>
        </div>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tell the story behind this content..."
            rows={8}
          />
        </label>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>03</span>
          <h2>Visibility</h2>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Published</strong>
            <span>Show this content on the website.</span>
          </div>

          <button
            type="button"
            className={`toggle ${published ? "active" : ""}`}
            onClick={() => setPublished(!published)}
          >
            <span />
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Featured</strong>
            <span>Highlight this content on the website.</span>
          </div>

          <button
            type="button"
            className={`toggle ${featured ? "active" : ""}`}
            onClick={() => setFeatured(!featured)}
          >
            <span />
          </button>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={() => router.push("/admin/bts")}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="button-primary"
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create BTS"}
        </button>
      </div>
    </form>
  );
}
