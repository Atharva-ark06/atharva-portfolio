import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import styles from './certificate-showcase.module.css';


const certificates = [
  {
    title: 'Cybersecurity Architecture V2',
    description: 'Cybersecurity architecture certificate.',
    year: 'PDF',
    link: '/static/certificates/cybersecurity-architecture-v2.pdf',
    image: '/static/certificates/cybersecurity-architecture-v2.png',
    glow: 'blue',
  },
  {
    title: 'Cybersecurity Architecture',
    description: 'Cybersecurity architecture certificate.',
    year: 'PDF',
    link: '/static/certificates/cybersecurity-architecture.pdf',
    image: '/static/certificates/cybersecurity-architecture.png',
    glow: 'purple',
  },
  {
    title: 'Cybersecurity Tools and Technologies',
    description: 'Certificate covering cybersecurity tools and technologies.',
    year: 'PDF',
    link: '/static/certificates/cybersecurity-tools-technologies.pdf',
    image: '/static/certificates/cybersecurity-tools-technologies.png',
    glow: 'green',
  },
  {
    title: 'Ethical Hacking Capstone Project',
    description: 'Breach, Response, AI — ethical hacking capstone certificate.',
    year: 'PDF',
    link: '/static/certificates/ethical-hacking-capstone-ai.pdf',
    image: '/static/certificates/ethical-hacking-capstone-ai.png',
    glow: 'orange',
  },
  {
    title: 'Ethical Hacking Capstone — Badge',
    description: 'Breach, Response, AI — capstone badge certificate.',
    year: 'PDF',
    link: '/static/certificates/ethical-hacking-capstone-ai-badge.pdf',
    image: '/static/certificates/ethical-hacking-capstone-ai-badge.png',
    glow: 'red',
  },
  {
    title: 'Introduction to Security Principles in Cloud',
    description: 'Cloud security principles certificate.',
    year: 'PDF',
    link: '/static/certificates/cloud-security-principles.pdf',
    image: '/static/certificates/cloud-security-principles.png',
    glow: 'blue',
  },
];


const glowColors = {
  blue: {
    base: 220,
    spread: 200,
  },
  purple: {
    base: 280,
    spread: 300,
  },
  green: {
    base: 120,
    spread: 200,
  },
  red: {
    base: 0,
    spread: 200,
  },
  orange: {
    base: 30,
    spread: 200,
  },
};

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

  /* -------------------------------- */
  /* SMOOTH CURSOR FOLLOW             */
  /* -------------------------------- */

  useEffect(() => {
    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setSmoothPosition(prev => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  /* -------------------------------- */
  /* MOUSE MOVE                       */
  /* -------------------------------- */

  const handleMouseMove = event => {
    if (!containerRef.current) return;

    const rect =
      containerRef.current.getBoundingClientRect();

    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  /* -------------------------------- */
  /* CARD MOUSE MOVE                  */
  /* -------------------------------- */

  const handleCardMouseMove = event => {
    const card = event.currentTarget;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xp = x / rect.width;
    const yp = y / rect.height;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.setProperty('--mouse-xp', xp.toFixed(3));
    card.style.setProperty('--mouse-yp', yp.toFixed(3));
  };

  /* -------------------------------- */
  /* HOVER                            */
  /* -------------------------------- */

  const handleMouseEnter = index => {
    setHoveredIndex(index);
    setIsVisible(true);
  };

  const handleMouseLeave = event => {
    event.currentTarget.style.removeProperty('--mouse-x');
    event.currentTarget.style.removeProperty('--mouse-y');

    setHoveredIndex(null);
    setIsVisible(false);
  };

  /* -------------------------------- */
  /* CURRENT CERTIFICATE              */
  /* -------------------------------- */

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

      {/* -------------------------------- */}
      {/* FLOATING CERTIFICATE PREVIEW     */}
      {/* -------------------------------- */}

      <div
        className={styles.preview}
        style={{
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

      {/* -------------------------------- */}
      {/* CERTIFICATE LIST                 */}
      {/* -------------------------------- */}

      <div className={styles.list}>

        {certificates.map((certificate, index) => {

          const glow =
            glowColors[certificate.glow] ||
            glowColors.blue;

          return (
            <a
              key={certificate.title}
              href={
                certificate.link === '#'
                  ? undefined
                  : certificate.link
              }

              className={styles.item}

              style={{
                '--base': glow.base,
                '--spread': glow.spread,
              }}

              onMouseEnter={() =>
                handleMouseEnter(index)
              }

              onMouseLeave={handleMouseLeave}

              onMouseMove={handleCardMouseMove}

              onClick={event => {
                if (certificate.link === '#') {
                  event.preventDefault();
                }
              }}
            >

              {/* GLOW BORDER */}

              <div
                className={styles.glowBorder}
              />

              {/* GLOW LIGHT */}

              <div
                className={styles.glowLight}
              />

              {/* CARD CONTENT */}

              <div className={styles.content}>

                <div className={styles.info}>

                  <div className={styles.titleRow}>

                    <h3 className={styles.title}>
                      {certificate.title}

                      <span
                        className={styles.underline}
                      />
                    </h3>

                    <ArrowUpRight
                      className={styles.arrow}
                    />

                  </div>

                  <p>
                    {certificate.description}
                  </p>

                </div>

                <div className={styles.year}>
                  {certificate.year}
                </div>

              </div>

            </a>
          );
        })}

      </div>

    </section>
  );
}

export default CertificateShowcase;