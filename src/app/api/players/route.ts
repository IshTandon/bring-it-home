import { NextResponse } from 'next/server';
import { PLAYERS } from '@/lib/data';
import { getAllSquadPlayers } from '@/lib/api-football';
import type { Player } from '@/types';

export const revalidate = 86400;

interface ApiPlayer {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    nationality: string;
    photo: string;
    height: string | null;
    weight: string | null;
  };
  statistics: {
    team: { id: number; name: string; logo: string };
    league: { id: number; name: string };
    games: {
      appearences: number | null;
      position: string;
      rating: string | null;
    };
    goals: { total: number | null; assists: number | null };
    passes: { accuracy: number | null };
    shots: { total: number | null; on: number | null };
    tackles: { total: number | null; interceptions: number | null };
    dribbles: { attempts: number | null; success: number | null };
  }[];
}

const FLAG_MAP: Record<string, string> = {
  Brazil: '🇧🇷', France: '🇫🇷', Argentina: '🇦🇷', Germany: '🇩🇪', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Spain: '🇪🇸', Portugal: '🇵🇹', Netherlands: '🇳🇱', Belgium: '🇧🇪', Croatia: '🇭🇷',
  Uruguay: '🇺🇾', Colombia: '🇨🇴', USA: '🇺🇸', Mexico: '🇲🇽', Japan: '🇯🇵',
  Senegal: '🇸🇳', Switzerland: '🇨🇭', Morocco: '🇲🇦', Denmark: '🇩🇰', Australia: '🇦🇺',
  'South Korea': '🇰🇷', 'Korea Republic': '🇰🇷', Canada: '🇨🇦', Nigeria: '🇳🇬',
  Ecuador: '🇪🇨', Poland: '🇵🇱', Serbia: '🇷🇸', Iran: '🇮🇷', Ghana: '🇬🇭',
  Cameroon: '🇨🇲', Tunisia: '🇹🇳', 'Saudi Arabia': '🇸🇦', 'Costa Rica': '🇨🇷',
};

function mapPosition(apiPos: string): string {
  const m: Record<string, string> = {
    Goalkeeper: 'GK', Defender: 'CB', Midfielder: 'CM', Attacker: 'ST',
  };
  return m[apiPos] ?? 'CM';
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function mapApiPlayer(raw: ApiPlayer): Player {
  const p = raw.player;
  const s = raw.statistics?.[0];
  const pos = mapPosition(s?.games?.position ?? 'Midfielder');
  const rating = parseFloat(s?.games?.rating ?? '6.5');
  const ovr = clamp(Math.round(rating * 10), 50, 99);

  const goals = s?.goals?.total ?? 0;
  const assists = s?.goals?.assists ?? 0;
  const appearances = s?.games?.appearences ?? 0;
  const passAcc = s?.passes?.accuracy ?? undefined;
  const teamName = s?.team?.name ?? 'Unknown';

  const isGK = pos === 'GK';
  const isDef = ['CB', 'LB', 'RB'].includes(pos);
  const isMid = ['CDM', 'CM', 'CAM'].includes(pos);

  return {
    id: String(p.id),
    apiId: p.id,
    name: p.name,
    flag: FLAG_MAP[p.nationality] ?? FLAG_MAP[teamName] ?? '🏳️',
    team: teamName,
    teamId: teamName.substring(0, 3).toUpperCase(),
    pos,
    ovr,
    photoUrl: `https://media.api-sports.io/football/players/${p.id}.png`,
    attrs: {
      PAC: isGK ? clamp(50 + Math.round(Math.random() * 15), 40, 65)
        : isDef ? clamp(ovr - 5 + Math.round(Math.random() * 10), 55, 88)
        : clamp(ovr + Math.round(Math.random() * 8), 65, 99),
      SHO: isGK ? clamp(8 + Math.round(Math.random() * 10), 5, 18)
        : isDef ? clamp(ovr - 20 + Math.round(Math.random() * 15), 30, 70)
        : clamp(ovr - 5 + Math.round(Math.random() * 12), 60, 98),
      PAS: clamp(ovr - 8 + Math.round(Math.random() * 16), 40, 96),
      DRI: isGK ? clamp(10 + Math.round(Math.random() * 12), 8, 22)
        : clamp(ovr - 5 + Math.round(Math.random() * 12), 45, 98),
      DEF: isGK ? clamp(ovr - 5 + Math.round(Math.random() * 8), 80, 95)
        : isDef ? clamp(ovr + Math.round(Math.random() * 8), 70, 95)
        : isMid ? clamp(ovr - 15 + Math.round(Math.random() * 20), 40, 80)
        : clamp(20 + Math.round(Math.random() * 20), 20, 50),
      PHY: clamp(ovr - 10 + Math.round(Math.random() * 20), 50, 95),
    },
    form: Array.from({ length: 5 }, () => {
      const r = Math.random();
      return r < 0.5 ? 'W' : r < 0.75 ? 'D' : 'L';
    }) as ('W' | 'D' | 'L')[],
    wcStats: {
      goals,
      assists,
      rating: Math.round(rating * 10) / 10,
      matches: appearances,
      passAccuracy: passAcc ?? undefined,
    },
    heatmap: {
      ATK: isGK ? 2 : isDef ? clamp(8 + Math.round(Math.random() * 15), 5, 25) : clamp(ovr - 10 + Math.round(Math.random() * 15), 55, 95),
      MID: isGK ? 5 : clamp(ovr - 20 + Math.round(Math.random() * 30), 20, 92),
      DEF: isGK ? 95 : isDef ? clamp(ovr + Math.round(Math.random() * 8), 75, 96) : clamp(20 + Math.round(Math.random() * 20), 5, 45),
      WID: isGK ? 4 : ['LW', 'RW', 'LB', 'RB'].includes(pos) ? clamp(ovr + Math.round(Math.random() * 10), 70, 95) : clamp(20 + Math.round(Math.random() * 30), 15, 55),
    },
    bio: `${p.name} represents ${teamName} at the 2026 World Cup.`,
  };
}

export async function GET() {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.FOOTBALL_API_KEY;

  if (!useMock) {
    try {
      const raw = await getAllSquadPlayers() as ApiPlayer[];
      const players = raw.map(mapApiPlayer);
      return NextResponse.json({
        players,
        source: 'api-football',
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error('API-Football players fetch failed, falling back to mock:', err);
    }
  }

  return NextResponse.json({
    players: PLAYERS,
    source: 'mock',
    lastUpdated: new Date().toISOString(),
  });
}
