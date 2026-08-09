/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import MediaField from "@/components/admin/media/MediaField";

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

type Project = {
  id: string;
  title: string;
  slug: string;
  brand_id: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  featured: boolean;
};

type ProjectTeamRow = {
  team_member_id: string;
  role: string;
};

type ProjectFormProps = {
  brands: Brand[];
  teamMembers: TeamMember[];
  project?: Project;
  projectTeam?: ProjectTeamRow[];
};

function createSlug(value: string) {
  const arabicMap: Record<string, string> = {
    ا: "a",
    أ: "a",
    إ: "i",
    آ: "a",
    ب: "b",
    ت: "t",
    ث: "th",
    ج: "j",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "dh",
    ر: "r",
    ز: "z",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "d",
    ط: "t",
    ظ: "z",
    ع: "a",
    غ: "gh",
    ف: "f",
    ق: "q",
    ك: "k",
    ل: "l",
    م: "m",
    ن: "n",
    ه: "h",
    و: "w",
    ي: "y",
    ى: "a",
    ة: "a",
    ء: "",
    ؤ: "w",
    ئ: "y",
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
  project,
  projectTeam = [],
}: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const isEditing = Boolean(project?.id);

  const [title, setTitle] = useState(
    project?.title || ""
  );

  const [slug, setSlug] = useState(
    project?.slug || ""
  );

  const [brandId, setBrandId] = useState(
    project?.brand_id || ""
  );

  const [description, setDescription] = useState(
    project?.description || ""
  );

  const [coverUrl, setCoverUrl] = useState(
    project?.cover_url || ""
  );

  const [published, setPublished] = useState(
    project?.published ?? true
  );

  const [featured, setFeatured] = useState(
    project?.featured ?? false
  );

  const [selectedTeam, setSelectedTeam] = useState<
    Record<string, string[]>
  >(() => {
    const initial: Record<string, string[]> = {};

    projectTeam.forEach((item) => {
      if (!initial[item.role]) {
        initial[item.role] = [];
      }

      initial[item.role].push(
        item.team_member_id
      );
    });

    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setSlug(createSlug(title));
    }
  }, [title, isEditing]);

  function toggleMember(
    role: string,
    memberId: string
  ) {
    setSelectedTeam((current) => {
      const existing = current[role] || [];

      return {
        ...current,
        [role]: existing.includes(memberId)
          ? existing.filter(
              (id) => id !== memberId
            )
          : [...existing, memberId],
      };
    });
  }

  async function handleSubmit(
    event: FormEvent
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

    if (!slug.trim()) {
      setError("Project slug is required.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      brand_id: brandId,
      title: title.trim(),
      slug: slug.trim(),
      description: description || null,
      cover_url: coverUrl || null,
      published,
      featured,
    };

    let projectId = project?.id;

    if (isEditing) {
      const result = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project?.id);

      if (result.error) {
        setError(result.error.message);
        setSaving(false);
        return;
      }
    } else {
      const result = await supabase
        .from("projects")
        .insert(payload)
        .select("id")
        .single();

      if (result.error) {
        setError(result.error.message);
        setSaving(false);
        return;
      }

      projectId = result.data.id;
    }

    if (!projectId) {
      setError("Project ID could not be determined.");
      setSaving(false);
      return;
    }

    const teamRows = Object.entries(
      selectedTeam
    ).flatMap(([role, memberIds]) =>
      memberIds.map((teamMemberId) => ({
        project_id: projectId,
        team_member_id: teamMemberId,
        role,
      }))
    );

    const deleteTeamResult = await supabase
      .from("project_team")
      .delete()
      .eq("project_id", projectId);

    if (deleteTeamResult.error) {
      setError(deleteTeamResult.error.message);
      setSaving(false);
      return;
    }

    if (teamRows.length > 0) {
      const teamResult = await supabase
        .from("project_team")
        .insert(teamRows);

      if (teamResult.error) {
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
      className="cms-form"
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
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Summer Campaign"
              required
            />
          </label>

          <label>
            Brand

            <select
              value={brandId}
              onChange={(e) =>
                setBrandId(e.target.value)
              }
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

        <label>
          URL slug

          <input
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            placeholder="summer-campaign"
            required
          />
        </label>

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
            (member) =>
              member.role === role.value
          );

          return (
            <div
              key={role.value}
              className="team-role-section"
            >
              <h3>{role.label}</h3>

              {members.length === 0 ? (
                <p className="muted">
                  No{" "}
                  {role.label.toLowerCase()}{" "}
                  profiles yet.
                </p>
              ) : (
                <div className="team-select-grid">
                  {members.map((member) => {
                    const active =
                      selectedTeam[
                        role.value
                      ]?.includes(member.id);

                    return (
                      <button
                        key={member.id}
                        type="button"
                        className={`team-select-card ${
                          active
                            ? "selected"
                            : ""
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

                        <strong>
                          {member.name}
                        </strong>

                        <small>
                          {member.role}
                        </small>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
              Show this project on the website.
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
              Highlight this project on the
              homepage.
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
          {saving
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create project"}
        </button>
      </div>
    </form>
  );
}