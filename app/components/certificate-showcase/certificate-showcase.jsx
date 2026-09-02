import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import styles from './certificate-showcase.module.css';

const certificates = [
  {
    title: 'Certificate 01',
    description: 'Your first certificate',
    year: '2026',
    link: '#',
    image: '/static/certificates/certificate-01.png',
  },
  {
    title: 'Certificate 02',
    description: 'Your second certificate',
    year: '2026',
    link: '#',
    image: '/static/certificates/certificate-02.png',
  },
  {
    title: 'Certificate 03',
    description: 'Your third certificate',
    year: '2026',
    link: '#',
    image: '/static/certificates/certificate-03.png',
  },
  {
    title: 'Certificate 04',
    description: 'Your fourth certificate',
    year: '2026',
    link: '#',
    image: '/static/certificates/certificate-04.png',
  },

  // SLOT 05
  {
    title: 'Certificate 05',
    description: 'Certificate slot — add your achievement later.',
    year: '—',
    link: '#',
    image: null,
  },

  // SLOT 06
  {
    title: 'Certificate 06',
    description: 'Certificate slot — add your achievement later.',
    year: '—',
    link: '#',
    image: null,
  },

  // SLOT 07
  {
    title: 'Certificate 07',
    description: 'Certificate slot — add your achievement later.',
    year: '—',
    link: '#',
    image: null,
  },

  // SLOT 08
  {
    title: 'Certificate 08',
    description: 'Certificate slot — add your achievement later.',
    year: '—',
    link: '#',
    image: null,
  },

  // SLOT 09
  {
    title: 'Certificate 09',
    description: 'Certificate slot — add your achievement later.',
    year: '—',
    link: '#',
    image: null,
  },

  // SLOT 10
  {
    title: 'Certificate 10',
    description: 'Certificate slot — add your achievement later.',
    year: '—',
    link: '#',
    image: null,
  },
];

export function CertificateShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const [smoothPosition, setSmoothPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // --------------------------------------------------
  // SMOOTH CURSOR FOLLOW
  // --------------------------------------------------

  useEffect(() => {
    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setSmoothPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  // --------------------------------------------------
  // MOUSE MOVE
  // --------------------------------------------------

  const handleMouseMove = event => {
    if (!containerRef.current) return;

    const rect =
      containerRef.current.getBoundingClientRect();

    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  // --------------------------------------------------
  // HOVER
  // --------------------------------------------------

  const handleMouseEnter = index => {
    setHoveredIndex(index);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setIsVisible(false);
  };

  // --------------------------------------------------
  // CURRENT CERTIFICATE
  // --------------------------------------------------

  const activeCertificate =
    hoveredIndex !== null
      ? certificates[hoveredIndex]
      : null;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={styles.showcase}
    >
      {/* -------------------------------------------- */}
      {/* FOLLOWING CERTIFICATE PREVIEW */}
      {/* -------------------------------------------- */}

      <div
        className={styles.preview}
        style={{
          left:
            containerRef.current?.getBoundingClientRect()
              .left ?? 0,

          top:
            containerRef.current?.getBoundingClientRect()
              .top ?? 0,

          transform: `translate3d(
            ${smoothPosition.x + 30}px,
            ${smoothPosition.y - 120}px,
            0
          )`,

          opacity: isVisible ? 1 : 0,

          scale: isVisible ? 1 : 0.8,
        }}
      >
        <div className={styles.previewInner}>
          {activeCertificate?.image ? (
            <img
              src={activeCertificate.image}
              alt={activeCertificate.title}
              className={styles.previewImage}
            />
          ) : (
            <div className={styles.previewPlaceholder}>
              <Award
                className={styles.placeholderIcon}
              />

              <span>
                Certificate Preview
              </span>

              <small>
                Image coming soon
              </small>
            </div>
          )}

          <div className={styles.previewOverlay} />
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* CERTIFICATE LIST */}
      {/* -------------------------------------------- */}

      <div className={styles.list}>
        {certificates.map((certificate, index) => {
          const isPlaceholder =
            !certificate.image;

          return (
            <a
              key={certificate.title}
              href={
                certificate.link === '#'
                  ? undefined
                  : certificate.link
              }
              className={`${styles.item} ${
                isPlaceholder
                  ? styles.placeholderItem
                  : ''
              }`}
              onMouseEnter={() =>
                handleMouseEnter(index)
              }
              onMouseLeave={handleMouseLeave}
              onClick={event => {
                if (certificate.link === '#') {
                  event.preventDefault();
                }
              }}
            >
              {/* Hover background */}
              <div
                className={`${styles.highlight} ${
                  hoveredIndex === index
                    ? styles.highlightActive
                    : ''
                }`}
              />

              <div className={styles.itemContent}>
                {/* LEFT SIDE */}
                <div className={styles.info}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.title}>
                      <span>
                        {certificate.title}

                        <span
                          className={`${styles.underline} ${
                            hoveredIndex === index
                              ? styles.underlineActive
                              : ''
                          }`}
                        />
                      </span>
                    </h3>

                    <ArrowUpRight
                      className={`${styles.arrow} ${
                        hoveredIndex === index
                          ? styles.arrowActive
                          : ''
                      }`}
                    />
                  </div>

                  <p className={styles.description}>
                    {certificate.description}
                  </p>
                </div>

                {/* RIGHT SIDE */}
                <div
                  className={`${styles.year} ${
                    hoveredIndex === index
                      ? styles.yearActive
                      : ''
                  }`}
                >
                  {certificate.year}
                </div>
              </div>
            </a>
          );
        })}

        {/* Bottom border */}
        <div className={styles.bottomBorder} />
      </div>
    </section>
  );
}

export default CertificateShowcase;