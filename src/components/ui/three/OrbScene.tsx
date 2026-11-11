"use client";

import { useEffect, useRef } from "react";
import { play } from "@/lib/sound/engine";
import { cn } from "@/lib/utils";

/* The particle orb's shaders. Every point sits on a sphere and is pushed out
   along its normal by a cheap 3-axis sine "noise", by a bulge toward the
   cursor, and by a shockwave ring when the orb is clicked. */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec3 uPointer;
  uniform float uHover;
  uniform float uWave;
  uniform vec3 uWaveDir;
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  float field(vec3 p, float t) {
    return sin(p.x * 2.3 + t) * sin(p.y * 2.9 + t * 1.3) * sin(p.z * 2.1 + t * 0.7)
         + 0.5 * sin(p.x * 5.1 - t * 1.7 + p.z * 3.3);
  }

  void main() {
    vec3 n = normalize(position);
    float t = uTime * 0.45;
    float d = field(n * 1.4, t) * 0.16;
    // Bulge toward the cursor.
    float facing = max(0.0, dot(n, normalize(uPointer)));
    d += pow(facing, 6.0) * 0.38 * uHover;
    // Shockwave travelling away from the clicked point.
    float ang = acos(clamp(dot(n, uWaveDir), -1.0, 1.0));
    d += exp(-pow((ang - uWave * 3.4) * 4.0, 2.0)) * 0.5 * step(0.0, uWave) * (1.0 - uWave);
    vec3 p = n * (1.6 + d);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aSeed * 0.8) * (1.0 + d * 1.5) / -mv.z;

    float k = n.y * 0.5 + 0.5;
    vColor = mix(mix(uC2, uC1, smoothstep(0.0, 0.55, k)), uC0, smoothstep(0.5, 1.0, k));
    vAlpha = 0.45 + 0.55 * smoothstep(-0.1, 0.4, d);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    gl_FragColor = vec4(vColor, soft * vAlpha * uOpacity);
  }
`;

function cssColor(name: string, fallback: string) {
  const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  probe.fillStyle = fallback;
  probe.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * A breathing sphere of a few thousand points in the layer tones, ringed by
 * two orbits with satellites. It turns with the cursor, swells where the
 * cursor points, and a click sends a shockwave around it. Lazy-loaded,
 * paused off screen, one still frame for reduced motion.
 */
export default function OrbScene({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (disposed) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.set(0, 0, 7);

      const orb = new THREE.Group();
      scene.add(orb);

      // Fibonacci sphere: evenly spread points.
      const COUNT = 5200;
      const pos = new Float32Array(COUNT * 3);
      const seed = new Float32Array(COUNT);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const a = golden * i;
        pos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
        seed[i] = Math.random();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

      const uniforms = {
        uTime: { value: 0 },
        uSize: { value: 40 * renderer.getPixelRatio() },
        uPointer: { value: new THREE.Vector3(0, 0, 1) },
        uHover: { value: 0 },
        uWave: { value: -1 },
        uWaveDir: { value: new THREE.Vector3(0, 0, 1) },
        uOpacity: { value: 1 },
        uC0: { value: new THREE.Color() },
        uC1: { value: new THREE.Color() },
        uC2: { value: new THREE.Color() },
      };
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      orb.add(points);

      // Two tilted orbits with a satellite each.
      const ringGeo = new THREE.TorusGeometry(2.35, 0.006, 6, 160);
      const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 });
      const satGeo = new THREE.SphereGeometry(0.07, 16, 12);
      const satMats = [new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial()];
      const rings = [0, 1].map((i) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(1.2 + i * 0.5, i * 0.9, 0.3 - i * 0.6);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.scale.setScalar(1 + i * 0.16);
        const sat = new THREE.Mesh(satGeo, satMats[i]);
        pivot.add(ring, sat);
        scene.add(pivot);
        return { pivot, sat, radius: 2.35 * (1 + i * 0.16), speed: i ? -0.5 : 0.7 };
      });

      const paint = () => {
        const dark = document.documentElement.classList.contains("dark");
        uniforms.uC0.value.set(cssColor("--layer-0", "#2f8bff"));
        uniforms.uC1.value.set(cssColor("--layer-1", "#8b5cf6"));
        uniforms.uC2.value.set(cssColor("--layer-4", "#ff4f9a"));
        mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
        mat.needsUpdate = true;
        uniforms.uOpacity.value = dark ? 0.9 : 0.85;
        ringMat.color.set(cssColor("--foreground", "#111"));
        ringMat.opacity = dark ? 0.18 : 0.14;
        satMats[0].color.set(cssColor("--layer-2", "#2ee6a8"));
        satMats[1].color.set(cssColor("--layer-3", "#ffa24c"));
      };
      paint();

      // --- Interaction ---------------------------------------------------
      const ndc = new THREE.Vector2(0, 0);
      let inside = false;
      const raycaster = new THREE.Raycaster();
      const sphere = new THREE.Sphere(new THREE.Vector3(), 1.75);
      const hitPoint = new THREE.Vector3();
      let yaw = 0;
      let pitch = 0;
      let spin = 0;

      const toNdc = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
        inside = Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1;
      };
      const localHit = () => {
        raycaster.setFromCamera(ndc, camera);
        if (!raycaster.ray.intersectSphere(sphere, hitPoint)) return null;
        return orb.worldToLocal(hitPoint.clone()).normalize();
      };
      const onMove = (event: PointerEvent) => {
        toNdc(event);
        wake();
      };
      const onDown = (event: PointerEvent) => {
        toNdc(event);
        const n = inside ? localHit() : null;
        if (!n || reduced) return;
        uniforms.uWaveDir.value.copy(n);
        uniforms.uWave.value = 0;
        play("ripple");
        wake();
      };

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = width / height;
        // Far enough back that the outer orbit fits inside the frame.
        camera.position.z = 10 * Math.max(1, 1.2 / camera.aspect);
        camera.updateProjectionMatrix();
        wake();
      };

      let frame = 0;
      let running = false;
      let visible = true;
      const clock = new THREE.Clock();
      const render = () => {
        const dt = Math.min(clock.getDelta(), 1 / 20);
        const t = reduced ? 1 : clock.elapsedTime;
        const k = 1 - Math.exp(-dt * 5);
        uniforms.uTime.value = t;

        const n = inside ? localHit() : null;
        uniforms.uHover.value += ((n ? 1 : 0) - uniforms.uHover.value) * k;
        if (n) uniforms.uPointer.value.lerp(n, 0.25);

        if (uniforms.uWave.value >= 0) {
          uniforms.uWave.value += dt * 0.9;
          if (uniforms.uWave.value >= 1) uniforms.uWave.value = -1;
        }

        yaw += ((inside ? ndc.x * 0.5 : 0) - yaw) * k;
        pitch += ((inside ? -ndc.y * 0.35 : 0) - pitch) * k;
        spin += dt * 0.12;
        orb.rotation.set(pitch, spin + yaw, 0);

        rings.forEach((r, i) => {
          const a = t * r.speed + i * 2;
          r.sat.position.set(Math.cos(a) * r.radius, Math.sin(a) * r.radius, 0);
          r.pivot.rotation.z += dt * 0.05 * (i ? -1 : 1);
        });

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
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      resize();
      el.dataset.ready = "";

      cleanup = () => {
        running = false;
        cancelAnimationFrame(frame);
        io.disconnect();
        ro.disconnect();
        themeWatch.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        document.removeEventListener("visibilitychange", onVisibility);
        geo.dispose();
        mat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        satGeo.dispose();
        satMats.forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} aria-hidden className={cn("pointer-events-none", className)} />;
}

