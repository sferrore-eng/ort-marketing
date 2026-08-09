import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublishToggle from "@/components/admin/cms/PublishToggle";

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
      name: (item: any) => item.name,
    },
    {
      title: "Projects",
      table: "projects",
      items: projects ?? [],
      name: (item: any) => item.title,
    },
    {
      title: "Team",
      table: "team_members",
      items: team ?? [],
      name: (item: any) => item.name,
    },
    {
      title: "BTS",
      table: "bts",
      items: bts ?? [],
      name: (item: any) => item.title,
    },
  ];

  return (
    <main className="cms-page">

      <div className="cms-page-header">
        <div>
          <span>ORT / CMS</span>
          <h1>Content</h1>
          <p>
            Control what appears on the public website.
          </p>
        </div>
      </div>

      {groups.map((group) => (
        <section
          className="cms-card"
          key={group.table}
        >
          <div className="cms-section-head">
            <div>
              <span>{group.title.toUpperCase()}</span>
              <h2>{group.items.length} items</h2>
            </div>

            <Link
              href={`/admin/${group.table === "team_members" ? "team" : group.table}`}
            >
              Manage ↗
            </Link>
          </div>

          {group.items.length === 0 ? (
            <div className="cms-empty">
              No {group.title.toLowerCase()} yet.
            </div>
          ) : (
            <div className="cms-content-list">
              {group.items.map((item: any) => (
                <div
                  className="cms-content-row"
                  key={item.id}
                >
                  <div>
                    <strong>
                      {group.name(item)}
                    </strong>

                    <small>
                      /{item.slug}
                    </small>
                  </div>

                  <PublishToggle
                    table={group.table}
                    id={item.id}
                    published={item.published !== false}
                    featured={item.featured === true}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

    </main>
  );
}
