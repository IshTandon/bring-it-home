import type { Team, TeamStats, Player, SquadList, Stadium, Group, Match, TimelineDay } from '@/types';
import { TEAMS_AF } from './data-teams-af';
import { TEAMS_GL } from './data-teams-gl';
import { SQUADS_TOP12 } from './data-squads-top12';
import { SQUADS_REST } from './data-squads-rest';

function ratingFromRank(rank: number): number {
  if (rank === 1) return 95;
  if (rank === 2) return 93;
  if (rank === 3) return 92;
  if (rank === 4) return 91;
  if (rank === 5) return 90;
  if (rank === 6) return 89;
  return Math.max(58, 95 - Math.floor(rank * 0.8));
}

const ALL_SQUADS: Record<string, SquadList> = { ...SQUADS_TOP12, ...SQUADS_REST };

export const TEAMS: Team[] = [...TEAMS_AF, ...TEAMS_GL].map(t => ({
  ...t,
  players: [],
  squads: ALL_SQUADS[t.id],
}));

const POS_ATTRS: Record<string, { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number }> = {
  GK:  { PAC: 45, SHO: 15, PAS: 55, DRI: 18, DEF: 88, PHY: 80 },
  CB:  { PAC: 62, SHO: 35, PAS: 65, DRI: 55, DEF: 85, PHY: 82 },
  LB:  { PAC: 80, SHO: 42, PAS: 70, DRI: 65, DEF: 76, PHY: 72 },
  RB:  { PAC: 82, SHO: 42, PAS: 68, DRI: 62, DEF: 74, PHY: 70 },
  DEF: { PAC: 68, SHO: 38, PAS: 66, DRI: 58, DEF: 82, PHY: 78 },
  CDM: { PAC: 65, SHO: 55, PAS: 75, DRI: 68, DEF: 78, PHY: 80 },
  CM:  { PAC: 68, SHO: 65, PAS: 78, DRI: 72, DEF: 65, PHY: 72 },
  CAM: { PAC: 72, SHO: 72, PAS: 82, DRI: 80, DEF: 40, PHY: 62 },
  MID: { PAC: 70, SHO: 62, PAS: 76, DRI: 72, DEF: 60, PHY: 70 },
  LW:  { PAC: 88, SHO: 78, PAS: 72, DRI: 82, DEF: 28, PHY: 62 },
  RW:  { PAC: 86, SHO: 76, PAS: 74, DRI: 80, DEF: 30, PHY: 60 },
  ST:  { PAC: 80, SHO: 85, PAS: 62, DRI: 75, DEF: 25, PHY: 78 },
  CF:  { PAC: 78, SHO: 82, PAS: 72, DRI: 78, DEF: 30, PHY: 72 },
  FWD: { PAC: 84, SHO: 80, PAS: 68, DRI: 78, DEF: 28, PHY: 70 },
};

function getPos(section: string, _idx: number): string {
  if (section === 'gk') return 'GK';
  if (section === 'def') return ['CB', 'CB', 'CB', 'CB', 'LB', 'RB', 'CB', 'RB'][_idx % 8];
  if (section === 'mid') return ['CDM', 'CM', 'CM', 'CAM', 'CM', 'CDM', 'CM', 'CAM'][_idx % 8];
  return ['ST', 'LW', 'RW', 'ST', 'CF', 'LW', 'RW'][_idx % 7];
}

let _playersCache: Player[] | null = null;

