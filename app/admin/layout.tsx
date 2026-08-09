import AdminSidebar from "./components/AdminSidebar";
import CMSHeader from "@/components/admin/cms/CMSHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cms-shell">
      <AdminSidebar />

      <main className="cms-main">
        <CMSHeader />

        <div className="cms-content">
          {children}
        </div>
      </main>
    </div>
  );
}