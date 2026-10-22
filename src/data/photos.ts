// Photos used across the site, with alt text and captions in one place.
// Team photos come from each team's public Instagram account. Record the
// source post when you add a photo.

import robot750B from '../assets/photos/2025-750b-robot-studio.jpg';
import team750C from '../assets/photos/2026-750c-team.jpg';
import team750E from '../assets/photos/2026-750e-team.jpg';
import team750R from '../assets/photos/2025-750r-team.jpg';
import worlds750SSign from '../assets/photos/2026-worlds-750s-vex-sign.jpg';
import team750W from '../assets/photos/2026-750w-team-amaze.jpg';
import worlds750SBanner from '../assets/photos/2026-worlds-750s-st-louis-banner.jpg';
import worldsRobotNight from '../assets/photos/2026-worlds-750s-robot-night.jpg';
import sbhsAwards from '../assets/photos/2026-sbhs-tournament-awards.jpg';
import sbhsVikings from '../assets/photos/2026-sbhs-tournament-vikings-banner.jpg';
import excellence750C from '../assets/photos/2026-sbhs-tournament-750c-excellence.jpg';
import worldsDallas from '../assets/photos/2025-worlds-dallas.jpeg';

type Photo = { src: ImageMetadata; alt: string; caption: string; position?: string; source?: string };

/** One photo per team for the homepage team tiles. */
export const teamPhotos: Record<string, Photo> = {
  '750B': {
    src: robot750B,
    alt: '750B’s robot lit by a single spotlight in a dark room.',
    caption: '750B robot · 2024–25',
    position: '50% 55%',
    source: 'https://www.instagram.com/750blitz/p/DJQbLgQRfK1/',
  },
  '750C': {
    src: team750C,
    alt: 'Members of 750C standing together in a school gym in front of championship banners.',
    caption: '750C · Feb 2026',
    position: '50% 40%',
    source: 'https://www.instagram.com/750cobras/p/DVFtS6JjWgs/',
  },
  '750E': {
    src: team750E,
    alt: 'Members of 750E posing arm in arm in a school gym.',
    caption: '750E · Feb 2026',
    position: '50% 35%',
    source: 'https://www.instagram.com/750ember/p/DVC3ZbEDK_U/',
  },
  '750R': {
    src: team750R,
    alt: 'Members of 750R holding an award in a gym during a tournament.',
    caption: '750R · Jan 2025',
    position: '50% 45%',
    source: 'https://www.instagram.com/750royals/p/DFTrO-ZOatP/',
  },
  '750S': {
    src: worlds750SSign,
    alt: 'Members of 750S with their robot in front of a large VEX Robotics sign at the 2026 World Championship.',
    caption: '750S at Worlds · Apr 2026',
    position: '50% 55%',
    source: 'https://www.instagram.com/750sentinels/p/DXsGzN1gXE2/',
  },
  '750W': {
    src: team750W,
    alt: 'Members of 750W holding their Amaze Award certificate in a gym.',
    caption: '750W · Feb 2026',
    position: '50% 40%',
    source: 'https://www.instagram.com/750wolves/p/DVEJvzPEfe7/',
  },
};

export const photos = {
  worlds2026Banner: {
    src: worlds750SBanner,
    alt: 'Members of 750S standing under a “Welcome to St. Louis” banner at the 2026 VEX Robotics World Championship.',
    caption: '750S at the World Championship · St. Louis, MO · Apr 2026',
    position: '50% 45%',
    source: 'https://www.instagram.com/750sentinels/p/DXsGzN1gXE2/',
  },
  worlds2026RobotNight: {
    src: worldsRobotNight,
    alt: '750S’s robot on a St. Louis street at night, with the Gateway Arch in the distance.',
    caption: '750S robot in St. Louis · Apr 2026',
    position: '50% 70%',
    source: 'https://www.instagram.com/750sentinels/p/DXsGzN1gXE2/',
  },
  robot750B: {
    src: robot750B,
    alt: '750B’s robot lit by a single spotlight in a dark room.',
    caption: '750B’s robot · 2024–25 season',
    position: '50% 58%',
    source: 'https://www.instagram.com/750blitz/p/DJQbLgQRfK1/',
  },
  worlds2025Dallas: {
    src: worldsDallas,
    alt: 'A group of South Brunswick Robotics members standing outside the 2025 VEX Robotics World Championship beneath a banner that reads ‘Welcome to the largest robotics competition in the world’.',
    caption: 'SB Robotics members at the World Championship · Dallas, TX · May 2025',
    position: '50% 0%',
  },
  sbhsAwards: {
    src: sbhsAwards,
    alt: '750S and 750C robots on a table with their Robot Skills Champion, Tournament Finalist, and Excellence Award certificates.',
    caption: '750S and 750C with their awards at our tournament · Feb 21, 2026',
    position: '50% 50%',
    source: 'https://www.instagram.com/750sentinels/p/DVHuEqPkc-s/',
  },
  sbhsVikings: {
    src: sbhsVikings,
    alt: 'Two robots in front of a “Welcome to SBHS, Home of the Vikings” banner at South Brunswick High School.',
    caption: 'Our tournament at South Brunswick High School · Feb 21, 2026',
    position: '50% 80%',
    source: 'https://www.instagram.com/750sentinels/p/DVHuEqPkc-s/',
  },
  excellence750C: {
    src: excellence750C,
    alt: '750C’s robot next to its Excellence Award certificate.',
    caption: '750C’s robot and Excellence Award · Feb 21, 2026',
    position: '50% 55%',
    source: 'https://www.instagram.com/750cobras/p/DVFtS6JjWgs/',
  },
} satisfies Record<string, Photo>;

/** Photos for tournaments we hosted, keyed by event code. */
export const eventPhotos: Record<string, { hero?: Photo; results?: Photo }> = {
  'RE-V5RC-25-0079': { hero: photos.sbhsVikings, results: photos.sbhsAwards },
};
