// ─── Squad ────────────────────────────────────────────────
export interface SquadPlayer {
  id: string;
  name: string;
  number: number;
  club: string;
  age: number;
  apiId?: number;
}

export interface SquadList {
  gk: SquadPlayer[];
  def: SquadPlayer[];
  mid: SquadPlayer[];
  fwd: SquadPlayer[];
}

// ─── Teams ────────────────────────────────────────────────
export interface TeamStats {
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  goalsByType: {
    openPlay: number;
    setPiece: number;
    freeKick: number;
    penalty: number;
    ownGoal: number;
  };
}

export interface Team {
  id: string;
  name: string;
  flag: string;
  rating: number;
  rank: number;
  group: string;
  coach: string;
  mascot: string;
  style: string;
  founded?: number;
  titles: number;
  finals: number;
  semifinals: number;
  bestResult: string;
  facts: string[];
  players: Player[];
  teamStats?: TeamStats;
  rankingHistory?: { year: number; rank: number }[];
  squads?: SquadList;
}

// ─── Players ──────────────────────────────────────────────
export interface Player {
  id: string;
  apiId?: number;
  name: string;
  flag: string;
  team: string;
  teamId: string;
  pos: string;
  ovr: number;
  photoUrl?: string;
  attrs: {
    PAC: number;
    SHO: number;
    PAS: number;
    DRI: number;
    DEF: number;
    PHY: number;
  };
  form: ('W' | 'D' | 'L')[];
  formDetailed?: { score: string; opponentFlag: string; outcome: 'W' | 'D' | 'L' }[];
  wcStats: {
    goals: number;
    assists: number;
    rating: number;
    matches: number;
    xG?: number;
    passAccuracy?: number;
  };
  heatmap: {
    ATK: number;
    MID: number;
    DEF: number;
    WID: number;
  };
  bio: string;
}

// ─── Matches ──────────────────────────────────────────────
export type MatchStatus = 'NS' | '1H' | 'HT' | '2H' | 'FT' | 'AET' | 'PEN';

export interface MatchEvent {
  minute: number;
  type: 'Goal' | 'Card' | 'Subst';
  team: string;
  player: string;
  detail?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  minute?: number;
  stadium: string;
  city: string;
  date: string;
  time: string;
  round: string;
  group?: string;
  events: MatchEvent[];
}

// ─── Group Standings ──────────────────────────────────────
export interface StandingRow {
  rank: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  qualProb: number;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
  standings: StandingRow[];
  matches: Match[];
}

// ─── Bracket ──────────────────────────────────────────────
export type Round = 'r32' | 'r16' | 'qf' | 'sf' | 'final';

export interface BracketMatch {
  id: string;
  round: Round;
  matchIndex: number;
  teamA: Team | null;
  teamB: Team | null;
  winner: Team | null;
  stadium: string;
  time: string;
}

export interface BracketState {
  r32: BracketMatch[];
  r16: BracketMatch[];
  qf: BracketMatch[];
  sf: BracketMatch[];
  final: BracketMatch[];
}

// ─── Stadiums ─────────────────────────────────────────────
export interface Stadium {
  name: string;
  city: string;
  country: string;
  capacity: number;
  surface: string;
  opened: number;
  cost: string;
  host: string;
  facts: string[];
  coordinates: { lat: number; lng: number };
  weather?: {
    temp: number;
    description: string;
    humidity: number;
    wind: number;
  };
}

// ─── Timeline / Story ─────────────────────────────────────
export interface TimelineMatch {
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
  note: string;
}

export interface TimelinePlayerOfDay {
  name: string;
  flag: string;
  team: string;
  stat: string;
}

export interface TimelineDay {
  id: number;
  label: string;
  date: string;
  tag: string;
  upset: boolean;
  future: boolean;
  headline: string;
  narrative: string;
  matches: TimelineMatch[];
  playerOfDay?: TimelinePlayerOfDay;
  stats: {
    goals: number;
    upsets: number;
    cards: number;
    penalties: number;
  };
  mood: { team: string; flag: string; positive: number; negative: number }[];
  voteOptions: { emoji: string; label: string; count: number }[];
}

// ─── Prediction / Streak ──────────────────────────────────
export interface Prediction {
  matchId: string;
  predictedWinner: string;
  confidence: number;
  createdAt: string;
  result?: 'correct' | 'wrong' | 'pending';
}

export interface UserStats {
  streak: number;
  totalPredictions: number;
  correctPredictions: number;
  longestStreak: number;
  fanIQLevel: string;
  topTeamViewed: string;
  topPlayerViewed: string;
  topStadiumViewed: string;
}

// ─── Simulator ────────────────────────────────────────────
export interface SimResult {
  teamA: { name: string; flag: string; winPct: number; xG: number };
  teamB: { name: string; flag: string; winPct: number; xG: number };
  drawPct: number;
  topScores: { score: string; pct: number }[];
  narrative: string;
}

// ─── API Responses ────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  error?: string;
  lastUpdated: string;
}
