import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

/**
 * Shared Open Graph / Twitter card renderer (1200×630, satori via next/og).
 *
 * Same language as the site: ink-blue night, the five-layer stack (or a
 * project screenshot), and the six timeline stones on a line of time. Copy
 * comes from the `og` message namespace; Vietnamese needs a real Be Vietnam
 * Pro TTF (satori cannot read the woff2 that next/font ships), kept in
 * `./fonts`.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

/** Dark-theme tones: blue, purple, green, orange, pink + the sixth stone. */
const TONES = ["#2997ff", "#b58cff", "#34d399", "#fb923c", "#f472b6", "#fcd34d"];
const LIGHT = ["#8cc4ff", "#dcc6ff", "#9cf0cc", "#fdc79a", "#fab8da", "#fde9a6"];

export interface OgInput {
  eyebrow: string;
  /** Plain part of the headline; `\n` breaks the line. */
  title: string;
  /** Gradient part, appended to the last line. */
  accent?: string;
  subtitle?: string;
  /** 0–5: colour of the eyebrow and the highlighted stone. */
  tone?: number;
  /** A file under /public (e.g. a project screenshot) shown on the right. */
  image?: string;
}

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const LOGO = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g0" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffa24c"/><stop offset="1" stop-color="#ff4f9a"/></linearGradient><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2ee6a8"/><stop offset="1" stop-color="#22b8ee"/></linearGradient><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f8bff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><g stroke-linejoin="round" stroke-width="2.5"><path d="M6 43 L32 56 L58 43 L58 48 L32 61 L6 48 Z" fill="#d63a7d" stroke="#d63a7d"/><path d="M32 30 L58 43 L32 56 L6 43 Z" fill="url(#g0)" stroke="url(#g0)"/></g><g stroke-linejoin="round" stroke-width="2.5"><path d="M6 30 L32 43 L58 30 L58 35 L32 48 L6 35 Z" fill="#1696b8" stroke="#1696b8"/><path d="M32 17 L58 30 L32 43 L6 30 Z" fill="url(#g1)" stroke="url(#g1)"/></g><g stroke-linejoin="round" stroke-width="2.5"><path d="M6 17 L32 30 L58 17 L58 22 L32 35 L6 22 Z" fill="#5a3fd6" stroke="#5a3fd6"/><path d="M32 4 L58 17 L32 30 L6 17 Z" fill="url(#g2)" stroke="url(#g2)"/></g></svg>`);

/** A cut stone: crown (light), pavilion (tone), one glint. */
function stoneUri(i: number) {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="24,0 76,0 100,34 0,34" fill="${LIGHT[i]}"/><polygon points="0,34 100,34 50,100" fill="${TONES[i]}"/><polygon points="24,0 40,0 30,34 14,34" fill="#ffffff" fill-opacity="0.55"/><polygon points="0,34 50,34 50,100" fill="#000" fill-opacity="0.12"/></svg>`,
  );
}

/** Five isometric plates, top (L0) to bottom (L4), drawn bottom-up. */
function stackUri() {
  const W = 460;
  const H = 230;
  const T = 16;
  const GAP = 70;
  const cx = W / 2 + 10;
  let body = "";
  let defs = "";
  for (let i = 4; i >= 0; i--) {
    const y = 20 + i * GAP;
    defs += `<linearGradient id="t${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${LIGHT[i]}" stop-opacity="0.95"/><stop offset="1" stop-color="${TONES[i]}" stop-opacity="0.9"/></linearGradient>`;
    body += `<path d="M${cx - W / 2} ${y + H / 2} L${cx} ${y + H} L${cx + W / 2} ${y + H / 2} L${cx + W / 2} ${y + H / 2 + T} L${cx} ${y + H + T} L${cx - W / 2} ${y + H / 2 + T} Z" fill="${TONES[i]}" fill-opacity="0.75"/>`;
    body += `<path d="M${cx} ${y} L${cx + W / 2} ${y + H / 2} L${cx} ${y + H} L${cx - W / 2} ${y + H / 2} Z" fill="url(#t${i})" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2" stroke-linejoin="round"/>`;
    if (i === 0) {
      // A hint of an interface on the top layer.
      body += `<path d="M${cx - 60} ${y + 70} L${cx + 60} ${y + 130}" stroke="#ffffff" stroke-opacity="0.85" stroke-width="12" stroke-linecap="round"/>`;
      body += `<path d="M${cx - 110} ${y + 100} L${cx - 10} ${y + 150}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="10" stroke-linecap="round"/>`;
    }
  }
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W + 20} ${20 + 4 * GAP + H + T + 10}"><defs>${defs}</defs>${body}</svg>`,
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

export async function renderOg({ eyebrow, title, accent, subtitle, tone = 0, image }: OgInput) {
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
          color: "#f4f5f8",
          backgroundColor: "#0b0d13",
          backgroundImage: [
            "radial-gradient(circle at 12% 0%, rgba(41,151,255,0.28), transparent 45%)",
            "radial-gradient(circle at 100% 100%, rgba(244,114,182,0.22), transparent 50%)",
            "radial-gradient(circle at 78% 30%, rgba(181,140,255,0.22), transparent 45%)",
          ].join(", "),
        }}
      >
        {/* Dot grid. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1.5px, transparent 1.5px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Right: a project screenshot, or the five-layer stack. */}
        {shot ? (
          <div
            style={{
              position: "absolute",
              right: -40,
              top: 120,
              width: 600,
              height: 380,
              display: "flex",
              borderRadius: 28,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.18)",
              boxShadow: `0 40px 90px -20px rgba(0,0,0,0.8), 0 0 120px -10px ${TONES[tone]}66`,
              transform: "rotate(-5deg)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot} width={600} height={380} style={{ objectFit: "cover", objectPosition: "top" }} alt="" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stackUri()} width={500} height={588} style={{ position: "absolute", right: 30, top: 24 }} alt="" />
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
            <img src={LOGO} width={48} height={48} alt="" />
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
              Jason Dev
              <span style={{ color: TONES[4] }}>.</span>
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: "#8a93a6", marginLeft: 8 }}>
              hwagfu.dev
            </div>
          </div>

          <div style={{ display: "flex", flexGrow: 1 }} />

          <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: TONES[tone], marginBottom: 14 }}>
            {eyebrow}
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
                {i === lines.length - 1 && accent && (
                  <span
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${TONES[0]}, ${TONES[1]} 55%, ${TONES[4]})`,
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {accent}
                  </span>
                )}
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
                color: "#a3abbd",
                maxWidth: shot ? 560 : 620,
              }}
            >
              {subtitle.length > 120 ? `${subtitle.slice(0, 117).trimEnd()}…` : subtitle}
            </div>
          )}

          <div style={{ display: "flex", flexGrow: 1 }} />

          {/* Six stones on the line of time; the page's own stone glows. */}
          <div style={{ display: "flex", position: "relative", alignItems: "center", width: 460, height: 40 }}>
            <div
              style={{
                position: "absolute",
                left: 10,
                right: 10,
                top: 19,
                height: 2,
                display: "flex",
                backgroundImage: `linear-gradient(90deg, ${TONES.join(", ")})`,
                opacity: 0.6,
              }}
            />
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
              {TONES.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    backgroundColor: "#0b0d13",
                    border: `2px solid ${i === tone ? c : "rgba(255,255,255,0.14)"}`,
                    boxShadow: i === tone ? `0 0 26px ${c}` : "none",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stoneUri(i)} width={20} height={20} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fontData },
  );
}
