"use client";

import { useEffect, useRef } from "react";
// Types only — the runtime module is imported lazily inside the effect.
import type * as THREE from "three";
import { play } from "@/lib/sound/engine";
import { cn } from "@/lib/utils";
import { isLowPower, pixelRatio } from "@/lib/three/quality";

/** The five layers of the stack, top to bottom. Latin only: drawn in mono. */
export const LAYER_NAMES = ["interface", "state", "api", "data", "infra"] as const;

/** Window event other components fire to bring one layer forward. */
export const LAYER_EVENT = "jd:layer";

export function focusLayer(index: number) {
  window.dispatchEvent(new CustomEvent(LAYER_EVENT, { detail: index }));
}

interface LayerSceneProps {
  /**
   * `stack` — one interactive stack, the hero centrepiece: hover lifts a
   * layer (and plays its note), click flips it, scrolling pulls the layers
   * apart, iridescent shapes orbit it.
   * `field` — two quieter stacks at the edges of a page hero, behind the copy.
   */
  variant?: "stack" | "field";
  /** Layer slid out of the stack. Omit to follow `focusLayer()` events. */
  focus?: number;
  className?: string;
}

interface Palette {
  layers: string[];
  tile: string;
  ink: string;
  dark: boolean;
}

/* Slab geometry, in world units. The face texture uses the same proportions
   and corner radius, so the drawing and the mesh outline line up exactly. */
const W = 4.2;
const D = 2.73;
const T = 0.08;
const R = 0.26;
const TEX_W = 640;
const TEX_H = Math.round((TEX_W * D) / W);
const TEX_R = (R / W) * TEX_W;

/** Resolve any CSS colour (oklch, var(), hex…) to `rgb()` via a 1px canvas. */
function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  const rgb = (value: string, fallback: string) => {
    probe.fillStyle = fallback;
    probe.fillStyle = value.trim() || fallback;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  };
  return {
    layers: [0, 1, 2, 3, 4].map((i) => rgb(css.getPropertyValue(`--layer-${i}`), "#888")),
    tile: rgb(css.getPropertyValue("--tile"), "#fff"),
    ink: rgb(css.getPropertyValue("--foreground"), "#111"),
    dark: document.documentElement.classList.contains("dark"),
  };
}

