import { createClient } from "@/lib/supabase/server";
import ContentManager from "@/components/admin/cms/ContentManager";
import HeroEditor from "@/components/admin/cms/HeroEditor";

export default async function ContentPage() {
  const supabase = await createClient();

  const [
    { data: brands },
    { data: projects },
    { data: team },
    { data: bts },
  ] = await Promise.all([
    supabase
      .from("brands")
      .select("id,name,slug,published,featured")
      .order("created_at", { ascending: false }),

    supabase
      .from("projects")
      .select("id,title,slug,published,featured")
      .order("created_at", { ascending: false }),

    supabase
      .from("team_members")
      .select("id,name,slug,published,featured")
      .order("created_at", { ascending: false }),

    supabase
      .from("bts")
      .select("id,title,slug,published,featured")
      .order("created_at", { ascending: false }),
  ]);

  const groups = [
    {
      title: "Brands",
      table: "brands",
      items: brands ?? [],
    },
    {
      title: "Projects",
      table: "projects",
      items: projects ?? [],
    },
    {
      title: "Team",
      table: "team_members",
      items: team ?? [],
    },
    {
      title: "BTS",
      table: "bts",
      items: bts ?? [],
    },
  ];

  return (
    <main className="cms-page">

      <div className="cms-page-header">
        <div>
          <span>ORT / CMS</span>
          <h1>Content</h1>
          <p>
            Search, filter and control everything
            published on the ORT website.
          </p>
        </div>
      </div>

      <HeroEditor
        initialTitle={undefined}
        initialSubtitle={undefined}
        initialDescription={undefined}
      />

      <ContentManager groups={groups} />

    </main>
  );
}
