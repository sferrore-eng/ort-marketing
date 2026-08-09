"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Image must be smaller than 15MB.");
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    await uploadFile(file);
  }

  async function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    await uploadFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function removeImage() {
    onChange("");
    setError("");
  }

  return (
    <div className="image-upload">
      <div className="image-upload-header">
        <strong>{label}</strong>

        {value && <span>Uploaded ✓</span>}
      </div>

      {value ? (
        <div className="image-preview">
          <img src={value} alt={label} />

          <button
            type="button"
            onClick={removeImage}
            disabled={uploading}
          >
            Remove
          </button>
        </div>
      ) : (
        <label
          className={`upload-box ${
            dragging ? "dragging" : ""
          } ${uploading ? "uploading" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleUpload}
            disabled={uploading}
          />

          <div className="upload-icon">
            {uploading ? "↑" : "+"}
          </div>

          <div className="upload-content">
            <strong>
              {uploading
                ? "Uploading..."
                : dragging
                  ? "Drop image here"
                  : "Upload image"}
            </strong>

            <span>
              Drag & drop or click to browse
            </span>

            <small>
              JPG, PNG, WEBP or AVIF · Max 15MB
            </small>
          </div>
        </label>
      )}

      {error && (
        <p className="upload-error">
          {error}
        </p>
      )}
    </div>
  );
}