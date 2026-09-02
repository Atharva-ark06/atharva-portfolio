import { useEffect, useRef } from 'react';
import styles from './project-curve.module.css';

export function ProjectCurve() {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const updatePath = () => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    };

    updatePath();
    window.addEventListener('resize', updatePath);

    return () => {
      window.removeEventListener('resize', updatePath);
    };
  }, []);

  return (
    <div className={styles.curve} aria-hidden="true">
      <svg
        viewBox="0 0 1000 2400"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          className={styles.pathGlow}
          d="
            M 120 0
            C 120 250, 850 250, 850 550
            C 850 850, 120 850, 120 1100
            C 120 1400, 850 1400, 850 1650
            C 850 1900, 120 1900, 120 2400
          "
        />

        <path
          className={styles.path}
          d="
            M 120 0
            C 120 250, 850 250, 850 550
            C 850 850, 120 850, 120 1100
            C 120 1400, 850 1400, 850 1650
            C 850 1900, 120 1900, 120 2400
          "
        />
      </svg>
    </div>
  );
}