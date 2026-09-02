"use client"
import {useApplication} from "../../context/ApplicationsContext";
import {getAnalyticsData} from '../../utility/analytics'


/**
 * Analytics page — retro-terminal dark skin (matches board direction 2a).
 * Drop at: app/analytics/page.tsx  (or import <AnalyticsPage data={...} />)
 *
 * No Tailwind config needed — palette lives in `C` below, styles are inline.
 * Fonts: add to app/layout.tsx
 *   <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
 *
 * All numbers come from `data` — replace DEMO with your API/server-component fetch.
 */

const C = {
  bg: '#0b0d11',
  panel: '#12151b',
  panel2: '#171b23',
  line: '#232833',
  line2: '#1e232d',
  ink: '#eceae4',
  ink2: '#a9aeba',
  ink3: '#6f7788',
  ink4: '#4a5262',
  lime: '#b8ff3c',
  limeBg: '#182008',
  limeLine: '#3d5a14',
  amber: '#ffb43c',
  amberBg: '#241d12',
  amberLine: '#4a3a18',
  violet: '#8b7bfa',
  green: '#4fd99b',
  red: '#ff7b7f',
  blue: '#4a9eff',
} as const;

const F = {
  pixel: "'Silkscreen', monospace",
  mono: "'JetBrains Mono', monospace",
  sans: "'Plus Jakarta Sans', system-ui, sans-serif",
} as const;

/* ---------- types ---------- */

export type Stat = { label: string; value: string; };
export type Portal = { name: string;count:number,responseCount:number  };
export type FunnelStage = { name: string; count: number; color?: string };
export type AnalyticsData = {
  stats: Stat[];
  portals: Portal[];
  funnel: FunnelStage[];
  /** newest-last, one entry per day, count of applications */
  daily: { date: string; count: number }[];
  streak: number;
  dailyTarget: number;
};

/* ---------- demo data (delete once wired) ---------- */

// const DEMO: AnalyticsData = {
//   stats: [
//     { label: 'TOTAL APPLIED', value: '420' },
//     { label: 'RESPONSE RATE', value: '22%' },
//     // { label: 'GHOSTED', value: '286'  },
//     // { label: 'INTERVIEW RATE', value: '4.5%' },
//   ],
//   portals: [
//     { name: 'Referral', applied: 24, converted: 10, color: C.green },
//     { name: 'Company site', applied: 88, converted: 27, color: C.violet },
//     { name: 'Wellfound', applied: 46, converted: 9, color: C.red },
//     { name: 'LinkedIn', applied: 174, converted: 24, color: C.blue },
//     { name: 'Indeed', applied: 88, converted: 5, color: C.ink3 },
//   ],
//   funnel: [
//     { name: 'Applied', count: 420, color: C.ink4 },
//     { name: 'Screening', count: 62, color: C.violet },
//     { name: 'Interview', count: 19, color: C.green },
//     { name: 'Offer', count: 2, color: C.lime },
//   ],
//   daily: Array.from({ length: 70 }, (_, i) => {
//     const d = new Date(); d.setDate(d.getDate() - (69 - i));
//     const n = [0, 0, 1, 2, 3, 4, 5, 5, 6, 7][Math.floor(Math.abs(Math.sin(i * 1.7)) * 10)];
//     return { date: d.toISOString().slice(0, 10), count: n };
//   }),
//   streak: 12,
//   dailyTarget: 5,
// };

/* ---------- small pieces ---------- */

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, ...style }}>
      {children}
    </div>
  );
}

function PanelTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ font: `400 11px ${F.pixel}`, color: C.ink, letterSpacing: '.03em' }}>{children}</div>
      {sub && <div style={{ font: `400 11.5px ${F.sans}`, color: C.ink3, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

//const toneColor = (t?: Stat['deltaTone']) => (t === 'up' ? C.green : t === 'down' ? C.red : C.amber);

/* ---------- sections ---------- */

function StatRow({ stats }: { stats: Stat[] }) {
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 12 }}>
      {stats.map((s) => (
        <Panel key={s.label} style={{ padding: '14px 16px' }}>
          <div style={{ font: `400 8px ${F.pixel}`, color: C.ink3, letterSpacing: '.06em' }}>{s.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 9 }}>
            <div style={{ font: `800 28px ${F.mono}`, color: C.ink, letterSpacing: '-.02em' }}>{s.value}</div>
            {/* {s.delta && <div style={{ font: `700 11px ${F.mono}`, color: toneColor(s.deltaTone) }}>{s.delta}</div>} */}
          </div>
          {/* {s.sub && <div style={{ font: `400 11px ${F.sans}`, color: C.ink3, marginTop: 3 }}>{s.sub}</div>} */}
        </Panel>
      ))}
    </div>
  );
}

/** Ranked by conversion rate. Bar length encodes volume, solid segment = converted. */
function PortalEffectiveness({ portals }: { portals: Portal[] }) {
  const ranked = [...portals].sort((a, b) => b.responseCount / b.count - a.responseCount / a.count);
  const maxApplied = Math.max(...ranked.map((p) => p.count));

  return (
    <Panel style={{ padding: '18px 20px' }}>
      <PanelTitle sub="Ranked by screening rate. Bar length = volume applied.">PORTAL EFFECTIVENESS</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {ranked.map((p) => {
          const rate = p.responseCount / p.count;
          const color = p.color ?? C.violet;
          return (
            <div key={p.name}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 7, height: 7, background: color }} />
                <div style={{ font: `700 12.5px ${F.mono}`, color: C.ink }}>{p.name}</div>
                <div style={{ font: `400 11px ${F.sans}`, color: C.ink3 }}>{p.count} applied</div>
                <div style={{ flex: 1 }} />
                <div style={{ font: `800 14px ${F.mono}`, color }}>{Math.round(rate * 100)}%</div>
              </div>
              <div
                style={{
                  height: 20, borderRadius: 3, background: C.panel2,
                  border: `1px solid ${C.line2}`, overflow: 'hidden', display: 'flex',
                  width: `${(p.count / maxApplied) * 100}%`, minWidth: 60,
                }}
              >
                <div style={{ width: `${rate * 100}%`, background: color }} />
                <div style={{ flex: 1, background: color, opacity: 0.18 }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 13, borderTop: `1px solid ${C.line2}` }}>
        <Legend color={C.violet} label="Reached screening+" />
        <Legend color={C.violet} label="No response" opacity={0.18} />
      </div>
    </Panel>
  );
}

function Legend({ color, label, opacity = 1 }: { color: string; label: string; opacity?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: 10, height: 10, background: color, opacity }} />
      <span style={{ font: `400 10.5px ${F.sans}`, color: C.ink2 }}>{label}</span>
    </div>
  );
}

