/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

type MediaItem = {
  id: string;
  url: string;
  filename?: string;
};

type Props = {
  value?: string;
  onChange: (url: string) => void;
};

export default function MediaPicker({
  value,
  onChange,
}: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadMedia() {
    setLoading(true);

    try {
      const response = await fetch("/api/media");

      if (!response.ok) return;

      const data = await response.json();

      setMedia(data.media ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      loadMedia();
    }
  }, [open]);

  return (
    <div className="cms-media-picker">

      {value && (
        <div className="cms-media-preview">
          <img src={value} alt="Selected media" />

          <button
            type="button"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        </div>
      )}

      <button
        type="button"
        className="cms-media-picker-button"
        onClick={() => setOpen(true)}
      >
        {value ? "Change image" : "Choose from Media Library"}
      </button>

      {open && (
        <div className="cms-media-modal">

          <div className="cms-media-modal-inner">

            <div className="cms-media-modal-header">
              <div>
                <span>ORT / MEDIA</span>
                <h3>Select image</h3>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            {loading ? (
              <div className="cms-empty">
                Loading media...
              </div>
            ) : media.length === 0 ? (
              <div className="cms-empty">
                No media available.
              </div>
            ) : (
              <div className="cms-picker-grid">

                {media.map((item) => (
                  <button
                    type="button"
                    className="cms-picker-item"
                    key={item.id}
                    onClick={() => {
                      onChange(item.url);
                      setOpen(false);
                    }}
                  >
                    <img
                      src={item.url}
                      alt={
                        item.filename ||
                        "ORT media"
                      }
                    />

                    <span>
                      {item.filename || "Image"}
                    </span>
                  </button>
                ))}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
