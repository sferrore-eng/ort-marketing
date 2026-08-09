type CMSOverviewProps = {
  stats: {
    brands: number;
    projects: number;
    team: number;
    bts: number;
    media: number;
  };
};

export default function CMSOverview({ stats }: CMSOverviewProps) {
  const items = [
    ["Brands", stats.brands],
    ["Projects", stats.projects],
    ["Team", stats.team],
    ["BTS", stats.bts],
    ["Media", stats.media],
  ];

  return (
    <div className="cms-overview-grid">
      {items.map(([label, value]) => (
        <div className="cms-stat-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
