import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

export type BlogListItem = {
  title: string;
  permalink: string;
  date?: string | Date;
};

type BlogTitleListProps = {
  posts: readonly BlogListItem[];
};

function calendarDate(date: string | Date | undefined): string | null {
  if (!date) {
    return null;
  }
  const value = date instanceof Date ? date.toISOString() : String(date);
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1]! : null;
}

export default function BlogTitleList({posts}: BlogTitleListProps): ReactNode {
  return (
    <ul className={styles.list}>
      {posts.map((post) => {
        const date = calendarDate(post.date);
        return (
          <li key={post.permalink}>
            <Link className={styles.link} to={post.permalink}>
              <span className={styles.title}>{post.title}</span>
              {date && (
                <time className={styles.date} dateTime={date}>
                  {date}
                </time>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
