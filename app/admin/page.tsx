import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/login");
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">ORT MARKETING</span>
          <h1>Dashboard</h1>
        </div>

        <form action="/auth/signout" method="post">
          <button className="logout-button" type="submit">
            Logout
          </button>
        </form>
      </header>

      <section className="admin-welcome">
        <p>Welcome back.</p>
        <h2>{user.email}</h2>
      </section>

      <section className="dashboard-grid">
        <article>
          <span>01</span>
          <h3>Brands</h3>
          <p>Manage clients and brand profiles.</p>
        </article>

        <article>
          <span>02</span>
          <h3>Projects</h3>
          <p>Manage campaigns and creative work.</p>
        </article>

        <article>
          <span>03</span>
          <h3>People</h3>
          <p>Models, editors, photographers and directors.</p>
        </article>

        <article>
          <span>04</span>
          <h3>Media</h3>
          <p>Photos, reels and behind the scenes.</p>
        </article>

        <article>
          <span>05</span>
          <h3>Website</h3>
          <p>Control the public website experience.</p>
        </article>

        <article>
          <span>06</span>
          <h3>Settings</h3>
          <p>Global ORT Marketing settings.</p>
        </article>
      </section>
    </main>
  );
}