/** The top face of a layer: a little wireframe of what lives on that layer. */
function drawFace(canvas: HTMLCanvasElement, index: number, palette: Palette, label: boolean) {
  const w = (canvas.width = TEX_W);
  const h = (canvas.height = TEX_H);
  const g = canvas.getContext("2d")!;
  const tone = palette.layers[index];
  const pad = 26;

  g.clearRect(0, 0, w, h);
  // Glassy fill: a tint of the layer's tone fading across the face.
  const fill = g.createLinearGradient(0, 0, w, h);
  fill.addColorStop(0, palette.tile);
  fill.addColorStop(1, palette.dark ? tone : palette.tile);
  g.globalAlpha = palette.dark ? 0.78 : 0.9;
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(0, 0, w, h, TEX_R);
  g.fill();
  if (palette.dark) {
    g.globalAlpha = 0.72;
    g.fillStyle = palette.tile;
    g.fill();
  }

  // Inner rim light.
  g.globalAlpha = 1;
  g.lineWidth = 6;
  g.strokeStyle = tone;
  g.beginPath();
  g.roundRect(3, 3, w - 6, h - 6, TEX_R - 3);
  g.stroke();

  // Dot grid.
  g.fillStyle = palette.ink;
  g.globalAlpha = 0.1;
  for (let x = pad + 18; x < w - pad; x += 30) {
    for (let y = pad + 18; y < h - pad; y += 30) g.fillRect(x, y, 3, 3);
  }

  // A sketch of the layer's contents.
  g.globalAlpha = 0.85;
  g.fillStyle = tone;
  g.strokeStyle = tone;
  g.lineWidth = 6;
  const bar = (x: number, y: number, bw: number, bh = 16) => {
    g.beginPath();
    g.roundRect(x, y, bw, bh, bh / 2);
    g.fill();
  };
  switch (index) {
    case 0: // interface: a card with a button
      g.globalAlpha = 0.18;
      g.beginPath();
      g.roundRect(60, 60, 300, 210, 22);
      g.fill();
      g.globalAlpha = 0.85;
      bar(84, 92, 170, 20);
      bar(84, 130, 230, 12);
      bar(84, 156, 200, 12);
      bar(84, 214, 110, 34);
      g.beginPath();
      g.arc(480, 150, 62, 0, Math.PI * 2);
      g.globalAlpha = 0.25;
      g.fill();
      break;
    case 1: // state: nodes and edges
      [
        [120, 120],
        [300, 90],
        [460, 170],
        [220, 240],
        [400, 280],
      ].forEach(([x, y], i, all) => {
        if (i) {
          g.globalAlpha = 0.4;
          g.beginPath();
          g.moveTo(all[i - 1][0], all[i - 1][1]);
          g.lineTo(x, y);
          g.stroke();
        }
        g.globalAlpha = 0.9;
        g.beginPath();
        g.arc(x, y, 18, 0, Math.PI * 2);
        g.fill();
      });
      break;
    case 2: // api: request lines
      for (let i = 0; i < 6; i++) {
        g.globalAlpha = 0.9;
        bar(70, 70 + i * 40, 54, 16);
        g.globalAlpha = 0.35;
        bar(138, 70 + i * 40, 120 + ((i * 97) % 260), 16);
      }
      break;
    case 3: // data: a table
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 4; c++) {
          g.globalAlpha = r === 0 ? 0.9 : 0.28;
          g.beginPath();
          g.roundRect(64 + c * 128, 64 + r * 48, 112, 34, 8);
          g.fill();
        }
      }
      break;
    case 4: // infra: servers
      for (let i = 0; i < 3; i++) {
        g.globalAlpha = 0.25;
        g.beginPath();
        g.roundRect(64 + i * 170, 70, 140, 220, 16);
        g.fill();
        g.globalAlpha = 0.9;
        for (let j = 0; j < 4; j++) {
          g.beginPath();
          g.arc(94 + i * 170, 104 + j * 48, 8, 0, Math.PI * 2);
          g.fill();
        }
      }
      break;
  }

  if (label) {
    g.globalAlpha = 1;
    g.fillStyle = tone;
    g.font = "600 30px ui-monospace, SFMono-Regular, Menlo, monospace";
    g.fillText(`L${index}`, pad + 10, h - pad - 10);
    g.fillStyle = palette.ink;
    g.globalAlpha = 0.7;
    g.fillText(LAYER_NAMES[index], pad + 70, h - pad - 10);
  }
}

/** A soft round sprite, for glowing particles. */
function glowTexture(THREE: typeof import("three")) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** The glowing disc under the stack: the five tones swirled around a centre. */
function drawHalo(canvas: HTMLCanvasElement, palette: Palette) {
  const s = (canvas.width = canvas.height = 512);
  const g = canvas.getContext("2d")!;
  g.clearRect(0, 0, s, s);
  const conic = g.createConicGradient(0, s / 2, s / 2);
  palette.layers.forEach((c, i) => conic.addColorStop(i / 5, c));
  conic.addColorStop(1, palette.layers[0]);
  g.fillStyle = conic;
  g.beginPath();
  g.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  g.fill();
  // Fade to transparent at the rim, and hollow the middle into a ring.
  g.globalCompositeOperation = "destination-in";
  const fade = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  fade.addColorStop(0, "rgba(0,0,0,0.15)");
  fade.addColorStop(0.55, "rgba(0,0,0,0.9)");
  fade.addColorStop(0.68, "rgba(0,0,0,0.35)");
  fade.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = fade;
  g.fillRect(0, 0, s, s);
  g.globalCompositeOperation = "source-over";
}

/**
 * The stack, in three.js. Lazy: `three` is imported inside the effect, so it
 * never blocks the first paint, and nothing renders while the canvas is off
 * screen or the tab is hidden. Reduced motion gets one still frame (redrawn on
 * theme change and resize). Colours come from the CSS tokens, so the scene
 * follows the theme — including mid view-transition.
 */
