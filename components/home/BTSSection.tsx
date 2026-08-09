type BTSItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
};

type BTSSectionProps = {
  items: BTSItem[];
};

export default function BTSSection({
  items,
}: BTSSectionProps) {
  if (!items.length) return null;

  return (
    <section className="home-bts-section">
      <div className="home-section-heading">
        <div>
          <span className="home-eyebrow">
            03 / BEHIND THE SCENES
          </span>

          <h2>
            Before the
            <br />
            <span>final cut.</span>
          </h2>
        </div>

        <p>
          The people, places and moments behind
          the work.
        </p>
      </div>

      <div className="home-bts-list">
        {items.map((item) => (
          <article
            className="home-bts-card"
            key={item.id}
          >
            <div className="home-bts-media">
              {item.cover_url ? (
                <img
                  src={item.cover_url}
                  alt={item.title}
                />
              ) : (
                <div className="home-bts-placeholder">
                  BTS
                </div>
              )}

              <span className="home-bts-play">
                ▶
              </span>
            </div>

            <div className="home-bts-info">
              <span>BEHIND THE SCENES</span>
              <h3>{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}