interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { outer: 32, font: 'text-xs' },
  md: { outer: 48, font: 'text-sm font-bold' },
  lg: { outer: 64, font: 'text-lg font-bold' },
};

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const { outer, font } = sizeConfig[size];
  return (
    <div
      className="hex-clip flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 select-none"
      style={{ width: outer, height: outer }}
    >
      <span className={font}>{level}</span>
    </div>
  );
}
