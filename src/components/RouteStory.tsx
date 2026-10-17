"use client";

import { useEffect, useRef } from "react";
import type { Map as MLMap, Marker as MLMarker, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ROUTE, STOPS, ROUTE_KM } from "@/data/route";
import "./route-story.css";

type LngLat = [number, number];

// ---------- geometrija rute ----------
const R = 6371000;
const rad = (d: number) => (d * Math.PI) / 180;
function dist(a: LngLat, b: LngLat) {
  const dp = rad(b[1] - a[1]);
  const dl = rad(b[0] - a[0]);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const CUM: number[] = [0];
for (let i = 1; i < ROUTE.length; i++) CUM.push(CUM[i - 1] + dist(ROUTE[i - 1], ROUTE[i]));
const LEN = CUM[CUM.length - 1];
// gdje je svaka postaja na trasi (u metrima)
const SD = STOPS.map((s) => (s.km / ROUTE_KM) * LEN);

function idxAt(d: number) {
  let lo = 0, hi = CUM.length - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (CUM[m] < d) lo = m + 1;
    else hi = m;
  }
  return Math.max(1, lo);
}
function pointAt(d: number): LngLat {
  d = Math.max(0, Math.min(LEN, d));
  const i = idxAt(d);
  const a = ROUTE[i - 1], b = ROUTE[i];
  const t = (d - CUM[i - 1]) / Math.max(1e-6, CUM[i] - CUM[i - 1]);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
function sliceTo(d: number): LngLat[] {
  if (d <= 0) return [];
  const i = idxAt(d);
  return [...ROUTE.slice(0, i), pointAt(d)];
}
function heading(a: LngLat, b: LngLat) {
  const y = Math.sin(rad(b[0] - a[0])) * Math.cos(rad(b[1]));
  const x = Math.cos(rad(a[1])) * Math.sin(rad(b[1])) - Math.sin(rad(a[1])) * Math.cos(rad(b[1])) * Math.cos(rad(b[0] - a[0]));
  return (Math.atan2(y, x) * 180) / Math.PI;
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const angDiff = (a: number, b: number) => ((b - a + 540) % 360) - 180;

// pregled cijele rute (početak i kraj priče)
const OVERVIEW = { center: [17.531, 43.037] as LngLat, zoom: 10.8, pitch: 31, bearing: 0 };

// koliko postaja koja dobiva scrolla: zadržavanje na postaji + vožnja do sljedeće
const N = STOPS.length;
const INTRO = 0.6; // u jedinicama poglavlja
const OUTRO = 0.9;
const UNITS = INTRO + (N - 1) + OUTRO;

type Frame = { d: number; idx: number; phase: "intro" | "run" | "outro"; t: number };
const lastStop = (d: number) => {
  let i = 0;
  while (i < N - 1 && SD[i + 1] <= d + 40) i++;
  return i;
};
function frameAt(p: number): Frame {
  const u = p * UNITS;
  if (u < INTRO) return { d: 0, idx: 0, phase: "intro", t: u / INTRO };
  if (u > INTRO + (N - 1)) return { d: LEN, idx: N - 1, phase: "outro", t: (u - INTRO - (N - 1)) / OUTRO };
  // ista brzina cijelom rutom: scroll se linearno pretvara u prijeđene metre
  const d = ((u - INTRO) / (N - 1)) * LEN;
  return { d, idx: lastStop(d), phase: "run", t: 0 };
}

export default function RouteStory() {
  const secRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current!;
    const $$ = <T extends Element>(s: string) => [...sec.querySelectorAll(s)] as T[];
    const chapters = $$<HTMLElement>(".x-rs-ch");
    const kmEl = sec.querySelector<HTMLElement>(".x-rs-km b span")!;
    const hint = sec.querySelector<HTMLElement>(".x-rs-hint")!;
    const gridEl = sec.querySelector<HTMLElement>(".x-rs-grid");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let map: MLMap | null = null;
    let ready = false;
    let headMk: MLMarker | null = null;
    const stopEls: HTMLDivElement[] = [];
    let p = 0, target = 0, cur = -1, raf = 0, smoothBearing = 0, bearingInit = false;
    let disposed = false;
    let visible = true;
    const mobile = () => innerWidth <= 860;

    function camera(fr: Frame) {
      const m = mobile();
      const near = { zoom: m ? 13.1 : 13.5, pitch: m ? 45 : 55 };
      if (fr.phase === "intro") {
        const t = ease(fr.t);
        const c = pointAt(0);
        return {
          center: [lerp(OVERVIEW.center[0], c[0], t), lerp(OVERVIEW.center[1], c[1], t)] as LngLat,
          zoom: lerp(OVERVIEW.zoom - (m ? 1.35 : 0), near.zoom, t),
          pitch: lerp(OVERVIEW.pitch, near.pitch, t),
          bearingTarget: null as number | null,
        };
      }
      if (fr.phase === "outro") {
        const t = ease(clamp(fr.t * 1.25));
        const c = pointAt(LEN);
        return {
          center: [lerp(c[0], OVERVIEW.center[0], t), lerp(c[1], OVERVIEW.center[1], t)] as LngLat,
          zoom: lerp(near.zoom, OVERVIEW.zoom - (m ? 1.35 : 0), t),
          pitch: lerp(near.pitch, OVERVIEW.pitch, t),
          bearingTarget: null,
        };
      }
      // vožnja: kamera prati točku stalnim zoomom i okreće se glatko u smjeru rijeke
      const ahead = pointAt(fr.d + 220);
      const hd = heading(pointAt(fr.d - 700), pointAt(fr.d + 1100));
      return { center: ahead, zoom: near.zoom, pitch: near.pitch, bearingTarget: hd };
    }

    function draw() {
      raf = 0;
      let settle = false;
      const gap = target - p;
      p = reduce || Math.abs(gap) < 0.00005 ? target : p + gap * 0.14;
      if (p !== target) settle = true;
      const fr = frameAt(p);
      const v = camera(fr);
      // glatka rotacija kamere (bez trzanja na zavojima rijeke)
      let bearing = 0;
      if (v.bearingTarget === null) {
        const k = fr.phase === "intro" ? ease(fr.t) : 1 - ease(clamp(fr.t * 1.25));
        const target = fr.phase === "intro" ? heading(pointAt(0), pointAt(900)) : heading(pointAt(LEN - 900), pointAt(LEN));
        bearing = target * k;
        smoothBearing = bearing;
        bearingInit = true;
      } else {
        if (!bearingInit) {
          smoothBearing = v.bearingTarget;
          bearingInit = true;
        }
        const diff = angDiff(smoothBearing, v.bearingTarget);
        smoothBearing += diff * (reduce ? 1 : 0.06);
        bearing = smoothBearing;
        if (Math.abs(diff) > 0.15) settle = true;
      }

      if (map) {
        const m = mobile();
        map.jumpTo({
          center: v.center,
          zoom: v.zoom,
          pitch: v.pitch,
          bearing,
          padding: m
            ? { top: 80, bottom: (gridEl?.offsetHeight || innerHeight * 0.4) + 10, left: 0, right: 0 }
            : { top: 0, bottom: 0, left: Math.min(620, innerWidth * 0.4), right: 0 },
        });
        if (ready) {
          const line = sliceTo(fr.d);
          (map.getSource("done") as GeoJSONSource).setData({
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: line.length > 1 ? line : [] },
          });
        }
        if (headMk) headMk.setLngLat(pointAt(fr.d));
        stopEls.forEach((el, i) => {
          el.classList.toggle("lit", fr.d >= SD[i] - 30);
          el.classList.toggle("now", i === fr.idx && fr.phase !== "outro");
          el.classList.toggle("next", i === fr.idx + 1);
        });
      }
      kmEl.textContent = ((fr.d / LEN) * ROUTE_KM).toFixed(1).replace(".", ",");
      hint.style.opacity = p > 0.02 ? "0" : "1";
      sec.classList.toggle("x-rs-over", fr.phase !== "run");
      if (settle && visible && !raf) raf = requestAnimationFrame(draw);

      if (fr.idx !== cur) {
        cur = fr.idx;
        chapters.forEach((c, i) => {
          c.classList.toggle("on", i === cur);
          c.classList.toggle("past", i < cur);
        });
      }
    }

    function onScroll() {
      const r = sec.getBoundingClientRect();
      const len = r.height - innerHeight;
      target = clamp(-r.top / len);
      visible = r.top < innerHeight && r.bottom > 0;
      if (!raf) raf = requestAnimationFrame(draw);
    }

    (async () => {
      let maplibregl: typeof import("maplibre-gl");
      try {
        maplibregl = await import("maplibre-gl");
      } catch {
        sec.classList.add("x-rs-fallback");
        return;
      }
      if (disposed || !mapRef.current) return;
      try {
        const fr = frameAt(p);
        const v = camera(fr);
        map = new maplibregl.Map({
          container: mapRef.current,
          style: "https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json",
          interactive: false,
          attributionControl: false,
          fadeDuration: 0,
          center: v.center,
          zoom: v.zoom,
          pitch: v.pitch,
          maxPitch: 70,
        });
      } catch {
        sec.classList.add("x-rs-fallback");
        return;
      }
      map.on("error", () => {
        /* pločice koje ne stignu nisu razlog za rušenje priče */
      });
      map.on("style.load", () => {
        if (!map) return;
        map.addSource("all", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: ROUTE } },
        });
        map.addSource("done", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
        });
        map.addLayer({
          id: "all",
          type: "line",
          source: "all",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#5b6b8c", "line-opacity": 0.55, "line-width": 1.4, "line-dasharray": [1.6, 2.2] },
        });
        map.addLayer({
          id: "done-case",
          type: "line",
          source: "done",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#ffffff", "line-opacity": 0.9, "line-width": ["interpolate", ["linear"], ["zoom"], 10, 3.5, 14, 5.5] },
        });
        map.addLayer({
          id: "done",
          type: "line",
          source: "done",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#e3030f", "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1.8, 14, 3] },
        });
        ready = true;
        draw();
      });

      STOPS.forEach((s, i) => {
        const el = document.createElement("div");
        const side = i === 0 ? "" : i % 2 ? " l" : "";
        const major = ["Metković", "Opuzen", "Komin", "Ploče"].includes(s.name) ? " major" : "";
        el.className = "x-rs-mk" + side + major;
        el.innerHTML = `<i></i><b></b><span><em>${s.label} km</em>${s.name}</span>`;
        stopEls.push(el);
        new maplibregl.Marker({ element: el }).setLngLat(pointAt(SD[i])).addTo(map!);
      });
      const head = document.createElement("div");
      head.className = "x-rs-head";
      head.innerHTML = "<b></b>";
      headMk = new maplibregl.Marker({ element: head }).setLngLat(pointAt(0)).addTo(map);
      draw();
    })();

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
    p = target;
    return () => {
      disposed = true;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      map?.remove();
    };
  }, []);

  return (
    <section ref={secRef} className="x-rs" id="ruta" aria-label="Ruta Maratona lađa">
      <div className="x-rs-pin">
        <div ref={mapRef} className="x-rs-map" role="img" aria-label="Karta rute niz Neretvu od Metkovića do Ploča" />
        <div className="x-rs-shade" aria-hidden="true" />
        <div className="x-wrap x-rs-grid">
          <div className="x-rs-text">
            <p className="x-tag">Ruta · Metković · Ploče</p>
            <div className="x-rs-chapters">
              {STOPS.map((s, i) => (
                <article key={s.name} className={"x-rs-ch" + (i === 0 ? " on" : "")}>
                  <div className="x-rs-k">
                    {s.label} km{s.sub ? ` · ${s.sub}` : ""}
                  </div>
                  <h3 className="x-rs-h">{s.name}</h3>
                  <p className="x-rs-p">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="x-rs-km" aria-live="off">
          <small>Prijeđeno</small>
          <b>
            <span>0,0</span>
            <em>km</em>
          </b>
          <small>od 22,58</small>
        </div>
        <div className="x-rs-hint">Skrolaj niz Neretvu</div>
        <p className="x-rs-credit">© OpenStreetMap · CARTO</p>
      </div>
    </section>
  );
}
