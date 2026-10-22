// Helpers that turn the JSON files in src/data into page-ready data.
// Every number shown on the site is computed here from those files,
// so updating the JSON updates the counts everywhere.

import rosterJson from '../data/roster.json';
import achievementsJson from '../data/achievements.json';
import seasonsJson from '../data/seasons.json';
import hostedJson from '../data/hostedEvents.json';
import { eventUrl } from '../data/site';

export type Member = { name: string; role: string };
// A season holds divisions of teams, plus an optional "leadership" list for
// club roles that were announced without a team.
type RosterSeason = { leadership?: Member[] } & Record<string, Record<string, { members: Member[] }> | Member[] | undefined>;
type RosterFile = Record<string, RosterSeason>;
type AwardRow = { award: string; team: string };
type Competition = {
  date: string;
  endDate?: string;
  name: string;
  location: string;
  eventCode: string;
  hosted?: boolean;
  awards: AwardRow[];
};
type AchievementsFile = Record<string, { competitions: Competition[] }>;
type Milestone = {
  date: string;
  endDate?: string;
  name: string;
  location: string;
  eventCode: string;
  teams: string[];
  summary: string;
};
type SeasonMeta = {
  label: string;
  game: string;
  recordNote?: string;
  teamNames: Record<string, string>;
  milestones: Milestone[];
  /** true when only leadership (not full teams) is on record for the season */
  partialRoster?: boolean;
  rosterNote?: string;
};

const roster = rosterJson as RosterFile;
const achievements = achievementsJson as AchievementsFile;
const seasons = seasonsJson as Record<string, SeasonMeta>;
export const hostedEvents = hostedJson as Array<{
  season: string;
  name: string;
  game: string;
  date: string;
  eventCode: string;
  venue: string;
  address: string;
  program: string;
  format: string;
  gradeLevel: string;
  capacity: number | null;
  skills: boolean | null;
  schedule: { time: string; item: string }[];
  awardsOffered: { award: string; qualifies: string | null }[];
}>;

/* ---------- Seasons ---------- */

const byYearDesc = (a: string, b: string) => b.localeCompare(a);

/** "2025" → "2024–25" */
export function seasonLabel(key: string): string {
  if (seasons[key]?.label) return seasons[key].label;
  const y = parseInt(key, 10);
  return `${y - 1}–${String(y).slice(2)}`;
}
export const seasonGame = (key: string) => seasons[key]?.game ?? '';
export const seasonNote = (key: string) => seasons[key]?.recordNote ?? '';
export const seasonMeta = (key: string) => seasons[key];
export const teamName = (season: string, team: string) => seasons[season]?.teamNames?.[team] ?? '';

export const rosterSeasons = Object.keys(roster).sort(byYearDesc);
export const awardSeasons = Object.keys(achievements).sort(byYearDesc);
export const isPartialRoster = (season: string) => !!seasons[season]?.partialRoster;
export const rosterNote = (season: string) => seasons[season]?.rosterNote ?? '';
/** Newest season with full team lists (partial, leadership-only seasons are skipped). */
export const latestRosterSeason = rosterSeasons.find((s) => !isPartialRoster(s)) ?? rosterSeasons[0];

/* ---------- Roster ---------- */

const TEAM_ORDER = ['750B', '750C', '750E', '750R', '750S', '750W'];
const sortTeams = (a: string, b: string) => {
  const ia = TEAM_ORDER.indexOf(a);
  const ib = TEAM_ORDER.indexOf(b);
  if (ia === -1 && ib === -1) return a.localeCompare(b);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
};

