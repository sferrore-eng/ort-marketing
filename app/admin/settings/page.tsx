import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (
    <main className="cms-page">
      <div className="cms-page-header">
        <div>
          <span>ORT / CMS</span>
          <h1>Site Settings</h1>
          <p>Manage the global information used across the website.</p>
        </div>
      </div>

      <section className="cms-card">
        <div className="cms-field">
          <label>Site name</label>
          <input
            defaultValue={settings?.site_name ?? "ORT Marketing"}
            placeholder="ORT Marketing"
          />
        </div>

        <div className="cms-field">
          <label>Site description</label>
          <textarea
            defaultValue={settings?.description ?? ""}
            placeholder="Creative production & marketing."
            rows={5}
          />
        </div>

        <div className="cms-field">
          <label>Contact email</label>
          <input
            type="email"
            defaultValue={settings?.email ?? "hello@ortmarketing.com"}
            placeholder="hello@ortmarketing.com"
          />
        </div>

        <div className="cms-field">
          <label>Instagram</label>
          <input
            defaultValue={settings?.instagram ?? ""}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="cms-field">
          <label>Facebook</label>
          <input
            defaultValue={settings?.facebook ?? ""}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="cms-field">
          <label>LinkedIn</label>
          <input
            defaultValue={settings?.linkedin ?? ""}
            placeholder="https://linkedin.com/..."
          />
        </div>

        <div className="cms-actions">
          <button type="button">
            Save settings
          </button>
        </div>
      </section>
    </main>
  );
}
