
import { useTheme } from '~/components/theme-provider';
import { Transition } from '~/components/transition';
import { useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport, useWindowSize } from '~/hooks';
import { startTransition, useEffect, useRef } from 'react';
import {
  AmbientLight,
  DirectionalLight,
  LinearSRGBColorSpace,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
} from 'three';
import { media } from '~/utils/style';
import { throttle } from '~/utils/throttle';
import { cleanRenderer, cleanScene, removeLights } from '~/utils/three';
import fragmentShader from './displacement-sphere-fragment.glsl?raw';
import vertexShader from './displacement-sphere-vertex.glsl?raw';
import styles from './displacement-sphere.module.css';

const springConfig = {
  stiffness: 30,
  damping: 20,
  mass: 2,
};

export const DisplacementSphere = props => {
  const { theme } = useTheme();

  const start = useRef(Date.now());
  const canvasRef = useRef(null);
  const mouse = useRef(null);
  const renderer = useRef(null);
  const camera = useRef(null);
  const scene = useRef(null);
  const lights = useRef([]);
  const uniforms = useRef(null);
  const material = useRef(null);
  const geometry = useRef(null);
  const sphere = useRef(null);

  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();

  const rotationX = useSpring(0, springConfig);
  const rotationY = useSpring(0, springConfig);

  // Create WebGL scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const { innerWidth, innerHeight } = window;

    mouse.current = new Vector2(0.8, 0.5);

    const webglRenderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });

    webglRenderer.setSize(innerWidth, innerHeight);
    webglRenderer.setPixelRatio(1);
    webglRenderer.outputColorSpace = LinearSRGBColorSpace;

    renderer.current = webglRenderer;

    const webglCamera = new PerspectiveCamera(
      54,
      innerWidth / innerHeight,
      0.1,
      100
    );

    webglCamera.position.z = 52;
    camera.current = webglCamera;

    const webglScene = new Scene();
    scene.current = webglScene;

    const phongMaterial = new MeshPhongMaterial();

    phongMaterial.onBeforeCompile = shader => {
      uniforms.current = UniformsUtils.merge([
        shader.uniforms,
        {
          time: {
            type: 'f',
            value: 0,
          },
        },
      ]);

      shader.uniforms = uniforms.current;
      shader.vertexShader = vertexShader;
      shader.fragmentShader = fragmentShader;
    };

    material.current = phongMaterial;

    startTransition(() => {
      if (!scene.current || !material.current) return;

      geometry.current = new SphereGeometry(32, 128, 128);

      sphere.current = new Mesh(
        geometry.current,
        material.current
      );

      sphere.current.position.z = 0;
      sphere.current.modifier = Math.random();

      scene.current.add(sphere.current);
    });

    return () => {
      if (scene.current) {
        cleanScene(scene.current);
      }

      if (renderer.current) {
        cleanRenderer(renderer.current);
      }

      renderer.current = null;
      camera.current = null;
      scene.current = null;
      material.current = null;
      geometry.current = null;
      sphere.current = null;
      uniforms.current = null;
    };
  }, []);

  // Lighting
  useEffect(() => {
    if (!scene.current) return;

    const dirLight = new DirectionalLight(
      0xffffff,
      theme === 'light' ? 1.8 : 2.0
    );

    const ambientLight = new AmbientLight(
      0xffffff,
      theme === 'light' ? 2.7 : 0.4
    );

    dirLight.position.z = 200;
    dirLight.position.x = 100;
    dirLight.position.y = 100;

    lights.current = [dirLight, ambientLight];

    lights.current.forEach(light => {
      scene.current.add(light);
    });

    return () => {
      removeLights(lights.current);
      lights.current = [];
    };
  }, [theme]);

  // Resize renderer using original dimensions
  useEffect(() => {
    if (
      !renderer.current ||
      !camera.current ||
      !sphere.current
    ) {
      return;
    }

    const { width, height } = windowSize;

    if (!width || !height) return;

    const adjustedHeight = height + height * 0.3;

    renderer.current.setSize(width, adjustedHeight);
    camera.current.aspect = width / adjustedHeight;
    camera.current.updateProjectionMatrix();

    // Responsive sphere positioning
    if (width <= media.mobile) {
      sphere.current.position.x = 14;
      sphere.current.position.y = 10;
    } else if (width <= media.tablet) {
      sphere.current.position.x = 18;
      sphere.current.position.y = 14;
    } else {
      sphere.current.position.x = 22;
      sphere.current.position.y = 16;
    }

    if (reduceMotion && scene.current) {
      renderer.current.render(
        scene.current,
        camera.current
      );
    }
  }, [reduceMotion, windowSize]);

  // Mouse interaction
  useEffect(() => {
    const onMouseMove = throttle(event => {
      const position = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };

      rotationX.set(position.y / 2);
      rotationY.set(position.x / 2);
    }, 100);

    if (!reduceMotion && isInViewport) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [
    isInViewport,
    reduceMotion,
    rotationX,
    rotationY,
  ]);

  // Animation loop
  useEffect(() => {
    if (
      !renderer.current ||
      !camera.current ||
      !scene.current ||
      !sphere.current
    ) {
      return;
    }

    let animationFrame;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      if (uniforms.current) {
        uniforms.current.time.value =
          0.00005 * (Date.now() - start.current);
      }

      if (!sphere.current) return;

      sphere.current.rotation.z += 0.001;
      sphere.current.rotation.x = rotationX.get();
      sphere.current.rotation.y = rotationY.get();

      renderer.current.render(
        scene.current,
        camera.current
      );
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      renderer.current.render(
        scene.current,
        camera.current
      );
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    isInViewport,
    reduceMotion,
    rotationX,
    rotationY,
  ]);

  return (
    <Transition
      in
      timeout={3000}
      nodeRef={canvasRef}
    >
      {({ visible, nodeRef }) => (
        <canvas
          aria-hidden="true"
          className={styles.canvas}
          data-visible={visible}
          ref={nodeRef}
          {...props}
        />
      )}
    </Transition>
  );
};