// Sort order for roles. Anything not listed (e.g. workshop leads) sits
// after Vice-Captain and before Member.
const ROLE_ORDER = ['President', 'Co-President', 'Vice-President', 'Captain', 'Co-Captain', 'Vice-Captain'];
const roleRank = (role: string) => {
  if (role === 'Member') return ROLE_ORDER.length + 1;
  const i = ROLE_ORDER.indexOf(role);
  return i === -1 ? ROLE_ORDER.length : i;
};
/** Club-wide roles (as opposed to team roles like Captain). */
export const isClubRole = (role: string) => /President|Workshop Lead|VLA Representative/i.test(role);
export const isCaptainRole = (role: string) => role === 'Captain' || role === 'Co-Captain';

export type Team = {
  id: string;
  letter: string;
  division: string;
  members: Member[];
  leaders: Member[];
};

export function teamsForSeason(season: string): Team[] {
  const divisions = roster[season] ?? {};
  const teams: Team[] = [];
  for (const [division, group] of Object.entries(divisions)) {
    if (division === 'leadership' || !group || Array.isArray(group)) continue;
    for (const [id, data] of Object.entries(group)) {
      const members = [...data.members].sort((a, b) => roleRank(a.role) - roleRank(b.role));
      teams.push({
        id,
        letter: id.replace(/^\d+/, ''),
        division,
        members,
        leaders: members.filter((m) => m.role !== 'Member'),
      });
    }
  }
  return teams.sort((a, b) => sortTeams(a.id, b.id));
}

export function memberCount(season: string): number {
  return teamsForSeason(season).reduce((n, t) => n + t.members.length, 0);
}

/** Club roles announced without a team in a season. */
export const seasonLeadership = (season: string): Member[] => roster[season]?.leadership ?? [];

/** Club leadership in a season: presidents, workshop leads, etc. Team is '' when none was given. */
export function officers(season: string) {
  const onTeams = teamsForSeason(season).flatMap((t) =>
    t.members.filter((m) => isClubRole(m.role)).map((m) => ({ ...m, team: t.id })),
  );
  const noTeam = seasonLeadership(season).map((m) => ({ ...m, team: '' }));
  return [...onTeams, ...noTeam].sort((a, b) => roleRank(a.role) - roleRank(b.role));
}

