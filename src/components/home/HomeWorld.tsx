"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { useRouter } from "@/i18n/navigation";
import { play } from "@/lib/sound/engine";
import { isLowPower, pixelRatio } from "@/lib/three/quality";

export interface WorldProject {
  id: string;
  title: string;
  image: string;
}

interface HomeWorldProps {
  projects: WorldProject[];
}

/*
 * One fixed, full-viewport three.js canvas behind the whole home page. The
 * camera follows the scroll position exactly (1 CSS px = 1 world unit × upp at
 * z = 0), so objects at z = 0 travel with the page and objects behind it drift
 * slower — real parallax, not a CSS trick.
 *
 * Sections reserve space for their 3D pieces with `data-world-slot="…"`:
 *   esl       — a swarm of electronic shelf labels that flip to new prices
 *               (what Phuc builds at TOTDigi)
 *   carousel  — a ring of project screenshots; click one to open it
 *   stone-0…5 — six faceted stones on ticking dials (the timeline); they
 *               light as the reader arrives, ride along at the right edge,
 *               and gather round the orb in Contact (stones-ring)
 * Around them: a stream of time — particles flowing down a glowing ribbon from hero to contact with a pulse at
 * the reader's scroll position, wireframe solids at many depths, and dust.
 */

const FOV = 40;
const DIST = 20;

const PRODUCTS = [
  ["Cà phê sữa đá", 29000],
  ["Trà đào cam sả", 35000],
  ["Bánh mì thịt", 25000],
  ["Sữa tươi 1L", 36000],
  ["Nước suối 500ml", 8000],
  ["Gạo ST25 5kg", 189000],
  ["Táo Envy", 129000],
  ["Dầu ăn 1L", 52000],
  ["Mì ly", 12000],
  ["Bột giặt 3kg", 165000],
  ["Snack khoai tây", 22000],
  ["Kem đánh răng", 39000],
] as const;

function cssColor(probe: CanvasRenderingContext2D, name: string, fallback: string) {
  probe.fillStyle = fallback;
  probe.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

function roundedShape(THREE: typeof import("three"), w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** ShapeGeometry with UVs stretched over its bounding box (0…1). */
function faceGeometry(THREE: typeof import("three"), shape: THREE.Shape, w: number, h: number) {
  const geo = new THREE.ShapeGeometry(shape, 10);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + w / 2) / w, (uv.getY(i) + h / 2) / h);
  uv.needsUpdate = true;
  return geo;
}

/** Draw one e-paper price label. */
function drawLabel(canvas: HTMLCanvasElement, index: number, font: string, tone: string) {
  const w = (canvas.width = 512);
  const h = (canvas.height = 320);
  const g = canvas.getContext("2d")!;
  const [name, base] = PRODUCTS[index % PRODUCTS.length];
  const sale = (index * 7) % 3 === 0;
  const price = sale ? Math.round((base * 0.8) / 1000) * 1000 : base;
  const fmt = (n: number) => n.toLocaleString("vi-VN");

  g.fillStyle = "#f1f0e9";
  g.fillRect(0, 0, w, h);
  // Accent strip in the third e-ink colour.
  g.fillStyle = sale ? "#d6322f" : "#1d1d1f";
  g.fillRect(0, 0, w, 54);
  g.fillStyle = "#ffffff";
  g.font = `600 30px ${font}`;
  g.fillText(name, 26, 38);

  g.fillStyle = "#1d1d1f";
  g.font = `800 96px ${font}`;
  g.fillText(fmt(price), 24, 168);
  g.font = `600 40px ${font}`;
  g.fillText("₫", 24 + g.measureText(fmt(price)).width + 18, 168);

  if (sale) {
    g.fillStyle = "#d6322f";
    g.font = `500 30px ${font}`;
    const old = `${fmt(base)} ₫`;
    g.fillText(old, 28, 214);
    const ow = g.measureText(old).width;
    g.fillRect(26, 203, ow + 4, 3);
    g.beginPath();
    g.roundRect(w - 132, 186, 106, 46, 23);
    g.fill();
    g.fillStyle = "#fff";
    g.font = `700 30px ${font}`;
    g.fillText("-20%", w - 116, 220);
  }

  // Barcode.
  g.fillStyle = "#1d1d1f";
  let x = 26;
  for (let i = 0; x < 300; i++) {
    const bw = 2 + ((i * 37 + index * 11) % 5);
    if (i % 2 === 0) g.fillRect(x, 238, bw, 56);
    x += bw;
  }
  g.font = "500 22px ui-monospace, Menlo, monospace";
  g.fillStyle = tone;
  g.fillText("ESL · TOTDigi", w - 196, 294);
}

