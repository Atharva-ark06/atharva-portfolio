import config from '~/config.json';

export const navLinks = [
  {
  label: 'Projects',
  pathname: '/projects',
  },
  {
    label: 'Details',
    pathname: '/#details',
  },
  {
    label: 'Certificates',
    pathname: '/certificates',
  },
  {
    label: 'Articles',
    pathname: '/articles',
  },
  {
    label: 'Contact',
    pathname: '/contact',
  },
];

export const socialLinks = [

  {
    label: 'Github',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/atharvakulkarniark/',
    icon: 'linkedin',
  },
];