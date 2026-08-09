"use client";

import { useMemo, useState } from "react";
import PublishToggle from "@/components/admin/cms/PublishToggle";

type Item = {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  published?: boolean;
  featured?: boolean;
};

type Group = {
  title: string;
  table: string;
  items: Item[];
};

export default function ContentManager({
  groups,
}: {
  groups: Group[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");

  const filteredGroups = useMemo(() => {
    return groups.map((group) => {
      const items = [...group.items]
        .filter((item) => {
          const text =
            `${item.name ?? ""} ${item.title ?? ""} ${item.slug ?? ""}`
              .toLowerCase();

          const matchesSearch =
            text.includes(search.toLowerCase());

          const matchesFilter =
            filter === "all" ||
            (filter === "published" &&
              item.published !== false) ||
            (filter === "draft" &&
              item.published === false) ||
            (filter === "featured" &&
              item.featured === true);

          return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
          const aName =
            (a.name ?? a.title ?? "").toLowerCase();

          const bName =
            (b.name ?? b.title ?? "").toLowerCase();

          if (sort === "name") {
            return aName.localeCompare(bName);
          }

          if (sort === "name-desc") {
            return bName.localeCompare(aName);
          }

          if (sort === "status") {
            return Number(b.published !== false) -
              Number(a.published !== false);
          }

          if (sort === "featured") {
            return Number(b.featured === true) -
              Number(a.featured === true);
          }

          return 0;
        });

      return {
        ...group,
        items,
      };
    });
  }, [groups, search, filter, sort]);

  const totalResults = filteredGroups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  return (
    <>
      <section className="cms-toolbar">

        <div className="cms-search">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search content..."
          />
        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="featured">Featured</option>
        </select>

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
        >
          <option value="name">A → Z</option>
          <option value="name-desc">Z → A</option>
          <option value="status">
            Published first
          </option>
          <option value="featured">
            Featured first
          </option>
        </select>

      </section>

      <div className="cms-results-count">
        {totalResults} result
        {totalResults === 1 ? "" : "s"}
      </div>

      {filteredGroups.map((group) => (
        <section
          className="cms-card"
          key={group.table}
        >
          <div className="cms-section-head">
            <div>
              <span>{group.title.toUpperCase()}</span>
              <h2>
                {group.items.length} items
              </h2>
            </div>
          </div>

          {group.items.length === 0 ? (
            <div className="cms-empty">
              No matching content.
            </div>
          ) : (
            <div className="cms-content-list">

              {group.items.map((item) => (
                <div
                  className="cms-content-row"
                  key={item.id}
                >
                  <div>
                    <strong>
                      {item.name ??
                        item.title ??
                        "Untitled"}
                    </strong>

                    <small>
                      /{item.slug ?? ""}
                    </small>
                  </div>

                  <PublishToggle
                    table={group.table}
                    id={item.id}
                    published={
                      item.published !== false
                    }
                    featured={
                      item.featured === true
                    }
                  />
                </div>
              ))}

            </div>
          )}
        </section>
      ))}
    </>
  );
}
