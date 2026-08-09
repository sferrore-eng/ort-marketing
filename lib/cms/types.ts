export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  description: string | null;
  website_url: string | null;
  instagram_url: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  brand_id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamRole =
  | "model"
  | "photographer"
  | "director"
  | "editor"
  | "other";

export type TeamMember = {
  id: string;
  name: string;
  slug: string;
  role: TeamRole;
  profile_url: string | null;
  bio: string | null;
  instagram_url: string | null;
  website_url: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectTeam = {
  project_id: string;
  team_member_id: string;
  role: TeamRole;
};

export type ProjectMedia = {
  id: string;
  project_id: string;
  media_type: "image" | "video" | "reel";
  media_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
};

export type TeamMemberMedia = {
  id: string;
  team_member_id: string;
  media_type: "image" | "video" | "reel";
  media_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
};