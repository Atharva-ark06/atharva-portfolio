
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import styles from './morph-gallery.module.css';
import MorphShader from './morph-shader';

const certificates = [
  {
    title: 'Ethical Hacking Capstone Badge',
    category: 'ACHIEVEMENT',
    description:
      'A visual recognition of completing the ethical hacking capstone learning milestone.',
    image: '/static/morph-gallery/forest-dawn.svg',
    thumbnail: '/static/morph-gallery/forest-thumb.jpg',
    certificateImage:
      '/static/certificates/ethical-hacking-capstone-ai-badge.png',
    pdf: '/static/certificates/ethical-hacking-capstone-ai-badge.pdf',
  },
  {
    title: 'Cybersecurity Architecture V2',
    category: 'ADVANCED SECURITY',
    description:
      'A further learning milestone in cybersecurity architecture and secure systems.',
    image: '/static/morph-gallery/mountain-night.svg',
    thumbnail: '/static/morph-gallery/mountain-night-thumb.jpg',
    certificateImage:
      '/static/certificates/cybersecurity-architecture-v2.png',
    pdf: '/static/certificates/cybersecurity-architecture-v2.pdf',
  },
  {
    title: 'Cloud Security Principles',
    category: 'CLOUD SECURITY',
    description:
      'Exploring security principles and protection strategies for cloud environments.',
    image: '/static/morph-gallery/glacial-lake.svg',
    thumbnail: '/static/morph-gallery/mountain-lake-thumb.jpg',
    certificateImage:
      '/static/certificates/cloud-security-principles.png',
    pdf: '/static/certificates/cloud-security-principles.pdf',
  },
  {
    title: 'Cybersecurity Architecture',
    category: 'SECURITY ARCHITECTURE',
    description:
      'Understanding security architecture, defensive design, and system protection.',
    image: '/static/morph-gallery/emerald-hills.svg',
    thumbnail: '/static/morph-gallery/green-hills-thumb.jpg',
    certificateImage:
      '/static/certificates/cybersecurity-architecture.png',
    pdf: '/static/certificates/cybersecurity-architecture.pdf',
  },
  {
    title: 'Cybersecurity Tools and Technologies',
    category: 'SECURITY TOOLS',
    description:
      'Building familiarity with tools and technologies used across cybersecurity workflows.',
    image: '/static/morph-gallery/wildflower-meadow.svg',
    thumbnail: '/static/morph-gallery/wildflowers-thumb.jpg',
    certificateImage:
      '/static/certificates/cybersecurity-tools-technologies.png',
    pdf: '/static/certificates/cybersecurity-tools-technologies.pdf',
  },
  {
    title: 'Ethical Hacking Capstone',
    category: 'ETHICAL HACKING',
    description:
      'A capstone learning milestone focused on ethical hacking concepts and practical security.',
    image: '/static/morph-gallery/tropical-coast.svg',
    thumbnail: '/static/morph-gallery/tropical-beach-thumb.jpg',
    certificateImage:
      '/static/certificates/ethical-hacking-capstone-ai.png',
    pdf: '/static/certificates/ethical-hacking-capstone-ai.pdf',
  },
  {
    title: 'Fundamentals of Cybersecurity',
    category: 'CYBERSECURITY',
    description: 'Certificate in foundational cybersecurity concepts.',
    image: '/static/morph-gallery/red-rock-canyon.svg',
    thumbnail: '/static/morph-gallery/forest-thumb.jpg',
    certificateImage: '/static/certificates/Fundamental%20of%20cyber-security.png',
    pdf: null,
  },
  {
    title: 'Network Security and Firewall',
    category: 'NETWORK SECURITY',
    description: 'Learning milestone in network security and firewall operations.',
    image: '/static/morph-gallery/aurora-ridge.svg',
    thumbnail: '/static/morph-gallery/mountain-night-thumb.jpg',
    certificateImage: '/static/certificates/network%20security%20%26%20firewall.png',
    pdf: null,
  },
  {
    title: 'Hack Kshetra 2.0',
    category: 'HACKATHON',
    description: 'Hackathon participation and achievement.',
    image: '/static/morph-gallery/misty-waterfall.svg',
    thumbnail: '/static/morph-gallery/green-hills-thumb.jpg',
    certificateImage: '/static/certificates/Hack-Keshtra%202.0.jpeg',
    pdf: null,
  },
  {
    title: 'NISM–SEBI',
    category: 'FINANCIAL LITERACY',
    description: 'Certificate related to financial markets and securities awareness.',
    image: '/static/morph-gallery/golden-dunes.svg',
    thumbnail: '/static/morph-gallery/mountain-lake-thumb.jpg',
    certificateImage: '/static/certificates/NISM-SEBI.png',
    pdf: null,
  },
  {
    title: 'Tata Crucible Quiz',
    category: 'COMPETITION',
    description: 'Participation in the Tata Crucible quiz.',
    image: '/static/morph-gallery/moonlit-pines.svg',
    thumbnail: '/static/morph-gallery/wildflowers-thumb.jpg',
    certificateImage: '/static/certificates/TATA-crucible-quiz.png',
    pdf: null,
  },
];


