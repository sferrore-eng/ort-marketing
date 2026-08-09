"use client";

import MediaField from "@/components/admin/media/MediaField";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/brands/ImageUpload";

const roles = [
  { value: "model", label: "Model" },
  { value: "photographer", label: "Photographer" },
  { value: "director", label: "Director" },
  { value: "editor", label: "Editor" },
  { value: "other", label: "Other" },
];

type TeamMember = {
  id: string;
  name: string;
  slug: string;
  role: string;
  profile_url: string | null;
  bio: string | null;
  instagram_url: string | null;
  website_url: string | null;
  published: boolean;
  featured: boolean;
};

type TeamMemberFormProps = {
  member?: TeamMember;
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

export default function TeamMemberForm({
  member,
}: TeamMemberFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isEditing = Boolean(member?.id);

  const [name, setName] = useState(
    member?.name || ""
  );

  const [slug, setSlug] = useState(
    member?.slug || ""
  );

  const [role, setRole] = useState(
    member?.role || "model"
  );

  const [profileUrl, setProfileUrl] = useState(
    member?.profile_url || ""
  );

  const [bio, setBio] = useState(
    member?.bio || ""
  );

  const [instagramUrl, setInstagramUrl] =
    useState(member?.instagram_url || "");

  const [websiteUrl, setWebsiteUrl] =
    useState(member?.website_url || "");

  const [published, setPublished] =
    useState(member?.published ?? true);

  const [featured, setFeatured] =
    useState(member?.featured ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);

    if (!isEditing) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const finalSlug = slug.trim();

    if (!finalSlug) {
      setError(
        "Please use an English name so a profile URL can be created."
      );
      setSaving(false);
      return;
    }

    const payload = {
      name: name.trim(),
      slug: finalSlug,
      role,
      profile_url: profileUrl || null,
      bio: bio || null,
      instagram_url: instagramUrl || null,
      website_url: websiteUrl || null,
      published,
      featured,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("team_members")
        .update(payload)
        .eq("id", member!.id);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("team_members")
        .insert(payload);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/team");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="cms-form"
    >
      <div className="form-section">
        <div className="form-section-title">
          <span>01</span>
          <h2>Profile</h2>
        </div>

        <div className="form-grid">
          <label>
            Name

            <input
              value={name}
              onChange={(e) =>
                handleNameChange(
                  e.target.value
                )
              }
              placeholder="Sara Ahmed"
              required
            />
          </label>

          <label>
            Role

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              {roles.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          URL slug

          <input
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            placeholder="sara-ahmed"
            required
          />
        </label>

        <ImageUpload
          label="Profile image"
          value={profileUrl}
          onChange={setProfileUrl}
          folder="team/profiles"
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>02</span>
          <h2>About</h2>
        </div>

        <label>
          Bio

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            placeholder="Tell us about this person..."
            rows={7}
          />
        </label>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>03</span>
          <h2>Links</h2>
        </div>

        <label>
          Instagram

          <input
            value={instagramUrl}
            onChange={(e) =>
              setInstagramUrl(
                e.target.value
              )
            }
            placeholder="https://instagram.com/..."
          />
        </label>

        <label>
          Website / Portfolio

          <input
            value={websiteUrl}
            onChange={(e) =>
              setWebsiteUrl(
                e.target.value
              )
            }
            placeholder="https://..."
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
              Show this profile on the website.
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
              Highlight this person on the
              website.
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
            router.push("/admin/team")
          }
          className="button-secondary"
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
              : "Create profile"}
        </button>
      </div>
    </form>
  );
}