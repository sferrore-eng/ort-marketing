import Link from "next/link";
import BrandForm from "@/components/admin/brands/BrandForm";

export default function NewBrandPage() {
  return (
    <main className="admin-page">
      <header className="admin-inner-header">
        <div>
          <span className="admin-eyebrow">
            BRANDS / NEW
          </span>

          <h1>Create brand</h1>
        </div>

        <Link
          href="/admin/brands"
          className="back-link"
        >
          ← All brands
        </Link>
      </header>

      <BrandForm />
    </main>
  );
}