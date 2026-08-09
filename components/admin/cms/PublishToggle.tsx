"use client";

import { useState } from "react";

type Props = {
  table: string;
  id: string;
  published: boolean;
  featured?: boolean;
};

export default function PublishToggle({
  table,
  id,
  published,
  featured = false,
}: Props) {
  const [isPublished, setIsPublished] = useState(published);
  const [isFeatured, setIsFeatured] = useState(featured);
  const [loading, setLoading] = useState(false);

  async function update(values: {
    published?: boolean;
    featured?: boolean;
  }) {
    setLoading(true);

    try {
      const response = await fetch("/api/cms/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table,
          id,
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      if (values.published !== undefined) {
        setIsPublished(values.published);
      }

      if (values.featured !== undefined) {
        setIsFeatured(values.featured);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cms-publish-toggle">
      <button
        type="button"
        disabled={loading}
        onClick={() =>
          update({ published: !isPublished })
        }
      >
        {isPublished ? "Published" : "Draft"}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() =>
          update({ featured: !isFeatured })
        }
      >
        {isFeatured ? "Featured" : "Feature"}
      </button>
    </div>
  );
}
