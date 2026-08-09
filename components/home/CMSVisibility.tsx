type CMSSection = {
  key?: string;
  slug?: string;
  name?: string;
  enabled?: boolean;
};

type CMSVisibilityProps = {
  section: string;
  sections: CMSSection[];
  children: React.ReactNode;
};

export default function CMSVisibility({
  section,
  sections,
  children,
}: CMSVisibilityProps) {
  const item = sections.find(
    (entry) =>
      entry.key === section ||
      entry.slug === section ||
      entry.name === section
  );

  if (item && item.enabled === false) {
    return null;
  }

  return <>{children}</>;
}
