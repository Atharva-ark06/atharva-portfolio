import { useEffect, useRef } from 'react';
import styles from './tubes-cursor.module.css';

export function TubesCursor() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!canvasRef.current) return;

      try {
        const { default: TubesCursor } = await import(
          'threejs-components/build/cursors/tubes1.min.js'
        );

        if (!mounted || !canvasRef.current) return;

        appRef.current = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ['#f967fb', '#53bc28', '#6958d5'],
            lights: {
              intensity: 200,
              colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
            },
          },
        });
      } catch (error) {
        console.error('Failed to load Tubes Cursor:', error);
      }
    };

    init();

    return () => {
      mounted = false;

      if (appRef.current?.destroy) {
        appRef.current.destroy();
      }

      appRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
}