"use client";

import Link from "next/link";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./home.css";

// Službena ruta Maratona lađa, Metković -> Ploče, 22,58 km (izvor: maraton-ladja.hr).
const STOPS = [
  { km: 0, label: "0,0", name: "Metković", sub: "START", desc: "Početak epske borbe. Spektakularan start ispod mosta, stotine lađa kreću istovremeno uz gromoglasno navijanje i zvukove sirena." },
  { km: 4.5, label: "4,5", name: "Kula Norinska", desc: "Prolazak uz staru kulu gdje se rječica Norin ulijeva u Neretvu. Ovdje je rijeka nešto uža i česta su prva velika pretjecanja." },
  { km: 6.0, label: "6,0", name: "Krvavac", desc: "Živopisno mjesto s velikim brojem navijača na obali. Lađari ovdje osjećaju prvi pravi umor, ali ih publika nosi naprijed." },
  { km: 9.5, label: "9,5", name: "Opuzen", desc: "Središte doline i jedino mjesto gdje je dozvoljena zamjena veslača. Ovdje vlada ogromna gužva, a taktika brze zamjene često odlučuje pobjednika." },
  { km: 13.0, label: "13,0", name: "Komin", desc: "Najduže mjesto na ruti s tradicijom apsolutno najžešćeg navijanja. Lokalni navijači priređuju bakljade i vatrenu podršku koja daje novi elan." },
  { km: 16.5, label: "16,5", name: "Banja", desc: "Ulazak u donji, širi tok. Ovdje se rijeka mijenja, vjetar i valovi postaju jači, a izdržljivost ekipa se stavlja na najveći test." },
  { km: 18.0, label: "18,0", name: "Šarić Struga", desc: "Zadnji trzaji snage prije samog ušća. Publika neumorno bodri veslače koji sada daju svoje posljednje atome snage." },
  { km: 19.5, label: "19,5", name: "Rogotin", desc: "Prelazak iz rijeke u jezero i morski dio. Specifičan pejzaž i teža, slana voda zahtijevaju potpunu promjenu ritma zaveslaja." },
  { km: 20.5, label: "20,5", name: "Čeveljuša", desc: "Prolazak kroz kanal i priprema za zadnju dionicu. Ovdje se već osjeća miris mora, a lađari skupljaju zadnje rezerve snage." },
  { km: 21.5, label: "21,5", name: "Stablina", desc: "Zadnje naselje pred ciljem. Bodrenje s obale postaje sve glasnije dok se lađari pripremaju za finalni sprint i ulazak u luku." },
  { km: 22.58, label: "22,58", name: "Ploče", sub: "CILJ", desc: "Veličanstveni cilj. Ovdje se okrunjuju pobjednici maratona, slavi izdržljivost i završava ova teška bitka na točno 22.580 metara od starta." },
];
const ROUTE_KM = 22.58;

