"use client";

import * as React from "react";
import { ArrowUp, CircleDashed, Sun } from "lucide-react";

export interface WildHuntImage {
  src: string;
  alt?: string;
  /** Object position shared by the image and its matching transparent cutout. */
  position?: string;
  cutout?: string;
}
export interface FooterLink {
  label: string;
  href?: string;
}
export interface FooterColumn {
  title: string;
  links: FooterLink[];
}
export type WildHuntPreset = "vermilion" | "ink" | "cobalt" | "bone";
export interface WildHuntFooterProps {
  wordmark?: string;
  image?: WildHuntImage;
  imageHeight?: number;
  dissolve?: number;
  tagline?: string;
  sideNote?: string;
  columns?: FooterColumn[];
  colophon?: string;
  legal?: string;
  backToTop?: boolean;
  sigils?: boolean;
  preset?: WildHuntPreset;
  palette?: { background?: string; ink?: string };
  tracking?: number;
  grain?: number;
  interactive?: boolean;
  fontFamily?: string;
  monoFamily?: string;
  height?: string;
  className?: string;
}

const PRESETS = {
  vermilion: { background: "#e2281b", ink: "#f4efe5" },
  ink: { background: "#100f0e", ink: "#ebe5d7" },
  cobalt: { background: "#1b2db0", ink: "#eef0ff" },
  bone: { background: "#ebe5d8", ink: "#17130f" },
};
const DEFAULT_IMAGE: WildHuntImage = {
  src: "https://cdn.21st.dev/assets/mirror/67/671b69b8614847816a300a1d11ee5704a7b2f5c51b8b50d45f17dfc49af09b68.jpg",
  alt: "Åsgårdsreien, the Wild Hunt of Odin, by Peter Nicolai Arbo, 1872",
  position: "50% 26%",
  cutout:
    "https://cdn.21st.dev/assets/mirror/69/692fb74acc74e0097901ca85075b1efbfdeebcb4d5edfe99874e9ec7e4847e0a.webp",
};
const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Visit", href: "#visit" },
      { label: "Exhibitions", href: "#exhibitions" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Collections", href: "#learn" },
      { label: "About", href: "#about" },
    ],
  },
];
const SANS_STACK =
  '"Inter", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';
const MONO_STACK =
  '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace';

