import {useCallback, useEffect, useState} from 'react';
import styles from './styles.module.css';

function padIndex(n) {
  return String(n).padStart(2, '0');
}

export default function ImageGallery({images = []}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;
  const active = isOpen ? images[activeIndex] : null;

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowLeft') {
        showPrev();
      } else if (event.key === 'ArrowRight') {
        showNext();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close, showPrev, showNext]);

  if (!images.length) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      <ul className={styles.grid}>
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => setActiveIndex(index)}
              aria-label={`查看大图：${image.caption || image.alt || `作品 ${index + 1}`}`}
            >
              <div className={styles.frame}>
                <img
                  className={styles.image}
                  src={image.src}
                  alt={image.alt || image.caption || ''}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={styles.meta}>
                <span className={styles.index}>{padIndex(index + 1)}</span>
                {image.caption ? (
                  <p className={styles.caption}>{image.caption}</p>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || active.alt || '图片预览'}
          onClick={close}
        >
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label="关闭"
          >
            ×
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.nav} ${styles.prev}`}
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                aria-label="上一张"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.nav} ${styles.next}`}
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="下一张"
              >
                ›
              </button>
            </>
          ) : null}

          <figure
            className={styles.lightboxFigure}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className={styles.lightboxImage}
              src={active.src}
              alt={active.alt || active.caption || ''}
            />
            {active.caption ? (
              <figcaption className={styles.lightboxCaption}>
                {padIndex(activeIndex + 1)} · {active.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </div>
  );
}
