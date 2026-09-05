import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import styles from './certificate-showcase.module.css';

const certificates = [
  {
    title: 'Code Rush — HARD',
    description: 'Code Rush certificate issued through HARP.',
    year: '2026',
    link: '#',
    image: '/static/certificates/code-rush.jpeg',
    glow: 'blue',
  },
  {
    title: 'Code Rush — UNSTOP',
    description: 'Code Rush certificate issued through UNSTOP.',
    year: '2026',
    link: '#',
    image: '/static/certificates/CODE-RUSH.png',
    glow: 'purple',
  },
  {
    title: 'Digital Essentials — Mastering',
    description: 'Digital Essentials learning certificate.',
    year: '2026',
    link: '#',
    image: '/static/certificates/Digital-Essential -mastering.png',
    glow: 'green',
  },
  {
    title: 'Flipkart Warehouse Training',
    description: 'Flipkart Warehouse Training — Day 1 to Day 5.',
    year: '2026',
    link: '#',
    image: '/static/certificates/Flipkart-warehouse training Day1-to-Day5.jpeg',
    glow: 'orange',
  },
  {
    title: 'Fundamentals of Cyber Security',
    description: 'Fundamentals of Cyber Security certificate.',
    year: '2026',
    link: '#',
    image: '/static/certificates/Fundamental of cyber-security.png',
    glow: 'red',
  },
  {
    title: 'Google Student Ambassador',
    description: 'Google Student Ambassador achievement.',
    year: '2026',
    link: '#',
    image: '/static/certificates/google student ambassador.png',
    glow: 'blue',
  },
  {
    title: 'Hack Kshetra 2.0',
    description: 'Hack Kshetra 2.0 participation certificate.',
    year: '2026',
    link: '#',
    image: '/static/certificates/Hack-Keshtra 2.0.jpeg',
    glow: 'purple',
  },
  {
    title: 'Kaggle Community Member',
    description: 'Kaggle Community membership recognition.',
    year: '2026',
    link: '#',
    image: '/static/certificates/Kaggle Community Member.png',
    glow: 'green',
  },
  {
    title: 'Network Security & Firewall',
    description: 'Network Security and Firewall Operations certificate.',
    year: '2026',
    link: '#',
    image: '/static/certificates/network security & firewall.png',
    glow: 'blue',
  },
  {
    title: 'NISM — SEBI',
    description: 'NISM and SEBI certification.',
    year: '2026',
    link: '#',
    image: '/static/certificates/NISM-SEBI.png',
    glow: 'orange',
  },
  {
    title: 'SCOA Academy',
    description: 'SCOA Academy certificate and achievement.',
    year: '2026',
    link: '#',
    image: '/static/certificates/SCOA-Academy.png',
    glow: 'purple',
  },
  {
    title: 'TATA Crucible Quiz',
    description: 'TATA Crucible Quiz participation certificate.',
    year: '2026',
    link: '#',
    image: '/static/certificates/TATA-crucible-quiz.png',
    glow: 'red',
  },
  {
    title: 'SCOA Data Entry Operator (DEO) Training Program',
    description: 'SCOA Data Entry Operator (DEO) Training Program certificate.',
    year: '2025',
    link: '#',
    image: '/static/certificates/SCOA-Data-Entry-Operator-DEO-Training-Program.png',
    glow: 'red',
  }
  
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