// Original bitmap blackletter: 22 rows, each packed into ceil(width / 4) hex digits.
const WHF_GLYPHS: Record<string, string> = {
  A: "15:00000000000c00fc01fc003c003c083c183c183c183c183c303c3ffc303c303c303c303c3038e03080000000",
  B: "15:00000800dfc0ffe078e0787078707860786078007fe07ff078787838781878187818780078007fc000000000",
  C: "14:000001e007f80ff810783000700070007100700070007000700070007100700078007c003fe01fc00f800000",
  D: "15:00000800dfc0ffe078f878787838781878187818781878187818781878187818781078007f807f0000000000",
  E: "14:000001e007f80ff810783000700070007000700071e073e0700070007000700078007c003fe01fc00f800000",
  F: "14:000004007ffc5ff01c001c001c001c001c001c001fe01fc01c001c001c001c001c001c001c001c00380070000000",
  G: "15:000001e007f80ff8107830007000700070007000700070fc701c701c701c701c78187c003fe01fc00f800000",
  H: "15:00000000d80cf81c783c783c783c783c783c783c7ffc7ffc783c783c783c783c783c783c7038603000000000",
  I: "10:0000407c05c01c01c81c01c01c01c01c81c01c01c01c01c01c01c01c01c03f0100000",
  J: "12:0000080fe1fc03803a03803803803803a0380380380380380380380380b03e07c0",
  K: "15:00000000d81cf838787078e078e079c07b807b007f007e007f007b807bc079e078f07878703c601800000000",
  L: "14:00000000d800f800780078007800780078007800780078007800780078007800780078007fe07fc000000000",
  M: "18:00000000006ff8057dc073ce073c6073ce073ce073ce073ce073ce073ce073ce073ce073ce073ce073ce073ce0738e0630c04000000000",
  N: "15:00000000d80cf81c783c7c3c7c3c7e3c7e3c7f3c7b3c7bbc79fc78fc78fc787c787c783c7038603000000000",
  O: "15:0000000007f00ff8007c307c313c711c711c711c729c739c711c711c711c791c78187c103fe01fc000000000",
  P: "15:00000800dfe0fff0787878387818781878187818781078007f807f0078007800780078007000e000c0000000",
  Q: "15:0000000007f00ff8007c307c313c711c711c711c729c739c711c711c711c791c78187cd03fe01ff00038001c",
  R: "15:00000800dfe0fff0787878387818781878187818780078007f807fc079e078e078707878703c601800000000",
  S: "14:0000000007f00ff8107030003000300038003e001fc00ff000f8007800380018001838107fc03fc000000000",
  T: "15:000000803ffc7ff803800380038003800380038003800380038003800380038003800380038007000e000000",
  U: "15:00000000d80cf81c783c783c783c783c783c783c783c783c783c783c783c7c3c3c3c3e3c1ff80ff00f800000",
  V: "15:00000000d008f01870187018701870187018701870187018701878187c107e003e001f000f80070000000000",
  W: "19:0000010000f061870e3871e3871e3871e3871e3871e3871e3871e3871e3871e3879e3879f307df303ffa01f7e01e3c00c3800810000000",
  X: "15:00000000100c381c3c381c301e700e6007e007c0038003c003c007e00ee00c701c7018383838301000000000",
  Y: "15:00000008d818f8387838783878387838783878387c387c383ff81ff80fb80038003800380038003003e007c0",
  Z: "14:000000003ff87ffc001c00380070006000e001c007c00fc0070006000e001c00180038003ff83ff800000000",
  "0": "13:0000000007e00fe011f030f0707070707070707070707070707070707070707078607c403f803f0000000000",
  "1": "11:0000200600e00e00e00e00e00e00e00e00e00e00e00e00e00e00e00e03f8080000",
  "2": "13:0000000007e00ff0107020300030003000200040000000000000000000000000000020003ff03ff000000000",
  "3": "13:000000001f803fc000e00060006000600040000007c007e000f0007000300030003030207f801f0000000000",
  "4": "14:000000100030007000f001f003f0037007700e700c701c70387030707ff80070007000700070006000400000",
  "5": "13:000000000ff01fc0100030003000300030003fc03fe000f00070003000300030003030207f803f0000000000",
  "6": "13:0000000007e00fe010e03000300070007000700077e077f07070703070307030703078203fc01f8000000000",
  "7": "13:000000003ff87ff00010003000200060006000c000c000c00180018001800300030003000600040000000000",
  "8": "13:00000000078007c018c018c018c018c01c001e000f00078001e010e030603060306038403f001f0000000000",
  "9": "13:0000000007c00fe020f0207060306030703078307ff03f300030003000300030002018403f801f0000000000",
  "&": "15:000000000f801f8031c031c030803180390038001c000e000700238023c861f070f070783ebc1f1800000000",
  ".": "4:000000000000000004f640",
  "-": "8:000000000000000000003e7c00000000000000000000",
  "'": "4:0026640000000000000000",
  "!": "6:00001838787878787878787878706000000030300000",
};
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
];
export const WHF_ROWS = 22;
export const WHF_SPAN = 0.28;
export function whfDecode(packed: string) {
  const i = packed.indexOf(":"),
    w = parseInt(packed.slice(0, i), 10),
    hex = packed.slice(i + 1),
    nd = (w + 3) >> 2;
  const rows: string[] = [];
  for (let r = 0; r < WHF_ROWS; r++) {
    const v = parseInt(hex.slice(r * nd, (r + 1) * nd) || "0", 16);
    let s = "";
    for (let c = 0; c < w; c++) s += (v >> (nd * 4 - 1 - c)) & 1 ? "#" : ".";
    rows.push(s);
  }
  return { w, rows };
}
export function whfPack(rows: string[]) {
  const w = rows[0]?.length || 0,
    nd = (w + 3) >> 2;
  let hex = "";
  for (let r = 0; r < WHF_ROWS; r++) {
    let v = 0;
    for (let c = 0; c < nd * 4; c++)
      v = (v << 1) | (rows[r]?.[c] === "#" ? 1 : 0);
    hex += v.toString(16).padStart(nd, "0");
  }
  return w + ":" + hex;
}
export function whfCompose(
  word: string,
  glyphs: Record<string, string>,
  tracking: number,
) {
  const cells: number[] = [],
    gap = Math.max(0, Math.round(tracking));
  let x = 0;
  for (const ch of Array.from(word.toUpperCase())) {
    if (ch === " ") {
      x += 6 + gap;
      continue;
    }
    if (!glyphs[ch]) continue;
    const g = whfDecode(glyphs[ch]);
    g.rows.forEach((row, r) => {
      for (let c = 0; c < g.w; c++) if (row[c] === "#") cells.push(x + c, r);
    });
    x += g.w + gap;
  }
  return { cols: Math.max(0, x - gap), cells };
}
export function whfBlocks(cells: number[], level: number) {
  const seen = new Set<string>(),
    out: number[] = [];
  for (let i = 0; i < cells.length; i += 2) {
    const bx = Math.floor(cells[i] / level),
      by = Math.floor(cells[i + 1] / level),
      k = bx + "," + by;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(bx, by);
    }
  }
  return out;
}
export function whfDissolve(y: number, start: number, span: number) {
  const t = Math.min(
    1,
    Math.max(
      0,
      (y - Math.min(0.95, Math.max(0, start))) / Math.max(0.02, span),
    ),
  );
  const e = t * t * (3 - 2 * t);
  return e * e * (3 - 2 * e);
}
export function whfHash(i: number, b: number) {
  let h = (Math.imul(i, 374761393) + Math.imul(b, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
export function whfCoord(x: number, y: number, w: number, h: number) {
  return (
    String.fromCharCode(
      65 + Math.min(15, Math.max(0, Math.floor((x / Math.max(1, w)) * 16))),
    ) +
    (Math.min(8, Math.max(0, Math.floor((y / Math.max(1, h)) * 9))) + 1)
  );
}
export function whfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h =
    m[1].length === 3
      ? m[1]
          .split("")
          .map((c) => c + c)
          .join("")
      : m[1];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
export function whfSwash(W: number, H: number, over: number) {
  const o = Math.max(0, over);
  const p = (x: number, y: number) =>
    `${(x * W).toFixed(1)} ${(y * H).toFixed(1)}`;
  const l = (x: number, y: number) =>
    `${(x * o).toFixed(1)} ${(y * H).toFixed(1)}`;
  const r = (x: number, y: number) =>
    `${(W + x * o).toFixed(1)} ${(y * H).toFixed(1)}`;
  return `M ${l(-1, 0.84)} C ${l(-0.3, 1.08)} ${l(1.1, 1.04)} ${l(0.85, 0.72)} C ${l(0.7, 0.5)} ${l(-0.55, 0.44)} ${l(-0.4, 0.62)} C ${l(-0.25, 0.82)} ${p(0.2, 0.92)} ${p(0.42, 0.66)} C ${p(0.58, 0.46)} ${p(0.72, 0.1)} ${p(0.86, 0.16)} C ${p(0.98, 0.21)} ${p(0.9, 0.44)} ${p(0.8, 0.36)} C ${p(0.73, 0.3)} ${p(0.84, 0.04)} ${r(0, 0.18)} C ${r(0.85, 0.27)} ${r(0.98, 0.52)} ${r(0.35, 0.72)}`;
}

const WHF_CSS = `
.whf-root { position:relative;width:100%;overflow:hidden;isolation:isolate;container-type:inline-size;background:var(--whf-bg);color:var(--whf-ink);font-family:var(--whf-font);-webkit-font-smoothing:antialiased;--whf-pad:clamp(18px,3.2vw,48px);--whf-ease:cubic-bezier(.65,0,.2,1);min-height:760px; }
.whf-root,.whf-root * { box-sizing:border-box; }
.whf-picture { position:absolute;left:0;top:0;width:100%;overflow:hidden;z-index:0; }
.whf-picture img { position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;filter:saturate(.92) contrast(1.04); }
.whf-tint { position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,color-mix(in srgb,var(--whf-bg) 55%,transparent) 70%); }
.whf-picture .whf-cutout { filter:none;z-index:1;pointer-events:none;clip-path:inset(0 0 100% 0);transition:clip-path 1.1s linear .1s; }
.whf-root.is-in .whf-picture .whf-cutout { clip-path:inset(0); }
.whf-dither { position:absolute;left:0;top:0;image-rendering:pixelated;display:block;max-width:none; }
.whf-grain { position:absolute;inset:0;width:100%;height:100%;display:block;max-width:none;z-index:2;pointer-events:none;mix-blend-mode:overlay; }
.whf-marks { position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;overflow:visible;display:block; }
.whf-marks text { font-family:var(--whf-mono);font-size:9px;letter-spacing:.14em;fill:var(--whf-ink); }
.whf-marks .whf-fade { opacity:0;transition:opacity .6s var(--whf-ease);transition-delay:var(--d,0s); }
.whf-root.is-in .whf-marks .whf-fade { opacity:1; }
.whf-word { position:absolute;left:0;top:0;display:block;max-width:none;z-index:4; }
.whf-swash { position:absolute;left:0;top:0;overflow:visible;z-index:5;pointer-events:none;display:block; }
.whf-swash path { fill:none;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1; }
.whf-swash .whf-cut { stroke:var(--whf-bg);stroke-width:5.5; }
.whf-swash .whf-pen { stroke:var(--whf-ink);stroke-width:1.35; }
.whf-root.is-in .whf-swash path { stroke-dashoffset:0;transition:stroke-dashoffset 1.25s var(--whf-ease) .95s; }
.whf-vert,.whf-foot { font-size:10px;line-height:1.55;letter-spacing:.16em;text-transform:uppercase; }
.whf-vert { position:absolute;top:44%;height:32%;z-index:6;margin:0;max-width:8em;display:flex;gap:.7em;writing-mode:vertical-rl;overflow:hidden;opacity:.9; }
.whf-vert.whf-l { left:var(--whf-pad);transform:rotate(180deg); }
.whf-vert.whf-r { right:var(--whf-pad); }
.whf-wipe { clip-path:inset(0 100% 0 0);transition:clip-path .7s var(--whf-ease);transition-delay:var(--d,0s); }
.whf-vert.whf-wipe { clip-path:inset(100% 0 0 0); }
.whf-root.is-in .whf-wipe { clip-path:inset(0); }
.whf-foot { position:absolute;left:0;right:0;bottom:0;z-index:6;padding:0 var(--whf-pad) 18px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) auto;column-gap:20px;align-items:start; }
.whf-col h3 { margin:0 0 .25em;font:inherit;opacity:.65; }
.whf-col ul { list-style:none;margin:0;padding:0; }
.whf-col a,.whf-up { color:inherit;text-decoration:none;opacity:.9;background:none;border:0;padding:0;cursor:pointer;font:inherit;letter-spacing:inherit;text-transform:inherit;background-image:linear-gradient(currentColor,currentColor);background-size:0% 1px;background-repeat:no-repeat;background-position:0 100%;transition:opacity .25s ease,background-size .35s var(--whf-ease);overflow-wrap:anywhere; }
.whf-col a:hover,.whf-up:hover { opacity:1;background-size:100% 1px; }
.whf-col a:focus-visible,.whf-up:focus-visible { outline:1px solid currentColor;outline-offset:3px;opacity:1; }
.whf-up { justify-self:end;white-space:nowrap;display:flex;align-items:center;gap:.6em; }
.whf-up svg { width:12px;height:12px;transition:transform .35s var(--whf-ease); }
.whf-up:hover svg { transform:translateY(-2px); }
.whf-legal { grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:20px;align-items:end;margin-top:18px;padding-top:11px;border-top:1px dotted color-mix(in srgb,var(--whf-ink) 38%,transparent);font-size:9.5px;letter-spacing:.12em;text-transform:none;line-height:1.55; }
.whf-legal p { margin:0;opacity:.8; }
.whf-sig { display:flex;align-items:center;flex-wrap:wrap;gap:12px; }
.whf-sig svg { width:14px;height:14px;display:block;opacity:.85;flex-shrink:0; }
.whf-sig span { opacity:.8; }
.whf-sr { position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap; }
@container (max-width:960px) { .whf-foot { grid-template-columns:repeat(4,minmax(0,1fr));row-gap:14px; }.whf-up { grid-column:1/-1;justify-self:start; } }
@container (max-width:720px) { .whf-vert { display:none; }.whf-foot { grid-template-columns:repeat(2,minmax(0,1fr));padding-bottom:20px; }.whf-legal { grid-template-columns:minmax(0,1fr);margin-top:10px; }.whf-marks .whf-tick text { display:none; } }
@media (prefers-reduced-motion:reduce) { .whf-root .whf-fade,.whf-root .whf-wipe,.whf-root .whf-swash path,.whf-root a,.whf-root button,.whf-root button svg,.whf-root .whf-cutout { transition:none!important; } }
`;

export default function WildHuntFooter({
  wordmark = "HUGINN",
  image = DEFAULT_IMAGE,
  imageHeight = 0.62,
  dissolve = 0.4,
  tagline = "Thought flies out at dawn · over the whole of the world · and is back by supper",
  sideNote = "Founded 2019 · Oslo & Reykjavík · a studio for slow software",
  columns = DEFAULT_COLUMNS,
  colophon = "Painting: Peter Nicolai Arbo, Åsgårdsreien, 1872. Public domain, via Wikimedia Commons.",
  legal = "© 2026 Huginn Studio",
  backToTop = true,
  sigils = true,
  preset = "vermilion",
  palette,
  tracking = 2,
  grain = 0.6,
  interactive = true,
  fontFamily = SANS_STACK,
  monoFamily = MONO_STACK,
  height = "min(100svh, 920px)",
  className = "",
}: WildHuntFooterProps) {
  const colors = { ...PRESETS[preset], ...palette };
  const rootRef = React.useRef<HTMLElement>(null);
  const pictureRef = React.useRef<HTMLDivElement>(null);
  const ditherRef = React.useRef<HTMLCanvasElement>(null);
  const wordRef = React.useRef<HTMLCanvasElement>(null);
  const grainRef = React.useRef<HTMLCanvasElement>(null);
  const marksRef = React.useRef<SVGSVGElement>(null);
  const swashRef = React.useRef<SVGSVGElement>(null);
  const footRef = React.useRef<HTMLDivElement>(null);
  const hasCutout = !!image.cutout;
  const opts = React.useRef({
    colors,
    wordmark,
    imageHeight,
    dissolve,
    tracking,
    grain,
    interactive,
    fontFamily,
    hasCutout,
  });
  opts.current = {
    colors,
    wordmark,
    imageHeight,
    dissolve,
    tracking,
    grain,
    interactive,
    fontFamily,
    hasCutout,
  };
  const key = [
    wordmark,
    imageHeight,
    dissolve,
    tracking,
    grain,
    colors.background,
    colors.ink,
    fontFamily,
    hasCutout,
  ].join("|");

  React.useEffect(() => {
    const root = rootRef.current,
      picture = pictureRef.current,
      dcv = ditherRef.current,
      wcv = wordRef.current,
      gcv = grainRef.current,
      marks = marksRef.current,
      swash = swashRef.current;
    if (!root || !picture || !dcv || !wcv || !gcv || !marks || !swash) return;
    const dctx = dcv.getContext("2d"),
      wctx = wcv.getContext("2d"),
      gctx = gcv.getContext("2d");
    if (!dctx || !wctx || !gctx) {
      root.classList.add("is-in");
      return;
    }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    const q = (sel: string) => marks.querySelector<SVGElement>(sel);
    const circleA = q(".whf-ca"),
      circleB = q(".whf-cb"),
      guideL = q(".whf-gl"),
      guideR = q(".whf-gr"),
      ticks = q(".whf-tick"),
      ret = q(".whf-ret"),
      retH = q(".whf-rh"),
      retV = q(".whf-rv"),
      retC = q(".whf-rc"),
      retT = q(".whf-rt"),
      sweepLine = q(".whf-sl");
    const paths = Array.from(swash.querySelectorAll("path"));
    let w = 0,
      h = 0,
      dpr = 1,
      bandH = 0,
      pixel = 4,
      dcols = 0,
      drows = 0,
      cell = 8,
      cols = 0;
    let dimg: ImageData | null = null,
      wob = new Float32Array(0),
      cells: number[] = [];
    let blocks: Record<number, number[]> = {},
      box = { x: 0, y: 0, w: 0, h: 0 };
    let px = -1e5,
      py = -1e5,
      inside = false,
      heat = 0,
      heatAt = 0,
      t0 = -1,
      sweepAt = -1e9,
      raf = 0,
      visible = false,
      awake = true,
      alive = true;
    const bg = whfHex(opts.current.colors.background) || [226, 40, 27];
    const fallback: Record<string, string> = {};
    const smooth = (t: number) =>
      t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
    const set = (
      el: Element | null,
      attrs: Record<string, string | number>,
    ) => {
      if (el) for (const k in attrs) el.setAttribute(k, String(attrs[k]));
    };
    const glyphFor = (ch: string) => {
      if (WHF_GLYPHS[ch]) return WHF_GLYPHS[ch];
      if (fallback[ch]) return fallback[ch];
      const c = document.createElement("canvas");
      c.width = 40;
      c.height = WHF_ROWS;
      const x = c.getContext("2d", { willReadFrequently: true });
      if (!x) return "";
      x.font = "bold 20px " + opts.current.fontFamily;
      x.textBaseline = "alphabetic";
      const width = Math.min(36, Math.ceil(x.measureText(ch).width));
      if (width <= 0) return "";
      x.fillText(ch, 1, 20);
      const d = x.getImageData(0, 0, c.width, c.height).data,
        rows: string[] = [];
      for (let r = 0; r < WHF_ROWS; r++) {
        let s = "";
        for (let cx = 0; cx < width + 2; cx++)
          s += d[(r * c.width + cx) * 4 + 3] > 110 ? "#" : ".";
        rows.push(s);
      }
      return (fallback[ch] = whfPack(rows));
    };
    const layout = () => {
      const o = opts.current,
        rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const narrow = w < 720,
        pad = Math.round(Math.max(18, Math.min(48, w * 0.032)));
      const glyphs: Record<string, string> = {};
      for (const ch of Array.from(o.wordmark.toUpperCase()))
        if (ch !== " " && !glyphs[ch]) glyphs[ch] = glyphFor(ch);
      const composed = whfCompose(o.wordmark, glyphs, o.tracking);
      cols = Math.max(1, composed.cols);
      cells = composed.cells;
      blocks = {
        8: whfBlocks(cells, 8),
        4: whfBlocks(cells, 4),
        2: whfBlocks(cells, 2),
      };
      const footH = footRef.current?.offsetHeight || 0;
      // Reserve space for captions and the word on short screens and at larger text sizes.
      const frac = Math.min(
        0.8,
        Math.max(0.3, narrow ? Math.min(o.imageHeight, 0.5) : o.imageHeight),
      );
      bandH = Math.round(
        Math.min(h * frac, Math.max(100, h - footH - (narrow ? 150 : 180))),
      );
      const redY =
        bandH * (Math.min(0.7, Math.max(0.1, o.dissolve)) + WHF_SPAN);
      const zoneTop = Math.round(
        Math.min(bandH + 8, Math.max(redY + 8, bandH - h * 0.07)),
      );
      const zoneH = Math.max(40, h - footH - 10 - zoneTop),
        sidePad = narrow ? pad : pad + 36;
      cell = Math.max(
        1,
        Math.min(
          (w - sidePad * 2) / cols,
          Math.floor((zoneH * 0.84) / WHF_ROWS),
        ),
      );
      const bw = cols * cell,
        bh = WHF_ROWS * cell;
      box = {
        x: Math.round((w - bw) / 2),
        y: Math.round(zoneTop + (zoneH - bh) * (o.hasCutout ? 0.5 : 0.3)),
        w: bw,
        h: bh,
      };
      picture.style.height = bandH + "px";
      root.querySelectorAll<HTMLElement>(".whf-vert").forEach((el) => {
        el.style.top = zoneTop + 6 + "px";
        el.style.height = Math.max(0, zoneH - 12) + "px";
      });
      pixel = Math.max(3, Math.min(6, Math.round(cell / 2)));
      dcols = Math.ceil(w / pixel);
      drows = Math.ceil(bandH / pixel);
      dcv.width = dcols;
      dcv.height = drows;
      dcv.style.width = dcols * pixel + "px";
      dcv.style.height = drows * pixel + "px";
      dimg = dctx.createImageData(dcols, drows);
      wob = new Float32Array(dcols);
      for (let x = 0; x < dcols; x++) {
        const u = x / dcols;
        wob[x] =
          0.07 * Math.sin(u * 11.3 + 1.7) +
          0.045 * Math.sin(u * 29.1 + 0.4) +
          0.03 * Math.sin(u * 71 + 2.9) +
          0.02 * Math.sin(u * 163 + 0.8);
      }
      const m = 4 * cell;
      wcv.width = Math.round((bw + m * 2) * dpr);
      wcv.height = Math.round((bh + m * 2) * dpr);
      wcv.style.width = bw + m * 2 + "px";
      wcv.style.height = bh + m * 2 + "px";
      wcv.style.transform = `translate(${box.x - m}px,${box.y - m}px)`;
      swash.style.width = bw + "px";
      swash.style.height = bh + "px";
      swash.style.transform = `translate(${box.x}px,${box.y}px)`;
      swash.setAttribute("viewBox", `0 0 ${bw} ${bh}`);
      const d = whfSwash(
        bw,
        bh,
        Math.min(bw * 0.14, 110, Math.max(24, box.x - pad - 8)),
      );
      paths.forEach((p) => p.setAttribute("d", d));
      gcv.width = Math.round(w * dpr);
      gcv.height = Math.round(h * dpr);
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.clearRect(0, 0, w, h);
      if (o.grain > 0) {
        const tile = document.createElement("canvas");
        tile.width = 160;
        tile.height = 160;
        const g = tile.getContext("2d");
        if (g) {
          const id = g.createImageData(160, 160);
          for (let i = 0; i < id.data.length; i += 4) {
            const v = 80 + Math.random() * 175;
            id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
            id.data[i + 3] = Math.random() < 0.55 ? 0 : 255;
          }
          g.putImageData(id, 0, 0);
          const pattern = gctx.createPattern(tile, "repeat");
          if (pattern) {
            gctx.globalAlpha = Math.min(1, o.grain) * 0.5;
            gctx.fillStyle = pattern;
            gctx.fillRect(0, 0, w, h);
          }
        }
        gctx.globalAlpha = Math.min(1, o.grain) * 0.55;
        gctx.fillStyle = "#fff";
        for (let i = 0; i < Math.round((w * h) / 2600); i++)
          gctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        gctx.globalAlpha = 1;
      }
      marks.setAttribute("viewBox", `0 0 ${w} ${h}`);
      set(circleA, { cx: w * 0.085, cy: h * 0.47, r: h * 0.4 });
      set(circleB, { cx: w * 0.87, cy: h * 0.79, r: h * 0.25 });
      const gy1 = box.y - Math.round(cell * 1.6),
        gy2 = box.y + bh + Math.round(cell * 1.4);
      if (guideL) {
        set(guideL, { transform: `translate(0 ${gy1})` });
        set(guideL.querySelector("line"), {
          x1: pad,
          x2: Math.max(pad + 40, box.x - cell * 6),
          y1: 0,
          y2: 0,
        });
        set(guideL.querySelector("rect"), { x: pad - 1.5, y: -1.5 });
      }
      if (guideR) {
        set(guideR, { transform: `translate(0 ${gy2})` });
        set(guideR.querySelector("line"), {
          x1: Math.min(w - pad - 40, box.x + bw + cell * 6),
          x2: w - pad,
          y1: 0,
          y2: 0,
        });
        set(guideR.querySelector("rect"), { x: w - pad - 1.5, y: -1.5 });
      }
      if (ticks) {
        set(ticks, { transform: `translate(${box.x} ${gy1 + 1})` });
        const items = Array.from(ticks.querySelectorAll("g"));
        items.forEach((it, i) =>
          set(it, {
            transform: `translate(${Math.round((i * bw) / items.length)} 0)`,
          }),
        );
      }
      set(retH, { x1: 0, x2: w });
      set(retV, { y1: 0, y2: h });
      set(sweepLine, { x1: 0, x2: w });
    };
    const drawDither = (now: number, t: number) => {
      if (!dimg) return;
      const data = dimg.data,
        start = Math.min(0.7, Math.max(0.1, opts.current.dissolve)),
        scanY = ((t - 60) / 820) * drows * 1.3;
      const sweep = now - sweepAt,
        sweepY = sweep < 760 ? (sweep / 760) * h : -1e4,
        R = Math.max(90, Math.min(220, w * 0.15));
      let i = 0;
      for (let y = 0; y < drows; y++) {
        const yf = (y + 0.5) / drows,
          base = whfDissolve(yf, start, WHF_SPAN),
          yp = (y + 0.5) * pixel;
        let fr =
          t < 0 ? 1 : Math.max(base, 1 - smooth((scanY - y) / (drows * 0.32)));
        if (sweepY > -1e3) {
          const back = sweepY - yp;
          if (back > 0 && back < 72) fr = Math.max(fr, 1 - back / 72);
        }
        for (let x = 0; x < dcols; x++, i += 4) {
          let f = fr;
          if (t >= 0 && fr === base)
            f = whfDissolve(yf + wob[x], start, WHF_SPAN);
          if (heat > 0.001 && inside && !reduced) {
            const dist = Math.hypot((x + 0.5) * pixel - px, yp - py);
            if (dist < R) f -= heat * smooth(1 - dist / R) * 0.98;
          }
          const on =
            (BAYER[(x & 7) | ((y & 7) << 3)] + 0.5) * 0.78 +
              whfHash(x + y * 4099, 0) * 14 <
            f * 64;
          data[i] = bg[0];
          data[i + 1] = bg[1];
          data[i + 2] = bg[2];
          data[i + 3] = on ? 255 : 0;
        }
      }
      dctx.putImageData(dimg, 0, 0);
    };
    const drawWord = (now: number, t: number) => {
      const m = 4 * cell;
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wctx.clearRect(0, 0, wcv.width, wcv.height);
      if (t < 230) return;
      wctx.fillStyle = opts.current.colors.ink;
      const level = t < 430 ? 8 : t < 630 ? 4 : t < 830 ? 2 : 1;
      if (level > 1) {
        const b = blocks[level];
        for (let i = 0; i < b.length; i += 2)
          wctx.fillRect(
            m + b[i] * level * cell,
            m + b[i + 1] * level * cell,
            level * cell,
            level * cell,
          );
        return;
      }
      const sweep = now - sweepAt,
        sweepY = sweep < 760 ? (sweep / 760) * h - box.y : -1e4,
        bucket = Math.floor(now / 70),
        R = Math.max(70, Math.min(160, w * 0.1));
      const lx = px - box.x,
        ly = py - box.y,
        blink = t < 1080 ? ((1080 - t) / 250) * 0.4 : 0;
      for (let i = 0; i < cells.length; i += 2) {
        const cx = cells[i],
          cy = cells[i + 1],
          yp = (cy + 0.5) * cell;
        if (sweepY > -1e3 && yp < sweepY && yp > sweepY - 90) continue;
        let dx = 0,
          dy = 0;
        if (heat > 0.001 && !reduced) {
          const dist = Math.hypot((cx + 0.5) * cell - lx, yp - ly);
          if (dist < R) {
            const k = heat * (1 - dist / R),
              r1 = whfHash(i, bucket),
              r2 = whfHash(i + 7919, bucket);
            if (r1 < 0.1 * k) continue;
            dx = Math.round((r1 * 2 - 1) * 2.4 * k);
            dy = Math.round((r2 * 2 - 1) * 1.6 * k);
          }
        }
        if (blink > 0 && whfHash(i, bucket) < blink) continue;
        if (dx || dy) {
          wctx.globalAlpha = 0.22;
          wctx.fillRect(m + cx * cell, m + cy * cell, cell, cell);
          wctx.globalAlpha = 1;
        }
        wctx.fillRect(m + (cx + dx) * cell, m + (cy + dy) * cell, cell, cell);
      }
      if (sweepY > -1e3) {
        const b = blocks[4];
        for (let i = 0; i < b.length; i += 2) {
          const yp = (b[i + 1] + 0.5) * 4 * cell;
          if (yp < sweepY && yp > sweepY - 90)
            wctx.fillRect(
              m + b[i] * 4 * cell,
              m + b[i + 1] * 4 * cell,
              4 * cell,
              4 * cell,
            );
        }
      }
    };
    const draw = (now: number) => {
      const t = t0 < 0 ? -1 : reduced ? 1e9 : Math.max(0, now - t0);
      const target = inside && opts.current.interactive && !reduced ? 1 : 0,
        dt = Math.min(0.05, (now - heatAt) / 1000);
      heatAt = now;
      heat += (target - heat) * Math.min(1, dt * (target ? 9 : 6));
      if (Math.abs(target - heat) < 0.01) heat = target;
      drawDither(now, t);
      drawWord(now, t);
      const sweep = now - sweepAt;
      if (sweep < 760)
        set(sweepLine, {
          y1: (sweep / 760) * h,
          y2: (sweep / 760) * h,
          opacity: 0.9 * (1 - sweep / 760),
        });
      else set(sweepLine, { opacity: 0 });
      awake = (t >= 0 && t < 1200) || heat > 0 || sweep < 760;
    };
    const loop = () => {
      raf = 0;
      if (!visible || document.hidden || !alive) return;
      draw(performance.now());
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (!raf && visible && !document.hidden && alive)
        raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      if (!opts.current.interactive || reduced || e.pointerType === "touch")
        return;
      const b = root.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      inside = true;
      set(ret, { opacity: 1 });
      set(retH, { transform: `translate(0 ${py.toFixed(1)})` });
      set(retV, { transform: `translate(${px.toFixed(1)} 0)` });
      set(retC, { transform: `translate(${px.toFixed(1)} ${py.toFixed(1)})` });
      if (retT) {
        const right = px > w - 180;
        set(retT, {
          transform: `translate(${(px + (right ? -14 : 14)).toFixed(1)} ${(py - 10).toFixed(1)})`,
          "text-anchor": right ? "end" : "start",
        });
        retT.textContent =
          whfCoord(px, py, w, h) +
          " · " +
          String(Math.round(px)).padStart(4, "0") +
          "," +
          String(Math.round(py)).padStart(4, "0");
      }
      wake();
    };
    const onLeave = () => {
      inside = false;
      set(ret, { opacity: 0 });
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (
        !opts.current.interactive ||
        reduced ||
        (e.target instanceof Element && e.target.closest("a,button"))
      )
        return;
      sweepAt = performance.now();
      wake();
    };
    const onMotion = () => {
      reduced = motionQuery.matches;
      heat = 0;
      inside = false;
      sweepAt = -1e9;
      set(ret, { opacity: 0 });
      wake();
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else wake();
    };
    layout();
    heatAt = performance.now();
    draw(performance.now());
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    motionQuery.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(root);
    if (footRef.current) ro.observe(footRef.current);
    const io = new IntersectionObserver(
      (entries) => {
        const en = entries[0];
        visible = en?.isIntersecting ?? true;
        // A fixed 28% ratio can be unreachable for a tall footer on a short viewport.
        if (visible && t0 < 0) {
          t0 = performance.now();
          root.classList.add("is-in");
        }
        if (visible) wake();
        else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(root);
    document.fonts?.ready.then(() => {
      if (alive) {
        layout();
        wake();
      }
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      motionQuery.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      root.classList.remove("is-in");
    };
  }, [key]);

  const delay = (value: string): React.CSSProperties =>
    ({ "--d": value }) as React.CSSProperties;
  const toTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  return (
    <footer
      ref={rootRef}
      className={"whf-root " + className}
      style={
        {
          height,
          "--whf-bg": colors.background,
          "--whf-ink": colors.ink,
          "--whf-font": fontFamily,
          "--whf-mono": monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{WHF_CSS}</style>
      <div
        className="whf-picture"
        ref={pictureRef}
        role={image.alt ? "img" : undefined}
        aria-label={image.alt}
        aria-hidden={image.alt ? undefined : true}
      >
        <img
          src={image.src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ objectPosition: image.position || "50% 26%" }}
        />
        <div className="whf-tint" />
        <canvas className="whf-dither" ref={ditherRef} />
        {image.cutout && (
          <img
            className="whf-cutout"
            src={image.cutout}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{ objectPosition: image.position || "50% 26%" }}
          />
        )}
      </div>
      <canvas className="whf-grain" ref={grainRef} aria-hidden="true" />
      <svg
        className="whf-marks"
        ref={marksRef}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle
          className="whf-ca whf-fade"
          strokeDasharray="1.5 5"
          opacity=".55"
          style={delay(".2s")}
        />
        <circle
          className="whf-cb whf-fade"
          strokeDasharray="1.5 5"
          opacity=".55"
          style={delay(".5s")}
        />
        <g className="whf-gl whf-fade" style={delay(".7s")}>
          <line strokeDasharray="1 3" />
          <rect width="3" height="3" fill="currentColor" stroke="none" />
        </g>
        <g className="whf-gr whf-fade" style={delay(".9s")}>
          <line strokeDasharray="1 3" />
          <rect width="3" height="3" fill="currentColor" stroke="none" />
        </g>
        <g className="whf-tick whf-fade" style={delay("1.1s")}>
          {["A1", "B2", "C3", "D4", "E5", "F6"].map((l) => (
            <g key={l}>
              <line x1="0" y1="-4" x2="0" y2="0" />
              <text x="5" y="-1">
                {l}
              </text>
            </g>
          ))}
        </g>
        <line className="whf-sl" opacity="0" />
        <g className="whf-ret" opacity="0">
          <line
            className="whf-rh"
            y1="0"
            y2="0"
            strokeDasharray="1 3"
            opacity=".6"
          />
          <line
            className="whf-rv"
            x1="0"
            x2="0"
            strokeDasharray="1 3"
            opacity=".6"
          />
          <g className="whf-rc">
            <circle r="7" />
            <line x1="-11" x2="-7" y1="0" y2="0" />
            <line x1="7" x2="11" y1="0" y2="0" />
            <line y1="-11" y2="-7" x1="0" x2="0" />
            <line y1="7" y2="11" x1="0" x2="0" />
          </g>
          <text className="whf-rt" />
        </g>
      </svg>
      <canvas className="whf-word" ref={wordRef} aria-hidden="true" />
      <svg className="whf-swash" ref={swashRef} aria-hidden="true">
        <path className="whf-cut" pathLength={1} />
        <path
          className="whf-pen"
          pathLength={1}
          transform="translate(1.6 -1.6)"
        />
        <path
          className="whf-pen"
          pathLength={1}
          transform="translate(.8 -.8)"
        />
        <path className="whf-pen" pathLength={1} />
      </svg>
      <span className="whf-sr">{wordmark}</span>
      {tagline && (
        <p className="whf-vert whf-l whf-wipe" style={delay(".6s")}>
          <span>{tagline}</span>
        </p>
      )}
      {sideNote && (
        <p className="whf-vert whf-r whf-wipe" style={delay(".8s")}>
          <span>{sideNote}</span>
        </p>
      )}
      <div className="whf-foot" ref={footRef}>
        {columns.map((col, i) => (
          <nav
            className="whf-col whf-wipe"
            key={col.title}
            aria-label={col.title}
            style={delay(0.5 + i * 0.08 + "s")}
          >
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href || "#"}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        {backToTop ? (
          <button
            type="button"
            className="whf-up whf-wipe"
            onClick={toTop}
            style={delay(".9s")}
          >
            <ArrowUp aria-hidden="true" />
            Back to top
          </button>
        ) : (
          <span />
        )}
        <div className="whf-legal whf-wipe" style={delay("1s")}>
          <div className="whf-sig">
            {sigils && (
              <>
                <Sun aria-hidden="true" strokeWidth={1} />
                <CircleDashed aria-hidden="true" strokeWidth={1} />
              </>
            )}
            <span>{legal}</span>
          </div>
          <p>{colophon}</p>
        </div>
      </div>
    </footer>
  );
}