export default function MorphGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);

  const timerRef = useRef(null);
const transitionRef = useRef(null);
const activeIndexRef = useRef(0);

  const active = certificates[activeIndex];
  const previous = certificates[previousIndex];
  const previousImage = previous?.image ?? active.image;

  const goTo = (index) => {
  const nextIndex =
    ((index % certificates.length) + certificates.length) %
    certificates.length;

  const currentIndex = activeIndexRef.current;

  if (nextIndex === currentIndex) return;

  // Update immediately so rapid clicks are never ignored.
  activeIndexRef.current = nextIndex;

  setPreviousIndex(currentIndex);
  setActiveIndex(nextIndex);
  setTransitionKey((key) => key + 1);
  setTransitioning(true);

  window.clearTimeout(transitionRef.current);

  transitionRef.current = window.setTimeout(() => {
    setTransitioning(false);
  }, 1250);
};

const next = () => goTo(activeIndexRef.current + 1);

const previousSlide = () => goTo(activeIndexRef.current - 1);


useEffect(() => {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reducedMotion) return undefined;

  timerRef.current = window.setInterval(() => {
    goTo(activeIndexRef.current + 1);
  }, 7000);

  return () => {
    window.clearInterval(timerRef.current);
    window.clearTimeout(transitionRef.current);
  };
}, []);

  return (
    <section
      className={styles.gallery}
      aria-label="Featured certificates"
    >
      <div className={styles.stage}>
        <div className={styles.imageLayer}>
          <MorphShader
            fromImage={previousImage}
            toImage={active.image}
            transitionKey={transitionKey}
            className={styles.morphCanvas}
          />

          <img
            className={styles.shaderFallback}
            src={active.image}
            alt=""
            aria-hidden="true"
          />

          <div
            className={styles.imageFallback}
            style={{
              backgroundImage: `url("${active.image}")`,
            }}
          />
        </div>

        <div className={styles.shade} />
        <div className={styles.grain} />

        <div className={styles.content} key={active.title}>
          <p className={styles.eyebrow}>
            <span className={styles.statusDot} />
            {active.category}
          </p>

          <p className={styles.counter}>
            {String(activeIndex + 1).padStart(2, '0')}
            <span>
              {' '}
              / {String(certificates.length).padStart(2, '0')}
            </span>
          </p>

          <h2 className={styles.title}>{active.title}</h2>

          <p className={styles.description}>
            {active.description}
          </p>


<div className={styles.certificateLinkWrapper}>
  <div className={styles.certificatePreview}>
    <img
      src={active.certificateImage}
      alt={`${active.title} certificate preview`}
    />
  </div>

  <a
    className={styles.certificateLink}
    href={active.pdf || active.certificateImage}
    target="_blank"
    rel="noreferrer"
  >
    View certificate <ExternalLink size={16} />
  </a>
</div>

        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={previousSlide}
            aria-label="Previous certificate"
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            className={styles.arrow}
            onClick={next}

            aria-label="Next certificate"
          >
            <ChevronRight size={21} />
          </button>
        </div>

        <div className={styles.progressTrack}>
          <span
            style={{
              width: `${
                ((activeIndex + 1) / certificates.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <div
        className={styles.thumbnailRail}
        aria-label="Choose a featured certificate"
      >
        {certificates.map((certificate, index) => (
          <button
            type="button"
            key={certificate.title}
            className={`${styles.thumbnail} ${
              index === activeIndex
                ? styles.thumbnailActive
                : ''
            }`}
            onClick={() => goTo(index)}

            aria-label={`Show ${certificate.title}`}
            aria-current={
              index === activeIndex ? 'true' : undefined
            }
          >
            <img
              src={certificate.thumbnail}
              alt=""
              loading="lazy"
            />
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
