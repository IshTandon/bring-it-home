interface GoalsByType {
  openPlay: number;
  setPiece: number;
  freeKick: number;
  penalty: number;
  ownGoal: number;
}

const BAR_CONFIG: { key: keyof GoalsByType; label: string; color: string }[] = [
  { key: 'openPlay', label: 'Open play', color: 'bg-[#185FA5]' },
  { key: 'setPiece', label: 'Set piece', color: 'bg-[#3B6D11]' },
  { key: 'freeKick', label: 'Free kick', color: 'bg-[#854F0B]' },
  { key: 'penalty',  label: 'Penalty',   color: 'bg-[#888780]' },
  { key: 'ownGoal',  label: 'Own goal',  color: 'bg-[#A32D2D]' },
];

export default function GoalsBreakdown({ goals }: { goals: GoalsByType }) {
  const max = Math.max(...Object.values(goals), 1);

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">How they score</h3>
      <div className="space-y-3">
        {BAR_CONFIG.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-dark-text-muted font-medium w-20 shrink-0">{label}</span>
            <div className="flex-1 h-3 bg-dark-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${color}`}
                style={{ width: `${(goals[key] / max) * 100}%` }} />
            </div>
            <span className="text-xs text-dark-text-primary font-bold tabular-nums w-5 text-right shrink-0">{goals[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
