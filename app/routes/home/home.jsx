import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';

// Prefetch draco decoder wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'AI/ML Developer + Cybersecurity',
    description: `Portfolio of ${config.name} — an AI/ML developer and cybersecurity enthusiast building practical technology projects.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);

  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [
      intro,
      projectOne,
      projectTwo,
      projectThree,
      details,
    ];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);

            if (visibleSections.includes(section)) return;

            setVisibleSections(prevSections => [
              ...prevSections,
              section,
            ]);
          }
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
      }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      {
        rootMargin: '-100% 0px 0px 0px',
      }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />

      {/* PROJECT 01 — OCEAN AI */}
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Ocean AI"
        description="An AI-powered ocean exploration platform combining interactive visualization, APIs, AI interaction, and image analysis."
        buttonText="View project"
        buttonLink="https://github.com/Atharva-ark06/Ocean-AI"
        model={{
          type: 'laptop',
          alt: 'Ocean AI project',
          textures: [
            {
              srcSet: '/static/ocean-ai.png',
              placeholder: '/static/ocean-ai.png',
            },
          ],
        }}
      />

      {/* PROJECT 02 — LPM NETWORK DEMONSTRATION */}
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="LPM Network Demonstration"
        description="A cybersecurity-focused network project demonstrating Longest Prefix Match and route selection using virtualized network environments."
        buttonText="View project"
        buttonLink="https://github.com/Atharva-ark06/LPM-Network-Demonstration"
        model={{
          type: 'laptop',
          alt: 'LPM Network Demonstration',
          textures: [
            {
              srcSet: '/static/lpm-network.png',
              placeholder: '/static/lpm-network.png',
            },
          ],
        }}
      />

      {/* PROJECT 03 — C-MINUS COMPILER */}
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="C-Minus Compiler"
        description="A functional, multi-phase compiler designed and implemented from scratch to demonstrate the core principles of compiler construction."
        buttonText="View project"
        buttonLink="https://github.com/Atharva-ark06/Custom-C-Minus-Compiler-Implementation"
        model={{
          type: 'laptop',
          alt: 'C-Minus Compiler project',
          textures: [
            {
              srcSet: '/static/c-compiler.png',
              placeholder: '/static/c-compiler.png',
            },
          ],
        }}
      />

      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />

      <Footer />
    </div>
  );
};