import { createClient } from "@/lib/supabase/server";

export async function getHomepageCMS() {
  const supabase = await createClient();

  const [{ data: settings }, { data: sections }] = await Promise.all([
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle(),

    supabase
      .from("site_sections")
      .select("*")
      .order("created_at", { ascending: true }),
  ]);

  return {
    settings,
    sections: sections ?? [],
  };
}
