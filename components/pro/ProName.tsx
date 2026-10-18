import type { ReactNode } from 'react';

/**
 * A Ranks name. Rookie Pro players (row.pro — stamped server-side by
 * /api/run/score, only when PRO_ACTIVE) get a gold name and a small PRO badge;
 * everyone else renders exactly as before.
 */
export function ProName({ pro, className = '', children }: { pro?: boolean; className?: string; children: ReactNode }) {
  if (!pro) return <span className={className}>{children}</span>;
  return (
    <span className={`${className} inline-flex items-center gap-1.5`}>
      <span className="truncate" style={{ color: '#FFD966', textShadow: '0 1px 0 rgba(0,0,0,0.55), 0 0 10px rgba(255,200,0,0.35)' }}>
        {children}
      </span>
      <span
        className="shrink-0 rounded-[5px] px-1 py-[1px] text-[8px] font-black uppercase tracking-widest leading-none"
        style={{ background: 'linear-gradient(180deg,#FFE27A 0%,#F2A91C 100%)', color: '#4A2F00' }}
        aria-label="Rookie Pro"
      >
        Pro
      </span>
    </span>
  );
}
