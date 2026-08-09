"use client";

import { ChangeEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  folder,
}: ImageUploadProps) {
  const supabase = createClient();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      return;
    }

    setUploading(true);

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(filePath);

    onChange(publicUrl);

    setUploading(false);
  }

  return (
    <div className="image-upload">
      <div className="image-upload-header">
        <label>{label}</label>

        {value && <span>Uploaded</span>}
      </div>

      {value ? (
        <div className="image-preview">
          <img src={value} alt={label} />

          <button
            type="button"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />

          <div>
            <strong>
              {uploading ? "Uploading..." : "Upload image"}
            </strong>

            <span>JPG, PNG or WEBP · Max 10MB</span>
          </div>
        </label>
      )}

      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}