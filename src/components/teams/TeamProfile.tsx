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

function FallbackSilhouette({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill="rgba(245,158,11,0.1)" />
      <circle cx="28" cy="21" r="8" fill="rgba(245,158,11,0.3)" />
      <path d="M28 31c-9 0-16 5-16 11v2h32v-2c0-6-7-11-16-11z" fill="rgba(245,158,11,0.3)" />
    </svg>
  );
}

function PlayerRow({ player }: { player: Player }) {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = player.photoUrl && !imgError;

  return (
    <Link href={`/players?highlight=${player.id}`}
      className="flex items-center gap-3 px-4 py-3 active:bg-dark-border/30 transition-colors">
      <span className="text-xs text-dark-text-muted tabular-nums w-5 text-center font-medium shrink-0">
        {Math.floor(Math.random() * 25) + 1}
      </span>
      {hasPhoto ? (
        <div className="w-9 h-9 rounded-full overflow-hidden bg-dark-border shrink-0">
          <Image src={player.photoUrl!} alt={player.name} width={36} height={36}
            className="object-cover w-full h-full" onError={() => setImgError(true)} unoptimized />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          <FallbackSilhouette size={36} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-text-primary truncate">{player.name}</p>
        <p className="text-[11px] text-dark-text-muted">{player.pos}</p>
      </div>
      <span className="text-xs text-dark-text-muted tabular-nums shrink-0">{player.ovr}</span>
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
      <div className="flex items-center gap-4 py-2">
        <span className="text-5xl">{team.flag}</span>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-dark-text-primary">{team.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-dark-accent text-dark-bg text-[10px] font-bold px-2 py-0.5 rounded-full">
              #{team.rank} FIFA
            </span>
            <span className="text-xs text-dark-text-muted">{team.coach}</span>
          </div>
        </div>
      </div>

      {nextOpponent && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Next Match</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextOpponent.opponent.flag}</span>
              <div>
                <p className="text-sm font-semibold text-dark-text-primary">
                  vs <Link href={`/teams/${nextOpponent.opponent.id}`} className="hover:text-dark-accent transition-colors">{nextOpponent.opponent.name}</Link>
                </p>
                <p className="text-[11px] text-dark-text-muted">{nextOpponent.match.date} · {nextOpponent.match.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-dark-text-muted">{nextOpponent.match.stadium}</p>
              <p className="text-[10px] text-dark-text-muted/50">{nextOpponent.match.round}</p>
            </div>
          </div>
        </div>
      )}

      {formPlayer?.formDetailed && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Recent Form</h3>
          <FormStrip results={formPlayer.formDetailed} />
        </div>
      )}

      {group && (
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">Group {group.id}</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-3 py-2 font-medium text-dark-text-muted">Team</th>
                <th className="text-center px-1 py-2 font-medium text-dark-text-muted w-7">P</th>
                <th className="text-center px-1 py-2 font-medium text-dark-text-muted w-7">W</th>
                <th className="text-center px-1 py-2 font-medium text-dark-text-muted w-7">D</th>
                <th className="text-center px-1 py-2 font-medium text-dark-text-muted w-7">L</th>
                <th className="text-center px-1 py-2 font-medium text-dark-text-muted w-8">GD</th>
                <th className="text-center px-2 py-2 font-medium text-dark-text-primary w-8">PTS</th>
              </tr>
            </thead>
            <tbody>
              {group.teams.map((t, idx) => (
                <tr key={t.id} className={`border-b border-dark-border/50 ${t.id === team.id ? 'bg-dark-accent/5' : ''} ${idx < 2 ? 'border-l-4 border-l-dark-accent' : 'border-l-4 border-l-transparent'}`}>
                  <td className="px-3 py-2.5">
                    <Link href={`/teams/${t.id}`} className="flex items-center gap-2 hover:text-dark-accent transition-colors">
                      <span className="text-sm">{t.flag}</span>
                      <span className={`font-medium truncate ${t.id === team.id ? 'text-dark-accent font-semibold' : 'text-dark-text-primary'}`}>{t.name}</span>
                    </Link>
                  </td>
                  <td className="text-center px-1 py-2.5 text-dark-text-muted tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-dark-text-muted tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-dark-text-muted tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-dark-text-muted tabular-nums">0</td>
                  <td className="text-center px-1 py-2.5 text-dark-text-muted tabular-nums font-medium">0</td>
                  <td className="text-center px-2 py-2.5 text-dark-accent tabular-nums font-bold">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-2">Playing Style</h3>
        <p className="text-sm text-dark-text-muted leading-relaxed italic">&ldquo;{team.style}&rdquo;</p>
      </div>
    </div>
  );
}

function SquadPlayerRow({ sp }: { sp: SquadPlayer }) {
  const [imgError, setImgError] = useState(false);
  const photoSrc = sp.apiId ? `https://media.api-sports.io/football/players/${sp.apiId}.png` : null;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-xs text-dark-text-muted tabular-nums w-5 text-center font-medium shrink-0">
        {sp.number}
      </span>
      {photoSrc && !imgError ? (
        <div className="w-9 h-9 rounded-full overflow-hidden bg-dark-border shrink-0">
          <Image src={photoSrc} alt={sp.name} width={36} height={36}
            className="object-cover w-full h-full" onError={() => setImgError(true)} unoptimized />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          <FallbackSilhouette size={36} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-text-primary truncate">{sp.name}</p>
        <p className="text-[11px] text-dark-text-muted truncate">{sp.club}</p>
      </div>
      <span className="text-xs text-dark-text-muted tabular-nums shrink-0">{sp.age}</span>
    </div>
  );
}

function SquadSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
            <div className="h-3 w-24 skeleton rounded" />
          </div>
          <div className="divide-y divide-dark-border/50">
            {[1, 2, 3].map(j => (
              <div key={j} className="flex items-center gap-3 px-4 py-3">
                <div className="w-5 h-3 skeleton rounded" />
                <div className="w-9 h-9 rounded-full skeleton" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 skeleton rounded" />
                  <div className="h-2.5 w-20 skeleton rounded" />
                </div>
                <div className="w-6 h-3 skeleton rounded" />
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
          <span className="bg-dark-accent text-dark-bg text-[10px] font-bold px-2.5 py-1 rounded-full">
            Group {team.group}
          </span>
          <span className="text-xs text-dark-text-muted">{total} players selected</span>
        </div>
      )}

      <div className="bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-dark-accent flex items-center justify-center text-dark-bg text-sm font-bold shrink-0">
          HC
        </div>
        <div>
          <p className="text-sm font-semibold text-dark-text-primary">{team.coach}</p>
          <p className="text-[11px] text-dark-text-muted">Head Coach · {team.flag} {team.name}</p>
        </div>
      </div>

      {sections.map(({ label, players }) => (
        <div key={label} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">{label}</h3>
            <span className="text-[10px] text-dark-text-muted/50 tabular-nums">{players.length}</span>
          </div>
          <div className="divide-y divide-dark-border/50">
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
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-sm font-semibold text-dark-text-primary mb-1">Squad not yet announced</h3>
        <p className="text-xs text-dark-text-muted">Official squad announced closer to tournament.</p>
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
      className="flex items-center gap-3 px-4 py-3 active:bg-dark-border/30 transition-colors">
      {hasPhoto ? (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-dark-border shrink-0">
          <Image src={photoUrl} alt={player.name} width={32} height={32}
            className="object-cover w-full h-full" onError={() => setImgErr(true)} unoptimized />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          <FallbackSilhouette size={32} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-text-primary truncate">{player.name}</p>
        <p className="text-[10px] text-dark-text-muted">{player.pos} · {player.team}</p>
      </div>
      <span className="text-sm font-bold text-dark-accent tabular-nums shrink-0">
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
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1f2937" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="#f59e0b" strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 36 36)" />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="central"
        className="text-sm font-bold" fill="#f9fafb">{pct}%</text>
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
        <span className="text-dark-text-muted font-medium">{label}</span>
        <span className="text-dark-text-primary font-bold tabular-nums">{value} ({pct}%)</span>
      </div>
      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {scorers && <p className="text-[10px] text-dark-text-muted truncate">{scorers}</p>}
    </div>
  );
}

function StatsTab({ team }: { team: Team }) {
  const stats = team.teamStats;

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-dark-text-muted text-sm">Stats will be available once the tournament begins.</p>
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
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Played', value: matchesPlayed, color: 'text-dark-text-primary' },
          { label: 'Scored', value: stats.goalsFor, color: 'text-dark-text-primary' },
          { label: 'Conceded', value: stats.goalsAgainst, color: 'text-dark-text-primary' },
          { label: 'GD', value: `${gd > 0 ? '+' : ''}${gd}`, color: gd > 0 ? 'text-green-400' : gd < 0 ? 'text-red-400' : 'text-dark-text-primary' },
        ].map(s => (
          <div key={s.label} className="bg-dark-surface border border-dark-border rounded-xl p-3 text-center">
            <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-dark-text-muted font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">How they attack</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-dark-text-primary tabular-nums">{avgGoals}</p>
            <p className="text-[10px] text-dark-text-muted font-medium mt-0.5">Goals / game</p>
          </div>
          <div className="flex-1 flex justify-center">
            <ShotAccuracyRing pct={shotAccuracy} />
          </div>
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-dark-text-primary tabular-nums">{xG}</p>
            <p className="text-[10px] text-dark-text-muted font-medium mt-0.5">xG total</p>
          </div>
        </div>
        <div className="space-y-3 pt-3 border-t border-dark-border">
          <AttackBar label="Open play" value={stats.goalsByType.openPlay} total={totalGoalsByType} color="#f59e0b" scorers={scorerNames || undefined} />
          <AttackBar label="Set piece" value={stats.goalsByType.setPiece} total={totalGoalsByType} color="#22c55e" />
          <AttackBar label="Penalty" value={stats.goalsByType.penalty} total={totalGoalsByType} color="#6b7280" />
          {stats.goalsByType.freeKick > 0 && (
            <AttackBar label="Free kick" value={stats.goalsByType.freeKick} total={totalGoalsByType} color="#3b82f6" />
          )}
          {stats.goalsByType.ownGoal > 0 && (
            <AttackBar label="Own goal" value={stats.goalsByType.ownGoal} total={totalGoalsByType} color="#ef4444" />
          )}
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">Who scores</h3>
        </div>
        {topScorers.length > 0 ? (
          <div className="divide-y divide-dark-border/50">
            {topScorers.map(p => <ScorerRow key={p.id} player={p} />)}
          </div>
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-dark-text-muted">No goals scored yet.</p>
          </div>
        )}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">On the edge</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-amber-400 tabular-nums">{stats.yellowCards}</p>
            <p className="text-[10px] text-amber-400/80 font-medium">Yellows</p>
          </div>
          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-red-400 tabular-nums">{stats.redCards}</p>
            <p className="text-[10px] text-red-400/80 font-medium">Reds</p>
          </div>
          <div className="bg-dark-border/50 border border-dark-border rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-dark-text-primary tabular-nums">{suspensionsPending}</p>
            <p className="text-[10px] text-dark-text-muted font-medium">Suspended</p>
          </div>
        </div>
        {dangerPlayer && stats.yellowCards >= 3 && (
          <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-800/50 rounded-lg px-3 py-2">
            <span className="text-amber-400 text-xs font-bold">DANGER</span>
            <p className="text-[11px] text-amber-300">
              {dangerPlayer.name} is one yellow from suspension
            </p>
          </div>
        )}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">vs the tournament</h3>
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
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-1">World Cup Appearances</p>
        <p className="text-5xl font-bold text-dark-text-primary tabular-nums">
          {team.semifinals + team.finals + team.titles + 5}
        </p>
      </div>

      {team.rankingHistory && team.rankingHistory.length > 0 && (
        <RankingChart history={team.rankingHistory} currentRank={team.rank} />
      )}

      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-2">Best Result</h3>
        <p className="text-sm font-semibold text-dark-text-primary">{team.bestResult}</p>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Trophy Cabinet</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-2xl mb-1">🏆</p>
            <p className="text-xl font-bold text-dark-text-primary tabular-nums">{team.titles}</p>
            <p className="text-[10px] text-dark-text-muted font-medium">Titles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">🥈</p>
            <p className="text-xl font-bold text-dark-text-primary tabular-nums">{team.finals}</p>
            <p className="text-[10px] text-dark-text-muted font-medium">Finals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl mb-1">🥉</p>
            <p className="text-xl font-bold text-dark-text-primary tabular-nums">{team.semifinals}</p>
            <p className="text-[10px] text-dark-text-muted font-medium">Semifinals</p>
          </div>
        </div>
        {titleYears.length > 0 && team.titles > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {titleYears.map(year => (
              <span key={year} className="bg-dark-accent/20 text-dark-accent text-xs font-bold px-2.5 py-1 rounded-md border border-dark-accent/30">
                {year}
              </span>
            ))}
          </div>
        )}
      </div>

      {team.facts.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Did You Know?</h3>
          <ul className="space-y-3">
            {team.facts.slice(0, 3).map((fact, i) => (
              <li key={i} className="text-sm text-dark-text-muted leading-relaxed flex gap-2">
                <span className="text-dark-accent font-bold shrink-0">💡</span>
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
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center">
          <span className="text-2xl">🏟️</span>
        </div>
        <h2 className="text-lg font-semibold text-dark-text-primary mb-1">Team not found</h2>
        <p className="text-sm text-dark-text-muted mb-4">We couldn&apos;t find a team with that ID.</p>
        <Link href="/bracket" className="btn-primary text-sm px-5 py-2">Back to bracket</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/bracket" className="inline-flex items-center gap-1 text-xs text-dark-text-muted mb-3 active:text-dark-text-primary transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </Link>

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-1 px-1">
        {TAB_KEYS.map(t => {
          const squadCount = team.squads
            ? team.squads.gk.length + team.squads.def.length + team.squads.mid.length + team.squads.fwd.length
            : 0;
          const label = t === 'Squad' && squadCount > 0 ? `Squad (${squadCount})` : t;
          return (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95
                ${t === tab ? 'bg-dark-accent text-dark-bg shadow-sm' : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
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