export default function HomeWorld({ projects }: HomeWorldProps) {
  const host = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    void Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ]).then(([THREE, { RoomEnvironment }]) => {
      if (disposed) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Phones: no MSAA, DPR ≤ 1.25, a third of the particles, cheaper stones.
      const lite = isLowPower();
      const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
      const bin: { dispose: () => void }[] = [];
      const keep = <X extends { dispose: () => void }>(x: X) => (bin.push(x), x);

      const renderer = new THREE.WebGLRenderer({ antialias: !lite, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(pixelRatio(1.5, lite));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 120);
      camera.position.set(0, 0, DIST);
      const amb = new THREE.AmbientLight(0xffffff, 1.4);
      const key = new THREE.DirectionalLight(0xffffff, 1.8);
      key.position.set(6, 10, 14);
      scene.add(amb, key);

      // --- Coordinate mapping -----------------------------------------------
      let upp = 1; // world units per CSS pixel at z = 0
      let vw = window.innerWidth;
      let vh = window.innerHeight;
      let docH = document.documentElement.scrollHeight;
      const worldY = (docY: number) => -(docY - vh / 2) * upp;
      const worldX = (px: number) => (px - vw / 2) * upp;

      interface Slot {
        x: number;
        y: number;
        w: number;
        h: number;
      }
      const slot = (name: string): Slot | null => {
        const node = document.querySelector<HTMLElement>(`[data-world-slot="${name}"]`);
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return {
          x: worldX(r.left + r.width / 2),
          y: worldY(r.top + window.scrollY + r.height / 2),
          w: r.width * upp,
          h: r.height * upp,
        };
      };

      // --- Background: wireframe solids at many depths ----------------------
      const wireGeos = [
        keep(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 0))),
        keep(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1, 0))),
        keep(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.3, 1.3, 1.3))),
        keep(new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(1, 0))),
        keep(new THREE.EdgesGeometry(new THREE.TorusGeometry(0.9, 0.3, 6, 14))),
      ];
      const wireMats = [0, 1, 2, 3, 4].map(() =>
        keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4, depthWrite: false })),
      );
      const wires: { mesh: THREE.LineSegments; docY: number; spin: THREE.Vector3; z: number; xf: number }[] = [];
      const WIRES = lite ? 14 : 34;
      for (let i = 0; i < WIRES; i++) {
        const mesh = new THREE.LineSegments(wireGeos[i % wireGeos.length], wireMats[i % 5]);
        mesh.scale.setScalar(0.6 + Math.random() * 1.8);
        scene.add(mesh);
        wires.push({
          mesh,
          docY: Math.random(),
          spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).multiplyScalar(0.4),
          z: -6 - Math.random() * 26,
          // Keep them to the sides so the copy column stays calm.
          xf: (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.5),
        });
      }

      // --- Dust ---------------------------------------------------------------
      const DUST = lite ? 360 : 1100;
      const dustPos = new Float32Array(DUST * 3);
      const dustSeed = new Float32Array(DUST * 3);
      for (let i = 0; i < DUST; i++) dustSeed.set([Math.random(), Math.random(), Math.random()], i * 3);
      const dustGeo = keep(new THREE.BufferGeometry());
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = glowCanvas.height = 64;
      {
        const g = glowCanvas.getContext("2d")!;
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.3, "rgba(255,255,255,0.7)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
      }
      const glow = keep(new THREE.CanvasTexture(glowCanvas));
      const dustMat = keep(
        new THREE.PointsMaterial({ size: 0.16, map: glow, transparent: true, depthWrite: false, opacity: 0.6 }),
      );
      const dust = new THREE.Points(dustGeo, dustMat);
      scene.add(dust);

      // --- Ribbon ------------------------------------------------------------
      const ribbonMat = keep(
        new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          uniforms: {
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uOpacity: { value: 0.6 },
            uC: { value: [0, 1, 2, 3, 4].map(() => new THREE.Color()) },
          },
          vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: /* glsl */ `
            uniform float uTime;
            uniform float uProgress;
            uniform float uOpacity;
            uniform vec3 uC[5];
            varying vec2 vUv;
            vec3 tone(float x) {
              float s = clamp(x, 0.0, 0.9999) * 4.0;
              int i = int(floor(s));
              float f = fract(s);
              vec3 a = uC[0]; vec3 b = uC[1];
              if (i == 1) { a = uC[1]; b = uC[2]; }
              if (i == 2) { a = uC[2]; b = uC[3]; }
              if (i == 3) { a = uC[3]; b = uC[4]; }
              return mix(a, b, f);
            }
            void main() {
              float pulse = exp(-pow((vUv.x - uProgress) * 22.0, 2.0));
              float dash = smoothstep(0.35, 0.5, fract(vUv.x * 90.0 - uTime * 0.6)) * 0.35;
              float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
              vec3 col = tone(vUv.x) + pulse * 0.6;
              float a = (0.35 + dash + pulse * 1.4) * uOpacity * (0.4 + 0.6 * edge);
              gl_FragColor = vec4(col, a);
            }
          `,
        }),
      );
      let ribbon: THREE.Mesh | null = null;

      // --- ESL swarm ------------------------------------------------------------
      const fontFamily = getComputedStyle(document.body).fontFamily;
      const TAG_W = 1.6;
      const TAG_H = 1;
      const tagShape = roundedShape(THREE, TAG_W, TAG_H, 0.08);
      const tagBody = keep(new THREE.ExtrudeGeometry(tagShape, { depth: 0.09, bevelEnabled: false, curveSegments: 8 }));
      tagBody.translate(0, 0, -0.045);
      const tagFace = keep(faceGeometry(THREE, roundedShape(THREE, TAG_W * 0.9, TAG_H * 0.86, 0.04), TAG_W * 0.9, TAG_H * 0.86));
      const tagBodyMat = keep(new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 }));
      const esl = new THREE.Group();
      scene.add(esl);
      interface Tag {
        holder: THREE.Group;
        faces: { canvas: HTMLCanvasElement; tex: THREE.CanvasTexture; product: number }[];
        flips: number;
        angle: number;
        base: THREE.Vector3;
        phase: number;
        hover: number;
      }
      const tags: Tag[] = [];
      const hitTags: THREE.Object3D[] = [];
      let nextProduct = 18;
      for (let i = 0; i < 9; i++) {
        const holder = new THREE.Group();
        const body = new THREE.Mesh(tagBody, tagBodyMat);
        holder.add(body);
        const faces = [0, 1].map((side) => {
          const canvas = document.createElement("canvas");
          const tex = keep(new THREE.CanvasTexture(canvas));
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = lite ? 2 : 8;
          const mesh = new THREE.Mesh(tagFace, keep(new THREE.MeshBasicMaterial({ map: tex })));
          mesh.position.z = side ? -0.05 : 0.05;
          mesh.rotation.y = side ? Math.PI : 0;
          mesh.userData.tag = i;
          body.userData.tag = i;
          holder.add(mesh);
          hitTags.push(mesh);
          return { canvas, tex, product: side * 9 + i };
        });
        const col = i % 3;
        const row = Math.floor(i / 3);
        const base = new THREE.Vector3(
          (col - 1) * 1.95 + (row % 2 ? 0.45 : -0.2),
          (1 - row) * 1.3,
          (Math.sin(i * 2.1) * 0.9),
        );
        holder.position.copy(base);
        holder.rotation.set(0, -0.35 + col * 0.25, (Math.random() - 0.5) * 0.12);
        esl.add(holder);
        tags.push({ holder, faces, flips: 0, angle: 0, base, phase: Math.random() * 6, hover: 0 });
      }
      const flipTag = (t: Tag) => {
        t.flips += 1;
        // The face about to turn away gets a fresh price once it is hidden.
        const hidden = t.faces[(t.flips + 1) % 2];
        window.setTimeout(() => {
          hidden.product = nextProduct++;
          drawLabel(hidden.canvas, hidden.product, fontFamily, tones[1] ?? "#888");
          hidden.tex.needsUpdate = true;
        }, 700);
      };

      let tones: string[] = [];

      // --- Project carousel ------------------------------------------------------
      const carousel = new THREE.Group();
      scene.add(carousel);
      const PANEL_W = 1.6;
      const PANEL_H = 1.0;
      const panelGeo = keep(faceGeometry(THREE, roundedShape(THREE, PANEL_W, PANEL_H, 0.06), PANEL_W, PANEL_H));
      const panelEdge = keep(new THREE.EdgesGeometry(new THREE.ShapeGeometry(roundedShape(THREE, PANEL_W, PANEL_H, 0.06), 10)));
      const loader = new THREE.TextureLoader();
      interface Panel {
        group: THREE.Group;
        edgeMat: THREE.LineBasicMaterial;
        id: string;
        hover: number;
      }
      const panels: Panel[] = [];
      const hitPanels: THREE.Object3D[] = [];
      const items = projects.length ? projects : [];
      const RING = Math.max(items.length, 5);
      for (let i = 0; i < RING; i++) {
        const p = items[i % Math.max(1, items.length)];
        if (!p) break;
        const tex = keep(
          loader.load(p.image, (t) => {
            // Cover-fit the screenshot into the 16:10 panel, from the top.
            const img = t.image as HTMLImageElement;
            const aspect = img.width / img.height;
            const target = PANEL_W / PANEL_H;
            if (aspect > target) {
              t.repeat.set(target / aspect, 1);
              t.offset.set((1 - target / aspect) / 2, 0);
            } else {
              t.repeat.set(1, aspect / target);
              t.offset.set(0, 1 - aspect / target);
            }
            t.needsUpdate = true;
          }),
        );
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = lite ? 2 : 8;
        const group = new THREE.Group();
        const mesh = new THREE.Mesh(panelGeo, keep(new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide })));
        mesh.userData.panel = i;
        // Panels on the far side of the ring are seen from behind: show the
        // screenshot dimmed rather than an empty frame.
        const back = new THREE.Mesh(
          panelGeo,
          keep(new THREE.MeshBasicMaterial({ map: tex, color: 0x5a5f6e, transparent: true, opacity: 0.85 })),
        );
        back.rotation.y = Math.PI;
        back.position.z = -0.002;
        group.add(back);
        const edgeMat = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 }));
        const edges = new THREE.LineSegments(panelEdge, edgeMat);
        edges.position.z = 0.002;
        group.add(mesh, edges);
        carousel.add(group);
        hitPanels.push(mesh);
        panels.push({ group, edgeMat, id: p.id, hover: 0 });
      }

      // --- Six stones on the stream of time ----------------------------------------
      // Faceted, lathe-cut crystals, one per timeline milestone. Each waits dim
      // on a ticking dial; when the reader reaches it, it lights up, and once
      // passed it travels with the reader (a column at the right edge on wide
      // screens) until all six gather in a ring around the orb in Contact.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTarget = keep(pmrem.fromScene(new RoomEnvironment(), 0.04));
      pmrem.dispose();
      scene.environment = envTarget.texture;

      const CUTS: [number, number, number, number][] = [
        // segments, table radius, crown height, pavilion depth
        [6, 0.3, 0.42, 1.0],
        [8, 0.36, 0.4, 0.9],
        [5, 0.26, 0.5, 1.15],
        [10, 0.4, 0.36, 0.8],
        [7, 0.3, 0.46, 1.0],
        [12, 0.42, 0.34, 0.85],
      ];
      const stoneGeos = CUTS.map(([seg, table, crown, pav]) =>
        keep(
          new THREE.LatheGeometry(
            [
              new THREE.Vector2(0, -pav),
              new THREE.Vector2(0.62, 0),
              new THREE.Vector2(0.62, 0.08),
              new THREE.Vector2(table, crown),
              new THREE.Vector2(0, crown),
            ],
            seg,
          ),
        ),
      );
      // A clock face of ticks; every fifth one longer.
      const dialGeo = keep(new THREE.BufferGeometry());
      {
        const v: number[] = [];
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * Math.PI * 2;
          const r0 = i % 5 === 0 ? 1.08 : 1.17;
          v.push(Math.cos(a) * r0, Math.sin(a) * r0, 0, Math.cos(a) * 1.25, Math.sin(a) * 1.25, 0);
        }
        for (let i = 0; i < 96; i++) {
          const a0 = (i / 96) * Math.PI * 2;
          const a1 = ((i + 1) / 96) * Math.PI * 2;
          v.push(Math.cos(a0) * 1.32, Math.sin(a0) * 1.32, 0, Math.cos(a1) * 1.32, Math.sin(a1) * 1.32, 0);
        }
        dialGeo.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
      }
      interface Stone {
        group: THREE.Group;
        mesh: THREE.Mesh;
        mat: THREE.MeshStandardMaterial;
        glow: THREE.Sprite;
        glowMat: THREE.SpriteMaterial;
        dial: THREE.LineSegments;
        dialMat: THREE.LineBasicMaterial;
        tone: THREE.Color;
        anchor: THREE.Vector3;
        docY: number;
        size: number;
        lit: number;
        litOn: boolean;
        collect: number;
        flash: number;
        placed: boolean;
      }
      const grey = new THREE.Color("#8a8f9c");
      const stones: Stone[] = CUTS.map((_, i) => {
        // Clearcoat + iridescence is the costliest shader on the page; phones
        // get the plain standard material.
        const mat = keep(
          lite
            ? new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.15, metalness: 0.2, envMapIntensity: 1.6 })
            : new THREE.MeshPhysicalMaterial({
                flatShading: true,
                roughness: 0.1,
                metalness: 0.15,
                clearcoat: 1,
                iridescence: 0.55,
                envMapIntensity: 1.4,
              }),
        );
        const mesh = new THREE.Mesh(stoneGeos[i], mat);
        mesh.userData.stone = i;
        mesh.rotation.x = 0.35;
        const glowMat = keep(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false }));
        const glowSprite = new THREE.Sprite(glowMat);
        glowSprite.renderOrder = -1;
        const group = new THREE.Group();
        group.add(glowSprite, mesh);
        const dialMat = keep(new THREE.LineBasicMaterial({ transparent: true, depthWrite: false }));
        const dial = new THREE.LineSegments(dialGeo, dialMat);
        scene.add(group, dial);
        return {
          group,
          mesh,
          mat,
          glow: glowSprite,
          glowMat,
          dial,
          dialMat,
          tone: new THREE.Color(),
          anchor: new THREE.Vector3(),
          docY: 0,
          size: 1,
          lit: 0,
          litOn: false,
          collect: 0,
          flash: 0,
          placed: false,
        };
      });
      const hitStones = stones.map((s) => s.mesh);
      let ringSlot: Slot | null = null;
      let ringDocY = 0;
      let hud = false;

      // --- Time stream: particles flowing along the ribbon, past → present ------
      const STREAM = lite ? 500 : 1400;
      const streamPos = new Float32Array(STREAM * 3);
      const streamCol = new Float32Array(STREAM * 3);
      const streamSeed = Array.from({ length: STREAM }, () => ({
        u: Math.random(),
        speed: 0.004 + Math.random() * 0.01,
        ox: (Math.random() - 0.5) * 0.7,
        oy: (Math.random() - 0.5) * 0.7,
        oz: (Math.random() - 0.5) * 0.7,
      }));
      const streamGeo = keep(new THREE.BufferGeometry());
      streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
      streamGeo.setAttribute("color", new THREE.BufferAttribute(streamCol, 3));
      const streamMat = keep(
        new THREE.PointsMaterial({ size: 0.14, map: glow, vertexColors: true, transparent: true, depthWrite: false }),
      );
      const stream = new THREE.Points(streamGeo, streamMat);
      stream.frustumCulled = false;
      scene.add(stream);
      let streamPath: THREE.Vector3[] = [];
      const streamPalette = Array.from({ length: 64 }, () => new THREE.Color());

      // --- Theme -----------------------------------------------------------------
      let dark = false;
      const paint = () => {
        dark = document.documentElement.classList.contains("dark");
        tones = [0, 1, 2, 3, 4].map((i) => cssColor(probe, `--layer-${i}`, "#888"));
        const ink = cssColor(probe, "--foreground", "#111");
        wireMats.forEach((m, i) => {
          m.color.set(tones[i]);
          m.opacity = dark ? 0.42 : 0.32;
        });
        dustMat.color.set(dark ? "#ffffff" : ink);
        dustMat.opacity = dark ? 0.55 : 0.22;
        dustMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
        dustMat.needsUpdate = true;
        ribbonMat.uniforms.uC.value.forEach((c: THREE.Color, i: number) => c.set(tones[i]));
        ribbonMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
        ribbonMat.uniforms.uOpacity.value = dark ? 0.75 : 0.6;
        ribbonMat.needsUpdate = true;
        tagBodyMat.color.set(dark ? "#2a2e38" : "#d8dbe2");
        for (const t of tags) {
          for (const f of t.faces) {
            drawLabel(f.canvas, f.product, fontFamily, tones[1]);
            f.tex.needsUpdate = true;
          }
        }
        panels.forEach((p, i) => p.edgeMat.color.set(tones[i % 5]));
        const stoneTones = [...tones, cssColor(probe, "--stone-gold", "#e0a800")];
        stones.forEach((s, i) => {
          s.tone.set(stoneTones[i]);
          s.glowMat.color.set(stoneTones[i]);
          s.glowMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
          s.glowMat.needsUpdate = true;
          s.dialMat.color.set(stoneTones[i]);
        });
        const c = new THREE.Color();
        streamPalette.forEach((col, i) => {
          const x = (i / 63) * 4;
          const a = Math.min(3, Math.floor(x));
          col.set(tones[a]).lerp(c.set(tones[a + 1]), x - a);
        });
        streamMat.opacity = dark ? 0.85 : 0.6;
        streamMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
        streamMat.needsUpdate = true;
      };

      // --- Layout ------------------------------------------------------------------
      let eslSlot: Slot | null = null;
      let carouselSlot: Slot | null = null;
      let radius = 3;
      let panelScale = 1;
      const layout = () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
        docH = document.documentElement.scrollHeight;
        renderer.setSize(vw, vh, false);
        camera.aspect = vw / vh;
        camera.updateProjectionMatrix();
        upp = (2 * DIST * Math.tan((FOV * Math.PI) / 360)) / vh;

        eslSlot = slot("esl");
        if (eslSlot) {
          esl.position.set(eslSlot.x, eslSlot.y, 0);
          esl.scale.setScalar(Math.min(eslSlot.w / 6.4, eslSlot.h / 3.9));
        }
        esl.visible = !!eslSlot;

        carouselSlot = slot("carousel");
        if (carouselSlot) {
          radius = Math.min(carouselSlot.w * 0.34, 9);
          // As large as the ring's spacing and the slot's height allow.
          panelScale = Math.min(((radius * 2 * Math.PI) / RING / PANEL_W) * 0.82, (carouselSlot.h * 0.62) / PANEL_H);
          carousel.position.set(carouselSlot.x, carouselSlot.y, -radius * 0.55);
          panels.forEach((p, i) => {
            const a = (i / RING) * Math.PI * 2;
            p.group.position.set(Math.sin(a) * radius, 0, Math.cos(a) * radius);
            p.group.rotation.y = a;
            p.group.scale.setScalar(panelScale);
          });
        }
        carousel.visible = !!carouselSlot;

        // Wireframes and dust spread over the whole document.
        wires.forEach((w) => {
          const depth = (DIST - w.z) / DIST;
          w.mesh.position.set(w.xf * (vw / 2) * upp * depth, worldY(w.docY * docH), w.z);
        });
        for (let i = 0; i < DUST; i++) {
          const z = -30 + dustSeed[i * 3 + 2] * 36;
          const depth = (DIST - z) / DIST;
          dustPos.set(
            [(dustSeed[i * 3] - 0.5) * vw * upp * depth * 1.2, worldY(dustSeed[i * 3 + 1] * docH), z],
            i * 3,
          );
        }
        dustGeo.attributes.position.needsUpdate = true;

        // Ribbon: weave from section to section, behind the copy.
        if (ribbon) {
          scene.remove(ribbon);
          ribbon.geometry.dispose();
        }
        const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-world-anchor]"));
        streamPath = [];
        if (anchors.length > 1) {
          const pts = anchors.flatMap((a, i) => {
            const r = a.getBoundingClientRect();
            const top = r.top + window.scrollY;
            const side = i % 2 ? -1 : 1;
            // Stay in the margin through each section; cross over only in
            // the gap between sections, so the ribbon never runs under copy.
            const x = side * vw * 0.47 * upp;
            const nodes = Array.from(a.querySelectorAll<HTMLElement>("[data-world-node]"));
            if (nodes.length) {
              // A section with nodes (the timeline): enter from the margin,
              // thread every node's centre, leave by the margin.
              return [
                new THREE.Vector3(x, worldY(top + r.height * 0.04), -5),
                ...nodes.map((n) => {
                  const b = n.getBoundingClientRect();
                  return new THREE.Vector3(worldX(b.left + b.width / 2), worldY(b.top + window.scrollY + b.height / 2), -2);
                }),
                new THREE.Vector3(x, worldY(top + r.height * 0.97), -5),
              ];
            }
            return [
              new THREE.Vector3(x, worldY(top + r.height * 0.08), -5),
              new THREE.Vector3(x * 1.05, worldY(top + r.height * 0.5), -6),
              new THREE.Vector3(x, worldY(top + r.height * 0.92), -5),
            ];
          });
          const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
          ribbon = new THREE.Mesh(new THREE.TubeGeometry(curve, lite ? 420 : 900, 0.05, lite ? 5 : 8, false), ribbonMat);
          ribbon.renderOrder = -1;
          scene.add(ribbon);
          streamPath = curve.getSpacedPoints(lite ? 900 : 1800);
        }

        // Stones: anchored on their dials in the timeline.
        stones.forEach((s, i) => {
          const sl = slot(`stone-${i}`);
          const node = document.querySelector<HTMLElement>(`[data-world-slot="stone-${i}"]`);
          s.group.visible = s.dial.visible = !!sl;
          if (!sl || !node) return;
          const b = node.getBoundingClientRect();
          s.docY = b.top + window.scrollY + b.height / 2;
          s.size = sl.w * 0.3;
          s.anchor.set(sl.x, sl.y, 0.5);
          s.dial.position.set(sl.x, sl.y, 0);
          s.dial.scale.setScalar(sl.w * 0.36);
          if (!s.placed) {
            s.group.position.copy(s.anchor);
            s.group.scale.setScalar(s.size);
            s.placed = true;
          }
        });
        ringSlot = slot("stones-ring");
        const ringNode = document.querySelector<HTMLElement>('[data-world-slot="stones-ring"]');
        if (ringNode) {
          const b = ringNode.getBoundingClientRect();
          ringDocY = b.top + window.scrollY + b.height / 2;
        }
        hud = vw >= 1024;
        wake();
      };

      // --- Interaction -------------------------------------------------------------
      const ndc = new THREE.Vector2(-10, -10);
      const pointer = new THREE.Vector2();
      let mouse = false;
      const raycaster = new THREE.Raycaster();
      let hoveredTag = -1;
      let hoveredPanel = -1;
      const onMove = (e: PointerEvent) => {
        ndc.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
        pointer.set(ndc.x, ndc.y);
        mouse = e.pointerType === "mouse";
      };
      const pick = (targets: THREE.Object3D[]) => {
        raycaster.setFromCamera(ndc, camera);
        return raycaster.intersectObjects(targets, false)[0]?.object;
      };
      const onDown = (e: PointerEvent) => {
        onMove(e);
        // Only react when the press lands on empty page, not on a control.
        if ((e.target as Element).closest("a, button, input, textarea, label")) return;
        const stoneHit = pick(hitStones);
        if (stoneHit) {
          const i = stoneHit.userData.stone as number;
          stones[i].flash = 1;
          play("note", i / 5);
          return;
        }
        const tagHit = esl.visible ? pick(hitTags) : undefined;
        if (tagHit) {
          flipTag(tags[tagHit.userData.tag]);
          play("press");
          return;
        }
        const panelHit = carousel.visible ? pick(hitPanels) : undefined;
        if (panelHit) {
          play("ripple");
          routerRef.current.push(`/library/projects/${panels[panelHit.userData.panel].id}`);
        }
      };

      // --- Loop ----------------------------------------------------------------------
      let frame = 0;
      let running = false;
      const clock = new THREE.Clock();
      let lastAutoFlip = 0;
      let spin = 0;
      let camX = 0;
      let camTilt = 0;

      const render = () => {
        const dt = Math.min(clock.getDelta(), 1 / 20);
        const t = clock.elapsedTime;
        const k = 1 - Math.exp(-dt * 6);
        const sy = window.scrollY;

        // Camera rides the scroll; a touch of mouse parallax on top.
        camX += ((reduced ? 0 : pointer.x * 0.35) - camX) * k;
        camTilt += ((reduced ? 0 : pointer.y * 0.02) - camTilt) * k;
        camera.position.set(camX, -sy * upp, DIST);
        camera.rotation.set(camTilt, camX * -0.01, 0);

        const progress = Math.min(1, sy / Math.max(1, docH - vh));
        ribbonMat.uniforms.uProgress.value = progress;
        ribbonMat.uniforms.uTime.value = reduced ? 0 : t;

        if (!reduced) {
          for (const w of wires) {
            w.mesh.rotation.x += w.spin.x * dt;
            w.mesh.rotation.y += w.spin.y * dt;
          }
        }

        // Hover picking.
        const tagHit = mouse && esl.visible ? pick(hitTags) : undefined;
        const nextTag = tagHit ? (tagHit.userData.tag as number) : -1;
        if (nextTag !== hoveredTag) {
          hoveredTag = nextTag;
          if (nextTag >= 0) play("hover");
        }
        const panelHit = !tagHit && mouse && carousel.visible ? pick(hitPanels) : undefined;
        const nextPanel = panelHit ? (panelHit.userData.panel as number) : -1;
        if (nextPanel !== hoveredPanel) {
          hoveredPanel = nextPanel;
          if (nextPanel >= 0) play("note", nextPanel / Math.max(1, panels.length - 1));
        }
        document.documentElement.style.cursor = nextTag >= 0 || nextPanel >= 0 ? "pointer" : "";

        // ESL swarm: bob, lean toward the cursor, flip now and then.
        if (esl.visible) {
          if (!reduced && t - lastAutoFlip > 2.2) {
            lastAutoFlip = t;
            flipTag(tags[Math.floor(Math.random() * tags.length)]);
          }
          esl.rotation.y = (reduced ? 0 : pointer.x * 0.25) - 0.12;
          esl.rotation.x = reduced ? 0 : -pointer.y * 0.12;
          tags.forEach((tag, i) => {
            tag.hover += ((hoveredTag === i ? 1 : 0) - tag.hover) * k;
            tag.angle += (tag.flips * Math.PI - tag.angle) * (1 - Math.exp(-dt * 5));
            const bob = reduced ? 0 : Math.sin(t * 1.1 + tag.phase) * 0.08;
            tag.holder.position.set(tag.base.x, tag.base.y + bob, tag.base.z + tag.hover * 0.6);
            tag.holder.rotation.x = Math.sin(t * 0.7 + tag.phase) * 0.06;
            tag.holder.rotation.y = -0.35 + (i % 3) * 0.25 + tag.angle;
            tag.holder.scale.setScalar(1 + tag.hover * 0.12);
          });
        }

        // Carousel: turns with time, scroll and the cursor.
        if (carousel.visible && carouselSlot) {
          const local = (carouselSlot.y - camera.position.y) / (vh * upp);
          spin += ((reduced ? 0 : t * 0.08) + local * 1.6 + (reduced ? 0 : pointer.x * 0.4) - spin) * k;
          carousel.rotation.y = spin;
          carousel.rotation.x = 0.08;
          panels.forEach((p, i) => {
            p.hover += ((hoveredPanel === i ? 1 : 0) - p.hover) * k;
            p.group.scale.setScalar(panelScale * (1 + p.hover * 0.12));
          });
        }

        // Time stream: each particle slides down the path and wraps around.
        if (streamPath.length > 1) {
          const last = streamPath.length - 1;
          for (let i = 0; i < STREAM; i++) {
            const p = streamSeed[i];
            const u = (p.u + (reduced ? 0 : t * p.speed)) % 1;
            const f = u * last;
            const a = Math.floor(f);
            const b = Math.min(last, a + 1);
            const w = f - a;
            const pa = streamPath[a];
            const pb = streamPath[b];
            const wob = reduced ? 0 : Math.sin(t * 1.3 + i) * 0.08;
            streamPos[i * 3] = pa.x + (pb.x - pa.x) * w + p.ox + wob;
            streamPos[i * 3 + 1] = pa.y + (pb.y - pa.y) * w + p.oy;
            streamPos[i * 3 + 2] = pa.z + (pb.z - pa.z) * w + p.oz;
            const col = streamPalette[Math.min(63, Math.floor(u * 64))];
            // Brighter near the reader's place in time.
            const near = 1 + Math.exp(-(((u - progress) * 14) ** 2)) * 0.8;
            streamCol[i * 3] = col.r * near;
            streamCol[i * 3 + 1] = col.g * near;
            streamCol[i * 3 + 2] = col.b * near;
          }
          streamGeo.attributes.position.needsUpdate = true;
          streamGeo.attributes.color.needsUpdate = true;
        }

        // Stones.
        const ringScreen = ringDocY - sy;
        const ring = ringSlot ? Math.min(1, Math.max(0, (vh * 1.1 - ringScreen) / (vh * 0.3))) : 0;
        const ringR = ringSlot ? Math.min(ringSlot.w, ringSlot.h) * 0.42 : 1;
        const tmp = new THREE.Vector3();
        const ringPos = new THREE.Vector3();
        stones.forEach((s, i) => {
          if (!s.group.visible) return;
          const screen = s.docY - sy;
          const litTarget = screen < vh * 0.62 || ring > 0 ? 1 : 0;
          if (litTarget && !s.litOn) {
            s.flash = 1;
            play("note", i / 5);
          }
          s.litOn = !!litTarget;
          s.lit += (litTarget - s.lit) * (1 - Math.exp(-dt * 3));
          s.collect += ((hud && screen < vh * 0.16 ? 1 : 0) - s.collect) * k;
          s.flash *= Math.exp(-dt * 2.5);

          // Anchor → right-edge column (follows the camera) → ring round the orb.
          tmp.copy(s.anchor);
          let size = s.size;
          if (s.collect > 0.001) {
            const hx = camera.position.x + (vw / 2 - 44) * upp;
            const hy = camera.position.y + (2.5 - i) * 52 * upp;
            tmp.lerp(ringPos.set(hx, hy, 0.5), s.collect);
            size += (15 * upp - size) * s.collect;
          }
          if (ringSlot && ring > 0.001) {
            const a = (i / 6) * Math.PI * 2 + (reduced ? 0 : t * 0.35);
            ringPos.set(ringSlot.x + Math.cos(a) * ringR, ringSlot.y + Math.sin(a) * ringR * 0.55, 1.5);
            tmp.lerp(ringPos, ring);
            size += (ringR * 0.16 - size) * ring;
          }
          s.group.position.lerp(tmp, s.collect > 0.02 ? 1 - Math.exp(-dt * 10) : 1 - Math.exp(-dt * 6));
          s.group.scale.setScalar(size * (1 + s.flash * 0.35));

          s.mesh.rotation.y += dt * (reduced ? 0 : 0.35 + s.lit * 0.9 + s.flash * 6);
          s.mat.color.copy(grey).lerp(s.tone, 0.2 + s.lit * 0.8);
          s.mat.emissive.copy(s.tone);
          s.mat.emissiveIntensity = (dark ? 0.08 + s.lit * 0.85 : 0.02 + s.lit * 0.4) + s.flash * 0.6;
          s.glow.scale.setScalar(3.4 * (1 + s.flash * 1.4));
          s.glowMat.opacity = (dark ? 0.85 : 0.4) * s.lit * (1 - s.collect * 0.4) + s.flash * 0.5;
          s.dial.rotation.z -= dt * (reduced ? 0 : 0.08 + s.lit * 0.5);
          s.dialMat.opacity = (dark ? 0.16 : 0.22) + s.lit * (dark ? 0.45 : 0.5) * (1 - s.collect * 0.6);
        });

        renderer.render(scene, camera);
      };

      // On phones, idle frames (nothing scrolling) drop to ~30 fps; while the
      // page scrolls every frame is drawn so z = 0 pieces stay glued to it.
      let lastFrame = 0;
      let lastScroll = 0;
      const loop = (now: number) => {
        if (!lite || now - lastScroll < 200 || now - lastFrame > 30) {
          lastFrame = now;
          render();
        }
        frame = running ? requestAnimationFrame(loop) : 0;
      };
      function wake() {
        if (reduced) {
          render();
          return;
        }
        running = !document.hidden;
        if (running && !frame) frame = requestAnimationFrame(loop);
      }

      const onScroll = () => {
        lastScroll = performance.now();
        if (reduced) render();
      };
      // Body size changes in bursts (images, fonts); layout() rebuilds the
      // ribbon, so run it once per burst.
      let layoutTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(layoutTimer);
        layoutTimer = window.setTimeout(layout, 120);
      });
      ro.observe(document.body);
      const themeWatch = new MutationObserver(() => {
        paint();
        wake();
      });
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      const onVisibility = () => (document.hidden ? (running = false) : wake());
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);

      paint();
      layout();
      void document.fonts?.ready.then(() => {
        if (disposed) return;
        paint();
        layout();
      });
      el.dataset.ready = "";

      cleanup = () => {
        running = false;
        cancelAnimationFrame(frame);
        ro.disconnect();
        window.clearTimeout(layoutTimer);
        themeWatch.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        document.documentElement.style.cursor = "";
        ribbon?.geometry.dispose();
        for (const d of bin) d.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [projects]);

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-1000 data-ready:opacity-100 [&>canvas]:block [&>canvas]:size-full"
    />
  );
}
