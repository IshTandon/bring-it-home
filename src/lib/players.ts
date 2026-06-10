import type { Player, SquadList } from '@/types';
import { TEAMS } from './teams';
import { SQUADS_TOP12 } from './data-squads-top12';
import { PLAYER_STATS_OVERRIDE } from './player-stats-override';

function clamp(v: number): number {
  return Math.min(99, Math.max(1, Math.round(v)));
}

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
        const baseAttrs = POS_ATTRS[pos] || POS_ATTRS.MID;
        const scale = (teamRating - 58) / 37;

        const override = PLAYER_STATS_OVERRIDE[sp.id];

        let attrs: { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number };
        let ovr: number;

        if (override) {
          const [pac, sho, pas, dri, def, phy] = override;
          attrs = { PAC: pac, SHO: sho, PAS: pas, DRI: dri, DEF: def, PHY: phy };
          ovr = Math.round((pac + sho + pas + dri + def + phy) / 6);
        } else {
          const nameHash = sp.name.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
          const jitter = (Math.abs(nameHash) % 17) - 8;
          ovr = Math.min(95, Math.max(58, Math.round(58 + scale * 34 + jitter)));

          const attrScale = (ovr - 58) / 37;
          const absHash = Math.abs(nameHash);
          attrs = {
            PAC: clamp(baseAttrs.PAC + attrScale * 12 + ((absHash >> 0) % 7) - 3),
            SHO: clamp(baseAttrs.SHO + attrScale * 12 + ((absHash >> 3) % 7) - 3),
            PAS: clamp(baseAttrs.PAS + attrScale * 10 + ((absHash >> 6) % 7) - 3),
            DRI: clamp(baseAttrs.DRI + attrScale * 12 + ((absHash >> 9) % 7) - 3),
            DEF: clamp(baseAttrs.DEF + attrScale * 8 + ((absHash >> 12) % 7) - 3),
            PHY: clamp(baseAttrs.PHY + attrScale * 8 + ((absHash >> 15) % 7) - 3),
          };
        }

        const form = forms[playerIdx % forms.length];
        const goals = pos === 'GK' ? 0 : pos.includes('B') || pos === 'CDM' ? ((playerIdx % 3 === 0) ? 1 : 0) : Math.floor(Math.random() * 4);
        const assists = pos === 'GK' ? 0 : Math.floor(Math.random() * 3);
        const ratingJitter = override ? (ovr - 65) * 0.05 : ((Math.abs(sp.name.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)) % 17) - 8) * 0.1;
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
