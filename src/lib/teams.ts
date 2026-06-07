import type { Team, SquadList, Player } from '@/types';
import { TEAMS_AF } from './data-teams-af';
import { TEAMS_GL } from './data-teams-gl';

export const TEAMS: Team[] = [...TEAMS_AF, ...TEAMS_GL].map(t => ({
  ...t,
  players: [],
}));

export function getTeam(id: string): Team | undefined {
  return TEAMS.find(t => t.id === id);
}

export function getTeamIds(): string[] {
  return TEAMS.map(t => t.id);
}
