import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import styles from './morph-gallery.module.css';

const certificates = [
  {
    title: 'Cloud Security Principles',
    category: 'CLOUD SECURITY',
    description: 'Exploring security principles and protection strategies for cloud environments.',
    image: 'https://cdn.21st.dev/assets/mirror/ec/eceae69f56b5b3e29b9372032b5c22e96bd5fc9c167ce072813868aa871d52af.jpg',
    thumbnail: 'https://cdn.21st.dev/assets/mirror/69/69dbb246d917da410f7e79e87e53aaf6302023baa9db05f1075fca5bcb255410.jpg',
    pdf: '/static/certificates/cloud-security-principles.pdf',
  },
  {
    title: 'Cybersecurity Architecture',
    category: 'SECURITY ARCHITECTURE',
    description: 'Understanding security architecture, defensive design, and system protection.',
    image: 'https://cdn.21st.dev/assets/mirror/95/95b854c8c5fc73249ba12e729548a432ff171dab87d960e2aaf098f1db941828.jpg',
    thumbnail: 'https://cdn.21st.dev/assets/mirror/3d/3d637a6ebf76a17643434f0a6939ae4a0e15853797ba886588071bf792dd12d9.jpg',
    pdf: '/static/certificates/cybersecurity-architecture.pdf',
  },
  {
    title: 'Cybersecurity Architecture V2',
    category: 'ADVANCED SECURITY',
    description: 'A further learning milestone in cybersecurity architecture and secure systems.',
    image: 'https://cdn.21st.dev/assets/mirror/15/15a4a367001c723a22cc1f5b480cfdc6abc1e50fdf87e0555ddd324f404fb98a.jpg',
    thumbnail: 'https://cdn.21st.dev/assets/mirror/b8/b88e4af2580633f65cd2fce4867c647be4e317e3bf54c47dac854aab211e6dde.jpg',
    pdf: '/static/certificates/cybersecurity-architecture-v2.pdf',
  },
  {
    title: 'Cybersecurity Tools and Technologies',
    category: 'SECURITY TOOLS',
    description: 'Building familiarity with tools and technologies used across cybersecurity workflows.',
    image: 'https://cdn.21st.dev/assets/mirror/69/6947b2d1b15fc6614fe30af02282fe6418b3c43556fbfe6ad8e2fa16c72ae700.jpg',
    thumbnail: 'https://cdn.21st.dev/assets/mirror/e0/e025ceb111646f4030ac36225aa4997e5024d098c4c939c409cddd281bd2c314.jpg',
    pdf: '/static/certificates/cybersecurity-tools-technologies.pdf',
  },
  {
    title: 'Ethical Hacking Capstone',
    category: 'ETHICAL HACKING',
    description: 'A capstone learning milestone focused on ethical hacking concepts and practical security.',
    image: 'https://cdn.21st.dev/assets/mirror/40/40907f0afb67e9bf2767a5982d24f0d56e6f49dd12b859cf92eb9b3b9771f4a4.jpg',
    thumbnail: 'https://cdn.21st.dev/assets/mirror/38/38b66ef8fe46060a916db605710e709522a9534ff72aa549c1233c543f0a92a9.jpg',
    pdf: '/static/certificates/ethical-hacking-capstone-ai.pdf',
  },
  {
    title: 'Ethical Hacking Capstone Badge',
    category: 'ACHIEVEMENT',
    description: 'A visual recognition of completing the ethical hacking capstone learning milestone.',
    image: 'https://cdn.21st.dev/assets/mirror/ef/ef4b96d0e0de49e89f600b77edbe0a150e1f93f8ba92ae1422d285d267b7bd47.jpg',
    thumbnail: 'https://cdn.21st.dev/assets/mirror/f8/f8ee65346d7a36d4a795ca4628042627baa2f3f5e1c79d1dd471f874c8a6f0a4.jpg',
    pdf: '/static/certificates/ethical-hacking-capstone-ai-badge.pdf',
  },
];

export default function MorphGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const timerRef = useRef(null);
  const transitionRef = useRef(null);

  const active = certificates[activeIndex];
  const previous = certificates[previousIndex];

  const goTo = (index) => {
    if (index === activeIndex || transitioning) return;

    setPreviousIndex(activeIndex);
    setActiveIndex((index + certificates.length) % certificates.length);
    setTransitioning(true);

    window.clearTimeout(transitionRef.current);
    transitionRef.current = window.setTimeout(() => {
      setTransitioning(false);
    }, 1000);
  };

  const next = () => goTo((activeIndex + 1) % certificates.length);
  const previousSlide = () => goTo((activeIndex - 1 + certificates.length) % certificates.length);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setImagesLoaded(true);
    image.onerror = () => setImagesLoaded(false);
    image.src = active.image;
  }, [active.image]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    timerRef.current = window.setInterval(() => {
      setActiveIndex((current) => {
        setPreviousIndex(current);
        setTransitioning(true);
        window.clearTimeout(transitionRef.current);
        transitionRef.current = window.setTimeout(() => setTransitioning(false), 1000);
        return (current + 1) % certificates.length;
      });
    }, 7000);

    return () => {
      window.clearInterval(timerRef.current);
      window.clearTimeout(transitionRef.current);
    };
  }, []);

  return (
    <section className={styles.gallery} aria-label="Featured certificates">
      <div className={styles.stage}>
        <div className={styles.imageLayer} key={active.image}>
          <img
            className={`${styles.heroImage} ${transitioning ? styles.imageEntering : ''}`}
            src={active.image}
            alt=""
            fetchPriority="high"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <div className={styles.imageFallback} style={{ backgroundImage: `url("${active.thumbnail}")` }} />
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
            <span> / {String(certificates.length).padStart(2, '0')}</span>
          </p>

          <h2 className={styles.title}>{active.title}</h2>
          <p className={styles.description}>{active.description}</p>

          <a className={styles.certificateLink} href={active.pdf} target="_blank" rel="noreferrer">
            View certificate <ExternalLink size={16} />
          </a>
        </div>

        <div className={styles.controls}>
          <button type="button" className={styles.arrow} onClick={previousSlide} aria-label="Previous certificate">
            <ChevronLeft size={21} />
          </button>
          <button type="button" className={styles.arrow} onClick={next} aria-label="Next certificate">
            <ChevronRight size={21} />
          </button>
        </div>

        <div className={styles.progressTrack}>
          <span style={{ width: `${((activeIndex + 1) / certificates.length) * 100}%` }} />
        </div>
      </div>

      <div className={styles.thumbnailRail} aria-label="Choose a featured certificate">
        {certificates.map((certificate, index) => (
          <button
            type="button"
            key={certificate.title}
            className={`${styles.thumbnail} ${index === activeIndex ? styles.thumbnailActive : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Show ${certificate.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <img src={certificate.thumbnail} alt="" loading="lazy" />
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
