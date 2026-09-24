import type {LoadContext, Plugin} from '@docusaurus/types';
import type {BlogContent} from '@docusaurus/plugin-content-blog';

export type HomepageBlogPost = {
  title: string;
  permalink: string;
  date: string;
};

type HomepageBlogPluginData = {
  posts: HomepageBlogPost[];
};

export default function homepageBlogPlugin(
  _context: LoadContext,
): Plugin<null> {
  return {
    name: 'homepage-blog',
    async allContentLoaded({allContent, actions}) {
      const blogContent = allContent['docusaurus-plugin-content-blog']
        ?.default as BlogContent | undefined;
      const posts: HomepageBlogPost[] = (blogContent?.blogPosts ?? [])
        .filter((post) => !post.metadata.unlisted)
        .map((post) => ({
          title: post.metadata.title,
          permalink: post.metadata.permalink,
          date: new Date(post.metadata.date).toISOString(),
        }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      actions.setGlobalData({posts} satisfies HomepageBlogPluginData);
    },
  };
}
