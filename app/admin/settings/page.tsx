import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function saveSettings(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const values = {
    site_name: String(formData.get("site_name") || ""),
    description: String(formData.get("description") || ""),
    email: String(formData.get("email") || ""),
    instagram: String(formData.get("instagram") || ""),
    facebook: String(formData.get("facebook") || ""),
    linkedin: String(formData.get("linkedin") || ""),
  };

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("site_settings")
      .update(values)
      .eq("id", existing.id);
  } else {
    await supabase
      .from("site_settings")
      .insert(values);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

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
          <p>
            Manage the global information used across the website.
          </p>
        </div>
      </div>

      <form action={saveSettings} className="cms-card">

        <div className="cms-field">
          <label>Site name</label>
          <input
            name="site_name"
            defaultValue={settings?.site_name ?? "ORT Marketing"}
            placeholder="ORT Marketing"
          />
        </div>

        <div className="cms-field">
          <label>Site description</label>
          <textarea
            name="description"
            defaultValue={settings?.description ?? ""}
            placeholder="Creative production & marketing."
            rows={5}
          />
        </div>

        <div className="cms-field">
          <label>Contact email</label>
          <input
            name="email"
            type="email"
            defaultValue={
              settings?.email ?? "hello@ortmarketing.com"
            }
            placeholder="hello@ortmarketing.com"
          />
        </div>

        <div className="cms-field">
          <label>Instagram</label>
          <input
            name="instagram"
            defaultValue={settings?.instagram ?? ""}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="cms-field">
          <label>Facebook</label>
          <input
            name="facebook"
            defaultValue={settings?.facebook ?? ""}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="cms-field">
          <label>LinkedIn</label>
          <input
            name="linkedin"
            defaultValue={settings?.linkedin ?? ""}
            placeholder="https://linkedin.com/..."
          />
        </div>

        <div className="cms-actions">
          <button type="submit">
            Save settings
          </button>
        </div>

      </form>

    </main>
  );
}