function Funnel({ funnel }: { funnel: FunnelStage[] }) {
  const top = funnel[0]?.count || 1;
  return (
    <Panel style={{ padding: '18px 20px' }}>
      <PanelTitle>FUNNEL</PanelTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {funnel.map((f, i) => {
          const pct = f.count / top;
          const stepPct = i === 0 ? 1 : f.count / funnel[i - 1].count;
          return (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 72, font: `600 11.5px ${F.mono}`, color: C.ink2 }}>{f.name}</div>
              <div style={{ flex: 1, height: 26, background: C.panel2, border: `1px solid ${C.line2}`, borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.max(pct * 100, 8)}%`, height: '100%',
                    background: f.color ?? C.violet, display: 'flex', alignItems: 'center',
                    paddingLeft: 9, boxSizing: 'border-box',
                  }}
                >
                  <span style={{ font: `700 11px ${F.mono}`, color: '#0b0d11' }}>{f.count}</span>
                </div>
              </div>
              <div style={{ width: 46, textAlign: 'right', font: `700 11px ${F.mono}`, color: C.ink3 }}>
                {i === 0 ? '100%' : `${(stepPct * 100).toFixed(0)}%`}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ font: `400 10.5px ${F.sans}`, color: C.ink4, marginTop: 12 }}>
        Right column = conversion from the previous stage.
      </div>
    </Panel>
  );
}

function Consistency({ daily, streak, dailyTarget }: Pick<AnalyticsData, 'daily' | 'streak' | 'dailyTarget'>) {
  const shade = (n: number) => {
    if (n === 0) return { bg: '#141821', bd: '#1f2530' };
    if (n < dailyTarget * 0.4) return { bg: 'rgba(184,255,60,.14)', bd: 'rgba(184,255,60,.2)' };
    if (n < dailyTarget) return { bg: 'rgba(184,255,60,.38)', bd: 'rgba(184,255,60,.45)' };
    return { bg: C.lime, bd: C.lime };
  };
  // chunk into weeks of 7 (oldest first)
  const weeks: AnalyticsData['daily'][] = [];
  for (let i = 0; i < daily.length; i += 7) weeks.push(daily.slice(i, i + 7));

  return (
    <Panel style={{ padding: '18px 20px', flex: 1 }}>
      <PanelTitle sub={`Applications per day · ${weeks.length} weeks`}>CONSISTENCY</PanelTitle>
      <div style={{ display: 'flex', gap: 3 }}>
        {weeks.map((w, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            {w.map((d) => {
              const s = shade(d.count);
              return <div key={d.date} title={`${d.date} · ${d.count}`} style={{ height: 13, borderRadius: 2, background: s.bg, border: `1px solid ${s.bd}` }} />;
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
        <span style={{ font: `400 10px ${F.sans}`, color: C.ink4 }}>less</span>
        {[0, 1, dailyTarget - 1, dailyTarget].map((n, i) => {
          const s = shade(n);
          return <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: s.bg, border: `1px solid ${s.bd}` }} />;
        })}
        <span style={{ font: `400 10px ${F.sans}`, color: C.ink4 }}>more</span>
        <div style={{ flex: 1 }} />
        <span style={{ font: `700 11px ${F.mono}`, color: C.amber }}>×{streak}</span>
        <span style={{ font: `400 8px ${F.pixel}`, color: C.ink3 }}>DAY STREAK</span>
      </div>
    </Panel>
  );
}

/* ---------- page ---------- */

export default function AnalyticsPage() {

    const {application}=useApplication()
    const data=getAnalyticsData(application)
    console.log(application)
    // const result=getPortalDetails(application)
    // const responseObject=getResponseRate(application)
    // console.log(responseObject)
    // console.log(result)

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '24px 28px', fontFamily: F.sans }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        <header style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ font: `400 9px ${F.pixel}`, color: C.lime, letterSpacing: '.1em' }}>STATS</div>
            <h1 style={{ font: `400 20px ${F.pixel}`, color: C.ink, margin: '12px 0 0', letterSpacing: '-.01em' }}>
              WHERE YOUR APPLICATIONS GO
            </h1>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', border: `1px solid ${C.line}`, borderRadius: 5, overflow: 'hidden' }}>
            {['30D', '90D', 'ALL'].map((t, i) => (
              <div
                key={t}
                style={{
                  padding: '6px 12px',
                  font: `600 11px ${F.mono}`,
                  color: i === 1 ? C.lime : C.ink3,
                  background: i === 1 ? '#1f2430' : 'transparent',
                  borderLeft: i ? `1px solid ${C.line}` : undefined,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StatRow stats={data.stat} />
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)', gap: 14 }}>
            <PortalEffectiveness portals={data.portal} />
            {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
              <Funnel funnel={data.funnel} />
              <Consistency daily={data.daily} streak={data.streak} dailyTarget={data.dailyTarget} />
            </div> */}
          </div>
        </div>

      </div>
    </div>
  );
}
