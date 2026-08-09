"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/brands/ImageUpload";

const roles = [
  {
    value: "model",
    label: "Model",
  },
  {
    value: "photographer",
    label: "Photographer",
  },
  {
    value: "director",
    label: "Director",
  },
  {
    value: "editor",
    label: "Editor",
  },
  {
    value: "other",
    label: "Other",
  },
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function TeamMemberForm() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [role, setRole] = useState("model");
  const [profileUrl, setProfileUrl] = useState("");
  const [bio, setBio] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const slug = createSlug(name);

    if (!slug) {
      setError(
        "Please use an English name so a profile URL can be created."
      );
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("team_members")
      .insert({
        name: name.trim(),
        slug,
        role,
        profile_url: profileUrl || null,
        bio: bio || null,
        instagram_url: instagramUrl || null,
        website_url: websiteUrl || null,
        published: true,
        featured: false,
      });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/team");
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
          <h2>Profile</h2>
        </div>

        <div className="form-grid">
          <label>
            Name

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
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
              setInstagramUrl(e.target.value)
            }
            placeholder="https://instagram.com/..."
          />
        </label>

        <label>
          Website / Portfolio

          <input
            value={websiteUrl}
            onChange={(e) =>
              setWebsiteUrl(e.target.value)
            }
            placeholder="https://..."
          />
        </label>
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
            ? "Creating..."
            : "Create profile"}
        </button>
      </div>
    </form>
  );
}
