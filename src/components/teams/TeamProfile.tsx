'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { TEAMS, PLAYERS, MOCK_GROUPS } from '@/lib/data';
import FormStrip from '@/components/ui/FormStrip';
import GoalsBreakdown from '@/components/ui/GoalsBreakdown';
import type { Team, Player, Group, SquadPlayer } from '@/types';

const RankingChart = dynamic(() => import('./RankingChart'), { ssr: false });

const TABS = ['Overview', 'Squad', 'Stats', 'History'] as const;
type Tab = (typeof TABS)[number];

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

function SquadTab({ team }: { team: Team }) {
  if (team.squads) {
    const sections: { label: string; players: SquadPlayer[] }[] = [
      { label: 'Goalkeepers', players: team.squads.gk },
      { label: 'Defenders', players: team.squads.def },
      { label: 'Midfielders', players: team.squads.mid },
      { label: 'Forwards', players: team.squads.fwd },
    ];

    return (
      <div className="space-y-3">
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
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {players.map(sp => <SquadPlayerRow key={sp.id} sp={sp} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback: use PLAYERS array
  const teamPlayers = PLAYERS.filter(p => p.teamId === team.id);
  const sections = (() => {
    const grouped: Record<string, Player[]> = {};
    const sorted = [...teamPlayers].sort((a, b) => (POS_ORDER[a.pos] ?? 4) - (POS_ORDER[b.pos] ?? 4));
    sorted.forEach(p => {
      const section = POS_SECTION[p.pos] || 'Other';
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(p);
    });
    return grouped;
  })();

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
          HC
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{team.coach}</p>
          <p className="text-[11px] text-gray-400">Head Coach · {team.flag} {team.name}</p>
        </div>
      </div>

      {Object.entries(sections).map(([section, players]) => (
        <div key={section} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{section}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {players.map(p => <PlayerRow key={p.id} player={p} />)}
          </div>
        </div>
      ))}

      {teamPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No player data available for this team yet.</p>
        </div>
      )}
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

  return (
    <div className="space-y-3">
      {/* Goals scored */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Goals Scored</p>
        <p className="text-5xl font-bold text-gray-900 tabular-nums">{stats.goalsFor}</p>
        <p className="text-xs text-gray-400 mt-1">{stats.goalsAgainst} conceded · {stats.goalsFor > stats.goalsAgainst ? '+' : ''}{stats.goalsFor - stats.goalsAgainst} GD</p>
      </div>

      <GoalsBreakdown goals={stats.goalsByType} />

      {/* Cards & clean sheets */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">🟨</p>
          <p className="text-xl font-bold text-gray-900 tabular-nums">{stats.yellowCards}</p>
          <p className="text-[10px] text-gray-400 font-medium">Yellows</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">🟥</p>
          <p className="text-xl font-bold text-gray-900 tabular-nums">{stats.redCards}</p>
          <p className="text-[10px] text-gray-400 font-medium">Reds</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">🧤</p>
          <p className="text-xl font-bold text-gray-900 tabular-nums">{stats.cleanSheets}</p>
          <p className="text-[10px] text-gray-400 font-medium">Clean Sheets</p>
        </div>
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
        {TABS.map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95
              ${t === tab ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'}
            `}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab team={team} group={group} />}
      {tab === 'Squad' && <SquadTab team={team} />}
      {tab === 'Stats' && <StatsTab team={team} />}
      {tab === 'History' && <HistoryTab team={team} />}
    </div>
  );
}
