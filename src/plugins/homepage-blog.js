export default function homepageBlogPlugin() {
  return {
    name: "homepage-blog",
    async allContentLoaded({ allContent, actions }) {
      const blogContent =
        allContent["docusaurus-plugin-content-blog"]?.default;
      const posts = (blogContent?.blogPosts ?? [])
        .filter((post) => !post.metadata.unlisted)
        .map((post) => ({
          title: post.metadata.title,
          permalink: post.metadata.permalink,
          date: new Date(post.metadata.date).toISOString(),
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      actions.setGlobalData({ posts });
    },
  };
}
