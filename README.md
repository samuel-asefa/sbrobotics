# South Brunswick Robotics website

The website for South Brunswick Robotics, the VEX V5 Robotics Competition program at South Brunswick High School (teams 750B, 750C, 750E, 750R, 750S, 750W).

Live site: <https://sbrobotics.vercel.app>

- **Framework:** [Astro 5](https://astro.build), static output
- **Styles:** Tailwind CSS 4 (Vite plugin) for the reset and design tokens, plus scoped component CSS
- **Fonts:** Barlow Condensed, Barlow, and JetBrains Mono, self-hosted through [Fontsource](https://fontsource.org) (SIL Open Font License)
- **Images:** optimized at build time by `astro:assets` (AVIF/WebP, responsive sizes)
- **JavaScript:** a few small vanilla TypeScript scripts, no client framework
- **Deploys:** Vercel builds `main` automatically. Nothing server-side is required.

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in ./dist
npm run preview   # serve ./dist locally
```

> **Folder names with a colon.** If the project lives in a folder whose path contains `:` (for example `Clubs:ECs`), npm cannot find the `astro` binary because `:` separates entries in `PATH`. Run Astro directly instead:
>
> ```bash
> node node_modules/astro/astro.js dev
> node node_modules/astro/astro.js build
> ```

## Project structure

```text
public/                     Files served as-is: favicons, og-image.jpg, original logo files
src/
  assets/
    brand/                  Logo used in the header and footer
    photos/                 Team photos (optimized automatically at build)
  components/
    Header.astro            Top bar, desktop nav, full-screen mobile menu (<dialog>)
    Footer.astro
    PageHero.astro          Big headline block used at the top of every inner page
    SectionHead.astro       Numbered section label + heading
    SeasonTimeline.astro    Event-by-event season story (horizontal on desktop)
    Stat.astro              Big number + label + scope line (counts up once)
    Marquee.astro           The one scrolling strip (pausable)
    ClosingCTA.astro        "Join the SB Crew" invitation
    TeamId.astro            "750B" with the letter in gold
    AwardIcon.astro         Line icon for each award type
    Icon.astro              Arrows, mail, close, etc.
  data/
    roster.json             Members by season and team
    achievements.json       Team awards by season and event
    seasons.json            Season labels, game names, team names, milestones (e.g. Worlds)
    hostedEvents.json       Tournaments we host at SBHS
    site.ts                 Email, address, navigation, external links
  layouts/Layout.astro      <head>, fonts, skip link, header/footer, motion script
  lib/data.ts               Turns the JSON into page data; all counts are computed here
  pages/                    One file per route: index, about, roster, achievements, competition, outreach, contact
  scripts/motion.ts         Scroll reveals, count-ups, parallax, marquee pausing, progress bar
  styles/global.css         Design tokens, type, buttons, reveal states, reduced motion
```

## Updating content

All content lives in `src/data`. Pages read from it, so you rarely need to edit page files.

### A new season roster

Seasons are keyed by the year the season **ends** (`"2026"` = the 2025–26 season).

1. Add the season to `src/data/roster.json`:
   ```json
   "2026": {
     "High School": {
       "750B": { "members": [ { "name": "First Last", "role": "Captain" } ] }
     }
   }
   ```
   Any role text works. `Captain`/`Co-Captain` show as captains on the homepage. Presidents, workshop leads, and the VLA Representative are treated as club leadership. Anyone who is not a `Member` is highlighted.
2. Club roles announced **without** a team go in a season-level `leadership` list (see `"2026"` in `roster.json`):
   ```json
   "leadership": [ { "name": "First Last", "role": "President" } ]
   ```
3. Add the season to `src/data/seasons.json` with its `label` (`"2026–27"`), `game` (`"Override"`), and `teamNames` as listed on VEX Events.
4. If only leadership is known for a season, set `"partialRoster": true` and a short `rosterNote` in `seasons.json`. That season is labeled "Leadership only" and is never used as the homepage roster.

The newest full roster becomes the default on `/roster` and on the homepage teams section automatically. Older seasons stay available as an archive.

Rosters were last imported from `SB-Robotics-Rosters-2023-2027.xlsx` (Roster Data sheet). Only named people with a roster or leadership source were imported. Unnamed slots and event-volunteer-only names were left out, and two spellings were normalized ("Sammy Asefa" → "Samuel Asefa", "Pranavkirthik Vijayakumaar" → "Pranavkirthik Vijayakumar"). The workbook also listed Aarush Sinha on 750S for 2026–27; the team confirmed he is only on 750B (Vice-Captain).

### Awards

Add events to `src/data/achievements.json` under the right season:

```json
{
  "date": "2026-02-21",
  "name": "Event name exactly as on VEX Events",
  "location": "Venue, Town, NJ",
  "eventCode": "RE-V5RC-25-0079",
  "hosted": true,
  "awards": [ { "award": "Excellence Award", "team": "750C" } ]
}
```

- Use ISO dates (`YYYY-MM-DD`).
- Use official award names (`Tournament Champions`, `Robot Skills Champion`, …). The icon and trophy-case category are picked from the name.
- `eventCode` builds the link to `https://events.vex.com/robot-competitions/vex-robotics-competition/<code>.html`. (Old `robotevents.com` event links now return 404.)
- `hosted: true` marks events we ran at SBHS.
- **Counting rule:** one record = one team receiving one award at one event. Two alliance partners who both win Tournament Champions are two records. Every count on the site (homepage stats, trophy case, team tiles) uses this rule.

Non-award moments such as a World Championship appearance go in `milestones` in `seasons.json`. They appear in the season timeline and the awards archive but are never counted as awards.

The homepage season story uses `storySeason` in `src/pages/index.astro` (currently `"2026"`). Change it when a newer season has a full set of results.

### A tournament we host

Add it to `src/data/hostedEvents.json`. The newest one leads `/competition`, older ones move to the archive. Whether it shows as "Upcoming" or "Past" is decided when the site is built, so redeploy after the event (any push to `main` does this). Put SB team results for that event in `achievements.json` with `"hosted": true`.

### Contact details and navigation

Edit `src/data/site.ts`.

### Photos

1. Put the original file in `src/assets/photos/` (largest version you have; JPEG or PNG). Name it `YYYY-event-subject.jpg`.
2. Import it in the page and use Astro's `<Picture>`:
   ```astro
   import { Picture } from 'astro:assets';
   import photo from '../assets/photos/2026-states-750c.jpg';
   <Picture src={photo} formats={['avif', 'webp']} fallbackFormat="jpg" widths={[640, 1280]} sizes="100vw" alt="Who, doing what, where, when" />
   ```
3. Write alt text that says who is in the photo and what event it is. Captions should name the event and date.
4. Do not use other teams' photos or AI-generated images of people or robots.
5. Shared photos (team tiles, Worlds feature, event photos) are listed with alt text, captions, and their source post in `src/data/photos.ts`. Most come from the teams' public Instagram accounts (750sentinels, 750blitz, 750cobras, 750royals, 750ember, 750wolves).

## Design system

- **Colors** (`src/styles/global.css`): near-black `--color-ink`, charcoal `--color-coal`, soft white `--color-paper`, and the logo gold `--color-gold` (#FFBC00). Gold is for emphasis, active states, and accents only.
- **Type:** Barlow Condensed ExtraBold (italic for the athletic display lines), Barlow for reading text, JetBrains Mono for small tracked labels, dates, and codes.
- **Motion** is opt-in through attributes, handled by `src/scripts/motion.ts`:
  - `data-reveal` (fade/slide), `data-reveal="mask"` (image wipe), `style="--d:1"` to stagger
  - `data-count` on a number to count up once
  - `data-parallax="0.1"` for slow image drift (desktop only, paused off screen)
  - `data-marquee` / `data-loop` pause looping animation when off screen
- **Accessibility:** with `prefers-reduced-motion`, or if JavaScript fails, all content is shown immediately with no animation. Menus and dialogs use native `<dialog>` (Escape closes, focus returns to the button that opened it).

## Content notes and verification

Checked against official VEX event pages (events.vex.com) in October 2026:

- Every team award for 750B, 750C, 750E, 750R, 750S, and 750W from 2023–24 through 2025–26 (33 records at 14 events), from each team's VEX Events page. Earlier seasons are not in the archive yet.
- Event names, dates, and venues for every linked event.
- 750S competed at the 2026 World Championship (high school V5RC, April 21–24, 2026, St. Louis, Spirit division; 865 teams entered). The team's own Instagram post says it qualified through a 4th-place finish in New Jersey's robot skills rankings.
- 750B competed at the 2025 World Championship (high school V5RC, May 6–8, 2025, Math division; 831 teams entered) after Tournament Finalists and the Think Award at the 2025 NJ State Championship (both listed as World Championship qualifiers).
- Team names registered for 2024–25 and 2025–26, and current team names on each team's VEX Events profile (October 2026).
- 2026–27 season game (Override), from 2026–27 event listings.
- 750C's Excellence Award at the 2013 NJ state championship and Worlds qualification (The Sun, Feb 27, 2013).

Fixed during the redesign: the Camden Catholic 2024 event pointed to the Sparta Blitz page (now `RE-VRC-23-1564`), one award was spelled "Tournament Champion", and event links moved from robotevents.com to events.vex.com.

Removed from public copy because they could not be verified: "50+ awards", "~5+ Worlds qualifications", "all 6 teams qualified for States", "Global Skills Ranking of 25th", "800 of 13,000 teams", and 750B's Round of 16 finish at Worlds. Add them back with a source if one turns up.

The founding year (2012) comes from the previous About page.

## Still needed

- 2026–27 roster questions from the roster workbook:
  - One 750S member slot and one 750R member slot have no name, so they are not shown.
  - Anushree Chidambaram's role is marked unconfirmed ("VLA Representative?"), so the site shows her as a Member for now.
- 2025–26: full team lists (only leadership was announced) and the 750B captain.
- Award history before 2023–24 (each team's VEX Events page lists it back to 2018–19).
- Current-season photos: robots on the field, build sessions, programming, and each team. Landscape originals at 2000px or wider would make the strongest heroes.
- A higher-resolution photo from our own tournament (the current pits photo is 259 × 194).
- Meeting information or a join process the team is happy to publish.
- Sponsor names and logos, if the program has sponsors to credit.
