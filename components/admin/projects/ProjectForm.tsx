"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/brands/ImageUpload";

type Brand = {
  id: string;
  name: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

type ProjectFormProps = {
  brands: Brand[];
  teamMembers: TeamMember[];
};

function createSlug(value: string) {
  const arabicMap: Record<string, string> = {
    ا: "a", أ: "a", إ: "i", آ: "a",
    ب: "b", ت: "t", ث: "th", ج: "j",
    ح: "h", خ: "kh", د: "d", ذ: "dh",
    ر: "r", ز: "z", س: "s", ش: "sh",
    ص: "s", ض: "d", ط: "t", ظ: "z",
    ع: "a", غ: "gh", ف: "f", ق: "q",
    ك: "k", ل: "l", م: "m", ن: "n",
    ه: "h", و: "w", ي: "y", ى: "a",
    ة: "a", ء: "", ؤ: "w", ئ: "y",
  };

  return value
    .split("")
    .map((char) => arabicMap[char] ?? char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const roles = [
  { value: "model", label: "Model" },
  { value: "photographer", label: "Photographer" },
  { value: "director", label: "Director" },
  { value: "editor", label: "Editor" },
  { value: "other", label: "Other" },
];

export default function ProjectForm({
  brands,
  teamMembers,
}: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brandId, setBrandId] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [selectedTeam, setSelectedTeam] = useState<
    Record<string, string[]>
  >({});

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSlug(createSlug(title));
  }, [title]);

  function toggleMember(role: string, memberId: string) {
    setSelectedTeam((current) => {
      const existing = current[role] || [];

      return {
        ...current,
        [role]: existing.includes(memberId)
          ? existing.filter((id) => id !== memberId)
          : [...existing, memberId],
      };
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!brandId) {
      setError("Please select a brand.");
      return;
    }

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    setSaving(true);
    setError("");

    const projectResult = await supabase
      .from("projects")
      .insert({
        brand_id: brandId,
        title: title.trim(),
        slug,
        description: description || null,
        cover_url: coverUrl || null,
        published: true,
        featured: false,
      })
      .select("id")
      .single();

    if (projectResult.error) {
      setError(projectResult.error.message);
      setSaving(false);
      return;
    }

    const projectId = projectResult.data.id;

    const teamRows = Object.entries(selectedTeam).flatMap(
      ([role, memberIds]) =>
        memberIds.map((teamMemberId) => ({
          project_id: projectId,
          team_member_id: teamMemberId,
          role,
        }))
    );

    if (teamRows.length > 0) {
      const teamResult = await supabase
        .from("project_team")
        .insert(teamRows);

      if (teamResult.error) {
        await supabase
          .from("projects")
          .delete()
          .eq("id", projectId);

        setError(teamResult.error.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/projects");
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
          <h2>Project identity</h2>
        </div>

        <div className="form-grid">
          <label>
            Project title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summer Campaign"
              required
            />
          </label>

          <label>
            Brand
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
            >
              <option value="">
                Select brand
              </option>

              {brands.map((brand) => (
                <option
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ImageUpload
          label="Project cover"
          value={coverUrl}
          onChange={setCoverUrl}
          folder="projects/covers"
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>02</span>
          <h2>About the project</h2>
        </div>

        <label>
          Description

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Tell the story of this project..."
            rows={7}
          />
        </label>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <span>03</span>
          <h2>Creative team</h2>
        </div>

        {roles.map((role) => {
          const members = teamMembers.filter(
            (member) => member.role === role.value
          );

          return (
            <div
              key={role.value}
              className="team-role-section"
            >
              <h3>{role.label}</h3>

              {members.length === 0 ? (
                <p className="muted">
                  No {role.label.toLowerCase()} profiles yet.
                </p>
              ) : (
                <div className="team-select-grid">
                  {members.map((member) => {
                    const active =
                      selectedTeam[role.value]?.includes(
                        member.id
                      );

                    return (
                      <button
                        key={member.id}
                        type="button"
                        className={`team-select-card ${
                          active ? "selected" : ""
                        }`}
                        onClick={() =>
                          toggleMember(
                            role.value,
                            member.id
                          )
                        }
                      >
                        <span className="team-select-check">
                          {active ? "✓" : ""}
                        </span>

                        <strong>{member.name}</strong>

                        <small>{member.role}</small>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
            router.push("/admin/projects")
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
          {saving ? "Creating..." : "Create project"}
        </button>
      </div>
    </form>
  );
}