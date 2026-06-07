'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { TEAMS, PLAYERS, MOCK_GROUPS } from '@/lib/data';
import FormStrip from '@/components/ui/FormStrip';
import type { Team, Player, Group, SquadPlayer, SquadList } from '@/types';

const RankingChart = dynamic(() => import('./RankingChart'), { ssr: false });
const StatsChart = dynamic(() => import('./StatsChart'), { ssr: false });

const TAB_KEYS = ['Overview', 'Squad', 'Stats', 'History'] as const;
type Tab = (typeof TAB_KEYS)[number];

const POS_ORDER: Record<string, number> = { GK: 0, CB: 1, RB: 1, LB: 1, CDM: 2, CM: 2, CAM: 2, LW: 3, RW: 3, ST: 3, CF: 3 };
const POS_SECTION: Record<string, string> = { GK: 'Goalkeepers', CB: 'Defenders', RB: 'Defenders', LB: 'Defenders', CDM: 'Midfielders', CM: 'Midfielders', CAM: 'Midfielders', LW: 'Forwards', RW: 'Forwards', ST: 'Forwards', CF: 'Forwards' };

function PlayerRow({ player }: { player: Player }) {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = player.photoUrl && !imgError;

  return (
    <Link href={`/players?highlight=${player.id}`}
      className="flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors">
      <span className="text-xs text-gray-400 tabular-nums w-5 text-center font-medium shrink-0">
        {Math.floor(Math.random() * 25) + 1}
      </span>
      {hasPhoto ? (
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <Image src={player.photoUrl!} alt={player.name} width={36} height={36}
            className="object-cover w-full h-full" onError={() => setImgError(true)} unoptimized />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <span className="text-lg">{player.flag}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{player.name}</p>
        <p className="text-[11px] text-gray-400">{player.pos}</p>
      </div>
      <span className="text-xs text-gray-400 tabular-nums shrink-0">{player.ovr}</span>
    </Link>
  );
}

function OverviewTab({ team, group }: { team: Team; group: Group | undefined }) {
  const teamPlayers = PLAYERS.filter(p => p.teamId === team.id);
  const formPlayer = teamPlayers.find(p => p.formDetailed && p.formDetailed.length >= 5);

  const nextOpponent = useMemo(() => {
    if (!group) return null;
    const match = group.matches.find(m =>
      (m.homeTeam.id === team.id || m.awayTeam.id === team.id) && m.status === 'NS'
    );
    if (!match) return null;
    const opp = match.homeTeam.id === team.id ? match.awayTeam : match.homeTeam;
    return { match, opponent: opp };
  }, [group, team.id]);

  return (
    <div className="space-y-3">
      {/* Hero row */}
      <div className="flex items-center gap-4 py-2">
        <span className="text-5xl">{team.flag}</span>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-[#185FA5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              #{team.rank} FIFA
            </span>
            <span className="text-xs text-gray-400">{team.coach}</span>
          </div>
        </div>
      </div>

      {/* Next match */}
      {nextOpponent && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Next Match</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextOpponent.opponent.flag}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  vs <Link href={`/teams/${nextOpponent.opponent.id}`} className="hover:text-[#185FA5] transition-colors">{nextOpponent.opponent.name}</Link>
                </p>
                <p className="text-[11px] text-gray-400">{nextOpponent.match.date} · {nextOpponent.match.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400">{nextOpponent.match.stadium}</p>
              <p className="text-[10px] text-gray-300">{nextOpponent.match.round}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form strip */}
      {formPlayer?.formDetailed && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Recent Form</h3>
          <FormStrip results={formPlayer.formDetailed} />
        </div>
      )}

      {/* Mini group table */}
      {group && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Group {group.id}</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-3 py-2 font-medium text-gray-400">Team</th>
                <th className="text-center px-1 py-2 font-medium text-gray-400 w-7">P</th>
                <th className="text-center px-1 py-2 font-medium text-gray-400 w-7">W</th>
                <th className="text-center px-1 py-2 font-medium text-gray-400 w-7">D</th>
                <th className="text-center px-1 py-2 font-medium text-gray-400 w-7">L</th>
                <th className="text-center px-1 py-2 font-medium text-gray-400 w-8">GD</th>
                <th className="text-center px-2 py-2 font-medium text-gray-900 w-8">PTS</th>
              </tr>
            </thead>
            <tbody>
              {group.teams.map((t, idx) => (
                <tr key={t.id} className={`border-b border-gray-50 ${t.id === team.id ? 'bg-blue-50/50' : ''} ${idx < 2 ? 'border-l-4 border-l-[#185FA5]' : 'border-l-4 border-l-transparent'}`}>
                  <td className="px-3 py-2.5">
                    <Link href={`/teams/${t.id}`} className="flex items-center gap-2 hover:text-[#185FA5] transition-colors">
                      <span className="text-sm">{t.flag}</span>
                      <span className={`font-medium truncate ${t.id === team.id ? 'text-[#185FA5] font-semibold' : 'text-gray-800'}`}>{t.name}</span>
                    </Link>
                  </td>
                  <td className="text-center px-1 py-2.5 text-gray-400 tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-gray-400 tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-gray-400 tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-gray-400 tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-gray-500 tabular-nums font-medium">0</td>
                  <td className="text-center px-2 py-2.5 text-gray-900 tabular-nums font-bold">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Style */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Playing Style</h3>
        <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{team.style}&rdquo;</p>
      </div>
    </div>
  );
}

function SquadPlayerRow({ sp }: { sp: SquadPlayer }) {
  const [imgError, setImgError] = useState(false);
  const photoSrc = sp.apiId ? `https://media.api-sports.io/football/players/${sp.apiId}.png` : null;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-xs text-gray-400 tabular-nums w-5 text-center font-medium shrink-0">
        {sp.number}
      </span>
      {photoSrc && !imgError ? (
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <Image src={photoSrc} alt={sp.name} width={36} height={36}
            className="object-cover w-full h-full" onError={() => setImgError(true)} unoptimized />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-gray-400">
            {sp.club.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{sp.name}</p>
        <p className="text-[11px] text-gray-400 truncate">{sp.club}</p>
      </div>
      <span className="text-xs text-gray-400 tabular-nums shrink-0">{sp.age}</span>
    </div>
  );
}

function SquadSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3].map(j => (
              <div key={j} className="flex items-center gap-3 px-4 py-3">
                <div className="w-5 h-3 bg-gray-200 animate-pulse rounded" />
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 bg-gray-200 animate-pulse rounded" />
                  <div className="h-2.5 w-20 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="w-6 h-3 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SquadTabLoaded({ team, squads }: { team: Team; squads: SquadList }) {
  const sections: { label: string; players: SquadPlayer[] }[] = [
    { label: 'Goalkeepers', players: squads.gk },
    { label: 'Defenders', players: squads.def },
    { label: 'Midfielders', players: squads.mid },
    { label: 'Forwards', players: squads.fwd },
  ];
  const total = sections.reduce((s, sec) => s + sec.players.length, 0);

  return (
    <div className="space-y-3">
      {team.group && (
        <div className="flex items-center gap-2">
          <span className="bg-[#185FA5] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            Group {team.group}
          </span>
          <span className="text-xs text-gray-400">{total} players selected</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
          HC
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{team.coach}</p>
          <p className="text-[11px] text-gray-400">Head Coach · {team.flag} {team.name}</p>
        </div>
      </div>

      {sections.map(({ label, players }) => (
        <div key={label} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</h3>
            <span className="text-[10px] text-gray-300 tabular-nums">{players.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {players.map(sp => <SquadPlayerRow key={sp.id} sp={sp} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function SquadTab({ team }: { team: Team }) {
  const [squads, setSquads] = useState<SquadList | null>(team.squads ?? null);
  const [loading, setLoading] = useState(!team.squads);
  const squadCache = useRef<Record<string, SquadList>>({});

  useEffect(() => {
    if (team.squads) {
      setSquads(team.squads);
      setLoading(false);
      return;
    }

    if (squadCache.current[team.id]) {
      setSquads(squadCache.current[team.id]);
      setLoading(false);
      return;
    }

    setLoading(true);
    import(`@/lib/squads/${team.id}`)
      .then((mod) => {
        const key = `SQUAD_${team.id}`;
        const data = (mod as Record<string, SquadList>)[key];
        if (data) {
          squadCache.current[team.id] = data;
          setSquads(data);
        }
      })
      .catch(() => setSquads(null))
      .finally(() => setLoading(false));
  }, [team.id, team.squads]);

  if (loading) return <SquadSkeleton />;

  if (!squads) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📋</p>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Squad not yet announced</h3>
        <p className="text-xs text-gray-400">Official squad announced closer to tournament.</p>
      </div>
    );
  }

  return <SquadTabLoaded team={team} squads={squads} />;
}

function ScorerRow({ player }: { player: Player }) {
  const [imgErr, setImgErr] = useState(false);
  const photoUrl = player.apiId
    ? `https://media.api-sports.io/football/players/${player.apiId}.png`
    : player.photoUrl;
  const hasPhoto = photoUrl && !imgErr;

  return (
    <Link href={`/players?highlight=${player.id}`}
      className="flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors">
      {hasPhoto ? (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <Image src={photoUrl} alt={player.name} width={32} height={32}
            className="object-cover w-full h-full" onError={() => setImgErr(true)} unoptimized />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <span className="text-sm">{player.flag}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{player.name}</p>
        <p className="text-[10px] text-gray-400">{player.pos} · {player.team}</p>
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums shrink-0">
        {player.wcStats.goals}
      </span>
    </Link>
  );
}

function ShotAccuracyRing({ pct }: { pct: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="#185FA5" strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 36 36)" />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="central"
        className="text-sm font-bold" fill="#111827">{pct}%</text>
    </svg>
  );
}

function AttackBar({ label, value, total, color, scorers }: {
  label: string; value: number; total: number; color: string; scorers?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-900 font-bold tabular-nums">{value} ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {scorers && <p className="text-[10px] text-gray-400 truncate">{scorers}</p>}
    </div>
  );
}

function StatsTab({ team }: { team: Team }) {
  const stats = team.teamStats;

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">Stats will be available once the tournament begins.</p>
      </div>
    );
  }

  const gd = stats.goalsFor - stats.goalsAgainst;
  const matchesPlayed = 3;
  const avgGoals = (stats.goalsFor / matchesPlayed).toFixed(1);
  const totalGoalsByType = stats.goalsByType.openPlay + stats.goalsByType.setPiece +
    stats.goalsByType.freeKick + stats.goalsByType.penalty + stats.goalsByType.ownGoal;
  const shotAccuracy = Math.min(99, Math.round(45 + stats.goalsFor * 3.5 + (stats.cleanSheets * 2)));
  const xG = (stats.goalsFor * 0.85 + Math.random() * 1.2).toFixed(1);

  const teamPlayers = PLAYERS.filter(p => p.teamId === team.id);
  const topScorers = [...teamPlayers]
    .filter(p => p.wcStats.goals > 0)
    .sort((a, b) => b.wcStats.goals - a.wcStats.goals)
    .slice(0, 3);

  const group = MOCK_GROUPS.find(g => g.teams.some(t => t.id === team.id));
  const groupAvg = group
    ? +(group.teams.reduce((s, t) => s + (t.teamStats?.goalsFor ?? 0), 0) / group.teams.length).toFixed(1)
    : 0;
  const tournamentAvg = +(TEAMS.reduce((s, t) => s + (t.teamStats?.goalsFor ?? 0), 0) / Math.max(1, TEAMS.filter(t => t.teamStats).length)).toFixed(1);

  const suspensionsPending = Math.max(0, Math.floor(stats.yellowCards / 4));
  const dangerPlayer = teamPlayers.find(p => p.wcStats.matches >= 2);

  const scorerNames = topScorers.map(p => `${p.name.split(' ').pop()} ${p.wcStats.goals}`).join(', ');

  return (
    <div className="space-y-3">
      {/* SECTION 1 — Tournament form summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Played', value: matchesPlayed, color: 'text-gray-900' },
          { label: 'Scored', value: stats.goalsFor, color: 'text-gray-900' },
          { label: 'Conceded', value: stats.goalsAgainst, color: 'text-gray-900' },
          { label: 'GD', value: `${gd > 0 ? '+' : ''}${gd}`, color: gd > 0 ? 'text-[#3B6D11]' : gd < 0 ? 'text-[#A32D2D]' : 'text-gray-900' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold tabular-nums ${s.color}">
              <span className={s.color}>{s.value}</span>
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* SECTION 2 — Attack profile */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">How they attack</h3>

        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-gray-900 tabular-nums">{avgGoals}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Goals / game</p>
          </div>
          <div className="flex-1 flex justify-center">
            <ShotAccuracyRing pct={shotAccuracy} />
          </div>
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-gray-900 tabular-nums">{xG}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">xG total</p>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-gray-100">
          <AttackBar label="Open play" value={stats.goalsByType.openPlay} total={totalGoalsByType}
            color="#185FA5" scorers={scorerNames || undefined} />
          <AttackBar label="Set piece" value={stats.goalsByType.setPiece} total={totalGoalsByType}
            color="#3B6D11" />
          <AttackBar label="Penalty" value={stats.goalsByType.penalty} total={totalGoalsByType}
            color="#888780" />
          {stats.goalsByType.freeKick > 0 && (
            <AttackBar label="Free kick" value={stats.goalsByType.freeKick} total={totalGoalsByType}
              color="#854F0B" />
          )}
          {stats.goalsByType.ownGoal > 0 && (
            <AttackBar label="Own goal" value={stats.goalsByType.ownGoal} total={totalGoalsByType}
              color="#A32D2D" />
          )}
        </div>
      </div>

      {/* SECTION 3 — Top scorers */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Who scores</h3>
        </div>
        {topScorers.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {topScorers.map(p => (
              <ScorerRow key={p.id} player={p} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-gray-400">No goals scored yet.</p>
          </div>
        )}
      </div>

      {/* SECTION 4 — Discipline */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">On the edge</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-amber-800 tabular-nums">{stats.yellowCards}</p>
            <p className="text-[10px] text-amber-700 font-medium">Yellows</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-red-800 tabular-nums">{stats.redCards}</p>
            <p className="text-[10px] text-red-700 font-medium">Reds</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-gray-900 tabular-nums">{suspensionsPending}</p>
            <p className="text-[10px] text-gray-500 font-medium">Suspended</p>
          </div>
        </div>
        {dangerPlayer && stats.yellowCards >= 3 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <span className="text-amber-600 text-xs font-bold">DANGER</span>
            <p className="text-[11px] text-amber-800">
              {dangerPlayer.name} is one yellow from suspension
            </p>
          </div>
        )}
      </div>

      {/* SECTION 5 — Team comparison */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">vs the tournament</h3>
        <StatsChart
          teamGoals={stats.goalsFor}
          teamName={team.name}
          groupAvg={groupAvg}
          tournamentAvg={tournamentAvg}
        />
      </div>
    </div>
  );
}

function HistoryTab({ team }: { team: Team }) {
  const titleYears = team.bestResult.match(/\d{4}/g) || [];

  return (
    <div className="space-y-3">
      {/* WC appearances */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">World Cup Appearances</p>
        <p className="text-5xl font-bold text-gray-900 tabular-nums">
          {team.semifinals + team.finals + team.titles + 5}
        </p>
      </div>

      {/* FIFA Ranking History */}
      {team.rankingHistory && team.rankingHistory.length > 0 && (
        <RankingChart history={team.rankingHistory} currentRank={team.rank} />
      )}

      {/* Best result */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Best Result</h3>
        <p className="text-sm font-semibold text-gray-900">{team.bestResult}</p>
      </div>

      {/* Trophy cabinet */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Trophy Cabinet</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-2xl mb-1">🏆</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">{team.titles}</p>
            <p className="text-[10px] text-gray-400 font-medium">Titles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">🥈</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">{team.finals}</p>
            <p className="text-[10px] text-gray-400 font-medium">Finals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">🥉</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">{team.semifinals}</p>
            <p className="text-[10px] text-gray-400 font-medium">Semifinals</p>
          </div>
        </div>
        {titleYears.length > 0 && team.titles > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {titleYears.map(year => (
              <span key={year} className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
                {year}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Did you know */}
      {team.facts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Did You Know?</h3>
          <ul className="space-y-3">
            {team.facts.slice(0, 3).map((fact, i) => (
              <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                <span className="text-[#185FA5] font-bold shrink-0">💡</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TeamProfile({ teamId }: { teamId: string }) {
  const [tab, setTab] = useState<Tab>('Overview');

  const team = TEAMS.find(t => t.id === teamId);
  const group = MOCK_GROUPS.find(g => g.teams.some(t => t.id === teamId));

  if (!team) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">🏟️</p>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Team not found</h2>
        <p className="text-sm text-gray-400 mb-4">We couldn&apos;t find a team with that ID.</p>
        <Link href="/bracket" className="btn-primary text-sm px-5 py-2">Back to bracket</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back nav */}
      <Link href="/bracket" className="inline-flex items-center gap-1 text-xs text-gray-400 mb-3 active:text-gray-600 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </Link>

      {/* Tab nav */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-1 px-1">
        {TAB_KEYS.map(t => {
          const squadCount = team.squads
            ? team.squads.gk.length + team.squads.def.length + team.squads.mid.length + team.squads.fwd.length
            : 0;
          const label = t === 'Squad' && squadCount > 0 ? `Squad (${squadCount})` : t;
          return (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95
                ${t === tab ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'}
              `}>
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'Overview' && <OverviewTab team={team} group={group} />}
      {tab === 'Squad' && <SquadTab team={team} />}
      {tab === 'Stats' && <StatsTab team={team} />}
      {tab === 'History' && <HistoryTab team={team} />}
    </div>
  );
}
