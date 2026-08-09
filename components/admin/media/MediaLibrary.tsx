"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type MediaFile = {
  name: string;
  path: string;
  url: string;
  size?: number;
};

const folders = [
  "all",
  "brands/logos",
  "brands/covers",
  "projects/covers",
  "team/profiles",
];

function formatFileSize(size?: number) {
  if (!size) return "";

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary() {
  const supabase = createClient();

  const [files, setFiles] = useState<MediaFile[]>(
    []
  );

  const [folder, setFolder] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadFiles() {
    setLoading(true);
    setError("");

    const foldersToLoad =
      folder === "all"
        ? folders.filter(
            (item) => item !== "all"
          )
        : [folder];

    const allFiles: MediaFile[] = [];

    for (const currentFolder of foldersToLoad) {
      const { data, error } =
        await supabase.storage
          .from("media")
          .list(currentFolder, {
            limit: 100,
            sortBy: {
              column: "created_at",
              order: "desc",
            },
          });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      for (const file of data || []) {
        if (!file.name) continue;

        const path =
          `${currentFolder}/${file.name}`;

        const {
          data: publicData,
        } = supabase.storage
          .from("media")
          .getPublicUrl(path);

        allFiles.push({
          name: file.name,
          path,
          url: publicData.publicUrl,
          size: file.metadata?.size,
        });
      }
    }

    setFiles(allFiles);
    setLoading(false);
  }

  useEffect(() => {
    loadFiles();
  }, [folder]);

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles =
      event.target.files;

    if (!selectedFiles?.length) {
      return;
    }

    setUploading(true);
    setError("");

    const uploadFolder =
      folder === "all"
        ? "uploads"
        : folder;

    for (const file of Array.from(
      selectedFiles
    )) {
      if (!file.type.startsWith("image/")) {
        setError(
          "Only image files are allowed."
        );
        continue;
      }

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        setError(
          `${file.name} is larger than 10MB.`
        );
        continue;
      }

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const filePath =
        `${uploadFolder}/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("media")
          .upload(
            filePath,
            file,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );

      if (uploadError) {
        setError(
          uploadError.message
        );
      }
    }

    event.target.value = "";

    setUploading(false);

    await loadFiles();
  }

  async function deleteFile(
    file: MediaFile
  ) {
    const confirmed =
      window.confirm(
        `Delete "${file.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase.storage
        .from("media")
        .remove([file.path]);

    if (error) {
      setError(error.message);
      return;
    }

    setFiles((current) =>
      current.filter(
        (item) =>
          item.path !== file.path
      )
    );
  }

  async function copyUrl(
    url: string
  ) {
    try {
      await navigator.clipboard.writeText(
        url
      );

      alert("URL copied.");
    } catch {
      setError(
        "Unable to copy URL."
      );
    }
  }

  const filteredFiles =
    files.filter((file) =>
      file.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="media-library">
      <div className="media-toolbar">
        <div className="media-search">
          <input
            type="search"
            placeholder="Search media..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <div className="media-upload">
          <label className="button-primary">
            {uploading
              ? "Uploading..."
              : "Upload images"}

            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={uploading}
              onChange={
                handleUpload
              }
            />
          </label>
        </div>
      </div>

      <div className="media-folders">
        {folders.map(
          (item) => (
            <button
              key={item}
              type="button"
              className={
                folder === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFolder(item)
              }
            >
              {item === "all"
                ? "All"
                : item
                    .split("/")
                    .pop()}
            </button>
          )
        )}
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="media-empty">
          Loading media...
        </div>
      ) : filteredFiles.length ===
        0 ? (
        <div className="media-empty">
          <span>00</span>

          <h2>
            No media found.
          </h2>

          <p>
            Upload an image to start
            building your library.
          </p>
        </div>
      ) : (
        <div className="media-grid">
          {filteredFiles.map(
            (file) => (
              <article
                key={file.path}
                className="media-card"
              >
                <div className="media-image">
                  <img
                    src={file.url}
                    alt={file.name}
                  />
                </div>

                <div className="media-card-info">
                  <strong
                    title={file.name}
                  >
                    {file.name}
                  </strong>

                  <span>
                    {formatFileSize(
                      file.size
                    )}
                  </span>
                </div>

                <div className="media-card-actions">
                  <button
                    type="button"
                    onClick={() =>
                      copyUrl(
                        file.url
                      )
                    }
                  >
                    Copy URL
                  </button>

                  <button
                    type="button"
                    className="delete-action"
                    onClick={() =>
                      deleteFile(
                        file
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}