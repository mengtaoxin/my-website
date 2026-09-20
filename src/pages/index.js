import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import BlogIndex from "@site/src/components/BlogIndex";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--9 col--offset-1">
            <BlogIndex />
          </div>
        </div>
      </main>
    </Layout>
  );
}
