import type { Player, SquadList } from '@/types';
import { TEAMS } from './teams';
import { SQUADS_TOP12 } from './data-squads-top12';
import { getPos, buildPlayerAttrs, jitterFromName, isPlayerOverride } from './build-player-attrs';

const forms: ('W' | 'D' | 'L')[][] = [
  ['W','W','D','W','W'], ['W','D','W','W','D'], ['D','W','W','D','W'],
  ['W','W','W','D','D'], ['W','D','D','W','W'], ['D','W','D','W','W'],
  ['W','W','W','W','D'], ['D','D','W','W','W'], ['W','D','W','D','W'],
  ['L','W','D','W','W'], ['W','W','L','W','D'], ['D','W','W','W','L'],
];

function buildPlayersFromSquads(squads: Record<string, SquadList>): Player[] {
  const result: Player[] = [];
  const top12Teams = TEAMS.filter(t => squads[t.id]);

  for (const team of top12Teams) {
    const squad = squads[team.id];
    if (!squad) continue;
    const teamRating = team.rating;
    const sections: (keyof SquadList)[] = ['gk', 'def', 'mid', 'fwd'];
    let playerIdx = result.length;

    for (const section of sections) {
      const players = squad[section];
      for (let i = 0; i < players.length; i++) {
        const sp = players[i];
        const pos = getPos(section, i);
        const scale = (teamRating - 58) / 37;
        const { attrs, ovr } = buildPlayerAttrs(sp, team.id, teamRating, pos);

        const form = forms[playerIdx % forms.length];
        const goals = pos === 'GK' ? 0 : pos.includes('B') || pos === 'CDM' ? ((playerIdx % 3 === 0) ? 1 : 0) : Math.floor(Math.random() * 4);
        const assists = pos === 'GK' ? 0 : Math.floor(Math.random() * 3);
        const ratingJitter = isPlayerOverride(team.id, sp.id) ? (ovr - 65) * 0.05 : jitterFromName(sp.name) * 0.1;
        const rating = Number((6.0 + scale * 2.5 + ratingJitter).toFixed(1));

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
  return result;
}

const _featuredPlayers = buildPlayersFromSquads(SQUADS_TOP12);

export const FEATURED_PLAYERS: Player[] = [..._featuredPlayers]
  .sort((a, b) => b.ovr - a.ovr)
  .slice(0, 100);

export const FEATURED_PLAYER_COUNT = _featuredPlayers.length;
