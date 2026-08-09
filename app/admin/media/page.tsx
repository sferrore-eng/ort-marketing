import MediaLibrary from "@/components/admin/media/MediaLibrary";

export default function MediaPage() {
  return (
    <main className="projects-page">
      <header className="projects-page-header">
        <div>
          <span className="cms-header-eyebrow">
            ORT MARKETING / MEDIA
          </span>

          <h1>Media Library</h1>

          <p className="brands-page-description">
            Manage images uploaded to the ORT
            Marketing media library.
          </p>
        </div>
      </header>

      <MediaLibrary />
    </main>
  );
}