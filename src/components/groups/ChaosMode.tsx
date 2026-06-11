'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Group, Match } from '@/types';
import type { MatchResult, Result } from '@/lib/qualification-calc';
import { computeStandings } from '@/lib/qualification-calc';
import { generateChaosScenario, findDramaticScenario } from '@/lib/chaos-engine';
import type { ChaosScenario } from '@/lib/chaos-engine';
import { useUserPreferencesStore } from '@/lib/store';
import EliminationBanner from './EliminationBanner';

const FINISHED = new Set(['FT', 'AET', 'PEN']);

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function matchResult(hs: number, as: number): Result {
  if (hs > as) return 'home';
  if (as > hs) return 'away';
  return 'draw';
}

function standingRowClass(
  isQualifier: boolean,
  isThird: boolean,
  isEliminated: boolean,
): string {
  if (isQualifier) return 'bg-green-900/15 border-l-4 border-l-green-500';
  if (isThird) return 'bg-amber-900/15 border-l-4 border-l-amber-600';
  if (isEliminated) return 'opacity-40 border-l-4 border-l-transparent';
  return 'border-l-4 border-l-transparent';
}

export default function ChaosMode({ group }: { group: Group }) {
  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);
  const fanMode = useUserPreferencesStore(s => s.fanMode);

  const defaultTeam = useMemo(() => {
    if (favoriteTeamId && favoriteTeamId !== 'skipped') {
      const inGroup = group.teams.some(t => t.id === favoriteTeamId);
      if (inGroup) return favoriteTeamId;
    }
    return null;
  }, [favoriteTeamId, group]);

  const [scenario, setScenario] = useState<ChaosScenario | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(defaultTeam);
  const [rollCount, setRollCount] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const { playedResults, remainingMatches, allPlayed } = useMemo(() => {
    const played: MatchResult[] = [];
    const remaining: Match[] = [];

    for (const match of group.matches) {
      if (FINISHED.has(match.status) && match.homeScore !== null && match.awayScore !== null) {
        played.push({
          matchId: match.id,
          result: matchResult(match.homeScore, match.awayScore),
          homeScore: match.homeScore,
          awayScore: match.awayScore,
        });
      } else {
        remaining.push(match);
      }
    }

    return { playedResults: played, remainingMatches: remaining, allPlayed: remaining.length === 0 };
  }, [group]);

  const preTop2Ids = useMemo(() => {
    const results: MatchResult[] = group.matches.map(m => {
      if (FINISHED.has(m.status) && m.homeScore !== null && m.awayScore !== null) {
        return {
          matchId: m.id,
          result: matchResult(m.homeScore, m.awayScore),
          homeScore: m.homeScore,
          awayScore: m.awayScore,
        };
      }
      return { matchId: m.id, result: null, homeScore: 0, awayScore: 0 };
    });
    const standings = computeStandings(group, results);
    return new Set(standings.slice(0, 2).map(r => r.team.id));
  }, [group]);

  const dramaticEliminations = useMemo(() => {
    if (!scenario) return [];
    return scenario.eliminatedTeams.filter(id => preTop2Ids.has(id));
  }, [scenario, preTop2Ids]);

  const upsetMatchIds = useMemo(() => {
    if (!scenario) return new Set<string>();
    return new Set(scenario.upsets.map(u => u.matchId));
  }, [scenario]);

  const roll = useCallback(() => {
    setRollCount(c => c + 1);
    setAnimKey(k => k + 1);
  }, []);

  const handleRandomize = useCallback(() => {
    setScenario(generateChaosScenario(group, playedResults, remainingMatches));
    roll();
  }, [group, playedResults, remainingMatches, roll]);

  const handleNightmare = useCallback(() => {
    if (!selectedTeamId) return;
    setScenario(findDramaticScenario(group, playedResults, remainingMatches, selectedTeamId));
    roll();
  }, [group, playedResults, remainingMatches, selectedTeamId, roll]);

  return (
    <div className="space-y-4">
      {/* Random Timeline card */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-text-primary">🎲 Random Timeline</h3>
          <p className="text-xs text-dark-text-muted mt-0.5">Generate a random set of results and see who qualifies</p>
        </div>
        <button
          type="button"
          onClick={handleRandomize}
          disabled={allPlayed}
          className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🎲 Randomize
        </button>
      </div>

      {/* Nightmare Scenario card */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-text-primary">😈 Nightmare Scenario</h3>
          <p className="text-xs text-dark-text-muted mt-0.5">Pick a team. We'll find the darkest timeline where they get eliminated.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {group.teams.map(team => (
            <button
              key={team.id}
              type="button"
              onClick={() => setSelectedTeamId(prev => (prev === team.id ? null : team.id))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95
                ${selectedTeamId === team.id
                  ? 'bg-red-900/40 text-red-300 border border-red-500/50'
                  : 'bg-dark-surface text-dark-text-muted border border-dark-border hover:border-dark-text-muted/30'}
              `}
            >
              <span>{team.flag}</span>
              <span className="hidden min-[420px]:inline">{team.name}</span>
            </button>
          ))}
        </div>
        {selectedTeamId && (
          <button
            type="button"
            onClick={handleNightmare}
            disabled={allPlayed}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg
                       cursor-pointer transition-all active:scale-95 w-full justify-center
                       border border-red-500/40 text-red-400
                       hover:bg-red-900/10 hover:border-red-400/60 hover:text-red-300
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            😈 Show me the nightmare
          </button>
        )}
      </div>

      {allPlayed && (
        <p className="text-xs text-dark-text-muted text-center py-2">
          All matches played — no chaos left to spin.
        </p>
      )}

      {fanMode === 'new' && (
        <p className="text-[11px] text-dark-accent/80">
          Every tap simulates one possible ending to the group.
        </p>
      )}

      {/* Scenario results */}
      {scenario && (
        <div className="space-y-4">
          <p className="text-[10px] font-medium text-dark-text-muted tabular-nums text-right">
            Timeline #{rollCount}
          </p>

          {/* Generated scorelines */}
          <motion.div
            key={animKey}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {remainingMatches.map(match => {
              const score = scenario.results[match.id];
              if (!score) return null;
              const isUpset = upsetMatchIds.has(match.id);

              return (
                <motion.div
                  key={match.id}
                  variants={staggerItem}
                  className="relative bg-dark-surface border border-dark-border rounded-lg p-2.5"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base shrink-0">{match.homeTeam.flag}</span>
                    <span className="text-xs font-medium text-dark-text-primary flex-1 min-w-0 truncate">
                      {match.homeTeam.name}
                    </span>
                    <span className="text-sm font-bold text-dark-text-primary tabular-nums w-4 text-right">
                      {score.home}
                    </span>
                    <span className="text-[10px] text-dark-text-muted px-0.5">—</span>
                    <span className="text-sm font-bold text-dark-text-primary tabular-nums w-4 text-left">
                      {score.away}
                    </span>
                    <span className="text-xs font-medium text-dark-text-primary flex-1 min-w-0 truncate text-right">
                      {match.awayTeam.name}
                    </span>
                    <span className="text-base shrink-0">{match.awayTeam.flag}</span>
                  </div>

                  {isUpset && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-900/60 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-amber-600/50">
                      ⚡ UPSET
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Standings table */}
          <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
            <div className="px-3 py-2 bg-dark-border/30 border-b border-dark-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">
                Final standings
              </h3>
            </div>

            <div className="flex items-center px-3 py-1.5 text-[10px] font-medium text-dark-text-muted border-b border-dark-border bg-dark-border/15">
              <span className="w-4 text-center shrink-0">#</span>
              <span className="flex-1 pl-2">Team</span>
              <span className="w-5 text-center shrink-0">P</span>
              <span className="w-5 text-center shrink-0">W</span>
              <span className="w-5 text-center shrink-0">D</span>
              <span className="w-5 text-center shrink-0">L</span>
              <span className="w-7 text-center shrink-0">GD</span>
              <span className="w-7 text-center shrink-0 font-semibold text-dark-text-primary">PTS</span>
            </div>

            <div className="divide-y divide-dark-border/50">
              <AnimatePresence mode="popLayout">
                {scenario.finalStandings.map(row => {
                  const isQ = scenario.qualifiers.includes(row.team.id);
                  const is3rd = scenario.thirdPlace === row.team.id;
                  const isOut = scenario.eliminatedTeams.includes(row.team.id);

                  return (
                    <motion.div
                      key={row.team.id}
                      layout
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center px-3 py-2.5 text-xs ${standingRowClass(isQ, is3rd, isOut)}`}
                    >
                      <span className="w-4 text-center shrink-0 font-semibold text-dark-text-muted">
                        {row.rank}
                      </span>
                      <Link
                        href={`/teams/${row.team.id}`}
                        className="flex-1 flex items-center gap-1.5 pl-2 min-w-0 hover:text-dark-accent transition-colors"
                      >
                        <span className="text-base">{row.team.flag}</span>
                        <span className="font-medium text-dark-text-primary truncate">{row.team.name}</span>
                      </Link>
                      <span className="w-5 text-center shrink-0 text-dark-text-muted tabular-nums">{row.played}</span>
                      <span className="w-5 text-center shrink-0 text-dark-text-muted tabular-nums">{row.won}</span>
                      <span className="w-5 text-center shrink-0 text-dark-text-muted tabular-nums">{row.drawn}</span>
                      <span className="w-5 text-center shrink-0 text-dark-text-muted tabular-nums">{row.lost}</span>
                      <span className="w-7 text-center shrink-0 font-medium text-dark-text-primary tabular-nums">
                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                      </span>
                      <span className="w-7 text-center shrink-0 font-bold tabular-nums text-dark-accent">
                        {row.points}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Dramatic elimination banners */}
          {dramaticEliminations.length > 0 && (
            <div className="space-y-2">
              {dramaticEliminations.map(teamId => {
                const team = group.teams.find(t => t.id === teamId);
                if (!team) return null;
                return <EliminationBanner key={teamId} teamName={team.name} teamFlag={team.flag} />;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
