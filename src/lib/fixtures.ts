import type { Stadium } from '@/types';
import { STADIUMS } from './data';

export type FixtureStage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';

export interface Fixture {
  id: string;
  matchday?: number;
  date: string;
  time: string;
  group?: string;
  homeTeamId: string;
  awayTeamId: string;
  stadiumId: string;
  stage: FixtureStage;
  label?: string;
}

export function getStadiumById(id: string): Stadium | undefined {
  return STADIUMS.find(s => s.id === id);
}

// ─── GROUP STAGE (72 matches) ────────────────────────────────────────────────

const GROUP_FIXTURES: Fixture[] = [
  // ── Group A ──────────────────────────────────────────────────
  { id: 'M01', matchday: 1, date: '2026-06-11', time: '19:00', group: 'A', homeTeamId: 'MEX', awayTeamId: 'RSA', stadiumId: 'azteca', stage: 'group' },
  { id: 'M02', matchday: 1, date: '2026-06-12', time: '02:00', group: 'A', homeTeamId: 'KOR', awayTeamId: 'CZE', stadiumId: 'akron', stage: 'group' },
  { id: 'M25', matchday: 2, date: '2026-06-18', time: '16:00', group: 'A', homeTeamId: 'CZE', awayTeamId: 'RSA', stadiumId: 'mercedes', stage: 'group' },
  { id: 'M28', matchday: 2, date: '2026-06-19', time: '01:00', group: 'A', homeTeamId: 'MEX', awayTeamId: 'KOR', stadiumId: 'akron', stage: 'group' },
  { id: 'M53', matchday: 3, date: '2026-06-25', time: '01:00', group: 'A', homeTeamId: 'CZE', awayTeamId: 'MEX', stadiumId: 'azteca', stage: 'group' },
  { id: 'M54', matchday: 3, date: '2026-06-25', time: '01:00', group: 'A', homeTeamId: 'RSA', awayTeamId: 'KOR', stadiumId: 'bbva', stage: 'group' },

  // ── Group B ──────────────────────────────────────────────────
  { id: 'M03', matchday: 1, date: '2026-06-12', time: '19:00', group: 'B', homeTeamId: 'CAN', awayTeamId: 'BIH', stadiumId: 'bmo', stage: 'group' },
  { id: 'M08', matchday: 1, date: '2026-06-13', time: '19:00', group: 'B', homeTeamId: 'QAT', awayTeamId: 'SUI', stadiumId: 'levis', stage: 'group' },
  { id: 'M26', matchday: 2, date: '2026-06-18', time: '19:00', group: 'B', homeTeamId: 'SUI', awayTeamId: 'BIH', stadiumId: 'sofi', stage: 'group' },
  { id: 'M27', matchday: 2, date: '2026-06-18', time: '22:00', group: 'B', homeTeamId: 'CAN', awayTeamId: 'QAT', stadiumId: 'bc-place', stage: 'group' },
  { id: 'M51', matchday: 3, date: '2026-06-24', time: '19:00', group: 'B', homeTeamId: 'SUI', awayTeamId: 'CAN', stadiumId: 'bc-place', stage: 'group' },
  { id: 'M52', matchday: 3, date: '2026-06-24', time: '19:00', group: 'B', homeTeamId: 'BIH', awayTeamId: 'QAT', stadiumId: 'lumen', stage: 'group' },

  // ── Group C ──────────────────────────────────────────────────
  { id: 'M07', matchday: 1, date: '2026-06-13', time: '22:00', group: 'C', homeTeamId: 'BRA', awayTeamId: 'MAR', stadiumId: 'metlife', stage: 'group' },
  { id: 'M05', matchday: 1, date: '2026-06-14', time: '01:00', group: 'C', homeTeamId: 'HAI', awayTeamId: 'SCO', stadiumId: 'gillette', stage: 'group' },
  { id: 'M30', matchday: 2, date: '2026-06-19', time: '22:00', group: 'C', homeTeamId: 'SCO', awayTeamId: 'MAR', stadiumId: 'gillette', stage: 'group' },
  { id: 'M29', matchday: 2, date: '2026-06-20', time: '01:00', group: 'C', homeTeamId: 'BRA', awayTeamId: 'HAI', stadiumId: 'lincoln', stage: 'group' },
  { id: 'M49', matchday: 3, date: '2026-06-24', time: '22:00', group: 'C', homeTeamId: 'SCO', awayTeamId: 'BRA', stadiumId: 'hard-rock', stage: 'group' },
  { id: 'M50', matchday: 3, date: '2026-06-24', time: '22:00', group: 'C', homeTeamId: 'MAR', awayTeamId: 'HAI', stadiumId: 'mercedes', stage: 'group' },

  // ── Group D ──────────────────────────────────────────────────
  { id: 'M04', matchday: 1, date: '2026-06-13', time: '01:00', group: 'D', homeTeamId: 'USA', awayTeamId: 'PAR', stadiumId: 'sofi', stage: 'group' },
  { id: 'M06', matchday: 1, date: '2026-06-13', time: '04:00', group: 'D', homeTeamId: 'AUS', awayTeamId: 'TUR', stadiumId: 'bc-place', stage: 'group' },
  { id: 'M32', matchday: 2, date: '2026-06-19', time: '19:00', group: 'D', homeTeamId: 'USA', awayTeamId: 'AUS', stadiumId: 'lumen', stage: 'group' },
  { id: 'M31', matchday: 2, date: '2026-06-20', time: '03:00', group: 'D', homeTeamId: 'TUR', awayTeamId: 'PAR', stadiumId: 'levis', stage: 'group' },
  { id: 'M59', matchday: 3, date: '2026-06-26', time: '02:00', group: 'D', homeTeamId: 'TUR', awayTeamId: 'USA', stadiumId: 'sofi', stage: 'group' },
  { id: 'M60', matchday: 3, date: '2026-06-26', time: '02:00', group: 'D', homeTeamId: 'PAR', awayTeamId: 'AUS', stadiumId: 'levis', stage: 'group' },

  // ── Group E ──────────────────────────────────────────────────
  { id: 'M10', matchday: 1, date: '2026-06-14', time: '17:00', group: 'E', homeTeamId: 'GER', awayTeamId: 'CUW', stadiumId: 'nrg', stage: 'group' },
  { id: 'M09', matchday: 1, date: '2026-06-14', time: '23:00', group: 'E', homeTeamId: 'CIV', awayTeamId: 'ECU', stadiumId: 'lincoln', stage: 'group' },
  { id: 'M33', matchday: 2, date: '2026-06-20', time: '20:00', group: 'E', homeTeamId: 'GER', awayTeamId: 'CIV', stadiumId: 'bmo', stage: 'group' },
  { id: 'M34', matchday: 2, date: '2026-06-21', time: '00:00', group: 'E', homeTeamId: 'ECU', awayTeamId: 'CUW', stadiumId: 'arrowhead', stage: 'group' },
  { id: 'M55', matchday: 3, date: '2026-06-25', time: '20:00', group: 'E', homeTeamId: 'CUW', awayTeamId: 'CIV', stadiumId: 'lincoln', stage: 'group' },
  { id: 'M56', matchday: 3, date: '2026-06-25', time: '20:00', group: 'E', homeTeamId: 'ECU', awayTeamId: 'GER', stadiumId: 'metlife', stage: 'group' },

  // ── Group F ──────────────────────────────────────────────────
  { id: 'M11', matchday: 1, date: '2026-06-14', time: '20:00', group: 'F', homeTeamId: 'NED', awayTeamId: 'JPN', stadiumId: 'att', stage: 'group' },
  { id: 'M12', matchday: 1, date: '2026-06-15', time: '02:00', group: 'F', homeTeamId: 'SWE', awayTeamId: 'TUN', stadiumId: 'bbva', stage: 'group' },
  { id: 'M35', matchday: 2, date: '2026-06-20', time: '17:00', group: 'F', homeTeamId: 'NED', awayTeamId: 'SWE', stadiumId: 'nrg', stage: 'group' },
  { id: 'M36', matchday: 2, date: '2026-06-20', time: '20:00', group: 'F', homeTeamId: 'TUN', awayTeamId: 'JPN', stadiumId: 'bbva', stage: 'group' },
  { id: 'M57', matchday: 3, date: '2026-06-25', time: '23:00', group: 'F', homeTeamId: 'JPN', awayTeamId: 'SWE', stadiumId: 'att', stage: 'group' },
  { id: 'M58', matchday: 3, date: '2026-06-25', time: '23:00', group: 'F', homeTeamId: 'TUN', awayTeamId: 'NED', stadiumId: 'arrowhead', stage: 'group' },

  // ── Group G ──────────────────────────────────────────────────
  { id: 'M16', matchday: 1, date: '2026-06-15', time: '19:00', group: 'G', homeTeamId: 'BEL', awayTeamId: 'EGY', stadiumId: 'lumen', stage: 'group' },
  { id: 'M15', matchday: 1, date: '2026-06-16', time: '01:00', group: 'G', homeTeamId: 'IRN', awayTeamId: 'NZL', stadiumId: 'sofi', stage: 'group' },
  { id: 'M39', matchday: 2, date: '2026-06-21', time: '19:00', group: 'G', homeTeamId: 'BEL', awayTeamId: 'IRN', stadiumId: 'sofi', stage: 'group' },
  { id: 'M40', matchday: 2, date: '2026-06-22', time: '01:00', group: 'G', homeTeamId: 'NZL', awayTeamId: 'EGY', stadiumId: 'bc-place', stage: 'group' },
  { id: 'M63', matchday: 3, date: '2026-06-27', time: '03:00', group: 'G', homeTeamId: 'EGY', awayTeamId: 'IRN', stadiumId: 'lumen', stage: 'group' },
  { id: 'M64', matchday: 3, date: '2026-06-27', time: '03:00', group: 'G', homeTeamId: 'NZL', awayTeamId: 'BEL', stadiumId: 'bc-place', stage: 'group' },

  // ── Group H ──────────────────────────────────────────────────
  { id: 'M14', matchday: 1, date: '2026-06-15', time: '16:00', group: 'H', homeTeamId: 'ESP', awayTeamId: 'CPV', stadiumId: 'mercedes', stage: 'group' },
  { id: 'M13', matchday: 1, date: '2026-06-15', time: '22:00', group: 'H', homeTeamId: 'KSA', awayTeamId: 'URU', stadiumId: 'hard-rock', stage: 'group' },
  { id: 'M38', matchday: 2, date: '2026-06-21', time: '16:00', group: 'H', homeTeamId: 'ESP', awayTeamId: 'KSA', stadiumId: 'mercedes', stage: 'group' },
  { id: 'M37', matchday: 2, date: '2026-06-21', time: '22:00', group: 'H', homeTeamId: 'URU', awayTeamId: 'CPV', stadiumId: 'hard-rock', stage: 'group' },
  { id: 'M65', matchday: 3, date: '2026-06-27', time: '00:00', group: 'H', homeTeamId: 'CPV', awayTeamId: 'KSA', stadiumId: 'nrg', stage: 'group' },
  { id: 'M66', matchday: 3, date: '2026-06-27', time: '00:00', group: 'H', homeTeamId: 'URU', awayTeamId: 'ESP', stadiumId: 'akron', stage: 'group' },

  // ── Group I ──────────────────────────────────────────────────
  { id: 'M17', matchday: 1, date: '2026-06-16', time: '19:00', group: 'I', homeTeamId: 'FRA', awayTeamId: 'SEN', stadiumId: 'metlife', stage: 'group' },
  { id: 'M18', matchday: 1, date: '2026-06-16', time: '22:00', group: 'I', homeTeamId: 'IRQ', awayTeamId: 'NOR', stadiumId: 'gillette', stage: 'group' },
  { id: 'M42', matchday: 2, date: '2026-06-22', time: '21:00', group: 'I', homeTeamId: 'FRA', awayTeamId: 'IRQ', stadiumId: 'lincoln', stage: 'group' },
  { id: 'M41', matchday: 2, date: '2026-06-23', time: '00:00', group: 'I', homeTeamId: 'NOR', awayTeamId: 'SEN', stadiumId: 'metlife', stage: 'group' },
  { id: 'M61', matchday: 3, date: '2026-06-26', time: '19:00', group: 'I', homeTeamId: 'NOR', awayTeamId: 'FRA', stadiumId: 'gillette', stage: 'group' },
  { id: 'M62', matchday: 3, date: '2026-06-26', time: '19:00', group: 'I', homeTeamId: 'SEN', awayTeamId: 'IRQ', stadiumId: 'bmo', stage: 'group' },

  // ── Group J ──────────────────────────────────────────────────
  { id: 'M19', matchday: 1, date: '2026-06-17', time: '01:00', group: 'J', homeTeamId: 'ARG', awayTeamId: 'ALG', stadiumId: 'arrowhead', stage: 'group' },
  { id: 'M20', matchday: 1, date: '2026-06-17', time: '04:00', group: 'J', homeTeamId: 'AUT', awayTeamId: 'JOR', stadiumId: 'levis', stage: 'group' },
  { id: 'M43', matchday: 2, date: '2026-06-22', time: '17:00', group: 'J', homeTeamId: 'ARG', awayTeamId: 'AUT', stadiumId: 'att', stage: 'group' },
  { id: 'M44', matchday: 2, date: '2026-06-23', time: '03:00', group: 'J', homeTeamId: 'JOR', awayTeamId: 'ALG', stadiumId: 'levis', stage: 'group' },
  { id: 'M69', matchday: 3, date: '2026-06-28', time: '02:00', group: 'J', homeTeamId: 'ALG', awayTeamId: 'AUT', stadiumId: 'arrowhead', stage: 'group' },
  { id: 'M70', matchday: 3, date: '2026-06-28', time: '02:00', group: 'J', homeTeamId: 'JOR', awayTeamId: 'ARG', stadiumId: 'att', stage: 'group' },

  // ── Group K ──────────────────────────────────────────────────
  { id: 'M23', matchday: 1, date: '2026-06-17', time: '17:00', group: 'K', homeTeamId: 'POR', awayTeamId: 'COD', stadiumId: 'nrg', stage: 'group' },
  { id: 'M24', matchday: 1, date: '2026-06-18', time: '02:00', group: 'K', homeTeamId: 'UZB', awayTeamId: 'COL', stadiumId: 'azteca', stage: 'group' },
  { id: 'M47', matchday: 2, date: '2026-06-23', time: '17:00', group: 'K', homeTeamId: 'POR', awayTeamId: 'UZB', stadiumId: 'nrg', stage: 'group' },
  { id: 'M48', matchday: 2, date: '2026-06-24', time: '02:00', group: 'K', homeTeamId: 'COL', awayTeamId: 'COD', stadiumId: 'akron', stage: 'group' },
  { id: 'M71', matchday: 3, date: '2026-06-28', time: '00:00', group: 'K', homeTeamId: 'COL', awayTeamId: 'POR', stadiumId: 'hard-rock', stage: 'group' },
  { id: 'M72', matchday: 3, date: '2026-06-28', time: '00:00', group: 'K', homeTeamId: 'COD', awayTeamId: 'UZB', stadiumId: 'mercedes', stage: 'group' },

  // ── Group L ──────────────────────────────────────────────────
  { id: 'M22', matchday: 1, date: '2026-06-17', time: '20:00', group: 'L', homeTeamId: 'ENG', awayTeamId: 'CRO', stadiumId: 'att', stage: 'group' },
  { id: 'M21', matchday: 1, date: '2026-06-17', time: '23:00', group: 'L', homeTeamId: 'GHA', awayTeamId: 'PAN', stadiumId: 'bmo', stage: 'group' },
  { id: 'M45', matchday: 2, date: '2026-06-23', time: '20:00', group: 'L', homeTeamId: 'ENG', awayTeamId: 'GHA', stadiumId: 'gillette', stage: 'group' },
  { id: 'M46', matchday: 2, date: '2026-06-23', time: '23:00', group: 'L', homeTeamId: 'PAN', awayTeamId: 'CRO', stadiumId: 'bmo', stage: 'group' },
  { id: 'M67', matchday: 3, date: '2026-06-27', time: '21:00', group: 'L', homeTeamId: 'PAN', awayTeamId: 'ENG', stadiumId: 'metlife', stage: 'group' },
  { id: 'M68', matchday: 3, date: '2026-06-27', time: '21:00', group: 'L', homeTeamId: 'CRO', awayTeamId: 'GHA', stadiumId: 'lincoln', stage: 'group' },
];

