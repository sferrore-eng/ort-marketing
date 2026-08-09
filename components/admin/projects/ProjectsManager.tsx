"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: string;
  title: string;
  slug: string;
  brand_id: string;
  cover_url: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  brands:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

type ProjectsManagerProps = {
  projects: Project[];
};

export default function ProjectsManager({
  projects: initialProjects,
}: ProjectsManagerProps) {
  const [projects, setProjects] =
    useState(initialProjects);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "published" | "draft" | "featured"
  >("all");

  const [savingOrder, setSavingOrder] =
    useState<string | null>(null);

  const [deletingProject, setDeletingProject] =
    useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return projects.filter((project) => {
      const brandName = Array.isArray(
        project.brands
      )
        ? project.brands[0]?.name || ""
        : project.brands?.name || "";

      const matchesSearch =
        !query ||
        project.title
          .toLowerCase()
          .includes(query) ||
        project.slug
          .toLowerCase()
          .includes(query) ||
        brandName
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "published" &&
          project.published) ||
        (filter === "draft" &&
          !project.published) ||
        (filter === "featured" &&
          project.featured);

      return (
        matchesSearch && matchesFilter
      );
    });
  }, [projects, search, filter]);

  function getBrandName(project: Project) {
    if (Array.isArray(project.brands)) {
      return project.brands[0]?.name || "No brand";
    }

    return project.brands?.name || "No brand";
  }

  async function moveProject(
    projectId: string,
    direction: "up" | "down"
  ) {
    const index = projects.findIndex(
      (project) =>
        project.id === projectId
    );

    if (index === -1) return;

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= projects.length
    ) {
      return;
    }

    const current = projects[index];
    const target = projects[targetIndex];

    setSavingOrder(projectId);

    const supabase = createClient();

    const firstUpdate = await supabase
      .from("projects")
      .update({
        sort_order: target.sort_order,
      })
      .eq("id", current.id);

    if (firstUpdate.error) {
      alert(firstUpdate.error.message);
      setSavingOrder(null);
      return;
    }

    const secondUpdate = await supabase
      .from("projects")
      .update({
        sort_order: current.sort_order,
      })
      .eq("id", target.id);

    if (secondUpdate.error) {
      alert(secondUpdate.error.message);
      setSavingOrder(null);
      return;
    }

    const updated = [...projects];

    updated[index] = {
      ...current,
      sort_order: target.sort_order,
    };

    updated[targetIndex] = {
      ...target,
      sort_order: current.sort_order,
    };

    updated.sort(
      (a, b) =>
        a.sort_order - b.sort_order
    );

    setProjects(updated);
    setSavingOrder(null);
  }

  async function deleteProject(
    project: Project
  ) {
    const confirmed = window.confirm(
      `Delete "${project.title}"?\n\n` +
        `This will permanently delete this project ` +
        `and its connected project data.\n\n` +
        `This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingProject(project.id);

    const supabase = createClient();

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (error) {
      alert(error.message);
      setDeletingProject(null);
      return;
    }

    setProjects((current) =>
      current.filter(
        (item) => item.id !== project.id
      )
    );

    setDeletingProject(null);
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
            placeholder="Search projects..."
            aria-label="Search projects"
          />
        </div>

        <div className="brands-filters">
          <button
            type="button"
            className={
              filter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </button>

          <button
            type="button"
            className={
              filter === "published"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("published")
            }
          >
            Published
          </button>

          <button
            type="button"
            className={
              filter === "draft"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("draft")
            }
          >
            Draft
          </button>

          <button
            type="button"
            className={
              filter === "featured"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("featured")
            }
          >
            Featured
          </button>
        </div>
      </div>

      <div className="brands-results-count">
        {filteredProjects.length}{" "}
        {filteredProjects.length === 1
          ? "project"
          : "projects"}
      </div>

      {filteredProjects.length === 0 ? (
        <section className="brands-empty">
          <div>
            <span className="brands-empty-number">
              00
            </span>

            <h2>No projects found.</h2>

            <p>
              Create a project or change your
              search filters.
            </p>

            <Link
              href="/admin/projects/new"
              className="primary-button"
            >
              Create project
            </Link>
          </div>
        </section>
      ) : (
        <section className="brands-table-wrapper">

          <div className="brands-table-head projects-table-head">
            <span>PROJECT</span>
            <span>BRAND</span>
            <span>STATUS</span>
            <span>ORDER</span>
            <span>ACTION</span>
          </div>

          <div className="brands-list">
            {filteredProjects.map(
              (project, index) => (
                <article
                  key={project.id}
                  className="brand-row project-row"
                >
                  <div className="brand-row-main">
                    <div className="brand-cover">
                      {project.cover_url ? (
                        <img
                          src={project.cover_url}
                          alt={project.title}
                        />
                      ) : (
                        <div className="brand-cover-placeholder">
                          ORT
                        </div>
                      )}
                    </div>

                    <div className="brand-row-info">
                      <h2>
                        {project.title}
                      </h2>

                      <span>
                        /{project.slug}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="status-badge">
                      {getBrandName(project)}
                    </span>
                  </div>

                  <div>
                    <span
                      className={
                        project.published
                          ? "status-badge published"
                          : "status-badge draft"
                      }
                    >
                      {project.published
                        ? "Published"
                        : "Draft"}

                      {project.featured
                        ? " · Featured"
                        : ""}
                    </span>
                  </div>

                  <div className="order-controls">
                    <button
                      type="button"
                      disabled={
                        index === 0 ||
                        savingOrder ===
                          project.id
                      }
                      onClick={() =>
                        moveProject(
                          project.id,
                          "up"
                        )
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                          filteredProjects.length -
                            1 ||
                        savingOrder ===
                          project.id
                      }
                      onClick={() =>
                        moveProject(
                          project.id,
                          "down"
                        )
                      }
                    >
                      ↓
                    </button>
                  </div>

                  <div className="brand-actions">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="table-action"
                    >
                      Edit ↗
                    </Link>

                    <button
                      type="button"
                      className="delete-action"
                      disabled={
                        deletingProject ===
                        project.id
                      }
                      onClick={() =>
                        deleteProject(project)
                      }
                    >
                      {deletingProject ===
                      project.id
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