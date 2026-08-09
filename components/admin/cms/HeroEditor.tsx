"use client";

import { useState } from "react";

type Props = {
  initialTitle?: string;
  initialSubtitle?: string;
  initialDescription?: string;
};

export default function HeroEditor({
  initialTitle = "We make brands impossible to ignore.",
  initialSubtitle = "ORT MARKETING / CREATIVE PRODUCTION",
  initialDescription = "Creative production, visual storytelling and campaigns built to move culture forward.",
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [description, setDescription] =
    useState(initialDescription);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/cms/hero",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            subtitle,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Save failed"
        );
      }

      setMessage("Hero saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Save failed."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="cms-card">

      <div className="cms-section-head">
        <div>
          <span>HOMEPAGE / HERO</span>
          <h2>Hero Content</h2>
        </div>
      </div>

      <div className="cms-field">
        <label>Eyebrow</label>
        <input
          value={subtitle}
          onChange={(e) =>
            setSubtitle(e.target.value)
          }
        />
      </div>

      <div className="cms-field">
        <label>Headline</label>
        <textarea
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          rows={3}
        />
      </div>

      <div className="cms-field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
        />
      </div>

      <div className="cms-actions">
        <button
          type="button"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Hero"}
        </button>
      </div>

      {message && (
        <div className="cms-message">
          {message}
        </div>
      )}

    </div>
  );
}