function buildPlayers(): Player[] {
  if (_playersCache) return _playersCache;

  const result: Player[] = [];
  const forms: ('W' | 'D' | 'L')[][] = [
    ['W','W','D','W','W'], ['W','D','W','W','D'], ['D','W','W','D','W'],
    ['W','W','W','D','D'], ['W','D','D','W','W'], ['D','W','D','W','W'],
    ['W','W','W','W','D'], ['D','D','W','W','W'], ['W','D','W','D','W'],
    ['L','W','D','W','W'], ['W','W','L','W','D'], ['D','W','W','W','L'],
  ];

  for (const team of TEAMS) {
    const squads = team.squads;
    if (!squads) continue;
    const teamRating = team.rating;
    const sections: (keyof SquadList)[] = ['gk', 'def', 'mid', 'fwd'];
    let playerIdx = 0;

    for (const section of sections) {
      const players = squads[section];
      for (let i = 0; i < players.length; i++) {
        const sp = players[i];
        const pos = getPos(section, i);
        const baseAttrs = POS_ATTRS[pos] || POS_ATTRS.MID;
        const scale = (teamRating - 58) / 37;
        const jitter = ((playerIdx * 7 + 13) % 11) - 5;
        const ovr = Math.min(95, Math.max(58, Math.round(58 + scale * 34 + jitter)));

        const attrScale = (ovr - 58) / 37;
        const attrs = {
          PAC: Math.min(99, Math.round(baseAttrs.PAC + attrScale * 12 + ((playerIdx * 3) % 7) - 3)),
          SHO: Math.min(99, Math.round(baseAttrs.SHO + attrScale * 12 + ((playerIdx * 5) % 7) - 3)),
          PAS: Math.min(99, Math.round(baseAttrs.PAS + attrScale * 10 + ((playerIdx * 2) % 7) - 3)),
          DRI: Math.min(99, Math.round(baseAttrs.DRI + attrScale * 12 + ((playerIdx * 4) % 7) - 3)),
          DEF: Math.min(99, Math.round(baseAttrs.DEF + attrScale * 8 + ((playerIdx * 6) % 7) - 3)),
          PHY: Math.min(99, Math.round(baseAttrs.PHY + attrScale * 8 + ((playerIdx * 1) % 7) - 3)),
        };

        const form = forms[playerIdx % forms.length];
        const goals = pos === 'GK' ? 0 : pos.includes('B') || pos === 'CDM' ? ((playerIdx % 3 === 0) ? 1 : 0) : Math.floor(Math.random() * 4);
        const assists = pos === 'GK' ? 0 : Math.floor(Math.random() * 3);
        const rating = Number((6.0 + scale * 2.5 + (jitter * 0.1)).toFixed(1));

        const heatmap = pos === 'GK'
          ? { ATK: 2, MID: 5, DEF: 95, WID: 5 }
          : pos.includes('B') || pos === 'CB'
          ? { ATK: 10 + (playerIdx % 15), MID: 30 + (playerIdx % 20), DEF: 85 - (playerIdx % 15), WID: 60 + (playerIdx % 30) }
          : section === 'mid'
          ? { ATK: 35 + (playerIdx % 25), MID: 75 - (playerIdx % 15), DEF: 50 + (playerIdx % 20), WID: 40 + (playerIdx % 30) }
          : { ATK: 85 - (playerIdx % 15), MID: 40 + (playerIdx % 20), DEF: 10 + (playerIdx % 15), WID: 70 + (playerIdx % 25) };

        result.push({
          id: `${team.id.toLowerCase()}-${sp.id}`,
          name: sp.name,
          flag: team.flag,
          team: team.name,
          teamId: team.id,
          pos,
          ovr,
          apiId: sp.apiId,
          attrs,
          form,
          wcStats: { goals, assists, rating: Math.max(6.0, Math.min(9.5, rating)), matches: 3 + (playerIdx % 3) },
          heatmap,
          bio: `${sp.name} plays for ${sp.club}. A key figure in ${team.name}'s World Cup campaign.`,
        });
        playerIdx++;
      }
    }
  }

  _playersCache = result;
  return result;
}

export function getPlayers(): Player[] {
  return buildPlayers();
}

export const PLAYERS: Player[] = buildPlayers();

