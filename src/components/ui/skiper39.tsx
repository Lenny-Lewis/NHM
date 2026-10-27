"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export interface CrowdCanvasProps {
  src: string;
  /** Horizontal sprite cells; preserves the supplied component's naming. */
  rows?: number;
  /** Vertical sprite cells. */
  cols?: number;
  onReady?: () => void;
  onError?: () => void;
}

type SpriteRect = [number, number, number, number];
interface Peep {
  rect: SpriteRect;
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
}

export function CrowdCanvas({
  src,
  rows = 15,
  cols = 7,
  onReady,
  onError,
}: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onReady, onError });
  callbacks.current = { onReady, onError };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      callbacks.current.onError?.();
      return;
    }
    let alive = true;
    let loaded = false;
    let visible = !document.hidden;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    let dpr = 1;
    const stage = { width: 0, height: 0 };
    const img = new Image();
    const allPeeps: Peep[] = [];
    const available: Peep[] = [];
    const crowd: Peep[] = [];
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const render = () => {
      if (!alive || !visible) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, stage.width, stage.height);
      for (const peep of crowd) {
        ctx.save();
        ctx.translate(peep.x, peep.y);
        ctx.scale(peep.scaleX, 1);
        ctx.drawImage(img, ...peep.rect, 0, 0, peep.width, peep.height);
        ctx.restore();
      }
    };

    const addPeep = (): Peep | undefined => {
      if (!alive || !available.length) return;
      const peep = available.splice(
        Math.floor(Math.random() * available.length),
        1,
      )[0];
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 80 - 190 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      peep.x = direction === 1 ? -peep.width : stage.width + peep.width;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      if (!reduced) {
        const walk = gsap.timeline({
          onComplete: () => {
            const index = crowd.indexOf(peep);
            if (index >= 0) crowd.splice(index, 1);
            available.push(peep);
            addPeep();
          },
        });
        walk.timeScale(randomRange(0.5, 1.5));
        walk.to(
          peep,
          { duration: 10, x: direction === 1 ? stage.width : 0, ease: "none" },
          0,
        );
        walk.to(
          peep,
          {
            duration: 0.25,
            repeat: 39,
            yoyo: true,
            y: startY - 10,
            ease: "power1.inOut",
          },
          0,
        );
        peep.walk = walk;
        if (!visible) walk.pause();
      } else peep.x = randomRange(peep.width, stage.width);
      return peep;
    };

    const resize = () => {
      if (!loaded || !alive) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      if (!stage.width || !stage.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(stage.width * dpr);
      canvas.height = Math.round(stage.height * dpr);
      allPeeps.forEach((peep) => {
        peep.walk?.kill();
        peep.walk = null;
      });
      crowd.length = 0;
      available.length = 0;
      available.push(...allPeeps);
      const scale = Math.min(1, stage.width < 640 ? 0.65 : 0.85);
      allPeeps.forEach((peep) => {
        peep.width = peep.rect[2] * scale;
        peep.height = peep.rect[3] * scale;
      });
      const count = Math.min(available.length, stage.width < 640 ? 32 : 60);
      for (let i = 0; i < count; i++) addPeep()?.walk?.progress(Math.random());
      render();
    };

    const syncPlayback = () => {
      visible = !document.hidden;
      crowd.forEach((peep) => {
        if (visible && !reduced) peep.walk?.resume();
        else peep.walk?.pause();
      });
      gsap.ticker.remove(render);
      if (visible && !reduced && loaded) gsap.ticker.add(render);
      render();
    };
    const onMotionChange = () => {
      reduced = motionQuery.matches;
      resize();
      syncPlayback();
    };
    img.onload = () => {
      if (!alive) return;
      const horizontal = Math.max(1, Math.floor(rows));
      const vertical = Math.max(1, Math.floor(cols));
      const width = img.naturalWidth / horizontal;
      const height = img.naturalHeight / vertical;
      for (let i = 0; i < horizontal * vertical; i++)
        allPeeps.push({
          rect: [
            (i % horizontal) * width,
            Math.floor(i / horizontal) * height,
            width,
            height,
          ],
          width,
          height,
          x: 0,
          y: 0,
          anchorY: 0,
          scaleX: 1,
          walk: null,
        });
      loaded = true;
      resize();
      syncPlayback();
      callbacks.current.onReady?.();
    };
    img.onerror = () => {
      if (alive) callbacks.current.onError?.();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", syncPlayback);
    motionQuery.addEventListener("change", onMotionChange);
    img.src = src;
    return () => {
      alive = false;
      observer.disconnect();
      img.onload = null;
      img.onerror = null;
      document.removeEventListener("visibilitychange", syncPlayback);
      motionQuery.removeEventListener("change", onMotionChange);
      gsap.ticker.remove(render);
      allPeeps.forEach((peep) => peep.walk?.kill());
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export function Skiper39({
  onReady,
  onError,
}: Pick<CrowdCanvasProps, "onReady" | "onError">) {
  return (
    <div className="relative h-full w-full bg-[#f5f3ec] text-black">
      <CrowdCanvas
        src="https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png"
        rows={15}
        cols={7}
        onReady={onReady}
        onError={onError}
      />
    </div>
  );
}

export default Skiper39;

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas.
 * Inspired by https://codepen.io/zadvorsky/pen/xxwbBQV
 * Illustrations: https://www.openpeeps.com/
 * Adapted from Skiper UI, author @gurvinder-singh02 (https://gxuri.me).
 * Free use requires attribution to Skiper UI; credit is shown in the loader.
 */
