import { useEffect, useRef } from 'react';
import styles from './particle-s-curve.module.css';

export function ParticleSCurve() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let animationFrame;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 500 : 1100;

    const particles = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getCurvePoint = t => {
      const centerX = width / 2;
      const amplitude = Math.min(
        width * 0.24,
        300
      );

      return {
        x:
          centerX +
          Math.sin(t * Math.PI * 2) *
            amplitude,

        y: t * height,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        t: Math.random(),
        spread: Math.random() * 20 + 2,
        angle: Math.random() * Math.PI * 2,
        size: Math.random() * 1.7 + 0.5,
        alpha: Math.random() * 0.45 + 0.15,
        speed:
          Math.random() * 0.00018 +
          0.000035,
        phase: Math.random() * Math.PI * 2,
        cyan: Math.random() > 0.78,
      });
    }

    const handleMouseMove = event => {
      const rect =
        container.getBoundingClientRect();

      mouse.x =
        event.clientX - rect.left;

      mouse.y =
        event.clientY - rect.top;

      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    window.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    const draw = time => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      const seconds = time * 0.001;

      particles.forEach(particle => {
        particle.t += particle.speed;

        if (particle.t > 1) {
          particle.t = 0;
        }

        const point =
          getCurvePoint(particle.t);

        let x =
          point.x +
          Math.cos(particle.angle) *
            particle.spread +
          Math.sin(
            seconds * 1.4 +
              particle.phase
          ) *
            2;

        let y =
          point.y +
          Math.sin(particle.angle) *
            particle.spread;

        // Cursor pushes particles away
        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          const radius = 180;

          if (distance < radius) {
            const force =
              1 - distance / radius;

            const push =
              force * 75;

            x +=
              (dx / (distance || 1)) *
              push;

            y +=
              (dy / (distance || 1)) *
              push;
          }
        }

        // Particle glow
        const glowSize =
          particle.size * 4;

        const gradient =
          ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            glowSize
          );

        if (particle.cyan) {
          gradient.addColorStop(
            0,
            `rgba(0, 173, 181, ${particle.alpha})`
          );

          gradient.addColorStop(
            1,
            'rgba(0, 173, 181, 0)'
          );
        } else {
          gradient.addColorStop(
            0,
            `rgba(55, 55, 55, ${particle.alpha})`
          );

          gradient.addColorStop(
            1,
            'rgba(55, 55, 55, 0)'
          );
        }

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          glowSize,
          0,
          Math.PI * 2
        );

        ctx.fill();

        // Main particle
        ctx.fillStyle = particle.cyan
          ? `rgba(0, 173, 181, ${
              particle.alpha + 0.15
            })`
          : `rgba(55, 55, 55, ${
              particle.alpha
            })`;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fill();
      });

      animationFrame =
        requestAnimationFrame(draw);
    };

    resize();

    window.addEventListener(
      'resize',
      resize
    );

    animationFrame =
      requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        'resize',
        resize
      );

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      window.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </div>
  );
}

export default ParticleSCurve;