const _TEAM_STATS: Record<string, TeamStats> = {};
for (const t of TEAMS) {
  const teamPlayers = PLAYERS.filter(p => p.teamId === t.id);
  const totalGoals = teamPlayers.reduce((s, p) => s + p.wcStats.goals, 0);
  _TEAM_STATS[t.id] = {
    goalsFor: Math.max(totalGoals, 3 + Math.floor(Math.random() * 8)),
    goalsAgainst: 1 + Math.floor(Math.random() * 5),
    cleanSheets: Math.floor(Math.random() * 3),
    yellowCards: 3 + Math.floor(Math.random() * 8),
    redCards: Math.floor(Math.random() * 2),
    goalsByType: {
      openPlay: 2 + Math.floor(Math.random() * 5),
      setPiece: 1 + Math.floor(Math.random() * 3),
      freeKick: Math.floor(Math.random() * 2),
      penalty: Math.floor(Math.random() * 2),
      ownGoal: Math.floor(Math.random() * 1),
    },
  };
}
TEAMS.forEach(t => { t.teamStats = _TEAM_STATS[t.id]; });

const _GROUP_OPPONENTS: Record<string, string[]> = {
  MEX: ['KOR','RSA','CZE'], KOR: ['MEX','RSA','CZE'], RSA: ['MEX','KOR','CZE'], CZE: ['MEX','KOR','RSA'],
  SUI: ['CAN','QAT','BIH'], CAN: ['SUI','QAT','BIH'], QAT: ['SUI','CAN','BIH'], BIH: ['SUI','CAN','QAT'],
  BRA: ['MAR','SCO','HAI'], MAR: ['BRA','SCO','HAI'], SCO: ['BRA','MAR','HAI'], HAI: ['BRA','MAR','SCO'],
  USA: ['AUS','PAR','TUR'], AUS: ['USA','PAR','TUR'], PAR: ['USA','AUS','TUR'], TUR: ['USA','AUS','PAR'],
  GER: ['CIV','ECU','CUW'], CIV: ['GER','ECU','CUW'], ECU: ['GER','CIV','CUW'], CUW: ['GER','CIV','ECU'],
  NED: ['JPN','SWE','TUN'], JPN: ['NED','SWE','TUN'], SWE: ['NED','JPN','TUN'], TUN: ['NED','JPN','SWE'],
  BEL: ['IRN','EGY','NZL'], IRN: ['BEL','EGY','NZL'], EGY: ['BEL','IRN','NZL'], NZL: ['BEL','IRN','EGY'],
  ESP: ['URU','KSA','CPV'], URU: ['ESP','KSA','CPV'], KSA: ['ESP','URU','CPV'], CPV: ['ESP','URU','KSA'],
  FRA: ['SEN','NOR','IRQ'], SEN: ['FRA','NOR','IRQ'], NOR: ['FRA','SEN','IRQ'], IRQ: ['FRA','SEN','NOR'],
  ARG: ['AUT','ALG','JOR'], AUT: ['ARG','ALG','JOR'], ALG: ['ARG','AUT','JOR'], JOR: ['ARG','AUT','ALG'],
  POR: ['COL','COD','UZB'], COL: ['POR','COD','UZB'], COD: ['POR','COL','UZB'], UZB: ['POR','COL','COD'],
  ENG: ['CRO','PAN','GHA'], CRO: ['ENG','PAN','GHA'], PAN: ['ENG','CRO','GHA'], GHA: ['ENG','CRO','PAN'],
};

const _TEAM_FLAG: Record<string, string> = {};
TEAMS.forEach(t => { _TEAM_FLAG[t.id] = t.flag; });
const _W_SCORES = ['2-0','3-1','1-0','2-1','3-0'];
const _D_SCORES = ['1-1','0-0','2-2'];
const _L_SCORES = ['0-1','1-2','0-2','1-3'];

PLAYERS.forEach(p => {
  const opps = _GROUP_OPPONENTS[p.teamId] || ['USA','MEX','CAN'];
  p.formDetailed = p.form.map((outcome, i) => {
    const oppId = opps[i % opps.length];
    const scores = outcome === 'W' ? _W_SCORES : outcome === 'D' ? _D_SCORES : _L_SCORES;
    return { score: scores[i % scores.length], opponentFlag: _TEAM_FLAG[oppId] || '🏳️', outcome };
  });
});

