// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

const baseUrl = '/my-website/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Site by mengtaoxin',
  tagline: 'Notes, pages, and images',
  favicon: 'img/favicon.ico',
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `${baseUrl}img/favicon-16x16.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `${baseUrl}img/favicon-32x32.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${baseUrl}img/apple-touch-icon.png`,
      },
    },
  ],

  future: {
    v4: true,
  },

  url: 'https://mengtaoxin.github.io',
  baseUrl,

  organizationName: 'mengtaoxin',
  projectName: 'my-website',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'pages',
          routeBasePath: 'pages',
          sidebarPath: './sidebars.js',
        },
        blog: {
          blogSidebarCount: 0,
          postsPerPage: 10,
          onUntruncatedBlogPosts: 'ignore',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
            title: 'Blogs by mengtaoxin',
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: ['./src/plugins/homepage-blog'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/icon-512.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Site by mengtaoxin',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'pagesSidebar',
            position: 'left',
            label: 'Pages',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/mengtaoxin/my-website',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://x.com/dawnlightx123',
            label: 'X',
            position: 'right',
          },
          {
            href: 'https://steamcommunity.com/id/mengtaoxin/',
            label: 'Steam',
            position: 'right',
          },
          {
            href: 'pathname:///blog/rss.xml',
            label: 'RSS',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} mengtaoxin.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