export default function LayerScene({ variant = "stack", focus, className }: LayerSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  // Read by the render loop every frame; the scene effect never re-runs for it.
  const focusRef = useRef(focus ?? -1);
  const wakeRef = useRef<() => void>(() => {});
  const controlledRef = useRef(focus !== undefined);

  useEffect(() => {
    if (focus === undefined) return;
    focusRef.current = focus;
    wakeRef.current();
  }, [focus]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    void Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
    ]).then(([threeModule, { RoomEnvironment }]) => {
      if (disposed) return;
      const THREE = threeModule;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const interactive = variant === "stack";
      const disposables: { dispose: () => void }[] = [];
      const keep = <X extends { dispose: () => void }>(x: X) => {
        disposables.push(x);
        return x;
      };

      const lite = isLowPower();
      const renderer = new THREE.WebGLRenderer({ antialias: !lite, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(pixelRatio(1.75, lite));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute("aria-hidden", "true");
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Image-based lighting for the iridescent shapes.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envTarget.texture;
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(4, 8, 6);
      scene.add(key);

      const camera = new THREE.PerspectiveCamera(variant === "stack" ? 30 : 34, 1, 0.1, 100);

      // --- Shared geometry ------------------------------------------------
      const shape = new THREE.Shape();
      {
        const x = -W / 2;
        const y = -D / 2;
        shape.moveTo(x + R, y);
        shape.lineTo(x + W - R, y);
        shape.quadraticCurveTo(x + W, y, x + W, y + R);
        shape.lineTo(x + W, y + D - R);
        shape.quadraticCurveTo(x + W, y + D, x + W - R, y + D);
        shape.lineTo(x + R, y + D);
        shape.quadraticCurveTo(x, y + D, x, y + D - R);
        shape.lineTo(x, y + R);
        shape.quadraticCurveTo(x, y, x + R, y);
      }
      // Body: the rounded outline extruded to a thin slab, lying flat.
      const bodyGeo = keep(new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: false, curveSegments: 12 }));
      bodyGeo.rotateX(-Math.PI / 2);
      bodyGeo.translate(0, -T / 2, 0);
      // Top face: the same outline, with UVs normalised to the texture.
      const faceGeo = keep(new THREE.ShapeGeometry(shape, 12));
      {
        const uv = faceGeo.attributes.uv;
        for (let i = 0; i < uv.count; i++) {
          uv.setXY(i, (uv.getX(i) + W / 2) / W, (uv.getY(i) + D / 2) / D);
        }
        uv.needsUpdate = true;
      }
      faceGeo.rotateX(-Math.PI / 2);
      faceGeo.translate(0, T / 2 + 0.002, 0);
      const edgeGeo = keep(new THREE.EdgesGeometry(bodyGeo, 30));

      // --- Stacks ----------------------------------------------------------
      const placements =
        variant === "stack"
          ? [{ x: 0, y: 0, z: 0, s: 1 }]
          : [
              { x: -6.4, y: -0.6, z: 1.5, s: 0.85 },
              { x: 6.6, y: 0.6, z: -1.2, s: 0.95 },
            ];

      interface Slab {
        holder: THREE.Group;
        face: THREE.CanvasTexture;
        canvas: HTMLCanvasElement;
        faceMat: THREE.MeshBasicMaterial;
        sideMat: THREE.MeshBasicMaterial;
        edgeMat: THREE.LineBasicMaterial;
        index: number;
        lift: number;
        slide: number;
        spin: number;
        spinTarget: number;
      }
      interface Orbiter {
        mesh: THREE.Mesh;
        mat: THREE.MeshPhysicalMaterial;
        tone: number;
        radius: number;
        height: number;
        speed: number;
        phase: number;
        grow: number;
        /** Extra spin speed from a click, decaying back to zero. */
        whirl: number;
        angle: number;
      }

      const slabs: Slab[] = [];
      const groups: THREE.Group[] = [];
      const orbiters: Orbiter[] = [];
      const hitTargets: THREE.Object3D[] = [];
      const hiddenCap = keep(new THREE.MeshBasicMaterial({ visible: false }));

      const orbitShapes = [
        () => new THREE.IcosahedronGeometry(0.34, 0),
        () => new THREE.TorusKnotGeometry(0.2, 0.07, 120, 14),
        () => new THREE.OctahedronGeometry(0.32, 0),
        () => new THREE.TorusGeometry(0.24, 0.085, 20, 56),
        () => new THREE.DodecahedronGeometry(0.28, 0),
        () => new THREE.SphereGeometry(0.2, 32, 16),
      ];

      placements.forEach((p, pi) => {
        const group = new THREE.Group();
        group.position.set(p.x, p.y, p.z);
        group.scale.setScalar(p.s);
        group.matrixAutoUpdate = false;

        for (let i = 0; i < 5; i++) {
          const canvas = document.createElement("canvas");
          const face = keep(new THREE.CanvasTexture(canvas));
          face.colorSpace = THREE.SRGBColorSpace;
          face.anisotropy = 8;
          const faceMat = keep(new THREE.MeshBasicMaterial({ map: face, transparent: true, depthWrite: false }));
          const sideMat = keep(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, depthWrite: false }));
          const edgeMat = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.95 }));

          const holder = new THREE.Group();
          const body = new THREE.Mesh(bodyGeo, [hiddenCap, sideMat]);
          const top = new THREE.Mesh(faceGeo, faceMat);
          const edges = new THREE.LineSegments(edgeGeo, edgeMat);
          // Bottom layer first, so the translucent faces stack correctly.
          body.renderOrder = top.renderOrder = edges.renderOrder = 5 - i;
          body.userData.index = top.userData.index = i;
          holder.add(body, top, edges);
          group.add(holder);
          if (interactive) hitTargets.push(body, top);
          slabs.push({ holder, face, canvas, faceMat, sideMat, edgeMat, index: i, lift: 0, slide: 0, spin: 0, spinTarget: 0 });
        }

        // Iridescent shapes orbiting the stack.
        const count = interactive ? 6 : 3;
        for (let k = 0; k < count; k++) {
          const geo = keep(orbitShapes[(k + pi * 2) % orbitShapes.length]());
          const mat = keep(
            new THREE.MeshPhysicalMaterial({
              metalness: 0.25,
              roughness: 0.16,
              clearcoat: 1,
              clearcoatRoughness: 0.08,
              iridescence: 1,
              iridescenceIOR: 1.45,
              iridescenceThicknessRange: [120, 900],
              envMapIntensity: 1.35,
              flatShading: k % 2 === 0,
            }),
          );
          const mesh = new THREE.Mesh(geo, mat);
          mesh.userData.orbiter = orbiters.length;
          group.add(mesh);
          if (interactive) hitTargets.push(mesh);
          orbiters.push({
            mesh,
            mat,
            tone: (k + pi) % 5,
            radius: 2.75 + (k % 3) * 0.35,
            height: -1.4 + (k / Math.max(1, count - 1)) * 3,
            speed: (0.16 + (k % 4) * 0.05) * (k % 2 ? 1 : -1),
            phase: (k / count) * Math.PI * 2,
            grow: 0,
            whirl: 0,
            angle: 0,
          });
        }

        scene.add(group);
        groups.push(group);
      });

      // Halo under each stack.
      const haloCanvas = document.createElement("canvas");
      const haloTex = keep(new THREE.CanvasTexture(haloCanvas));
      haloTex.colorSpace = THREE.SRGBColorSpace;
      const haloMat = keep(new THREE.MeshBasicMaterial({ map: haloTex, transparent: true, depthWrite: false }));
      const haloGeo = keep(new THREE.PlaneGeometry(7.2, 7.2));
      const halos = groups.map((group) => {
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = -Math.PI / 2;
        halo.renderOrder = -1;
        group.add(halo);
        return halo;
      });

      // Data packets: glowing points falling through the layers, with a faint
      // beam marking each column.
      const glow = keep(glowTexture(THREE));
      const PACKETS = interactive ? 34 : 18;
      const seeds = groups.flatMap((_, gi) =>
        Array.from({ length: PACKETS }, () => ({
          group: gi,
          x: (Math.random() - 0.5) * W * 0.8,
          z: (Math.random() - 0.5) * D * 0.75,
          speed: 0.14 + Math.random() * 0.22,
          phase: Math.random(),
        })),
      );
      const packetPos = new Float32Array(seeds.length * 3);
      const packetCol = new Float32Array(seeds.length * 3);
      const packetGeo = keep(new THREE.BufferGeometry());
      packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3).setUsage(THREE.DynamicDrawUsage));
      packetGeo.setAttribute("color", new THREE.BufferAttribute(packetCol, 3));
      const packetMat = keep(
        new THREE.PointsMaterial({
          size: 0.32,
          map: glow,
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      );
      const packets = new THREE.Points(packetGeo, packetMat);
      packets.renderOrder = 10;
      scene.add(packets);

      const beamPos = new Float32Array(seeds.length * 6);
      const beamCol = new Float32Array(seeds.length * 6);
      const beamGeo = keep(new THREE.BufferGeometry());
      beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3).setUsage(THREE.DynamicDrawUsage));
      beamGeo.setAttribute("color", new THREE.BufferAttribute(beamCol, 3));
      const beamMat = keep(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.22, depthWrite: false }));
      const beams = new THREE.LineSegments(beamGeo, beamMat);
      scene.add(beams);

      // Dust: slow motes drifting up through the whole frame.
      const DUST = interactive ? 260 : 160;
      const dustPos = new Float32Array(DUST * 3);
      const dustSeed = new Float32Array(DUST);
      for (let i = 0; i < DUST; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * (interactive ? 12 : 22);
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
        dustSeed[i] = Math.random();
      }
      const dustGeo = keep(new THREE.BufferGeometry());
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3).setUsage(THREE.DynamicDrawUsage));
      const dustMat = keep(
        new THREE.PointsMaterial({ size: 0.07, map: glow, transparent: true, opacity: 0.5, depthWrite: false }),
      );
      const dust = new THREE.Points(dustGeo, dustMat);
      scene.add(dust);

      // --- Theme --------------------------------------------------------
      const tmp = new THREE.Color();
      const paint = () => {
        const palette = readPalette();
        for (const slab of slabs) {
          drawFace(slab.canvas, slab.index, palette, interactive);
          slab.face.needsUpdate = true;
          slab.sideMat.color.set(palette.layers[slab.index]);
          slab.edgeMat.color.set(palette.layers[slab.index]);
        }
        for (const o of orbiters) o.mat.color.set(palette.layers[o.tone]);
        seeds.forEach((_, i) => {
          tmp.set(palette.layers[i % 5]);
          packetCol.set([tmp.r, tmp.g, tmp.b], i * 3);
          beamCol.set([tmp.r, tmp.g, tmp.b, tmp.r, tmp.g, tmp.b], i * 6);
        });
        packetGeo.attributes.color.needsUpdate = true;
        beamGeo.attributes.color.needsUpdate = true;
        // Glow adds light on dark backgrounds; on paper it would vanish.
        packetMat.blending = palette.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
        packetMat.needsUpdate = true;
        dustMat.color.set(palette.dark ? "#ffffff" : palette.ink);
        dustMat.opacity = palette.dark ? 0.45 : 0.22;
        drawHalo(haloCanvas, palette);
        haloTex.needsUpdate = true;
        haloMat.opacity = palette.dark ? 0.9 : 0.55;
      };
      paint();

      // --- Interaction state ---------------------------------------------
      const pointer = new THREE.Vector2(0, 0);
      const ndc = new THREE.Vector2(-10, -10);
      let pointerActive = false;
      let hovered = -1;
      let hoveredOrbiter = -1;
      const raycaster = new THREE.Raycaster();

      const pick = () => {
        raycaster.setFromCamera(ndc, camera);
        return raycaster.intersectObjects(hitTargets, false)[0]?.object;
      };

      const onPointer = (event: PointerEvent) => {
        pointer.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
        const rect = el.getBoundingClientRect();
        ndc.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1,
        );
        pointerActive = event.pointerType === "mouse";
        wake();
      };
      // Click a layer: it flips over. Click an orbiter: it whirls.
      const onDown = (event: PointerEvent) => {
        if (!interactive || reduced) return;
        onPointer(event);
        const hit = pick();
        if (!hit) return;
        if (hit.userData.orbiter !== undefined) {
          orbiters[hit.userData.orbiter].whirl += 18;
          play("ripple");
        } else {
          const slab = slabs[hit.userData.index as number];
          slab.spinTarget += Math.PI * 2;
          play("layer", slab.index);
        }
        wake();
      };
      const onLayer = (event: Event) => {
        if (controlledRef.current) return;
        focusRef.current = (event as CustomEvent<number>).detail;
        wake();
      };

      // --- Size ----------------------------------------------------------
      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = width / height;
        // Pull back on narrow frames so the whole scene stays in shot.
        const fit =
          variant === "stack"
            ? 0.95 * Math.max(1, 1.15 / camera.aspect)
            : Math.max(1, 1.6 / camera.aspect);
        camera.position.set(7.5 * fit, 6.2 * fit, 10.5 * fit);
        camera.lookAt(0, variant === "stack" ? 0.1 : 0, 0);
        camera.updateProjectionMatrix();
        wake();
      };

      // --- Loop ----------------------------------------------------------
      let frame = 0;
      let running = false;
      let visible = true;
      const clock = new THREE.Clock();
      let yaw = 0;
      let tilt = 0;
      const local = new THREE.Vector3();

      const render = () => {
        const dt = Math.min(clock.getDelta(), 1 / 20);
        const t = reduced ? 0 : clock.elapsedTime;
        const k = 1 - Math.exp(-dt * 7);

        // Scroll pulls the layers apart as the section leaves the screen.
        const rect = el.getBoundingClientRect();
        const progress = interactive ? Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height))) : 0;
        const gap = 0.62 + progress * 0.75;

        // Hover → raycast (stack only).
        if (interactive && pointerActive && !reduced) {
          const hit = pick();
          const slabHit = hit && hit.userData.orbiter === undefined ? (hit.userData.index as number) : -1;
          const orbHit = hit && hit.userData.orbiter !== undefined ? (hit.userData.orbiter as number) : -1;
          if (slabHit !== hovered) {
            hovered = slabHit;
            if (slabHit >= 0) play("layer", slabHit);
          }
          if (orbHit !== hoveredOrbiter) {
            hoveredOrbiter = orbHit;
            if (orbHit >= 0) play("note", orbHit / Math.max(1, orbiters.length - 1));
          }
        }

        yaw += ((reduced ? 0 : pointer.x * 0.3) - yaw) * k;
        tilt += ((reduced ? 0 : pointer.y * 0.09) - tilt) * k;

        groups.forEach((group, gi) => {
          const sway = reduced ? 0 : Math.sin(t * 0.25 + gi * 2) * 0.14;
          group.rotation.set(tilt, -0.18 + sway + yaw, 0);
          group.updateMatrix();
          group.updateMatrixWorld(true);
        });

        for (const slab of slabs) {
          const i = slab.index;
          slab.lift += ((hovered === i ? 0.34 : 0) - slab.lift) * k;
          slab.slide += ((focusRef.current === i ? 0.95 : 0) - slab.slide) * k;
          slab.spin += (slab.spinTarget - slab.spin) * (1 - Math.exp(-dt * 4));
          const bob = reduced ? 0 : Math.sin(t * 0.9 + i * 0.7) * 0.05;
          slab.holder.position.set(slab.slide, (2 - i) * gap + bob + slab.lift, 0);
          slab.holder.rotation.x = slab.spin;
          const dim = hovered >= 0 && hovered !== i ? 0.5 : 1;
          slab.sideMat.opacity = 0.55 * dim;
          slab.edgeMat.opacity = 0.95 * dim;
          slab.faceMat.opacity = dim;
        }

        orbiters.forEach((o, i) => {
          const a = o.phase + t * o.speed;
          o.grow += ((hoveredOrbiter === i ? 1 : 0) - o.grow) * k;
          o.whirl *= 1 - Math.min(1, dt * 1.6);
          o.angle += (0.6 + o.whirl) * dt;
          o.mesh.position.set(Math.cos(a) * o.radius, o.height * (gap / 0.62) + Math.sin(t * 0.8 + o.phase) * 0.22, Math.sin(a) * o.radius * 0.8);
          o.mesh.rotation.set(o.angle + o.phase, o.angle * 1.4, 0);
          o.mesh.scale.setScalar(1.3 + o.grow * 0.55);
        });

        halos.forEach((halo, hi) => {
          // Clamped so the spread stack never pushes the halo out of frame.
          halo.position.y = -2 * Math.min(gap, 0.85) - 0.45;
          halo.rotation.z = t * 0.12 * (hi % 2 ? -1 : 1);
          const pulse = 1 + Math.sin(t * 1.4 + hi) * 0.04;
          halo.scale.set(pulse, pulse, 1);
        });

        // Packets fall from the top layer to the bottom, then start again.
        const span = 4 * gap;
        seeds.forEach((seed, i) => {
          const f = (seed.phase + t * seed.speed) % 1;
          const m = groups[seed.group].matrixWorld;
          local.set(seed.x, 2 * gap - f * span + 0.08, seed.z).applyMatrix4(m);
          packetPos.set([local.x, local.y, local.z], i * 3);
          local.set(seed.x, 2 * gap + 0.08, seed.z).applyMatrix4(m);
          beamPos.set([local.x, local.y, local.z], i * 6);
          local.set(seed.x, -2 * gap - 0.4, seed.z).applyMatrix4(m);
          beamPos.set([local.x, local.y, local.z], i * 6 + 3);
        });
        packetGeo.attributes.position.needsUpdate = true;
        beamGeo.attributes.position.needsUpdate = true;
        packetMat.size = 0.3 + Math.sin(t * 3) * 0.04;

        if (!reduced) {
          for (let i = 0; i < DUST; i++) {
            let y = dustPos[i * 3 + 1] + dt * (0.08 + dustSeed[i] * 0.16);
            if (y > 4) y = -4;
            dustPos[i * 3 + 1] = y;
            dustPos[i * 3] += Math.sin(t * 0.5 + dustSeed[i] * 10) * dt * 0.05;
          }
          dustGeo.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };

      const loop = () => {
        render();
        frame = running ? requestAnimationFrame(loop) : 0;
      };
      function wake() {
        if (reduced) {
          render();
          return;
        }
        running = visible && !document.hidden;
        if (running && !frame) frame = requestAnimationFrame(loop);
      }

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        else running = false;
      });
      io.observe(el);
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      const themeWatch = new MutationObserver(() => {
        paint();
        wake();
      });
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      const onVisibility = () => (document.hidden ? (running = false) : wake());

      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener(LAYER_EVENT, onLayer);
      document.addEventListener("visibilitychange", onVisibility);
      resize();
      // Fonts used on the slab labels may arrive late.
      void document.fonts?.ready.then(() => {
        if (disposed) return;
        paint();
        wake();
      });
      wakeRef.current = wake;
      el.dataset.ready = "";

      cleanup = () => {
        wakeRef.current = () => {};
        running = false;
        cancelAnimationFrame(frame);
        io.disconnect();
        ro.disconnect();
        themeWatch.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener(LAYER_EVENT, onLayer);
        document.removeEventListener("visibilitychange", onVisibility);
        for (const d of disposables) d.dispose();
        envTarget.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [variant]);

  return <div ref={host} aria-hidden data-variant={variant} className={cn("layer-scene pointer-events-none", className)} />;
}