export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add("js");

    const $ = <T extends Element = Element>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
    const $$ = <T extends Element = Element>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    const cleanups: Array<() => void> = [];

    // ---- odbrojavanje ----
    // Maraton je druge subote u kolovozu u 17:00 = 14.8.2027.
    // TODO Nedo: potvrdi datum s udrugom pa promijeni samo ovu liniju.
    const RACE_DATE = new Date("2027-08-14T17:00:00+02:00");
    const pad = (n: number) => String(n).padStart(2, "0");
    const cd = (s: string) => $(`[data-cd="${s}"]`);
    function tick() {
      const diff = RACE_DATE.getTime() - Date.now();
      if (diff <= 0) {
        ["d", "h", "m", "s"].forEach((k) => {
          const el = cd(k);
          if (el) el.textContent = "00";
        });
        return;
      }
      const d = cd("d"), h = cd("h"), m = cd("m"), s = cd("s");
      if (d) d.textContent = String(Math.floor(diff / 864e5));
      if (h) h.textContent = pad(Math.floor((diff % 864e5) / 36e5));
      if (m) m.textContent = pad(Math.floor((diff % 36e5) / 6e4));
      if (s) s.textContent = pad(Math.floor((diff % 6e4) / 1e3));
    }
    tick();
    const tickId = setInterval(tick, 1000);
    cleanups.push(() => clearInterval(tickId));

    // ---- reveal ----
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.14 }
    );
    $$(".x-r").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // ---- brojači ----
    const fmt = (v: number, dec: number) => v.toLocaleString("hr-HR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          const el = e.target as HTMLElement;
          const to = parseFloat(el.dataset.to || "0");
          const dec = +(el.dataset.dec || 0);
          const suf = el.dataset.suffix || "";
          if (reduce) {
            el.textContent = fmt(to, dec) + suf;
            return;
          }
          const t0 = performance.now(), dur = 1500;
          (function step(now: number) {
            const p = clamp((now - t0) / dur), v = to * (1 - Math.pow(1 - p, 3));
            el.textContent = fmt(v, dec) + suf;
            if (p < 1) requestAnimationFrame(step);
          })(t0);
        }),
      { threshold: 0.6 }
    );
    $$("[data-to]").forEach((el) => cio.observe(el));
    cleanups.push(() => cio.disconnect());

    // ---- izjava: riječi se pale kako skrolaš ----
    const scrub = $(".x-scrub");
    const words: HTMLSpanElement[] = [];
    if (scrub) {
      (function split(node: Node) {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            (n.textContent || "").split(/([ \t\r\n]+)/).forEach((t) => {
              if (!t.trim()) {
                frag.appendChild(document.createTextNode(t));
                return;
              }
              const s = document.createElement("span");
              s.textContent = t;
              words.push(s);
              frag.appendChild(s);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) split(n);
        });
      })(scrub);
    }
    let lit = -1;

    // ---- ruta: live tracker (prava karta, 11 postaja) ----
    const route = $(".x-route");
    const base = $<SVGPathElement>("#xBase");
    const trail = $<SVGPathElement>("#xTrail");
    const glow = $<SVGPathElement>("#xGlow");
    const dot = $("#xDot");
    const kmEl = $("#xKm");
    const mapImg = $<HTMLImageElement>("#xMapImg");
    const mapSvg = $<SVGSVGElement>("#xMapSvg");
    const stopKmEl = $("#xStopKm");
    const stopNameEl = $("#xStopName");
    const stopDescEl = $("#xStopDesc");
    let L = 0;
    const fr = STOPS.map((s) => s.km / ROUTE_KM);
    let sg: SVGGElement[] = [];
    const railItems = $$(".x-rail-item");
    let q = 0, act = -1;

    if (base && trail && glow && dot && kmEl) {
      L = base.getTotalLength();
      [trail, glow].forEach((p) => {
        p.style.strokeDasharray = String(L);
        p.style.strokeDashoffset = String(L);
      });
      sg = STOPS.map((_s, i) => ({ i, g: $<SVGGElement>(`#xs${i}`) }))
        .filter((e): e is { i: number; g: SVGGElement } => !!e.g)
        .map(({ i, g }) => {
          const pt = base.getPointAtLength(L * fr[i]);
          g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          g.dataset.idx = String(i);
          return g;
        });
    }

    // ---- tri desetljeća: scrubbing timeline ----
    const hist = $(".x-hist");
    const yearEl = $("#xYear");
    const histFill = $<HTMLElement>("#xHistFill");
    const hstops = $$(".x-hstop");
    let hact = -1;

    // ---- kursor + magnetični gumbi ----
    let cur: HTMLDivElement | null = null;
    let tx = -200, ty = -200, cx = -200, cy = -200;
    if (fine && !reduce) {
      cur = document.createElement("div");
      cur.className = "x-cur";
      cur.innerHTML = "<span></span>";
      document.body.appendChild(cur);
      const onMove = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
      };
      addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => removeEventListener("pointermove", onMove));

      const onOver = (e: PointerEvent) => {
        const t = (e.target as HTMLElement).closest?.("[data-cursor]") as HTMLElement | null;
        cur!.classList.toggle("big", !!t);
        (cur!.firstChild as HTMLElement).textContent = t ? t.dataset.cursor || "" : "";
      };
      document.addEventListener("pointerover", onOver);
      cleanups.push(() => document.removeEventListener("pointerover", onOver));

      $$<HTMLElement>("[data-magnetic]").forEach((b) => {
        const onBMove = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          b.style.setProperty("--mx", (e.clientX - r.left - r.width / 2) * 0.22 + "px");
          b.style.setProperty("--my", (e.clientY - r.top - r.height / 2) * 0.3 + "px");
        };
        const onBLeave = () => {
          b.style.setProperty("--mx", "0px");
          b.style.setProperty("--my", "0px");
        };
        b.addEventListener("pointermove", onBMove as EventListener);
        b.addEventListener("pointerleave", onBLeave);
        cleanups.push(() => {
          b.removeEventListener("pointermove", onBMove as EventListener);
          b.removeEventListener("pointerleave", onBLeave);
        });
      });
      cleanups.push(() => cur?.remove());
    }

    // ---- glavna petlja ----
    const hero = $<HTMLElement>("#top");
    const prog = $<HTMLElement>("#xProg");
    const bg = $<HTMLElement>("#xBg");
    const bandAnims: Animation[] = [];
    const onLoad = () => $$(".x-track").forEach((t) => t.getAnimations().forEach((a) => bandAnims.push(a)));
    addEventListener("load", onLoad);
    cleanups.push(() => removeEventListener("load", onLoad));

    let last = scrollY, vel = 0, rate = 1;
    let raf = 0;
    function loop() {
      const y = scrollY, vh = innerHeight;
      vel += (Math.abs(y - last) - vel) * 0.12;
      last = y;

      const docH = document.documentElement.scrollHeight - vh;
      if (prog) prog.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;

      if (hero && y < vh * 1.3) {
        hero.style.setProperty("--py", (y * 0.32).toFixed(1));
        hero.style.setProperty("--pp", clamp(y / (vh * 0.85)).toFixed(3));
      }

      const target = reduce ? 1 : 1 + Math.min(vel * 0.35, 6);
      rate += (target - rate) * 0.1;
      bandAnims.forEach((a) => {
        try {
          a.playbackRate = rate;
        } catch {
          /* noop */
        }
      });

      if (scrub && bg) {
        const sr = scrub.parentElement!.getBoundingClientRect();
        bg.style.setProperty("--bw", ((sr.top - vh) * 0.12).toFixed(1));

        const r = scrub.getBoundingClientRect();
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
        const n = reduce ? words.length : Math.ceil(p * words.length);
        if (n !== lit) {
          lit = n;
          words.forEach((w, i) => w.classList.toggle("on", i < n));
        }
      }

      if (route && base && trail && glow && dot && kmEl) {
        const rr = route.getBoundingClientRect();
        const tot = (route as HTMLElement).offsetHeight - vh;
        if (rr.top < vh && rr.bottom > 0) {
          const tq = clamp((clamp(-rr.top / tot) - 0.05) / 0.88);
          q += (tq - q) * 0.14;
          const off = L * (1 - q);
          trail.style.strokeDashoffset = String(off);
          glow.style.strokeDashoffset = String(off);
          const pt = base.getPointAtLength(L * q);
          dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          if (mapImg && mapSvg) {
            const zoom = 1 + q * 0.4;
            const panX = (0.5 - pt.x / 1920) * 46 * q;
            const panY = (0.5 - pt.y / 578) * 46 * q;
            const t = `scale(${zoom.toFixed(3)}) translate(${panX.toFixed(2)}%, ${panY.toFixed(2)}%)`;
            mapImg.style.transform = t;
            mapSvg.style.transform = t;
          }
          const kmNow = q * ROUTE_KM;
          kmEl.textContent = kmNow.toFixed(1).replace(".", ",");
          let a = 0;
          for (let i = 0; i < fr.length; i++) if (q >= fr[i] - 0.004) a = i;
          if (a !== act) {
            act = a;
            sg.forEach((g) => g.classList.toggle("on", Number(g.dataset.idx) <= a));
            railItems.forEach((el, i) => el.classList.toggle("on", i === a));
            const s = STOPS[a];
            if (stopKmEl) stopKmEl.textContent = s.label + " KM" + (s.sub ? " · " + s.sub : "");
            if (stopNameEl) stopNameEl.textContent = s.name;
            if (stopDescEl) stopDescEl.textContent = s.desc;
          }
        }
      }

      if (hist && yearEl && histFill) {
        const hr = hist.getBoundingClientRect();
        const htot = (hist as HTMLElement).offsetHeight - vh;
        if (hr.top < vh && hr.bottom > 0) {
          const hp = clamp(-hr.top / htot);
          yearEl.textContent = String(Math.round(1998 + hp * (2027 - 1998)));
          histFill.style.width = (hp * 100).toFixed(2) + "%";
          const hi = hp >= 0.92 ? 2 : hp >= 0.12 ? 1 : 0;
          if (hi !== hact) {
            hact = hi;
            hstops.forEach((s, i) => s.classList.toggle("on", i === hi));
          }
        }
      }

      if (cur) {
        cx += (tx - cx) * 0.2;
        cy += (ty - cy) * 0.2;
        cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    cleanups.push(() => cancelAnimationFrame(raf));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="x-prog" id="xProg" />
      <div className="x-curtain" aria-hidden="true">
        <div>
          <b>
            Maraton <em>lađa</em>
          </b>
          <i />
        </div>
      </div>

      <Header transparent />

      {/* ================= 1. HERO ================= */}
      <section className="x-hero" id="top">
        <div className="x-hero-media">
          <img
            className="x-hero-img"
            src="https://maraton-ladja.hr/images/Maraton_Laa-2.jpg"
            alt="Lađe na Neretvi tijekom Maratona"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="x-hero-shade" />
        <div className="x-hero-bars" aria-hidden="true">
          <i />
          <i />
        </div>

        <div className="x-wrap x-hero-inner">
          <p className="x-eyebrow x-in" style={{ ["--d" as string]: "1.25s" }}>
            <i />
            30. izdanje · kolovoz 2027.
          </p>
          <h1 className="x-display x-h1" aria-label="Maraton lađa">
            <span className="x-line">
              <span style={{ ["--d" as string]: "1.3s" }}>Maraton</span>
            </span>
            <span className="x-line x-red">
              <span style={{ ["--d" as string]: "1.42s" }}>lađa</span>
            </span>
          </h1>

          <div className="x-hero-row">
            <div>
              <p className="x-lead x-in" style={{ ["--d" as string]: "1.6s" }}>
                22,5 kilometra tradicionalnim neretvanskim lađama, od Metkovića do Ploča. Deset vesala, jedan ritam bubnja, i rijeka koja na jedan dan postane stadion.
              </p>
              <div className="x-cta x-in" style={{ ["--d" as string]: "1.75s" }}>
                <Link className="x-btn" data-magnetic="" data-cursor="Otvori" href="/rezultati/arhiva">
                  <span>Rezultati 2026.</span>
                </Link>
                <a className="x-btn x-ghost" data-magnetic="" data-cursor="Skrolaj" href="#ruta">
                  <span>Ruta</span>
                </a>
              </div>
            </div>
            <div className="x-cd x-in" style={{ ["--d" as string]: "1.9s" }} aria-label="Odbrojavanje do starta">
              <p>Do starta</p>
              <div>
                <span>
                  <b data-cd="d">--</b>
                  <small>dana</small>
                </span>
                <span>
                  <b data-cd="h">--</b>
                  <small>sati</small>
                </span>
                <span>
                  <b data-cd="m">--</b>
                  <small>min</small>
                </span>
                <span>
                  <b data-cd="s">--</b>
                  <small>sek</small>
                </span>
              </div>
            </div>
          </div>

          <div className="x-score x-in" style={{ ["--d" as string]: "2.05s" }}>
            <div>
              <small>Start</small>
              <b>17:00</b>
            </div>
            <div>
              <small>Ruta</small>
              <b>22,5 km</b>
            </div>
            <div>
              <small>Posada</small>
              <b>10 veslača</b>
            </div>
            <div>
              <small>Cilj</small>
              <b>Ploče</b>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. TRAKA ================= */}
      <div className="x-band" aria-hidden="true">
        <div className="x-track">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>30. Maraton lađa ✦ Metković – Opuzen – Ploče ✦ 22,5 km ✦ 10 vesala ✦ jedan ritam ✦ kolovoz 2027. ✦</span>
          ))}
        </div>
      </div>

      {/* ================= 3. IZJAVA + BROJKE ================= */}
      <section className="x-statement" id="o-nama">
        <div className="x-bgword" id="xBg" aria-hidden="true">
          1998
        </div>
        <div className="x-wrap">
          <p className="x-tag x-r" style={{ marginBottom: "1.6rem" }}>
            Od 1998.
          </p>
          <p className="x-scrub">
            Prva utrka održana je 13. rujna 1998., po kiši, s <em>18 lađa</em> i preko <em>20&nbsp;000 gledatelja</em>. Danas je Maraton lađa središnji događaj doline Neretve.
          </p>

          <div className="x-stats">
            <div className="x-stat x-r">
              <b data-to="22.5" data-dec="1">
                22,5
              </b>
              <p>kilometara rute</p>
            </div>
            <div className="x-stat x-r" style={{ ["--d" as string]: ".08s" }}>
              <b data-to="30" data-suffix=".">
                30.
              </b>
              <p>jubilarno izdanje</p>
            </div>
            <div className="x-stat red x-r" style={{ ["--d" as string]: ".16s" }}>
              <b data-to="33">33</b>
              <p>identične lađe</p>
            </div>
            <div className="x-stat x-r" style={{ ["--d" as string]: ".24s" }}>
              <b data-to="400" data-suffix="+">
                400+
              </b>
              <p>veslača na rijeci</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. RUTA (pinned, live tracker na pravoj karti) ================= */}
      <section className="x-route" id="ruta">
        <div className="x-route-stick">
          <div className="x-wrap">
            <div className="x-route-head">
              <div>
                <p className="x-tag" style={{ marginBottom: "1rem" }}>
                  Nizvodno · Metković — Ploče
                </p>
                <h2 className="x-display x-h2">Ruta</h2>
              </div>
              <div className="x-km">
                <small>Prijeđeno</small>
                <b>
                  <span id="xKm">0,0</span>
                  <em>km</em>
                </b>
                <span>od 22,58</span>
              </div>
            </div>

            <div className="x-map">
              <img id="xMapImg" src="/images/ruta-karta.jpg" alt="Karta rute Maratona lađa, Metković – Ploče" />
              <svg id="xMapSvg" viewBox="0 0 1920 578" fill="none" aria-hidden="true" preserveAspectRatio="none">
                <defs>
                  <filter id="xBlur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                  <linearGradient id="xLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#c81e2c" />
                    <stop offset="1" stopColor="#1f5fd0" />
                  </linearGradient>
                </defs>
                <path
                  id="xBase"
                  d="M1900.0,75.0 C1888.3,76.7 1850.0,80.8 1830.0,85.0 C1810.0,89.2 1796.7,94.2 1780.0,100.0 C1763.3,105.8 1746.7,111.7 1730.0,120.0 C1713.3,128.3 1696.7,138.3 1680.0,150.0 C1663.3,161.7 1646.7,176.7 1630.0,190.0 C1613.3,203.3 1596.7,216.7 1580.0,230.0 C1563.3,243.3 1546.7,256.7 1530.0,270.0 C1513.3,283.3 1496.7,296.7 1480.0,310.0 C1463.3,323.3 1446.7,336.7 1430.0,350.0 C1413.3,363.3 1396.7,378.3 1380.0,390.0 C1363.3,401.7 1346.7,411.7 1330.0,420.0 C1313.3,428.3 1296.7,433.3 1280.0,440.0 C1263.3,446.7 1246.7,455.0 1230.0,460.0 C1213.3,465.0 1196.7,469.2 1180.0,470.0 C1163.3,470.8 1146.7,468.3 1130.0,465.0 C1113.3,461.7 1095.0,459.2 1080.0,450.0 C1065.0,440.8 1053.3,423.3 1040.0,410.0 C1026.7,396.7 1015.0,383.3 1000.0,370.0 C985.0,356.7 966.7,343.3 950.0,330.0 C933.3,316.7 918.3,303.3 900.0,290.0 C881.7,276.7 860.0,260.8 840.0,250.0 C820.0,239.2 800.0,230.8 780.0,225.0 C760.0,219.2 736.7,219.2 720.0,215.0 C703.3,210.8 692.5,206.7 680.0,200.0 C667.5,193.3 656.7,175.0 645.0,175.0 C633.3,175.0 620.8,201.7 610.0,200.0 C599.2,198.3 591.7,173.3 580.0,165.0 C568.3,156.7 555.0,147.8 540.0,150.0 C525.0,152.2 506.7,175.0 490.0,178.0 C473.3,181.0 455.0,174.3 440.0,168.0 C425.0,161.7 415.0,148.8 400.0,140.0 C385.0,131.2 366.7,121.3 350.0,115.0 C333.3,108.7 320.0,103.7 300.0,102.0 C280.0,100.3 250.8,104.0 230.0,105.0 C209.2,106.0 193.3,108.8 175.0,108.0 C156.7,107.2 138.3,102.7 120.0,100.0 C101.7,97.3 74.2,93.3 65.0,92.0"
                  stroke="rgba(255,255,255,.01)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="xGlow"
                  d="M1900.0,75.0 C1888.3,76.7 1850.0,80.8 1830.0,85.0 C1810.0,89.2 1796.7,94.2 1780.0,100.0 C1763.3,105.8 1746.7,111.7 1730.0,120.0 C1713.3,128.3 1696.7,138.3 1680.0,150.0 C1663.3,161.7 1646.7,176.7 1630.0,190.0 C1613.3,203.3 1596.7,216.7 1580.0,230.0 C1563.3,243.3 1546.7,256.7 1530.0,270.0 C1513.3,283.3 1496.7,296.7 1480.0,310.0 C1463.3,323.3 1446.7,336.7 1430.0,350.0 C1413.3,363.3 1396.7,378.3 1380.0,390.0 C1363.3,401.7 1346.7,411.7 1330.0,420.0 C1313.3,428.3 1296.7,433.3 1280.0,440.0 C1263.3,446.7 1246.7,455.0 1230.0,460.0 C1213.3,465.0 1196.7,469.2 1180.0,470.0 C1163.3,470.8 1146.7,468.3 1130.0,465.0 C1113.3,461.7 1095.0,459.2 1080.0,450.0 C1065.0,440.8 1053.3,423.3 1040.0,410.0 C1026.7,396.7 1015.0,383.3 1000.0,370.0 C985.0,356.7 966.7,343.3 950.0,330.0 C933.3,316.7 918.3,303.3 900.0,290.0 C881.7,276.7 860.0,260.8 840.0,250.0 C820.0,239.2 800.0,230.8 780.0,225.0 C760.0,219.2 736.7,219.2 720.0,215.0 C703.3,210.8 692.5,206.7 680.0,200.0 C667.5,193.3 656.7,175.0 645.0,175.0 C633.3,175.0 620.8,201.7 610.0,200.0 C599.2,198.3 591.7,173.3 580.0,165.0 C568.3,156.7 555.0,147.8 540.0,150.0 C525.0,152.2 506.7,175.0 490.0,178.0 C473.3,181.0 455.0,174.3 440.0,168.0 C425.0,161.7 415.0,148.8 400.0,140.0 C385.0,131.2 366.7,121.3 350.0,115.0 C333.3,108.7 320.0,103.7 300.0,102.0 C280.0,100.3 250.8,104.0 230.0,105.0 C209.2,106.0 193.3,108.8 175.0,108.0 C156.7,107.2 138.3,102.7 120.0,100.0 C101.7,97.3 74.2,93.3 65.0,92.0"
                  stroke="#c81e2c"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#xBlur)"
                  opacity=".55"
                />
                <path
                  id="xTrail"
                  d="M1900.0,75.0 C1888.3,76.7 1850.0,80.8 1830.0,85.0 C1810.0,89.2 1796.7,94.2 1780.0,100.0 C1763.3,105.8 1746.7,111.7 1730.0,120.0 C1713.3,128.3 1696.7,138.3 1680.0,150.0 C1663.3,161.7 1646.7,176.7 1630.0,190.0 C1613.3,203.3 1596.7,216.7 1580.0,230.0 C1563.3,243.3 1546.7,256.7 1530.0,270.0 C1513.3,283.3 1496.7,296.7 1480.0,310.0 C1463.3,323.3 1446.7,336.7 1430.0,350.0 C1413.3,363.3 1396.7,378.3 1380.0,390.0 C1363.3,401.7 1346.7,411.7 1330.0,420.0 C1313.3,428.3 1296.7,433.3 1280.0,440.0 C1263.3,446.7 1246.7,455.0 1230.0,460.0 C1213.3,465.0 1196.7,469.2 1180.0,470.0 C1163.3,470.8 1146.7,468.3 1130.0,465.0 C1113.3,461.7 1095.0,459.2 1080.0,450.0 C1065.0,440.8 1053.3,423.3 1040.0,410.0 C1026.7,396.7 1015.0,383.3 1000.0,370.0 C985.0,356.7 966.7,343.3 950.0,330.0 C933.3,316.7 918.3,303.3 900.0,290.0 C881.7,276.7 860.0,260.8 840.0,250.0 C820.0,239.2 800.0,230.8 780.0,225.0 C760.0,219.2 736.7,219.2 720.0,215.0 C703.3,210.8 692.5,206.7 680.0,200.0 C667.5,193.3 656.7,175.0 645.0,175.0 C633.3,175.0 620.8,201.7 610.0,200.0 C599.2,198.3 591.7,173.3 580.0,165.0 C568.3,156.7 555.0,147.8 540.0,150.0 C525.0,152.2 506.7,175.0 490.0,178.0 C473.3,181.0 455.0,174.3 440.0,168.0 C425.0,161.7 415.0,148.8 400.0,140.0 C385.0,131.2 366.7,121.3 350.0,115.0 C333.3,108.7 320.0,103.7 300.0,102.0 C280.0,100.3 250.8,104.0 230.0,105.0 C209.2,106.0 193.3,108.8 175.0,108.0 C156.7,107.2 138.3,102.7 120.0,100.0 C101.7,97.3 74.2,93.3 65.0,92.0"
                  stroke="url(#xLineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {STOPS.map(
                  (s, i) =>
                    (i === 0 || i === STOPS.length - 1 || s.name === "Opuzen" || s.name === "Komin") && (
                      <g key={s.name} id={`xs${i}`} className={"x-sg" + (i === 0 ? " on" : "")}>
                        <text className="x-svgtxt" x={i === 0 ? -16 : 16} y="-18" textAnchor={i === 0 ? "end" : "start"}>
                          {s.name.toUpperCase()}
                        </text>
                      </g>
                    )
                )}
                <g id="xDot">
                  <circle r="16" fill="#c81e2c" opacity=".25">
                    <animate attributeName="r" values="10;22;10" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".4;0;.4" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle r="7" fill="url(#xLineGrad)" stroke="#fff" strokeWidth="3" />
                </g>
              </svg>
            </div>

            <div className="x-stop-active">
              <small id="xStopKm">0,0 KM · START</small>
              <h3 className="x-display" id="xStopName">
                Metković
              </h3>
              <p id="xStopDesc">Početak epske borbe. Spektakularan start ispod mosta, stotine lađa kreću istovremeno uz gromoglasno navijanje i zvukove sirena.</p>
            </div>

            <div className="x-rail">
              {STOPS.map((s, i) => (
                <div key={s.name} className={"x-rail-item" + (i === 0 ? " on" : "")}>
                  <i />
                  <small>{s.label} km</small>
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4b. TRI DESETLJEĆA (pinned, scrubbing timeline) ================= */}
      <section className="x-hist" id="tri-desetljeca">
        <div className="x-hist-stick">
          <div className="x-wrap">
            <p className="x-tag" style={{ marginBottom: "1rem" }}>
              Tri desetljeća
            </p>
            <div className="x-hist-row">
              <h2 className="x-display x-h2">
                Godina
                <br />
                za godinom.
              </h2>
              <div className="x-hist-year">
                <b id="xYear">1998</b>
                <span>1998. — 2027.</span>
              </div>
            </div>
            <div className="x-hist-track">
              <i id="xHistFill" />
            </div>
            <div className="x-hist-stops">
              <div className="x-hstop on">
                <small>1998</small>
                <h3 className="x-display">Prva utrka</h3>
                <p>18 lađa i preko 20&nbsp;000 gledatelja, po kiši. Neretva postaje pozornica.</p>
              </div>
              <div className="x-hstop">
                <small>Iz godine u godinu</small>
                <h3 className="x-display">Tradicija koja raste</h3>
                <p>Ista posada, isti ritam bubnja — generacija za generacijom.</p>
              </div>
              <div className="x-hstop">
                <small>2027</small>
                <h3 className="x-display">30. izdanje</h3>
                <p>33 identične lađe, 400+ veslača. Jubilarni Maraton lađa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. NAJNOVIJE ================= */}
      <section className="x-news">
        <div className="x-wrap">
          <div className="x-sechead">
            <h2 className="x-display x-h2 x-r">Najnovije</h2>
            <Link href="/novosti" className="x-link x-r" data-cursor="Sve">
              Sve novosti
            </Link>
          </div>
          <div className="x-cards">
            <Link href="/novosti" className="x-card x-r" data-cursor="Čitaj">
              <div className="im">
                <img
                  src="https://maraton-ladja.hr/images/WhatsApp_Image_2026-09-21_at_14.20.32_1.jpeg"
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <time>24. rujna 2026.</time>
              <h3>Lađa na Neretvi, ne plastika: Maraton bez plastike</h3>
              <p>Četrdesetak volontera, ronilaca i članova udruga očistilo obalu i dno Neretve u Metkoviću.</p>
            </Link>
            <Link href="/novosti" className="x-card x-r" style={{ ["--d" as string]: ".1s" }} data-cursor="Čitaj">
              <div className="im">
                <img
                  src="https://maraton-ladja.hr/images/770067796_18110548478287565_831642774667007538_n-1-scaled.jpg"
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <time>12. kolovoza 2026.</time>
              <h3>UL Crni put i UL Gusar Komin podijelili tron 29. Maratona lađa</h3>
              <p>Dramatična završnica i neizvjesna borba za sam vrh na 22,5 km od Metkovića do Ploča.</p>
            </Link>
            <Link href="/novosti" className="x-card x-r" style={{ ["--d" as string]: ".2s" }} data-cursor="Čitaj">
              <div className="im">
                <img
                  src="https://maraton-ladja.hr/images/13-Maraton-ladarica-pobjednice-UL-Sisak.jpg"
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <time>12. kolovoza 2026.</time>
              <h3>Lađarice Siska slavile na 13. Maratonu lađarica</h3>
              <p>Neretvom je zaplovila ženska snaga i borbenost na dionici Metković – Opuzen.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 6. KALENDAR ================= */}
      <section className="x-cal">
        <div className="x-wrap">
          <div className="x-sechead">
            <h2 className="x-display x-h2 x-r">Kalendar 2027.</h2>
          </div>
          {/* TODO: datumi 2027. kad ih udruga potvrdi */}
          <div className="x-rows x-r">
            <Link href="/utrke/brzinske-utrke" className="x-row" data-cursor="Otvori">
              <b>Brzinske utrke</b>
              <span>Opuzen, datum potvrditi</span>
            </Link>
            <Link href="/utrke/maraton-ladarica" className="x-row" data-cursor="Otvori">
              <b>14. Maraton lađarica</b>
              <span>Metković – Opuzen, datum potvrditi</span>
            </Link>
            <Link href="/utrke/maraton-ladja" className="x-row hot" data-cursor="Otvori">
              <b>30. Maraton lađa</b>
              <span>Metković – Opuzen – Ploče, datum potvrditi</span>
            </Link>
            <Link href="/utrke/ladjarski-kupovi" className="x-row" data-cursor="Otvori">
              <b>Lađarski kupovi</b>
              <span>Cijela sezona</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 7. ISTRAŽI ================= */}
      <section className="x-explore" id="sadrzaj">
        <div className="x-wrap">
          <div className="x-sechead">
            <h2 className="x-display x-h2 x-r">Istraži</h2>
          </div>
          <div className="x-list">
            <Link href="/rezultati/poredak-po-godinama" className="x-item x-r" data-cursor="Otvori">
              <small>01</small>
              <h3 className="x-display">Rezultati</h3>
              <p>Poredak svih posada, po godinama</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/rezultati/kuca-slavnih" className="x-item x-r" data-cursor="Otvori">
              <small>02</small>
              <h3 className="x-display">Kuća slavnih</h3>
              <p>Pobjednici, rekordi i legende</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/galerija" className="x-item x-r" data-cursor="Otvori">
              <small>03</small>
              <h3 className="x-display">Galerija</h3>
              <p>Fotografije i snimke s rijeke</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/utrke/pravilnik-i-prijave" className="x-item x-r" data-cursor="Otvori">
              <small>04</small>
              <h3 className="x-display">Pravilnik i prijave</h3>
              <p>Uvjeti natjecanja i prijava ekipe</p>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 8. PARTNERI ================= */}
      <section className="x-partners" aria-label="Partneri">
        <div className="x-wrap" style={{ marginBottom: "2.4rem" }}>
          <p className="x-tag">Partneri i sponzori</p>
        </div>
        <div className="x-track" aria-hidden="true">
          {[0, 1].map((i) => (
            <span key={i} style={{ display: "contents" }}>
              <span className="gen">HEP</span>
              <span>Hrvatska turistička zajednica</span>
              <span>Ministarstvo turizma i sporta</span>
              <span>Dubrovačko-neretvanska županija</span>
              <span>Grad Metković</span>
              <span>Grad Opuzen</span>
              <span>Grad Ploče</span>
              <span>HRT</span>
              <span>Slobodna Dalmacija</span>
              <span>Radio Delta</span>
              <span>Radio Ploče</span>
            </span>
          ))}
        </div>
        <div className="x-track rev b" aria-hidden="true">
          {[0, 1].map((i) => (
            <span key={i} style={{ display: "contents" }}>
              <span>Hrvatska pošta</span>
              <span>Hrvatska lutrija</span>
              <span>Telemach</span>
              <span>Jadrolinija</span>
              <span>HPB</span>
              <span>ACI Marinas</span>
              <span>Janaf</span>
              <span>Luka Ploče</span>
              <span>LNG Hrvatska</span>
              <span>OIV</span>
              <span>Groupama</span>
              <span>Plinacro</span>
              <span>Hrvatske šume</span>
              <span>Karlovačko</span>
              <span>Terra Madre</span>
              <span>Vina Delmati</span>
              <span>Poljopromet</span>
            </span>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
