import React, { useState } from "react";
import clsx from "clsx";
import { usePluginData } from "@docusaurus/useGlobalData";
import BlogTitleList from "@site/src/components/BlogTitleList";

const POSTS_PER_PAGE = 10;

export default function BlogIndex() {
  const { posts } = usePluginData("homepage-blog");
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(start, start + POSTS_PER_PAGE);

  return (
    <section>
      <BlogTitleList posts={visiblePosts} />
      {totalPages > 1 && (
        <nav className="pagination-nav" aria-label="Blog list page navigation">
          {currentPage > 1 && (
            <button
              type="button"
              className="pagination-nav__link"
              onClick={() => setPage(currentPage - 1)}
            >
              <div className="pagination-nav__label">Newer entries</div>
            </button>
          )}
          {currentPage < totalPages && (
            <button
              type="button"
              className={clsx(
                "pagination-nav__link",
                "pagination-nav__link--next",
              )}
              onClick={() => setPage(currentPage + 1)}
            >
              <div className="pagination-nav__label">Older entries</div>
            </button>
          )}
        </nav>
      )}
    </section>
  );
}
