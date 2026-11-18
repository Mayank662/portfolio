import type { Project } from "@/content/projects";

/**
 * Minimal line-art architecture illustrations, one per project concept.
 * Pure SVG so they stay crisp and cheap; the dash animation is CSS-driven
 * and halts under reduced motion.
 */
const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  vectorEffect: "non-scaling-stroke" as const,
};

function Node({ x, y, w = 72, h = 28, label }: { x: number; y: number; w?: number; h?: number; label: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={8} {...common} className="text-ink-2/70" />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-ink-2 font-mono text-[9px] uppercase tracking-wider">
        {label}
      </text>
    </g>
  );
}

function Flow({ d }: { d: string }) {
  return (
    <path d={d} {...common} className="text-accent [stroke-dasharray:5_7] motion-safe:animate-[dash_3s_linear_infinite]" />
  );
}

export function Diagram({ kind }: { kind: Project["diagram"] }) {
  return (
    <svg viewBox="0 0 420 260" className="h-full w-full" role="img" aria-label={`${kind} architecture illustration`}>
      <style>{`@keyframes dash { to { stroke-dashoffset: -24; } }`}</style>
      <defs>
        <radialGradient id={`g-${kind}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {kind === "agent" && (
        <g>
          <circle cx="210" cy="130" r="70" fill={`url(#g-${kind})`} />
          <circle cx="210" cy="130" r="30" {...common} className="text-accent-2" />
          <text x="210" y="134" textAnchor="middle" className="fill-ink font-mono text-[10px] uppercase tracking-wider">Agent</text>
          <Node x={70} y={60} label="Query" />
          <Node x={70} y={130} label="NER" />
          <Node x={70} y={200} label="RAG" />
          <Node x={350} y={90} w={90} label="Intent" />
          <Node x={350} y={170} w={90} label="Tool call" />
          <Flow d="M106 60 C 150 60, 160 110, 180 118" />
          <Flow d="M106 130 L 180 130" />
          <Flow d="M106 200 C 150 200, 160 150, 180 142" />
          <Flow d="M240 120 C 270 110, 280 92, 305 90" />
          <Flow d="M240 140 C 270 150, 280 168, 305 170" />
          <circle cx="210" cy="130" r="44" {...common} className="text-accent/40 [stroke-dasharray:2_6]" />
        </g>
      )}

      {kind === "workflow" && (
        <g>
          <rect x="40" y="105" width="340" height="50" rx="25" fill={`url(#g-${kind})`} />
          <Node x={70} y={130} w={56} label="Trigger" />
          <Node x={160} y={130} w={64} label="Validate" />
          <Node x={250} y={130} w={56} label="LLM" />
          <Node x={350} y={80} w={60} label="Approve" />
          <Node x={350} y={180} w={60} label="Commit" />
          <Flow d="M98 130 L 128 130" />
          <Flow d="M192 130 L 222 130" />
          <Flow d="M278 125 C 300 110, 310 82, 320 80" />
          <Flow d="M278 135 C 300 150, 310 178, 320 180" />
          <path d="M250 158 L 250 200 L 160 200 L 160 150" {...common} className="text-ink-3 [stroke-dasharray:3_5]" />
          <text x="205" y="214" textAnchor="middle" className="fill-ink-3 font-mono text-[8px] uppercase tracking-wider">retry · idempotent</text>
          <text x="250" y="52" textAnchor="middle" className="fill-ink-3 font-mono text-[8px] uppercase tracking-wider">confidence gate</text>
          <path d="M250 60 L 250 108" {...common} className="text-ink-3" />
        </g>
      )}

      {kind === "services" && (
        <g>
          <rect x="50" y="118" width="320" height="24" rx="12" fill={`url(#g-${kind})`} />
          <path d="M50 130 L 370 130" {...common} className="text-accent" />
          <text x="210" y="122" textAnchor="middle" className="fill-accent-2 font-mono text-[8px] uppercase tracking-[0.3em]">event bus</text>
          <Node x={90} y={60} label="Orders" />
          <Node x={210} y={60} label="Billing" />
          <Node x={330} y={60} label="Notify" />
          <Node x={150} y={200} label="Postgres" />
          <Node x={270} y={200} label="Mongo" />
          <Flow d="M90 74 L 90 130" />
          <Flow d="M210 74 L 210 130" />
          <Flow d="M330 74 L 330 130" />
          <path d="M150 186 L 150 130" {...common} className="text-ink-3" />
          <path d="M270 186 L 270 130" {...common} className="text-ink-3" />
          <rect x="30" y="30" width="360" height="200" rx="16" {...common} className="text-ink-3/60 [stroke-dasharray:3_6]" />
          <text x="42" y="22" className="fill-ink-3 font-mono text-[8px] uppercase tracking-wider">docker network</text>
        </g>
      )}

      {kind === "devtools" && (
        <g>
          <rect x="40" y="40" width="200" height="180" rx="12" {...common} className="text-ink-2/70" />
          <rect x="40" y="40" width="200" height="22" rx="12" className="fill-bg-2" />
          <circle cx="56" cy="51" r="3" className="fill-ink-3" />
          <circle cx="68" cy="51" r="3" className="fill-ink-3" />
          <circle cx="80" cy="51" r="3" className="fill-ink-3" />
          <text x="54" y="86" className="fill-accent-2 font-mono text-[9px]">$ rca BUG-1042</text>
          <text x="54" y="104" className="fill-ink-2 font-mono text-[9px]">▸ reading defect + stack trace</text>
          <text x="54" y="122" className="fill-ink-2 font-mono text-[9px]">▸ diffing last 6 merge requests</text>
          <text x="54" y="140" className="fill-ink-2 font-mono text-[9px]">▸ querying affected rows</text>
          <text x="54" y="158" className="fill-ink-2 font-mono text-[9px]">▸ 3 hypotheses ranked</text>
          <rect x="54" y="170" width="6" height="11" className="fill-accent motion-safe:animate-pulse" />
          <circle cx="330" cy="130" r="60" fill={`url(#g-${kind})`} />
          <Node x={330} y={80} w={76} label="Jira" />
          <Node x={330} y={130} w={76} label="GitLab MCP" />
          <Node x={330} y={180} w={76} label="DB MCP" />
          <Flow d="M240 100 C 270 100, 280 82, 294 80" />
          <Flow d="M240 130 L 294 130" />
          <Flow d="M240 160 C 270 160, 280 178, 294 180" />
        </g>
      )}
    </svg>
  );
}
