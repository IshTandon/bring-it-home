import { PLAYER_STATS_OVERRIDE } from './player-stats-override';

export type PlayerAttrs = {
  PAC: number;
  SHO: number;
  PAS: number;
  DRI: number;
  DEF: number;
  PHY: number;
};

export const POS_ATTRS: Record<string, PlayerAttrs> = {
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

export function getPos(section: string, idx: number): string {
  if (section === 'gk') return 'GK';
  if (section === 'def') return ['CB', 'CB', 'CB', 'CB', 'LB', 'RB', 'CB', 'RB'][idx % 8];
  if (section === 'mid') return ['CDM', 'CM', 'CM', 'CAM', 'CM', 'CDM', 'CM', 'CAM'][idx % 8];
  return ['ST', 'LW', 'RW', 'ST', 'CF', 'LW', 'RW'][idx % 7];
}

function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, Math.round(v)));
}

function clampAttr(v: number): number {
  return clamp(1, 99, v);
}

function nameHash(name: string): number {
  return name.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
}

export function jitterFromName(name: string): number {
  return (Math.abs(nameHash(name)) % 17) - 8;
}

export function playerOverrideKey(teamId: string, playerId: string): string {
  return `${teamId}:${playerId}`;
}

export function isPlayerOverride(teamId: string, playerId: string): boolean {
  return playerOverrideKey(teamId, playerId) in PLAYER_STATS_OVERRIDE;
}

export function buildPlayerAttrs(
  sp: { id: string; name: string },
  teamId: string,
  teamRating: number,
  pos: string,
): { attrs: PlayerAttrs; ovr: number } {
  const override = PLAYER_STATS_OVERRIDE[playerOverrideKey(teamId, sp.id)];
  if (override) {
    const [pac, sho, pas, dri, def, phy] = override;
    const attrs = { PAC: pac, SHO: sho, PAS: pas, DRI: dri, DEF: def, PHY: phy };
    const ovr = Math.round((pac + sho + pas + dri + def + phy) / 6);
    return { attrs, ovr };
  }

  const base = POS_ATTRS[pos] || POS_ATTRS.MID;
  const scale = (teamRating - 58) / 37;
  const hash = nameHash(sp.name);
  const jitter = (Math.abs(hash) % 17) - 8;
  const ovr = clamp(58, 95, 58 + scale * 34 + jitter);
  const attrScale = (ovr - 58) / 37;
  const absHash = Math.abs(hash);

  const attrs: PlayerAttrs = {
    PAC: clampAttr(base.PAC + attrScale * 12 + ((absHash >> 0) % 7) - 3),
    SHO: clampAttr(base.SHO + attrScale * 12 + ((absHash >> 3) % 7) - 3),
    PAS: clampAttr(base.PAS + attrScale * 10 + ((absHash >> 6) % 7) - 3),
    DRI: clampAttr(base.DRI + attrScale * 12 + ((absHash >> 9) % 7) - 3),
    DEF: clampAttr(base.DEF + attrScale * 8 + ((absHash >> 12) % 7) - 3),
    PHY: clampAttr(base.PHY + attrScale * 8 + ((absHash >> 15) % 7) - 3),
  };

  return { attrs, ovr };
}
