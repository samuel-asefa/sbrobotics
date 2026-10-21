// Site-wide facts and navigation. Update contact details here only.

export const site = {
  name: 'South Brunswick Robotics',
  shortName: 'SB Robotics',
  organization: '750',
  school: 'South Brunswick High School',
  email: 'robotics@sbschools.org',
  address: {
    street: '750 Ridge Road',
    city: 'Monmouth Junction',
    state: 'NJ',
    zip: '08852',
  },
  founded: 2012,
  description:
    'South Brunswick Robotics is the VEX V5 robotics program at South Brunswick High School in Monmouth Junction, New Jersey. Students design, build, program, and compete as the 750 teams.',
  credit: { name: 'Sammy', href: 'https://samuel-asefa.github.io' },
};

export const nav = [
  { label: 'About', href: '/about' },
  { label: 'Roster', href: '/roster' },
  { label: 'Awards', href: '/achievements' },
  { label: 'Competition', href: '/competition' },
  { label: 'Outreach', href: '/outreach' },
];

export const contactNav = { label: 'Get involved', href: '/contact' };

export const externalLinks = [
  { label: 'VEX Robotics', href: 'https://www.vexrobotics.com/' },
  { label: 'VEX Events', href: 'https://events.vex.com/' },
  { label: 'REC Foundation', href: 'https://recf.org/' },
];

export const eventUrl = (code: string) =>
  `https://events.vex.com/robot-competitions/vex-robotics-competition/${code}.html`;

export const mailto = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
