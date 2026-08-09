import AdminSidebar from "@/app/admin/components/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
