import Link from "next/link";

export default function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-background">
        <div className="home-hero-gradient" />
      </div>

      <div className="home-hero-content">
        <div className="home-hero-kicker">
          ORT MARKETING / CREATIVE STUDIO
        </div>

        <h1>
          We make
          <br />
          <span>brands move.</span>
        </h1>

        <p>
          Creative production, visual storytelling and marketing
          for brands ready to be seen differently.
        </p>

        <div className="home-hero-actions">
          <Link href="#brands" className="home-button">
            Explore our brands ↗
          </Link>

          <Link href="#contact" className="home-button home-button-light">
            Start a project
          </Link>
        </div>
      </div>

      <div className="home-hero-bottom">
        <span>SCROLL TO EXPLORE</span>
        <span className="home-hero-line" />
      </div>
    </section>
  );
}