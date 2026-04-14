import type { PlayerStats } from '../../types/player';

interface StatConfig {
  key: keyof PlayerStats;
  label: string;
  germanLabel: string;
  color: string;
  bg: string;
}

const STAT_CONFIG: StatConfig[] = [
  { key: 'vocabulary', label: 'Vocabulary', germanLabel: 'Wortschatz', color: '#a78bfa', bg: 'bg-purple-500' },
  { key: 'listening', label: 'Listening', germanLabel: 'Hörverstehen', color: '#2dd4bf', bg: 'bg-teal-400' },
  { key: 'reading', label: 'Reading', germanLabel: 'Leseverstehen', color: '#60a5fa', bg: 'bg-blue-400' },
  { key: 'grammar', label: 'Grammar', germanLabel: 'Grammatik', color: '#fbbf24', bg: 'bg-amber-400' },
];

interface StatPanelProps {
  stats: PlayerStats;
  deltas?: Partial<PlayerStats>;
}

export function StatPanel({ stats, deltas }: StatPanelProps) {
  return (
    <div className="space-y-3">
      {STAT_CONFIG.map(({ key, germanLabel, color, bg }) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{germanLabel}</span>
            <div className="flex items-center gap-1.5">
              {deltas && deltas[key] ? (
                <span className="text-xs text-emerald-400 font-medium">+{deltas[key]}</span>
              ) : null}
              <span className="text-xs font-mono" style={{ color }}>{stats[key]}</span>
            </div>
          </div>
          <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${bg}`}
              style={{ width: `${stats[key]}%`, opacity: 0.85 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Pentagon SVG for ProgressScreen
export function StatPentagon({ stats }: { stats: PlayerStats }) {
  const cx = 100, cy = 100, r = 80;
  const keys: (keyof PlayerStats)[] = ['vocabulary', 'listening', 'reading', 'grammar'];
  // 4 stats, square layout
  const angles = keys.map((_, i) => (i * 90 - 90) * (Math.PI / 180));
  const points = keys.map((key, i) => {
    const val = stats[key] / 100;
    return [
      cx + r * val * Math.cos(angles[i]),
      cy + r * val * Math.sin(angles[i]),
    ];
  });
  const gridPoints = angles.map((a) => [
    cx + r * Math.cos(a),
    cy + r * Math.sin(a),
  ]);
  const toPath = (pts: number[][]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + 'Z';

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1.0].map((scale) => (
        <polygon
          key={scale}
          points={gridPoints.map(([gx, gy]) =>
            `${(cx + (gx - cx) * scale).toFixed(1)},${(cy + (gy - cy) * scale).toFixed(1)}`
          ).join(' ')}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1"
        />
      ))}
      {gridPoints.map(([gx, gy], i) => (
        <line key={i} x1={cx} y1={cy} x2={gx.toFixed(1)} y2={gy.toFixed(1)} stroke="#1e293b" strokeWidth="1" />
      ))}
      {/* Stat polygon */}
      <polygon
        points={points.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ')}
        fill="rgba(251,191,36,0.2)"
        stroke="#fbbf24"
        strokeWidth="2"
      />
      {/* Stat dots */}
      {points.map(([px, py], i) => (
        <circle key={i} cx={px.toFixed(1)} cy={py.toFixed(1)} r="4" fill="#fbbf24" />
      ))}
      {/* Labels */}
      {keys.map((key, i) => {
        const [lx, ly] = gridPoints[i];
        const config = STAT_CONFIG.find((s) => s.key === key)!;
        return (
          <text
            key={key}
            x={(cx + (lx - cx) * 1.2).toFixed(1)}
            y={(cy + (ly - cy) * 1.2).toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill={config.color}
          >
            {config.germanLabel}
          </text>
        );
      })}
    </svg>
  );
}
