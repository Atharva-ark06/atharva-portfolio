import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import CertificateShowcase from '~/components/certificate-showcase/certificate-showcase';
import styles from './certificates.module.css';
import MorphGallery from '~/components/morph-gallery/morph-gallery';

export const Certificates = () => {
  return (
    <Section className={styles.certificates}>
      <div className={styles.header}>
        <Text size="s" className={styles.label}>
          01 — CERTIFICATES
        </Text>

        <Heading level={1} as="h1">
          Certificates
        </Heading>

        <Text className={styles.intro}>
          A collection of certifications, achievements, competitions,
          and learning milestones.
        </Text>
      </div>
<MorphGallery />


    </Section>
  );
};

export default Certificates;
