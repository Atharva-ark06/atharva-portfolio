import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { deviceModels } from '~/components/model/device-models';
import { Loader } from '~/components/loader';
import { TubesCursor } from '~/components/tubes-cursor/tubes-cursor';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import styles from './projects.module.css';

const Model = lazy(() =>
  import('~/components/model').then(module => ({ default: module.Model }))
);

const projects = [
  {
    title: 'XYZ Insta Neural Social Hub',
    description:
      'A modern social media platform featuring user authentication, registration, posts, and an immersive neural-inspired interface.',
    image: '/static/xyz-insta.png',
    github:
      'https://github.com/Atharva-ark06/XYZ-Insta-Neural-Social-Hub',
  },
  {
    title: 'Ocean AI',
    description:
      'An AI-powered ocean exploration platform combining interactive visualization, APIs, AI interaction, and image analysis.',
    image: '/static/ocean-ai.png',
    github: 'https://github.com/Atharva-ark06/Ocean-AI',
  },
  {
    title: 'LPM Network Demonstration',
    description:
      'A cybersecurity-focused network project demonstrating Longest Prefix Match and route selection using virtualized network environments.',
    image: '/static/lpm-network.png',
    github:
      'https://github.com/Atharva-ark06/LPM-Network-Demonstration',
  },
  {
    title: 'C-Minus Compiler',
    description:
      'A functional multi-phase compiler designed and implemented from scratch to demonstrate the core principles of compiler construction.',
    image: '/static/c-compiler.png',
    github:
      'https://github.com/Atharva-ark06/Custom-C-Minus-Compiler-Implementation',
  },
];

function ProjectLaptop({ project }) {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={styles.modelWrapper}>
      {!loaded && (
        <Loader center className={styles.loader} />
      )}

      {visible && (
        <Suspense fallback={null}>
          <Model
            alt={`${project.title} displayed on laptop`}
            cameraPosition={{ x: 0, y: 0, z: 8 }}
            show
            showDelay={300}
            onLoad={() => setLoaded(true)}
            models={[
              {
                ...deviceModels.laptop,
                texture: {
                  srcSet: project.image,
                  placeholder: project.image,
                  sizes: '(max-width: 768px) 90vw, 45vw',
                },
              },
            ]}
          />
        </Suspense>
      )}
    </div>
  );
}

export function Projects() {
  return (
    <Section className={styles.projects}>
      {/* CURSOR EFFECT — PROJECTS SECTION ONLY */}
      <div className={styles.cursorBackground}>
        <TubesCursor />
      </div>

      <div className={styles.header}>
        <Heading level={1} as="h1">
          Projects
        </Heading>

        <Text className={styles.intro}>
          A collection of my projects, experiments, and technical work.
        </Text>
      </div>

      <div className={styles.projectList}>
        {projects.map((project, index) => (
          <article
            className={styles.project}
            data-alternate={index % 2 === 1}
            key={project.title}
          >
            <div className={styles.preview}>
              <ProjectLaptop project={project} />
            </div>

            <div className={styles.content}>
              <div className={styles.projectNumber}>
                {String(index + 1).padStart(2, '0')}
              </div>

              <Heading level={2} as="h2">
                {project.title}
              </Heading>

              <Text className={styles.description}>
                {project.description}
              </Text>

              <Button
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                iconEnd="arrow-right"
              >
                View on GitHub
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}