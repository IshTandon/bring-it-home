'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { FIXTURES, getTournamentDates, getNextFixture, getStadiumById } from '@/lib/fixtures';
import type { Fixture } from '@/lib/fixtures';
import { TEAMS } from '@/lib/data';
import { useUserPreferencesStore } from '@/lib/store';

function getTeam(id: string) {
  return TEAMS.find(t => t.id === id);
}

function formatLocalTime(date: string, time: string): string {
  const utc = new Date(`${date}T${time}:00Z`);
  return utc.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

function getStageName(stage: string): string {
  switch (stage) {
    case 'group': return 'Group Stage';
    case 'r32': return 'Round of 32';
    case 'r16': return 'Round of 16';
    case 'qf': return 'Quarter-final';
    case 'sf': return 'Semi-final';
    case 'third': return 'Third Place';
    case 'final': return 'Final';
    default: return '';
  }
}

function NextMatchCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  const [fixture, setFixture] = useState<Fixture | undefined>();

  useEffect(() => {
    const next = getNextFixture();
    setFixture(next);
    if (!next) return;

    const tick = () => {
      const now = new Date();
      const kickoff = new Date(`${next.date}T${next.time}:00Z`);
      const diff = kickoff.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('LIVE NOW');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!fixture) return null;

  const home = getTeam(fixture.homeTeamId);
  const away = getTeam(fixture.awayTeamId);

  return (
    <div className="card mb-4">
      <div className="text-xs text-dark-text-muted uppercase tracking-wider mb-1">Next match</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {home ? (
            <span className="text-lg">{home.flag} {home.name}</span>
          ) : (
            <span className="text-sm text-dark-text-secondary">{fixture.label?.split(' vs ')[0] || 'TBD'}</span>
          )}
          <span className="text-dark-text-muted text-sm">vs</span>
          {away ? (
            <span className="text-lg">{away.flag} {away.name}</span>
          ) : (
            <span className="text-sm text-dark-text-secondary">{fixture.label?.split(' vs ')[1] || 'TBD'}</span>
          )}
        </div>
        <div className="text-dark-accent font-semibold text-sm whitespace-nowrap">
          in {timeLeft}
        </div>
      </div>
    </div>
  );
}

function DateScroller({
  dates,
  selectedDate,
  onSelect,
}: {
  dates: string[];
  selectedDate: string;
  onSelect: (d: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = selectedRef.current;
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [selectedDate]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto scrollbar-none py-2 px-1"
    >
      {dates.map(d => {
        const isSelected = d === selectedDate;
        const dateObj = new Date(d + 'T12:00:00');
        const dayNum = dateObj.getDate();
        const dayName = dateObj.toLocaleDateString([], { weekday: 'short' });
        const hasMatches = FIXTURES.some(f => f.date === d);

        return (
          <button
            key={d}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => onSelect(d)}
            className={`flex flex-col items-center min-w-[48px] px-2 py-1.5 rounded-lg text-xs transition-all ${
              isSelected
                ? 'bg-dark-accent text-dark-bg font-bold'
                : hasMatches
                ? 'bg-dark-surface text-dark-text-secondary hover:bg-dark-border'
                : 'bg-transparent text-dark-text-muted opacity-50'
            }`}
          >
            <span className="text-[10px] uppercase">{dayName}</span>
            <span className="text-sm font-semibold">{dayNum}</span>
          </button>
        );
      })}
    </div>
  );
}

function MatchCard({ fixture }: { fixture: Fixture }) {
  const home = getTeam(fixture.homeTeamId);
  const away = getTeam(fixture.awayTeamId);
  const stadium = getStadiumById(fixture.stadiumId);
  const localTime = formatLocalTime(fixture.date, fixture.time);

  const kickoff = new Date(`${fixture.date}T${fixture.time}:00Z`);
  const isFuture = kickoff > new Date();

  const roundLabel = fixture.stage === 'group'
    ? `Group ${fixture.group} · Round ${fixture.matchday}`
    : getStageName(fixture.stage);

  return (
    <Link
      href={home ? `/teams/${home.id}` : '#'}
      className="card block hover:border-dark-accent/70 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="badge badge-blue text-[10px]">{roundLabel}</span>
        <span className="text-xs text-dark-text-muted">{localTime}</span>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {home ? (
            <>
              <span className="text-xl">{home.flag}</span>
              <span className="text-sm font-medium text-dark-text-primary truncate">{home.name}</span>
            </>
          ) : (
            <span className="text-xs text-dark-text-muted">{fixture.label?.split(' vs ')[0] || 'TBD'}</span>
          )}
        </div>

        <span className="text-dark-text-muted text-xs font-medium px-3">vs</span>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          {away ? (
            <>
              <span className="text-sm font-medium text-dark-text-primary truncate">{away.name}</span>
              <span className="text-xl">{away.flag}</span>
            </>
          ) : (
            <span className="text-xs text-dark-text-muted">{fixture.label?.split(' vs ')[1] || 'TBD'}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dark-border">
        <span className="text-[11px] text-dark-text-muted truncate">
          {stadium ? `${stadium.name}, ${stadium.city}` : fixture.stadiumId}
        </span>
        {isFuture && fixture.homeTeamId !== 'TBD' && (
          <span className="text-[11px] text-dark-accent font-medium whitespace-nowrap ml-2">
            🔮 Predict
          </span>
        )}
      </div>
    </Link>
  );
}

type FilterMode = 'all' | 'my-team' | 'by-group';

export default function SchedulePage() {
  const dates = useMemo(() => getTournamentDates(), []);
  const [selectedDate, setSelectedDate] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (today >= '2026-06-11' && today <= '2026-07-19') {
      setSelectedDate(today);
    } else {
      setSelectedDate('2026-06-11');
    }
  }, []);

  const filteredFixtures = useMemo(() => {
    let matches = FIXTURES.filter(f => f.date === selectedDate);

    if (filter === 'my-team' && favoriteTeamId && favoriteTeamId !== 'skipped') {
      matches = FIXTURES.filter(
        f => f.homeTeamId === favoriteTeamId || f.awayTeamId === favoriteTeamId
      );
    } else if (filter === 'by-group') {
      matches = FIXTURES.filter(f => f.group === selectedGroup && f.date === selectedDate);
    }

    return matches.sort((a, b) => {
      const ta = new Date(`${a.date}T${a.time}:00Z`).getTime();
      const tb = new Date(`${b.date}T${b.time}:00Z`).getTime();
      return ta - tb;
    });
  }, [selectedDate, filter, selectedGroup, favoriteTeamId]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-dark-bg p-4">
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-12 w-full mb-4" />
        <div className="skeleton h-32 w-full mb-3" />
        <div className="skeleton h-32 w-full mb-3" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      <div className="sticky top-0 z-40 bg-dark-bg border-b border-dark-border">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-dark-text-primary mb-1">Schedule</h1>
          <p className="text-xs text-dark-text-muted">
            104 matches. 16 stadiums. One trophy.
          </p>
        </div>

        <div className="px-4">
          <DateScroller
            dates={dates}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-dark-accent text-dark-bg'
                : 'bg-dark-surface text-dark-text-secondary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('my-team')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === 'my-team'
                ? 'bg-dark-accent text-dark-bg'
                : 'bg-dark-surface text-dark-text-secondary'
            }`}
          >
            My Team
          </button>
          <button
            onClick={() => setFilter('by-group')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === 'by-group'
                ? 'bg-dark-accent text-dark-bg'
                : 'bg-dark-surface text-dark-text-secondary'
            }`}
          >
            By Group
          </button>

          {filter === 'by-group' && (
            <div className="flex gap-1 ml-2">
              {['A','B','C','D','E','F','G','H','I','J','K','L'].map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  className={`w-6 h-6 rounded text-[10px] font-bold transition-colors ${
                    selectedGroup === g
                      ? 'bg-dark-accent text-dark-bg'
                      : 'bg-dark-surface text-dark-text-muted'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pt-4">
        <NextMatchCountdown />

        {filter === 'my-team' && (!favoriteTeamId || favoriteTeamId === 'skipped') && (
          <div className="card text-center py-8">
            <p className="text-dark-text-secondary text-sm mb-2">
              Pick your team to see their fixtures here.
            </p>
            <Link href="/settings" className="btn-primary text-xs">
              Choose Team
            </Link>
          </div>
        )}

        {filter === 'my-team' && favoriteTeamId && favoriteTeamId !== 'skipped' && (
          <div className="mb-3">
            <p className="text-xs text-dark-text-muted mb-2">
              All matches for {getTeam(favoriteTeamId)?.flag} {getTeam(favoriteTeamId)?.name}
            </p>
          </div>
        )}

        {filteredFixtures.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredFixtures.map(f => (
              <MatchCard key={f.id} fixture={f} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-3xl mb-3">☀️</p>
            <p className="text-dark-text-secondary font-medium mb-1">Rest day</p>
            <p className="text-dark-text-muted text-sm">
              Catch up on highlights or explore the groups.
            </p>
            <Link href="/groups" className="btn text-xs mt-4 inline-block">
              Explore Groups
            </Link>
          </div>
        )}

        {selectedDate && filteredFixtures.length > 0 && filter !== 'my-team' && (
          <p className="text-center text-[11px] text-dark-text-muted mt-4 mb-2">
            {formatDateLabel(selectedDate)} · {filteredFixtures.length} match{filteredFixtures.length !== 1 ? 'es' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
