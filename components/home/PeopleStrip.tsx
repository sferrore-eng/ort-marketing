type Person = {
  id: string;
  name: string;
  slug: string;
  role: string | null;
  profile_url: string | null;
};

type PeopleStripProps = {
  people: Person[];
};

export default function PeopleStrip({
  people,
}: PeopleStripProps) {
  if (!people.length) return null;

  return (
    <section className="home-people-section">
      <div className="home-section-heading">
        <div>
          <span className="home-eyebrow">
            02 / THE PEOPLE
          </span>

          <h2>
            The people
            <br />
            <span>behind the lens.</span>
          </h2>
        </div>

        <p>
          Models, photographers, directors and creatives
          who turn ideas into images.
        </p>
      </div>

      <div className="home-people-strip">
        {people.map((person) => (
          <div
            className="home-person-card"
            key={person.id}
          >
            <div className="home-person-image">
              {person.profile_url ? (
                <img
                  src={person.profile_url}
                  alt={person.name}
                />
              ) : (
                <span>
                  {person.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="home-person-info">
              <strong>{person.name}</strong>
              <span>{person.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}