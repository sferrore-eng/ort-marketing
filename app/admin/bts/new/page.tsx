import BTSForm from "@/components/admin/bts/BTSForm";

export default function NewBTSPage() {
  return (
    <main className="admin-page">
      <header className="brands-page-header">
        <div>
          <span className="eyebrow">
            ORT MARKETING / CONTENT
          </span>

          <h1>New Behind the Scenes</h1>

          <p className="brands-page-description">
            Create a new behind-the-scenes entry.
          </p>
        </div>
      </header>

      <BTSForm />
    </main>
  );
}
