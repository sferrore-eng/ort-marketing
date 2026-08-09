"use client";

import { useEffect, useState } from "react";

type MediaItem = {
  id: string;
  url: string;
  filename?: string;
  mime_type?: string;
  size?: number;
};

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadMedia() {
    const response = await fetch("/api/media");

    if (!response.ok) return;

    const data = await response.json();

    setMedia(data.media ?? []);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "/api/media/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      setMessage("Upload successful.");
      await loadMedia();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="cms-card">

      <div className="cms-section-head">
        <div>
          <span>MEDIA</span>
          <h2>Media Library</h2>
          <p>
            Upload and manage images used across ORT.
          </p>
        </div>

        <label className="cms-upload-button">
          {uploading
            ? "Uploading..."
            : "Upload image"}

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>
      </div>

      {message && (
        <div className="cms-message">
          {message}
        </div>
      )}

      {media.length === 0 ? (
        <div className="cms-empty">
          <strong>No media yet.</strong>
          <p>
            Upload your first image to start building
            the ORT media library.
          </p>
        </div>
      ) : (
        <div className="cms-media-grid">
          {media.map((item) => (
            <div
              className="cms-media-item"
              key={item.id}
            >
              <img
                src={item.url}
                alt={item.filename || "ORT media"}
              />

              <div>
                <strong>
                  {item.filename || "Image"}
                </strong>

                <small>
                  {item.mime_type || "image"}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
