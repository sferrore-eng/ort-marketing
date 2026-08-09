type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
};

type BrandMarqueeProps = {
  brands: Brand[];
};

export default function BrandMarquee({
  brands,
}: BrandMarqueeProps) {
  if (!brands.length) return null;

  const items = [...brands, ...brands, ...brands];

  return (
    <section className="home-marquee-section">
      <div className="home-marquee-track">
        {items.map((brand, index) => (
          <div
            className="home-marquee-item"
            key={`${brand.id}-${index}`}
          >
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
              />
            ) : (
              <span>{brand.name}</span>
            )}

            <i>✦</i>
          </div>
        ))}
      </div>
    </section>
  );
}