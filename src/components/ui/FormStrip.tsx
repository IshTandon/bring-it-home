interface FormResult {
  score: string;
  opponentFlag: string;
  outcome: 'W' | 'D' | 'L';
}

const CHIP_STYLES: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-[#eaf3de] text-[#27500a]',
  D: 'bg-gray-100 text-gray-500',
  L: 'bg-[#fcebeb] text-[#a32d2d]',
};

export default function FormStrip({ results }: { results: FormResult[] }) {
  return (
    <div className="flex gap-1">
      {results.slice(0, 5).map((r, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <span className={`rounded-md px-2 py-1 text-xs font-medium tabular-nums leading-none ${CHIP_STYLES[r.outcome]}`}>
            {r.score}
          </span>
          <span className="text-[10px] leading-none">{r.opponentFlag}</span>
        </div>
      ))}
    </div>
  );
}
