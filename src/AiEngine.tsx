import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Tokens ───────────────────────────────────────────────────────
const BG = "#0b0d17";
const CARD_BG = "#0f1120";
const CARD_BDR = "rgba(200,200,210,0.45)"; // brighter grey border for S1/S3
const PURPLE = "#7c3aed";
const PURPLE_L = "#a78bfa";
const PURPLE_D = "rgba(255,255,255,0.06)"; // icon circle bg — neutral dark

const DIM = "rgba(255,255,255,0.04)";
const ICON_C = "rgba(255,255,255,0.55)"; // icon stroke colour — silver
const TEXT = "rgba(255,255,255,0.92)";
const TEXT_SUB = "rgba(255,255,255,0.45)";
const TITLE_C = "#ffffff"; // white for stage titles
const FONT = "'Segoe UI', system-ui, sans-serif";

// ─── Helpers ──────────────────────────────────────────────────────
function clamp(
  v: number,
  i: [number, number],
  o: [number, number],
  e?: (t: number) => number,
) {
  return interpolate(v, i, o, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });
}
const eOut3 = Easing.out(Easing.cubic);

// ─── Dark card ────────────────────────────────────────────────────
function Card({
  x,
  y,
  w,
  h,
  glow = false,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  glow?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 14,
        background: CARD_BG,
        border: `2.5px solid ${glow ? "rgba(255,255,255,0.5)" : CARD_BDR}`,
        boxShadow: glow
          ? `0 0 0 1px rgba(255,255,255,0.08), 0 0 32px rgba(255,255,255,0.08)`
          : `0 0 0 1px rgba(200,200,210,0.06)`,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// ─── Icon cell (dark circle + SVG icon) ───────────────────────────
function IconCell({
  icon,
  label,
  dim = false,
}: {
  icon: React.ReactNode;
  label: string;
  dim?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        margin: "6px 4px",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: dim ? DIM : PURPLE_D,
          border: `1px solid rgba(255,255,255,0.12)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 12,
          color: dim ? TEXT_SUB : TEXT,
          fontFamily: FONT,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────
const IC = {
  chart: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <polyline
        points="3,17 7,12 11,14 16,7 21,10"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="3" cy="17" r="1.5" fill={c} />
      <circle cx="21" cy="10" r="1.5" fill={c} />
    </svg>
  ),
  brain: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3C6.8 3 5 4.8 5 7c0 .9.3 1.7.8 2.3C4.7 9.9 4 11 4 12.3 4 14.3 5.5 16 7.4 16H9v-1H7.4C6.1 15 5 13.9 5 12.3c0-1 .6-1.9 1.4-2.3L7 9.6l-.4-.5C6.2 8.6 6 7.8 6 7c0-1.7 1.3-3 3-3s3 1.3 3 3v9h1V7c0-2.2-1.8-4-4-4z"
        fill={c}
      />
      <path
        d="M15 3c2.2 0 4 1.8 4 4 0 .8-.2 1.6-.6 2.1l-.4.5.6.4c.8.4 1.4 1.3 1.4 2.3 0 1.6-1.1 2.7-2.4 2.7H16v1h1.6C19.5 16 21 14.3 21 12.3c0-1.3-.7-2.4-1.8-3 .5-.6.8-1.4.8-2.3 0-2.2-1.8-4-4-4s-4 1.8-4 4v9h1V7c0-1.7 1.3-3 3-3z"
        fill={c}
      />
    </svg>
  ),
  shield: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7L12 3z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polyline
        points="9,12 11,14 15,10"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  loop: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a8 8 0 018-8v0a8 8 0 018 8"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 12a8 8 0 01-8 8v0a8 8 0 01-8-8"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polyline
        points="17,9 20,12 23,9"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="7,15 4,12 1,15"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  hexagon: (c = PURPLE_L) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill={c} opacity="0.6" />
    </svg>
  ),
  database: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke={c} strokeWidth="2" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke={c} strokeWidth="2" />
      <path
        d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"
        stroke={c}
        strokeWidth="2"
      />
    </svg>
  ),
  execute: (c = "#fff") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="5,3 19,12 5,21" fill={c} />
    </svg>
  ),
  // price/volume bars
  bars: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="9" rx="1" fill={c} opacity="0.7" />
      <rect x="10" y="7" width="4" height="14" rx="1" fill={c} />
      <rect x="17" y="4" width="4" height="17" rx="1" fill={c} opacity="0.85" />
    </svg>
  ),
  // funding rate (percent)
  percent: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="7" cy="7" r="3" stroke={c} strokeWidth="2" />
      <circle cx="17" cy="17" r="3" stroke={c} strokeWidth="2" />
      <line
        x1="5"
        y1="19"
        x2="19"
        y2="5"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  // markets / grid
  grid: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.8"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke={c}
        strokeWidth="1.8"
      />
    </svg>
  ),
  // action: rank (trophy/medal)
  rank: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // action: levels (sliders)
  levels: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="9" cy="6" r="2.5" fill={c} />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="15" cy="12" r="2.5" fill={c} />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="7" cy="18" r="2.5" fill={c} />
    </svg>
  ),
  // action: constrained (lock)
  lock: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M8 11V7a4 4 0 018 0v4"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill={c} />
    </svg>
  ),
  // eUSDC vault
  vault: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="6"
        width="18"
        height="14"
        rx="2"
        stroke={c}
        strokeWidth="2"
      />
      <circle cx="12" cy="13" r="3" stroke={c} strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke={c} strokeWidth="1.5" />
      <circle cx="6.5" cy="8" r="1" fill={c} />
    </svg>
  ),
  // circuit breaker
  circuit: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke={c}
        strokeWidth="2"
      />
      <path
        d="M12 7v5l3 1.5"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill={c} />
    </svg>
  ),
  // sizing / position
  sizing: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3h7v7H3z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3h7v7h-7z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M3 14h7v7H3z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M14 14h7v7h-7z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  ),
  // multi-timeframe — three candles of different sizes
  mtf: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="10"
        width="4"
        height="7"
        rx="0.8"
        stroke={c}
        strokeWidth="1.6"
      />
      <line
        x1="5"
        y1="7"
        x2="5"
        y2="10"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="17"
        x2="5"
        y2="20"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect
        x="10"
        y="6"
        width="4"
        height="10"
        rx="0.8"
        stroke={c}
        strokeWidth="1.6"
      />
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="6"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="20"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect
        x="17"
        y="8"
        width="4"
        height="8"
        rx="0.8"
        stroke={c}
        strokeWidth="1.6"
      />
      <line
        x1="19"
        y1="5"
        x2="19"
        y2="8"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="19"
        y1="16"
        x2="19"
        y2="20"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  // orderbook — stacked bid/ask rows
  orderbook: (c = PURPLE_L) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <line
        x1="4"
        y1="6"
        x2="14"
        y2="6"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="10"
        x2="20"
        y2="10"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="14"
        x2="17"
        y2="14"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="18"
        x2="11"
        y2="18"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  globe: (c = TEXT_SUB) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.5" />
      <path d="M12 3c-2.5 3-4 5.7-4 9s1.5 6 4 9" stroke={c} strokeWidth="1.5" />
      <path d="M12 3c2.5 3 4 5.7 4 9s-1.5 6-4 9" stroke={c} strokeWidth="1.5" />
      <line x1="3" y1="12" x2="21" y2="12" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
  tag: (c = TEXT_SUB) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.6 11.4L12.6 3.4A2 2 0 0011.2 3H5a2 2 0 00-2 2v6.2a2 2 0 00.6 1.4l8 8a2 2 0 002.8 0l6.2-6.2a2 2 0 000-2.8z"
        stroke={c}
        strokeWidth="1.5"
      />
      <circle cx="7.5" cy="7.5" r="1.5" fill={c} />
    </svg>
  ),
  star: (c = TEXT_SUB) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <polygon
        points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"
        stroke={c}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ─── Flowing particles on a straight line ─────────────────────────
function FlowLine({
  x1,
  y1,
  x2,
  y2,
  frame,
  color = PURPLE,
  n = 3,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frame: number;
  color?: string;
  n?: number;
  dashed?: boolean;
}) {
  const { durationInFrames: dur } = useVideoConfig();
  const cycleDur = dur * 0.5;
  return (
    <>
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(200,200,210,0.35)"
          strokeWidth={2}
          strokeDasharray={dashed ? "5 4" : undefined}
          opacity={1}
        />
      </svg>
      {Array.from({ length: n }).map((_, i) => {
        const t = (frame / cycleDur + i / n) % 1;
        const ex = eOut3(t);
        const px = x1 + (x2 - x1) * ex;
        const py = y1 + (y2 - y1) * ex;
        const op = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - 5,
              top: py - 5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}88`,
              opacity: op,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}

// ─── Orb (data stream center) ─────────────────────────────────────
// Galaxy — spiral star field, silver/white, bottom-right background of S2

// ─── Dashed feedback arc — multiple particles like FlowLine ──────
function FeedbackArc({
  x1,
  y1,
  x2,
  y2,
  frame,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frame: number;
}) {
  const { durationInFrames: dur } = useVideoConfig();
  const mx = (x1 + x2) / 2;
  const my = Math.max(y1, y2) + 90;
  const N = 4;
  const cycleDur = dur * 0.85; // slower than other flow lines

  // Quadratic bezier at parameter t
  const bez = (t: number) => ({
    x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2,
    y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2,
  });

  const particles = Array.from({ length: N }).map((_, i) => {
    const t = (frame / cycleDur + i / N) % 1;
    const eased = eOut3(t); // same easing as FlowLine
    const { x: bx, y: by } = bez(eased);
    const op = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;
    return { bx, by, op };
  });

  return (
    <>
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <path
          d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
          fill="none"
          stroke="rgba(200,200,210,0.35)"
          strokeWidth={2}
          strokeDasharray="10 4"
          opacity={1}
        />
      </svg>
      {particles.map(({ bx, by, op }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: bx - 5,
            top: by - 5,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: PURPLE,
            boxShadow: `0 0 10px ${PURPLE}, 0 0 20px ${PURPLE}88`,
            opacity: op,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export const AiEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur, width: W } = useVideoConfig();

  const fadeIn = clamp(frame, [0, 18], [0, 1], eOut3);

  // Layout — symmetric margins, each card sized to its content
  const MGAP = 45;
  const S1_W = 350;
  const S3_W = 350;
  const S2_W = 700; // fixed width for AI Core

  // Per-card heights
  const S1_H = 380;
  const S2_H = 520;
  const S3_H = 380; // match S1 height

  // All cards vertically centered at the same mid-line
  const MARGIN = 80;
  const CENTER_Y = 420;
  const S1 = { x: MARGIN, y: CENTER_Y - S1_H / 2, w: S1_W, h: S1_H };
  const S2 = {
    x: MARGIN + S1_W + MGAP,
    y: CENTER_Y - S2_H / 2,
    w: S2_W,
    h: S2_H,
  };
  const S3 = {
    x: MARGIN + S1_W + MGAP + S2_W + MGAP,
    y: CENTER_Y - S3_H / 2,
    w: S3_W,
    h: S3_H,
  };

  const midY = CENTER_Y; // all arrows at the visual center line

  // Sub-card layout inside S2 — equally distributed vertically
  const S2_HEADER = 48;
  void 0; // S2_BOT_PAD removed — layout now driven by LOGO_OFFSET
  const PAD = 16;
  const HGAP_SUB = 35; // gap between KB and LLM (connector dot visible)
  const KB_W = Math.floor((S2.w - PAD * 2 - HGAP_SUB) / 2);
  const LLM_W = S2.w - PAD * 2 - KB_W - HGAP_SUB;
  const ROW_H = 185;
  const CL_H = 92; // taller compound learner card
  const CL_GAP = 28; // gap between KB/LLM row and CL
  // Free space to distribute above KB and below CL
  // KB/LLM now placed below logo rather than using computed VGAP

  const LOGO_OFFSET = 52 + 10 + 10; // logo height + top margin + gap below
  const KB_TOP = S2.y + S2_HEADER + LOGO_OFFSET; // start below logo
  const LLM_TOP = KB_TOP;
  const CL_TOP = KB_TOP + ROW_H + CL_GAP;

  const KB = { x: S2.x + PAD, y: KB_TOP, w: KB_W, h: ROW_H };
  const LLM = {
    x: S2.x + PAD + KB_W + HGAP_SUB,
    y: LLM_TOP,
    w: LLM_W,
    h: ROW_H,
  };
  const CL = { x: S2.x + PAD, y: CL_TOP, w: S2.w - PAD * 2, h: CL_H };

  // Feedback arc from S3 bottom → S2 bottom
  const arcX1 = S3.x + S3.w / 2;
  const arcY1 = S3.y + S3.h + 10;
  const arcX2 = S2.x + S2.w / 2;
  const arcY2 = S2.y + S2.h + 10;

  return (
    <AbsoluteFill style={{ opacity: fadeIn, fontFamily: FONT }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, #10122a 0%, ${BG} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Purple ambient bloom behind Stage 2 */}
      <div
        style={{
          position: "absolute",
          left: S2.x - 60,
          top: S2.y - 60,
          width: S2.w + 120,
          height: S2.h + 120,
          borderRadius: 32,
          background: `radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Title bar ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 38,
          width: W,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: TEXT,
            letterSpacing: 0.5,
          }}
        >
          AI Vault Trading Engine
        </div>
        <div
          style={{
            fontSize: 13,
            color: TEXT_SUB,
            marginTop: 8,
            marginBottom: 18,
            letterSpacing: 1.5,
          }}
        >
          — Built on Hyperliquid —
        </div>
      </div>

      {/* ════════════════════════════════════
          STAGE 1 — MARKET DATA
      ════════════════════════════════════ */}
      <Card x={S1.x} y={S1.y} w={S1.w} h={S1.h}>
        {/* Header */}
        <div
          style={{
            padding: "12px 16px 10px",
            borderBottom: `1px solid ${CARD_BDR}`,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: TITLE_C,
              letterSpacing: 0.4,
            }}
          >
            01 · Market Data
          </span>
        </div>
        {/* 6 icons — 3×2 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px 10px",
            padding: "20px 12px",
            marginBottom: 45,
          }}
        >
          <IconCell icon={IC.chart(ICON_C)} label="Perp Futures" />
          <IconCell icon={IC.bars(ICON_C)} label="Price & Volume" />
          <IconCell icon={IC.percent(ICON_C)} label="Funding Rate" />
          <IconCell icon={IC.orderbook(ICON_C)} label="Orderbook" />
          <IconCell icon={IC.grid(ICON_C)} label="140+ Markets" />
          <IconCell icon={IC.mtf(ICON_C)} label="Multi Timeframe" />
        </div>
        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 14,
            right: 14,
            background: "rgba(109,40,217,0.20)",
            borderRadius: 8,
            padding: "8px 0",
            textAlign: "center",
            border: `1.5px solid rgba(124,58,237,0.55)`,
          }}
        >
          <span style={{ fontSize: 11, color: TEXT, letterSpacing: 0.2 }}>
            Live Microstructure Feed
          </span>
        </div>
      </Card>

      {/* ════════════════════════════════════
          ARROW  1 → 2
      ════════════════════════════════════ */}
      <FlowLine
        x1={S1.x + S1.w}
        y1={midY}
        x2={S2.x}
        y2={midY}
        frame={frame}
        n={4}
        dashed
      />

      {/* ════════════════════════════════════
          STAGE 2 — AI CORE
      ════════════════════════════════════ */}
      {/* Outer glow border */}
      <div
        style={{
          position: "absolute",
          left: S2.x - 4,
          top: S2.y - 4,
          width: S2.w + 8,
          height: S2.h + 8,
          borderRadius: 18,
          border: `2px solid rgba(255,255,255,0.8)`,
          boxShadow: [
            "0 0 0 4px rgba(124,58,237,0.15)",
            "0 0 30px rgba(124,58,237,0.25)",
            "0 0 70px rgba(124,58,237,0.12)",
            "0 0 16px rgba(255,255,255,0.1)",
          ].join(", "),
          pointerEvents: "none",
        }}
      />
      <Card x={S2.x} y={S2.y} w={S2.w} h={S2.h} glow>
        {/* Header */}
        <div
          style={{
            padding: "12px 16px 10px",
            borderBottom: `1px solid rgba(255,255,255,0.5)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: TITLE_C,
              letterSpacing: 0.4,
            }}
          >
            02 · AI Reasoning Core
          </span>
          <div
            style={{
              background: PURPLE,
              borderRadius: 10,
              padding: "5px 14px",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            AI
          </div>
        </div>

        {/* ── KB sub-card ── */}
        <div
          style={{
            position: "absolute",
            left: KB.x - S2.x,
            top: KB.y - S2.y,
            width: KB.w,
            height: KB.h,
            borderRadius: 10,
            background: "rgba(28,32,52,0.85)",
            border: `1.5px solid rgba(200,200,210,0.45)`,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "8px 12px 6px",
              borderBottom: `1px solid rgba(200,200,210,0.25)`,
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ fontSize: 14, color: ICON_C }}>✦</span>
            <span style={{ fontSize: 14, fontWeight: 400, color: TEXT }}>
              Knowledge Base
            </span>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 30px",
            }}
          >
            <IconCell icon={IC.database(ICON_C)} label="Rules" />
            <IconCell icon={IC.brain(ICON_C)} label="Heuristics" />
            <IconCell icon={IC.shield(ICON_C)} label="Risk Params" />
          </div>
        </div>

        {/* ── LLM sub-card ── */}
        <div
          style={{
            position: "absolute",
            left: LLM.x - S2.x,
            top: LLM.y - S2.y,
            width: LLM.w,
            height: LLM.h,
            borderRadius: 10,
            background: "rgba(28,32,52,0.85)",
            border: `1.5px solid rgba(200,200,210,0.45)`,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "8px 12px 6px",
              borderBottom: `1px solid rgba(200,200,210,0.25)`,
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              gap: 7,
              flexShrink: 0,
            }}
          >
            {/* CPU/chip icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect
                x="7"
                y="7"
                width="10"
                height="10"
                rx="1.5"
                stroke={ICON_C}
                strokeWidth="2"
              />
              <line
                x1="9"
                y1="7"
                x2="9"
                y2="4"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="7"
                x2="12"
                y2="4"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="15"
                y1="7"
                x2="15"
                y2="4"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="17"
                x2="9"
                y2="20"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="12"
                y1="17"
                x2="12"
                y2="20"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="15"
                y1="17"
                x2="15"
                y2="20"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="7"
                y1="9"
                x2="4"
                y2="9"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="7"
                y1="12"
                x2="4"
                y2="12"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="7"
                y1="15"
                x2="4"
                y2="15"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="17"
                y1="9"
                x2="20"
                y2="9"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="17"
                y1="12"
                x2="20"
                y2="12"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="17"
                y1="15"
                x2="20"
                y2="15"
                stroke={ICON_C}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 400, color: TEXT }}>
              LLM Engine
            </span>
          </div>
          {/* Action-style: icon + arrow label */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
              padding: "0 10px",
            }}
          >
            {[
              { icon: IC.rank(ICON_C), label: "→ Rank Trades" },
              {
                icon: IC.levels(ICON_C),
                label: "→ Set Entry / Stop-Loss / Take-Profit",
              },
              { icon: IC.lock(ICON_C), label: "→ Trade Mgmt" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: PURPLE_D,
                    border: `1px solid rgba(255,255,255,0.12)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: TEXT,
                    fontFamily: FONT,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connection dot KB↔LLM — same size as flow dots */}
        {(() => {
          const dotX = KB.x - S2.x + KB.w + (LLM.x - KB.x - KB.w) / 2;
          const dotY = KB.y - S2.y + KB.h / 2;
          const pulse = 0.6 + 0.4 * Math.sin(frame * 0.18);
          return (
            <div
              style={{
                position: "absolute",
                left: dotX - 5,
                top: dotY - 5,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: PURPLE,
                boxShadow: `0 0 10px ${PURPLE}, 0 0 20px ${PURPLE}88`,
                opacity: pulse,
              }}
            />
          );
        })()}

        {/* ── Compound Learner sub-card ── */}
        <div
          style={{
            position: "absolute",
            left: CL.x - S2.x,
            top: CL.y - S2.y,
            width: CL.w,
            height: CL.h,
            borderRadius: 10,
            background: "rgba(28,32,52,0.85)",
            border: `1.5px solid rgba(200,200,210,0.45)`,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <div
            style={{
              padding: "7px 14px 6px",
              borderBottom: `1px solid rgba(200,200,210,0.25)`,
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: PURPLE_D,
                border: `1px solid rgba(255,255,255,0.12)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {IC.loop(ICON_C)}
            </div>
            <span style={{ fontSize: 14, fontWeight: 400, color: TEXT }}>
              Compound Learner
            </span>
          </div>
          {/* Body */}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>
              Post-trade post-mortem → feeds back into Knowledge Base
            </div>
          </div>
        </div>

        {/* Logo — top right, below header title */}
        <Img
          src={staticFile("Logo Mark - White_SVG.svg")}
          style={{
            position: "absolute",
            top: S2_HEADER + 10,
            right: 16,
            width: 52,
            height: 52,
            opacity: 0.35,
          }}
        />

        {/* Bottom label */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 14,
            right: 14,
            background: "rgba(109,40,217,0.20)",
            borderRadius: 8,
            padding: "8px 0",
            textAlign: "center",
            border: `1.5px solid rgba(124,58,237,0.55)`,
          }}
        >
          <span style={{ fontSize: 11, color: TEXT, letterSpacing: 0.2 }}>
            Proprietary Trading Methodology
          </span>
        </div>
      </Card>

      {/* ════════════════════════════════════
          ARROW  2 → 3
      ════════════════════════════════════ */}
      <FlowLine
        x1={S2.x + S2.w}
        y1={midY}
        x2={S3.x}
        y2={midY}
        frame={frame}
        color={PURPLE}
        n={4}
        dashed
      />

      {/* ════════════════════════════════════
          STAGE 3 — EXECUTION
      ════════════════════════════════════ */}
      <Card x={S3.x} y={S3.y} w={S3.w} h={S3.h}>
        {/* Header */}
        <div
          style={{
            padding: "12px 16px 10px",
            borderBottom: `1px solid ${CARD_BDR}`,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: TITLE_C,
              letterSpacing: 0.4,
            }}
          >
            03 · Execution
          </span>
        </div>
        {/* 5 icons — 3×2 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px 10px",
            padding: "20px 12px",
            marginBottom: 45,
          }}
        >
          <IconCell icon={IC.shield(ICON_C)} label="Risk-First" />
          <IconCell icon={IC.sizing(ICON_C)} label="Sizing" />
          <IconCell icon={IC.circuit(ICON_C)} label="Circuit Breaker" />
          <IconCell
            icon={
              <Img
                src={staticFile("HL symbol_white.svg")}
                style={{ width: 32, height: 32, opacity: 0.55 }}
              />
            }
            label="Hyperliquid Perp"
          />
          <IconCell icon={IC.vault(ICON_C)} label="Vault Token" />
        </div>
        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: 14,
            right: 14,
            background: "rgba(109,40,217,0.20)",
            borderRadius: 8,
            padding: "8px 0",
            textAlign: "center",
            border: `1.5px solid rgba(124,58,237,0.55)`,
          }}
        >
          <span style={{ fontSize: 11, color: TEXT, letterSpacing: 0.2 }}>
            Auditable Thesis
          </span>
        </div>
      </Card>

      {/* ════════════════════════════════════
          FEEDBACK ARC  S3 → S2
      ════════════════════════════════════ */}
      <FeedbackArc x1={arcX1} y1={arcY1} x2={arcX2} y2={arcY2} frame={frame} />
    </AbsoluteFill>
  );
};