export const STADIUMS: Record<string, Stadium> = {
  'MetLife Stadium': {
    name: 'MetLife Stadium', city: 'East Rutherford', country: 'USA', capacity: 82500,
    surface: 'Natural grass', opened: 2010, cost: '$1.6 billion',
    host: 'Final + 8 other matches',
    facts: [
      'Largest stadium in the WC tournament — 82,500 seats',
      'Home of NY Giants and NY Jets',
      'Open air — weather can be extreme in July',
      'Built specifically to host major events',
    ],
    coordinates: { lat: 40.8135, lng: -74.0745 },
  },
  'AT&T Stadium': {
    name: 'AT&T Stadium', city: 'Arlington', country: 'USA', capacity: 80000,
    surface: 'Retractable artificial turf', opened: 2009, cost: '$1.3 billion',
    host: '8 matches including a semifinal',
    facts: [
      'Climate-controlled dome — no weather issues for players or fans',
      'The roof opens in just 18 minutes',
      'Has the world\'s largest HD video screen (160m wide)',
      'Known as "Jerry World" after owner Jerry Jones',
    ],
    coordinates: { lat: 32.7473, lng: -97.0945 },
  },
  'SoFi Stadium': {
    name: 'SoFi Stadium', city: 'Inglewood', country: 'USA', capacity: 70240,
    surface: 'Artificial turf', opened: 2020, cost: '$5.5 billion (most expensive ever)',
    host: '8 matches',
    facts: [
      'Most expensive stadium ever constructed',
      '70,000 sq ft HD screen wrapping the seating bowl',
      'Fully enclosed but not climate controlled',
      'Home of LA Rams and LA Chargers',
    ],
    coordinates: { lat: 33.9535, lng: -118.3392 },
  },
  'Estadio Azteca': {
    name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523,
    surface: 'Natural grass', opened: 1966, cost: 'Renovated for $100M in 2023',
    host: '3 group stage matches',
    facts: [
      'Highest altitude WC venue at 2,240m — affects stamina significantly',
      'Only stadium to host 2 WC finals (1970 and 1986)',
      'Maradona\'s "Hand of God" goal was scored here in 1986',
      'Original capacity was 105,000 — reduced after 1985 earthquake',
    ],
    coordinates: { lat: 19.3029, lng: -99.1505 },
  },
};

function findTeam(id: string) { return TEAMS.find(t => t.id === id)!; }

const GROUP_DEFS: { id: string; name: string; teamIds: string[] }[] = [
  { id: 'A', name: 'Group A', teamIds: ['MEX', 'KOR', 'RSA', 'CZE'] },
  { id: 'B', name: 'Group B', teamIds: ['SUI', 'CAN', 'QAT', 'BIH'] },
  { id: 'C', name: 'Group C', teamIds: ['BRA', 'MAR', 'SCO', 'HAI'] },
  { id: 'D', name: 'Group D', teamIds: ['USA', 'AUS', 'PAR', 'TUR'] },
  { id: 'E', name: 'Group E', teamIds: ['GER', 'CIV', 'ECU', 'CUW'] },
  { id: 'F', name: 'Group F', teamIds: ['NED', 'JPN', 'SWE', 'TUN'] },
  { id: 'G', name: 'Group G', teamIds: ['BEL', 'IRN', 'EGY', 'NZL'] },
  { id: 'H', name: 'Group H', teamIds: ['ESP', 'URU', 'KSA', 'CPV'] },
  { id: 'I', name: 'Group I', teamIds: ['FRA', 'SEN', 'NOR', 'IRQ'] },
  { id: 'J', name: 'Group J', teamIds: ['ARG', 'AUT', 'ALG', 'JOR'] },
  { id: 'K', name: 'Group K', teamIds: ['POR', 'COL', 'COD', 'UZB'] },
  { id: 'L', name: 'Group L', teamIds: ['ENG', 'CRO', 'PAN', 'GHA'] },
];

function buildGroupMatches(teamIds: string[], groupId: string): Match[] {
  const t = teamIds.map(findTeam);
  const pairs: [number, number][] = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
  return pairs.map(([a, b], i) => ({
    id: `g${groupId}-${i}`,
    homeTeam: t[a], awayTeam: t[b],
    homeScore: null, awayScore: null,
    status: 'NS' as const, stadium: STADIUM_NAMES[i % 4],
    city: STADIUM_CITIES[i % 4], date: `2026-06-${15 + i}`,
    time: MATCH_TIMES_G[i % 3], round: 'Group Stage',
    group: `Group ${groupId}`, events: [],
  }));
}

