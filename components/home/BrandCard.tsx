import Link from "next/link";

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  description: string | null;
};

type BrandCardProps = {
  brand: Brand;
  index: number;
};

export default function BrandCard({
  brand,
  index,
}: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={`home-brand-card ${
        index === 0 ? "home-brand-card-featured" : ""
      }`}
    >
      <div className="home-brand-media">
        {brand.cover_url ? (
          <img
            src={brand.cover_url}
            alt={brand.name}
          />
        ) : (
          <div className="home-brand-placeholder">
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
        )}

        <div className="home-brand-shade" />
      </div>

      <div className="home-brand-info">
        <div className="home-brand-logo">
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={`${brand.name} logo`}
            />
          ) : (
            <span>{brand.name}</span>
          )}
        </div>

        <span className="home-brand-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="home-brand-hover">
        <span>VIEW BRAND ↗</span>
      </div>
    </Link>
  );
}