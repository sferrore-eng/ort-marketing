import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CMSOverview from "@/components/admin/cms/CMSOverview";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    brands,
    projects,
    team,
    bts,
    media,
  ] = await Promise.all([
    supabase.from("brands").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("team_members").select("id", { count: "exact", head: true }),
    supabase.from("bts").select("id", { count: "exact", head: true }),
    supabase.from("media").select("id", { count: "exact", head: true }),
  ]);

  const stats = {
    brands: brands.count ?? 0,
    projects: projects.count ?? 0,
    team: team.count ?? 0,
    bts: bts.count ?? 0,
    media: media.count ?? 0,
  };

  return (
    <main className="cms-page">
      <div className="cms-page-header">
        <div>
          <span>ORT / ADMIN</span>
          <h1>Dashboard</h1>
          <p>
            Overview of your ORT Marketing website.
          </p>
        </div>
      </div>

      <CMSOverview stats={stats} />

      <section className="cms-card">
        <div className="cms-section-head">
          <div>
            <span>CONTENT MANAGEMENT</span>
            <h2>Manage your website</h2>
          </div>
        </div>

        <div className="cms-quick-actions">
          <Link href="/admin/brands">
            Manage Brands ↗
          </Link>

          <Link href="/admin/projects">
            Manage Projects ↗
          </Link>

          <Link href="/admin/team">
            Manage Team ↗
          </Link>

          <Link href="/admin/bts">
            Manage BTS ↗
          </Link>

          <Link href="/admin/media">
            Media Library ↗
          </Link>

          <Link href="/admin/content">
            Homepage Content ↗
          </Link>

          <Link href="/admin/settings">
            Site Settings ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