/** Every season/team/role a person appears in (team is '' for club-only roles). */
export function memberHistory(name: string) {
  const out: { season: string; team: string; role: string }[] = [];
  for (const season of rosterSeasons) {
    for (const t of teamsForSeason(season)) {
      const m = t.members.find((x) => x.name === name);
      if (m) out.push({ season, team: t.id, role: m.role });
    }
    for (const m of seasonLeadership(season)) {
      if (m.name === name) out.push({ season, team: '', role: m.role });
    }
  }
  return out;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/* ---------- Awards ----------
   Counting rule used everywhere: one "team award" = one team receiving
   one award at one event. Two alliance partners who both win
   Tournament Champions count as two team awards.                    */

export type AwardKind =
  | 'excellence'
  | 'champions'
  | 'finalists'
  | 'skills'
  | 'design'
  | 'innovate'
  | 'think'
  | 'amaze'
  | 'judges'
  | 'sportsmanship'
  | 'create'
  | 'other';

export function awardKind(name: string): AwardKind {
  const n = name.toLowerCase();
  if (n.includes('excellence')) return 'excellence';
  if (n.includes('tournament champion')) return 'champions';
  if (n.includes('finalist')) return 'finalists';
  if (n.includes('skills')) return 'skills';
  if (n.includes('design')) return 'design';
  if (n.includes('innovate')) return 'innovate';
  if (n.includes('think')) return 'think';
  if (n.includes('amaze')) return 'amaze';
  if (n.includes('judges')) return 'judges';
  if (n.includes('sportsmanship')) return 'sportsmanship';
  if (n.includes('create')) return 'create';
  return 'other';
}

/** Display order and short labels for the trophy case. */
export const AWARD_KINDS: { kind: AwardKind; label: string; short: string; blurb: string }[] = [
  { kind: 'excellence', label: 'Excellence Award', short: 'Excellence', blurb: 'The top overall award at a VEX event, judged across robot, notebook, interview, and match performance.' },
  { kind: 'champions', label: 'Tournament Champions', short: 'Champions', blurb: 'Won the elimination bracket as part of the winning alliance.' },
  { kind: 'finalists', label: 'Tournament Finalists', short: 'Finalists', blurb: 'Reached the final match of the elimination bracket.' },
  { kind: 'skills', label: 'Robot Skills Champion', short: 'Skills', blurb: 'Highest combined driver and autonomous skills score at the event.' },
  { kind: 'design', label: 'Design Award', short: 'Design', blurb: 'Recognizes an organized design process documented in the engineering notebook.' },
  { kind: 'innovate', label: 'Innovate Award', short: 'Innovate', blurb: 'Recognizes a creative, well-documented engineering solution.' },
  { kind: 'think', label: 'Think Award', short: 'Think', blurb: 'Recognizes a strong programming effort, including autonomous routines.' },
  { kind: 'amaze', label: 'Amaze Award', short: 'Amaze', blurb: 'Recognizes a consistently high-performing, competitive robot.' },
  { kind: 'judges', label: 'Judges Award', short: 'Judges', blurb: 'Chosen by judges for a team that stood out.' },
  { kind: 'sportsmanship', label: 'Sportsmanship Award', short: 'Sportsmanship', blurb: 'Recognizes enthusiasm, courtesy, and respect throughout the event.' },
  { kind: 'create', label: 'Create Award', short: 'Create', blurb: 'Recognizes a creative engineering solution.' },
  { kind: 'other', label: 'Other awards', short: 'Other', blurb: '' },
];

export type EventRecord = Competition & {
  season: string;
  url: string;
  teams: string[];
};

export type AwardRecord = AwardRow & {
  season: string;
  kind: AwardKind;
  date: string;
  eventName: string;
  eventCode: string;
};

export function allEvents(): EventRecord[] {
  return awardSeasons
    .flatMap((season) =>
      (achievements[season]?.competitions ?? []).map((c) => ({
        ...c,
        season,
        url: eventUrl(c.eventCode),
        teams: [...new Set(c.awards.map((a) => a.team))].sort(sortTeams),
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function allAwards(): AwardRecord[] {
  return allEvents().flatMap((e) =>
    e.awards.map((a) => ({
      ...a,
      season: e.season,
      kind: awardKind(a.award),
      date: e.date,
      eventName: e.name,
      eventCode: e.eventCode,
    })),
  );
}

export function countByKind(records: AwardRecord[]) {
  const counts = new Map<AwardKind, number>();
  for (const r of records) counts.set(r.kind, (counts.get(r.kind) ?? 0) + 1);
  return counts;
}

export function awardsForTeam(team: string, season?: string) {
  return allAwards().filter((a) => a.team === team && (!season || a.season === season));
}

export const awardTeams = () => [...new Set(allAwards().map((a) => a.team))].sort(sortTeams);
export const allTeamIds = () =>
  [...new Set([...rosterSeasons.flatMap((s) => teamsForSeason(s).map((t) => t.id)), ...awardTeams()])].sort(sortTeams);

/* ---------- Dates ---------- */

const parse = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function formatDate(iso: string, style: 'long' | 'short' | 'month' = 'long') {
  const d = parse(iso);
  const opts: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { month: 'short', day: 'numeric', timeZone: 'UTC' }
      : style === 'month'
        ? { month: 'short', year: 'numeric', timeZone: 'UTC' }
        : { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
  return new Intl.DateTimeFormat('en-US', opts).format(d);
}

export function formatRange(start: string, end?: string) {
  if (!end) return formatDate(start);
  const a = parse(start);
  const b = parse(end);
  const sameMonth = a.getUTCMonth() === b.getUTCMonth();
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(a);
  if (sameMonth) return `${month} ${a.getUTCDate()}–${b.getUTCDate()}, ${b.getUTCFullYear()}`;
  return `${formatDate(start, 'short')} – ${formatDate(end)}`;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
