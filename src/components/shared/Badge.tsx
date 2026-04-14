import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'amber' | 'indigo' | 'teal' | 'purple' | 'slate' | 'emerald' | 'red' | 'orange';
  size?: 'xs' | 'sm';
  className?: string;
}

const colorStyles: Record<string, string> = {
  amber: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  indigo: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  teal: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  slate: 'bg-slate-700 text-slate-300 border border-slate-600',
  emerald: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  red: 'bg-red-500/20 text-red-300 border border-red-500/30',
  orange: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
};

const sizeStyles: Record<string, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] rounded-md',
  sm: 'px-2 py-0.5 text-xs rounded-lg',
};

export function Badge({ children, color = 'slate', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium ${colorStyles[color]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}
