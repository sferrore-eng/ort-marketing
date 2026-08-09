"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Member = {
  id: string;
  name: string;
  slug: string;
  role: string;
  profile_url: string | null;
  bio: string | null;
  instagram_url: string | null;
  website_url: string | null;
  published: boolean;
  featured: boolean;
};

type TeamManagerProps = {
  members: Member[];
};

const roleLabels: Record<string, string> = {
  model: "Model",
  photographer: "Photographer",
  director: "Director",
  editor: "Editor",
  other: "Other",
};

export default function TeamManager({
  members: initialMembers,
}: TeamManagerProps) {
  const [members, setMembers] =
    useState(initialMembers);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("all");

  const [deleting, setDeleting] =
    useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name
          .toLowerCase()
          .includes(query) ||
        member.slug
          .toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "all" ||
        member.role === roleFilter;

      return (
        matchesSearch && matchesRole
      );
    });
  }, [members, search, roleFilter]);

  async function deleteMember(
    member: Member
  ) {
    const confirmed = window.confirm(
      `Delete "${member.name}"?\n\n` +
        `This profile will be permanently deleted.\n\n` +
        `This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(member.id);

    const supabase = createClient();

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", member.id);

    if (error) {
      alert(error.message);
      setDeleting(null);
      return;
    }

    setMembers((current) =>
      current.filter(
        (item) => item.id !== member.id
      )
    );

    setDeleting(null);
  }

  return (
    <>
      <div className="brands-toolbar">
        <div className="brands-search">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search team..."
            aria-label="Search team"
          />
        </div>

        <div className="brands-filters">
          <button
            type="button"
            className={
              roleFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setRoleFilter("all")
            }
          >
            All
          </button>

          {Object.entries(roleLabels).map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  roleFilter === value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setRoleFilter(value)
                }
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="brands-results-count">
        {filteredMembers.length}{" "}
        {filteredMembers.length === 1
          ? "member"
          : "members"}
      </div>

      {filteredMembers.length === 0 ? (
        <section className="brands-empty">
          <div>
            <span className="brands-empty-number">
              00
            </span>

            <h2>
              No team members found.
            </h2>

            <p>
              Try another search or add a new
              profile.
            </p>

            <Link
              href="/admin/team/new"
              className="primary-button"
            >
              Add member
            </Link>
          </div>
        </section>
      ) : (
        <section className="brands-table-wrapper">
          <div className="brands-table-head team-table-head">
            <span>MEMBER</span>
            <span>ROLE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          <div className="brands-list">
            {filteredMembers.map(
              (member) => (
                <article
                  key={member.id}
                  className="brand-row team-row"
                >
                  <div className="brand-row-main">
                    <div className="brand-cover">
                      {member.profile_url ? (
                        <img
                          src={member.profile_url}
                          alt={member.name}
                        />
                      ) : (
                        <div className="brand-cover-placeholder">
                          ORT
                        </div>
                      )}
                    </div>

                    <div className="brand-row-info">
                      <h2>
                        {member.name}
                      </h2>

                      <span>
                        /{member.slug}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="status-badge">
                      {roleLabels[
                        member.role
                      ] || member.role}
                    </span>
                  </div>

                  <div>
                    <span
                      className={
                        member.published
                          ? "status-badge published"
                          : "status-badge draft"
                      }
                    >
                      {member.published
                        ? "Published"
                        : "Draft"}

                      {member.featured
                        ? " · Featured"
                        : ""}
                    </span>
                  </div>

                  <div className="brand-actions">
                    <Link
                      href={`/admin/team/${member.id}/edit`}
                      className="table-action"
                    >
                      Edit ↗
                    </Link>

                    <button
                      type="button"
                      className="delete-action"
                      disabled={
                        deleting ===
                        member.id
                      }
                      onClick={() =>
                        deleteMember(member)
                      }
                    >
                      {deleting ===
                      member.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      )}
    </>
  );
}