// ─── KNOCKOUT STAGE (32 matches) ─────────────────────────────────────────────

const KNOCKOUT_FIXTURES: Fixture[] = [
  // ── Round of 32 (16 matches) ─────────────────────────────────
  { id: 'M73', date: '2026-06-28', time: '19:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'sofi', stage: 'r32', label: '2A vs 2B' },
  { id: 'M74', date: '2026-06-29', time: '21:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'gillette', stage: 'r32', label: '1E vs Best 3rd' },
  { id: 'M75', date: '2026-06-30', time: '01:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'bbva', stage: 'r32', label: '1F vs 2C' },
  { id: 'M76', date: '2026-06-29', time: '21:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'nrg', stage: 'r32', label: '1C vs 2F' },
  { id: 'M77', date: '2026-07-01', time: '01:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'metlife', stage: 'r32', label: '1I vs Best 3rd' },
  { id: 'M78', date: '2026-06-30', time: '21:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'att', stage: 'r32', label: '2E vs 2I' },
  { id: 'M79', date: '2026-07-01', time: '01:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'azteca', stage: 'r32', label: '1A vs Best 3rd' },
  { id: 'M80', date: '2026-07-01', time: '20:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'mercedes', stage: 'r32', label: '1L vs Best 3rd' },
  { id: 'M81', date: '2026-07-02', time: '00:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'levis', stage: 'r32', label: '1D vs Best 3rd' },
  { id: 'M82', date: '2026-07-02', time: '00:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'lumen', stage: 'r32', label: '1G vs Best 3rd' },
  { id: 'M83', date: '2026-07-03', time: '03:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'bmo', stage: 'r32', label: '2K vs 2L' },
  { id: 'M84', date: '2026-07-02', time: '23:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'sofi', stage: 'r32', label: '1H vs 2J' },
  { id: 'M85', date: '2026-07-03', time: '03:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'bc-place', stage: 'r32', label: '1B vs Best 3rd' },
  { id: 'M86', date: '2026-07-03', time: '22:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'hard-rock', stage: 'r32', label: '1J vs 2H' },
  { id: 'M87', date: '2026-07-04', time: '01:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'arrowhead', stage: 'r32', label: '1K vs Best 3rd' },
  { id: 'M88', date: '2026-07-03', time: '18:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'att', stage: 'r32', label: '2D vs 2G' },

  // ── Round of 16 (8 matches) ──────────────────────────────────
  { id: 'M89', date: '2026-07-05', time: '01:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'lincoln', stage: 'r16', label: 'Winner M74 vs Winner M77' },
  { id: 'M90', date: '2026-07-04', time: '21:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'nrg', stage: 'r16', label: 'Winner M73 vs Winner M75' },
  { id: 'M91', date: '2026-07-06', time: '00:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'metlife', stage: 'r16', label: 'Winner M76 vs Winner M78' },
  { id: 'M92', date: '2026-07-06', time: '04:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'azteca', stage: 'r16', label: 'Winner M79 vs Winner M80' },
  { id: 'M93', date: '2026-07-07', time: '00:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'att', stage: 'r16', label: 'Winner M83 vs Winner M84' },
  { id: 'M94', date: '2026-07-07', time: '04:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'lumen', stage: 'r16', label: 'Winner M81 vs Winner M82' },
  { id: 'M95', date: '2026-07-07', time: '20:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'mercedes', stage: 'r16', label: 'Winner M86 vs Winner M88' },
  { id: 'M96', date: '2026-07-08', time: '00:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'bc-place', stage: 'r16', label: 'Winner M85 vs Winner M87' },

  // ── Quarter-finals (4 matches) ───────────────────────────────
  { id: 'M97', date: '2026-07-09', time: '20:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'gillette', stage: 'qf', label: 'Winner M89 vs Winner M90' },
  { id: 'M98', date: '2026-07-10', time: '23:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'sofi', stage: 'qf', label: 'Winner M93 vs Winner M94' },
  { id: 'M99', date: '2026-07-11', time: '21:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'hard-rock', stage: 'qf', label: 'Winner M91 vs Winner M92' },
  { id: 'M100', date: '2026-07-12', time: '01:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'arrowhead', stage: 'qf', label: 'Winner M95 vs Winner M96' },

  // ── Semi-finals (2 matches) ──────────────────────────────────
  { id: 'M101', date: '2026-07-14', time: '20:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'att', stage: 'sf', label: 'Winner M97 vs Winner M98' },
  { id: 'M102', date: '2026-07-15', time: '19:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'mercedes', stage: 'sf', label: 'Winner M99 vs Winner M100' },

  // ── Third-place play-off ─────────────────────────────────────
  { id: 'M103', date: '2026-07-19', time: '01:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'hard-rock', stage: 'third', label: 'Loser M101 vs Loser M102' },

  // ── Final ────────────────────────────────────────────────────
  { id: 'M104', date: '2026-07-19', time: '19:00', homeTeamId: 'TBD', awayTeamId: 'TBD', stadiumId: 'metlife', stage: 'final', label: 'Winner M101 vs Winner M102' },
];

export const FIXTURES: Fixture[] = [...GROUP_FIXTURES, ...KNOCKOUT_FIXTURES];

export function getFixturesByDate(date: string): Fixture[] {
  return FIXTURES.filter(f => f.date === date);
}

export function getFixturesByGroup(group: string): Fixture[] {
  return FIXTURES.filter(f => f.group === group);
}

export function getFixturesByTeam(teamId: string): Fixture[] {
  return FIXTURES.filter(f => f.homeTeamId === teamId || f.awayTeamId === teamId);
}

export function getFixturesByStage(stage: FixtureStage): Fixture[] {
  return FIXTURES.filter(f => f.stage === stage);
}

export function getNextFixture(now?: Date): Fixture | undefined {
  const ref = now ?? new Date();
  return FIXTURES
    .filter(f => {
      const kickoff = new Date(`${f.date}T${f.time}:00Z`);
      return kickoff > ref;
    })
    .sort((a, b) => {
      const da = new Date(`${a.date}T${a.time}:00Z`);
      const db = new Date(`${b.date}T${b.time}:00Z`);
      return da.getTime() - db.getTime();
    })[0];
}

export function getNextFixtureForTeam(teamId: string, now?: Date): Fixture | undefined {
  const ref = now ?? new Date();
  return FIXTURES
    .filter(f => {
      if (f.homeTeamId !== teamId && f.awayTeamId !== teamId) return false;
      const kickoff = new Date(`${f.date}T${f.time}:00Z`);
      return kickoff > ref;
    })
    .sort((a, b) => {
      const da = new Date(`${a.date}T${a.time}:00Z`);
      const db = new Date(`${b.date}T${b.time}:00Z`);
      return da.getTime() - db.getTime();
    })[0];
}

export function getTournamentDates(): string[] {
  const start = new Date('2026-06-11');
  const end = new Date('2026-07-19');
  const dates: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
