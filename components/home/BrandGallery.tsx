import Link from "next/link";

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  cover_url?: string | null;
  featured?: boolean | null;
};

export default function BrandGallery({ brands }: { brands: Brand[] }) {
  const visibleBrands = brands.slice(0, 8);

  if (!visibleBrands.length) {
    return (
      <section className="home-brands-section" id="brands">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">02 / CLIENTS</span>
            <h2>
              Brands we
              <br />
              <span>build with.</span>
            </h2>
          </div>
        </div>

        <div className="home-empty-state">
          No published brands yet.
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="home-brands-section" id="brands">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">02 / CLIENTS</span>
            <h2>
              Brands we
              <br />
              <span>build with.</span>
            </h2>
          </div>

          <p>
            A selection of brands we have helped shape, build and move
            forward.
          </p>
        </div>

        <div className="home-brand-grid">
          {visibleBrands.map((brand, index) => (
            <Link
              href={`/brands/${brand.slug}`}
              className={`home-brand-card ${
                index === 0 ? "home-brand-card-featured" : ""
              }`}
              key={brand.id}
            >
              <div className="home-brand-media">
                {brand.cover_url ? (
                  <img
                    src={brand.cover_url}
                    alt={brand.name}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="home-brand-placeholder">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        style={{
                          width: "45%",
                          height: "auto",
                          objectFit: "contain",
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                    ) : (
                      <span>{brand.name.charAt(0)}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="home-brand-shade" />

              <div className="home-brand-info">
                <div className="home-brand-logo">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt="" />
                  ) : (
                    <span>{brand.name}</span>
                  )}
                </div>

                <span className="home-brand-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <span className="home-brand-hover">
                VIEW BRAND ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-marquee-section">
        <div className="home-marquee-track">
          {[0, 1, 2].map((copy) => (
            <div className="home-marquee-item" key={copy}>
              {visibleBrands.map((brand) => (
                <span key={`${copy}-${brand.id}`}>
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} />
                  ) : (
                    <span>{brand.name}</span>
                  )}
                  <i>✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