const STADIUM_NAMES = ['MetLife Stadium', 'AT&T Stadium', 'SoFi Stadium', 'Estadio Azteca'];
const STADIUM_CITIES = ['East Rutherford', 'Arlington', 'Inglewood', 'Mexico City'];
const MATCH_TIMES_G = ['14:00 ET', '17:00 ET', '20:00 ET'];

export const MOCK_GROUPS: Group[] = GROUP_DEFS.map(g => ({
  id: g.id,
  name: g.name,
  teams: g.teamIds.map(findTeam),
  standings: [],
  matches: buildGroupMatches(g.teamIds, g.id),
}));

export const TIMELINE_DAYS: TimelineDay[] = [
  {
    id: 1, label: 'Day 1', date: '2026-06-11', tag: 'Opening Day', upset: false, future: false,
    headline: 'The World Cup is alive. Mexico silence the doubters in a thundering Azteca opener.',
    narrative: 'Estadio Azteca shook. 87,000 voices became one as Mexico dismantled South Korea 3-1 in the tournament\'s opening match. Hirving Lozano rolled back the years with a brace, and Edson Álvarez controlled midfield like he owned it. In the late kickoff, the USA drew 1-1 with Australia — Christian Pulisic\'s free kick cancelled out by a late equalizer. The tournament has begun. Nobody is safe.',
    matches: [
      { homeTeam: 'Mexico', homeFlag: '🇲🇽', awayTeam: 'South Korea', awayFlag: '🇰🇷', homeScore: 3, awayScore: 1, note: 'Lozano brace lights up Azteca' },
      { homeTeam: 'USA', homeFlag: '🇺🇸', awayTeam: 'Australia', awayFlag: '🇦🇺', homeScore: 1, awayScore: 1, note: 'Pulisic free kick answered late' },
    ],
    playerOfDay: { name: 'Hirving Lozano', flag: '🇲🇽', team: 'Mexico', stat: '2 goals, 1 assist, 9.2 rating' },
    stats: { goals: 5, upsets: 0, cards: 6, penalties: 0 },
    mood: [
      { team: 'Mexico', flag: '🇲🇽', positive: 94, negative: 6 },
      { team: 'South Korea', flag: '🇰🇷', positive: 18, negative: 82 },
      { team: 'USA', flag: '🇺🇸', positive: 55, negative: 45 },
      { team: 'Australia', flag: '🇦🇺', positive: 62, negative: 38 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 4821 },
      { emoji: '😴', label: 'Dull', count: 312 },
      { emoji: '😱', label: 'Shocking', count: 1450 },
      { emoji: '🎉', label: 'Festival', count: 3200 },
    ],
  },
  {
    id: 2, label: 'Day 2', date: '2026-06-12', tag: 'Europe Arrives', upset: true, future: false,
    headline: 'France cruise. Brazil stutter. The group of death is already delivering.',
    narrative: 'France opened with a statement: Mbappé scored twice and Griezmann added a third in a commanding 3-0 demolition of Norway. Meanwhile, Brazil were held to a surprise 1-1 draw by Morocco — Hakimi\'s late equalizer silencing the Canarinho faithful. England edged Croatia 1-0 thanks to a Bellingham screamer from 25 yards. The tournament is finding its rhythm.',
    matches: [
      { homeTeam: 'France', homeFlag: '🇫🇷', awayTeam: 'Norway', awayFlag: '🇳🇴', homeScore: 3, awayScore: 0, note: 'Mbappé double leads France' },
      { homeTeam: 'Brazil', homeFlag: '🇧🇷', awayTeam: 'Morocco', awayFlag: '🇲🇦', homeScore: 1, awayScore: 1, note: 'Hakimi late equalizer stuns Brazil' },
      { homeTeam: 'England', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam: 'Croatia', awayFlag: '🇭🇷', homeScore: 1, awayScore: 0, note: 'Bellingham screamer wins it' },
    ],
    playerOfDay: { name: 'Kylian Mbappé', flag: '🇫🇷', team: 'France', stat: '2 goals, 1 assist, 9.5 rating' },
    stats: { goals: 6, upsets: 1, cards: 8, penalties: 0 },
    mood: [
      { team: 'France', flag: '🇫🇷', positive: 96, negative: 4 },
      { team: 'Morocco', flag: '🇲🇦', positive: 78, negative: 22 },
      { team: 'Brazil', flag: '🇧🇷', positive: 35, negative: 65 },
      { team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', positive: 82, negative: 18 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 5200 },
      { emoji: '😴', label: 'Dull', count: 180 },
      { emoji: '😱', label: 'Shocking', count: 3800 },
      { emoji: '🎉', label: 'Festival', count: 2900 },
    ],
  },
  {
    id: 3, label: 'Day 3', date: '2026-06-13', tag: 'South American Flair', upset: false, future: false,
    headline: 'Argentina remind the world why they\'re champions. Spain show their depth.',
    narrative: 'Messi turned back the clock with a magical free kick as Argentina beat Austria 2-0 in a controlled display. Spain were equally impressive, dismantling Saudi Arabia 3-0 with Yamal and Williams tormenting the Saudi defence. Germany ground out a 1-0 win over Ecuador thanks to a Musiala solo goal. The favourites are flexing.',
    matches: [
      { homeTeam: 'Argentina', homeFlag: '🇦🇷', awayTeam: 'Austria', awayFlag: '🇦🇹', homeScore: 2, awayScore: 0, note: 'Messi free kick masterclass' },
      { homeTeam: 'Spain', homeFlag: '🇪🇸', awayTeam: 'Saudi Arabia', awayFlag: '🇸🇦', homeScore: 3, awayScore: 0, note: 'Yamal and Williams unstoppable' },
      { homeTeam: 'Germany', homeFlag: '🇩🇪', awayTeam: 'Ecuador', awayFlag: '🇪🇨', homeScore: 1, awayScore: 0, note: 'Musiala solo goal decides it' },
    ],
    playerOfDay: { name: 'Lionel Messi', flag: '🇦🇷', team: 'Argentina', stat: '1 goal, 1 assist, 9.3 rating' },
    stats: { goals: 6, upsets: 0, cards: 5, penalties: 0 },
    mood: [
      { team: 'Argentina', flag: '🇦🇷', positive: 95, negative: 5 },
      { team: 'Spain', flag: '🇪🇸', positive: 92, negative: 8 },
      { team: 'Germany', flag: '🇩🇪', positive: 74, negative: 26 },
      { team: 'Ecuador', flag: '🇪🇨', positive: 32, negative: 68 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 4600 },
      { emoji: '😴', label: 'Dull', count: 420 },
      { emoji: '😱', label: 'Shocking', count: 1100 },
      { emoji: '🎉', label: 'Festival', count: 3400 },
    ],
  },
];

export interface TournamentHistoryPlayer { name: string; flag: string; team: string; goals: number; assists: number; rating: number; }
export interface TournamentHistoryTeam { id: string; name: string; flag: string; avgRating: number; goalsScored: number; goalsConceded: number; bigChances: number; }
export interface TournamentHistoryEntry { year: number; host: string; hostFlag: string; winner: { name: string; flag: string; id: string }; runnerUp: { name: string; flag: string; id: string }; finalScore: string; topPlayers: TournamentHistoryPlayer[]; topTeams: TournamentHistoryTeam[]; }

export { TOURNAMENT_HISTORY } from './data-history';

export const FAN_IQ_LEVELS = [
  { level: 'Casual Fan', min: 0, max: 20 },
  { level: 'Football Nerd', min: 21, max: 40 },
  { level: 'Tactical Analyst', min: 41, max: 60 },
  { level: 'Scout', min: 61, max: 80 },
  { level: 'World Cup Oracle', min: 81, max: 100 },
];

export const ALL_PLAYERS = PLAYERS;
