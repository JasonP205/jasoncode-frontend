import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

/**
 * Shared Open Graph / Twitter card renderer (1200×630, satori via next/og).
 *
 * Same language as the site: a navy (#09318D) card with a faint grid, paper
 * (#FCFFFF) type, and pink (#FD91CC) for the one accent — the headline's
 * payoff and a hairline. On the right: the logo's three plates, or a project
 * screenshot in a browser window. Copy comes from the `og` message namespace;
 * Vietnamese needs a real Be Vietnam Pro TTF (satori cannot read the woff2
 * that next/font ships), kept in `./fonts`.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const NAVY = "#09318d";
const NAVY_DEEP = "#061f5c";
const PAPER = "#fcffff";
const PINK = "#fd91cc";
const MUTED = "#b9c6ea";

export interface OgInput {
  eyebrow: string;
  /** Plain part of the headline; `\n` breaks the line. */
  title: string;
  /** Gradient part, appended to the last line. */
  accent?: string;
  subtitle?: string;
  /** Legacy (six stones); ignored. */
  tone?: number;
  /** A file under /public (e.g. a project screenshot) shown on the right. */
  image?: string;
}

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** The logo's three plates (navy, light navy, pink on top) at `scale`. */
function platesSvg(scale: number, lightBase: boolean) {
  const base = lightBase ? ["#8fa3db", "#c9d4f2"] : ["#06225f", NAVY];
  const plates = [
    { y: 30, edge: base[0], face: base[1] },
    { y: 17, edge: "#3b5aa8", face: "#7e94c9" },
    { y: 4, edge: "#c26aa8", face: PINK },
  ];
  const body = plates
    .map(
      ({ y, edge, face }) =>
        `<g stroke-linejoin="round" stroke-width="2.5"><path d="M6 ${y + 13} L32 ${y + 26} L58 ${y + 13} L58 ${y + 18} L32 ${y + 31} L6 ${y + 18} Z" fill="${edge}" stroke="${edge}"/><path d="M32 ${y} L58 ${y + 13} L32 ${y + 26} L6 ${y + 13} Z" fill="${face}" stroke="${face}"/></g>`,
    )
    .join("");
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${64 * scale}" height="${64 * scale}">${body}</svg>`,
  );
}

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 700; style: "normal" }[]> | null = null;
function loadFonts() {
  fonts ??= Promise.all(
    (
      [
        ["Medium", 500],
        ["Bold", 700],
      ] as const
    ).map(async ([file, weight]) => ({
      name: "Be Vietnam Pro",
      data: await readFile(join(process.cwd(), "src/lib/og/fonts", `BeVietnamPro-${file}.ttf`)),
      weight,
      style: "normal" as const,
    })),
  );
  return fonts;
}

async function publicImage(path: string) {
  const mime = extname(path).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
  const data = await readFile(join(process.cwd(), "public", path));
  return `data:${mime};base64,${data.toString("base64")}`;
}

export async function renderOg({ eyebrow, title, accent, subtitle, image }: OgInput) {
  const [fontData, shot] = await Promise.all([loadFonts(), image ? publicImage(image) : null]);
  const lines = title.split("\n");
  // Size the headline to its longest line (bold ≈ 0.6em per character) so
  // two-line titles never wrap into a third line.
  const lastLine = lines[lines.length - 1] + (accent ?? "");
  const longest = Math.max(...lines.slice(0, -1).map((l) => l.length), lastLine.length, 1);
  const textWidth = (image ? 640 : 700) - 72;
  const fontSize = Math.max(44, Math.min(80, Math.floor(textWidth / (0.6 * longest))));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Be Vietnam Pro",
          color: PAPER,
          backgroundColor: NAVY,
          backgroundImage: [
            `radial-gradient(circle at 92% 8%, rgba(253,145,204,0.28), transparent 38%)`,
            `linear-gradient(160deg, ${NAVY} 30%, ${NAVY_DEEP})`,
          ].join(", "),
        }}
      >
        {/* Grid. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(252,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(252,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Right: a project screenshot in a window, or the logo's plates. */}
        {shot ? (
          <div
            style={{
              position: "absolute",
              right: -40,
              top: 110,
              width: 600,
              display: "flex",
              flexDirection: "column",
              borderRadius: 22,
              overflow: "hidden",
              backgroundColor: PAPER,
              border: "2px solid rgba(252,255,255,0.35)",
              boxShadow: "0 40px 90px -20px rgba(0,0,0,0.6)",
              transform: "rotate(-4deg)",
            }}
          >
            <div style={{ display: "flex", gap: 8, padding: "12px 16px", backgroundColor: PAPER }}>
              {[PINK, "#d5dcef", "#d5dcef"].map((c, i) => (
                <div key={i} style={{ display: "flex", width: 12, height: 12, borderRadius: 999, backgroundColor: c }} />
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot} width={600} height={360} style={{ objectFit: "cover", objectPosition: "top" }} alt="" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={platesSvg(7, true)} width={448} height={448} style={{ position: "absolute", right: 60, top: 92 }} alt="" />
        )}

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: shot ? 640 : 700,
            height: "100%",
            padding: "64px 0 56px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={platesSvg(0.75, true)} width={48} height={48} alt="" />
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
              Jason Dev
              <span style={{ color: PINK }}>.</span>
            </div>
          </div>

          <div style={{ display: "flex", flexGrow: 1 }} />

          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 24,
                fontWeight: 500,
                color: PAPER,
                padding: "8px 20px 8px 16px",
                borderRadius: 999,
                backgroundColor: "rgba(252,255,255,0.08)",
                border: "1.5px solid rgba(252,255,255,0.18)",
                marginBottom: 22,
              }}
            >
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, backgroundColor: PINK }} />
              {eyebrow}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize,
              fontWeight: 700,
              lineHeight: 1.16,
              letterSpacing: -fontSize * 0.03,
            }}
          >
            {lines.map((line, i) => (
              <div key={i} style={{ display: "flex", flexWrap: "wrap" }}>
                {line && <span style={{ whiteSpace: "pre" }}>{line}</span>}
                {i === lines.length - 1 && accent && <span style={{ color: PINK }}>{accent}</span>}
              </div>
            ))}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 27,
                fontWeight: 500,
                lineHeight: 1.45,
                color: MUTED,
                maxWidth: shot ? 560 : 620,
              }}
            >
              {subtitle.length > 120 ? `${subtitle.slice(0, 117).trimEnd()}…` : subtitle}
            </div>
          )}

          <div style={{ display: "flex", flexGrow: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, fontWeight: 500, color: MUTED }}>
            <div style={{ display: "flex", width: 56, height: 3, borderRadius: 2, backgroundColor: PINK }} />
            hwagfu.dev
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fontData },
  );
}
