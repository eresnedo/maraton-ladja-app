"use client";

import Link from "next/link";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./home.css";

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

    // ---- ruta: live tracker ----
    const route = $(".x-route");
    const base = $<SVGPathElement>("#xBase");
    const trail = $<SVGPathElement>("#xTrail");
    const glow = $<SVGPathElement>("#xGlow");
    const dot = $("#xDot");
    const kmEl = $("#xKm");
    let L = 0;
    const fr = [0, 10 / 22.5, 1];
    let sg: Element[] = [];
    const stops = $$(".x-stop");
    const rbgs = $$<HTMLImageElement>(".x-rbg img");
    let q = 0, act = -1;

    if (base && trail && glow && dot && kmEl) {
      L = base.getTotalLength();
      [trail, glow].forEach((p) => {
        p.style.strokeDasharray = String(L);
        p.style.strokeDashoffset = String(L);
      });
      sg = [0, 1, 2].map((i) => {
        const g = $(`#xs${i}`)!;
        const pt = base.getPointAtLength(L * fr[i]);
        g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
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
          kmEl.textContent = (q * 22.5).toFixed(1).replace(".", ",");
          const a = q >= 0.995 ? 2 : q >= fr[1] ? 1 : 0;
          if (a !== act) {
            act = a;
            stops.forEach((s, i) => s.classList.toggle("on", i === a));
            sg.forEach((g, i) => g.classList.toggle("on", i <= a));
            rbgs.forEach((im, i) => im.classList.toggle("on", i === a));
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

      {/* ================= 4. RUTA (pinned, live tracker) ================= */}
      <section className="x-route" id="ruta">
        <div className="x-route-stick">
          <div className="x-rbg" aria-hidden="true">
            <img
              className="on"
              data-bg="0"
              src="https://maraton-ladja.hr/images/2022/udruga_ladjara_neretve_o_nama.jpg"
              alt=""
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <img
              data-bg="1"
              src="https://maraton-ladja.hr/images/slajd/celo_004.jpg"
              alt=""
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <img
              data-bg="2"
              src="https://maraton-ladja.hr/images/2022/neretva-luka-tambaca.jpg"
              alt=""
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="x-wrap">
            <div className="x-route-head">
              <div>
                <p className="x-tag" style={{ marginBottom: "1rem" }}>
                  Nizvodno
                </p>
                <h2 className="x-display x-h2">Ruta</h2>
              </div>
              <div className="x-km">
                <small>Prijeđeno</small>
                <b>
                  <span id="xKm">0,0</span>
                  <em>km</em>
                </b>
                <span>od 22,5</span>
              </div>
            </div>

            <div className="x-map">
              <svg viewBox="0 0 1200 380" fill="none" aria-hidden="true">
                <defs>
                  <filter id="xBlur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="7" />
                  </filter>
                </defs>
                <g stroke="rgba(255,255,255,.07)">
                  <path d="M0 95H1200M0 190H1200M0 285H1200M150 0V380M300 0V380M450 0V380M600 0V380M750 0V380M900 0V380M1050 0V380" />
                </g>
                <path
                  id="xBase"
                  d="M40 300 C 230 300 250 100 440 130 S 700 310 830 215 S 1020 70 1160 96"
                  stroke="rgba(255,255,255,.22)"
                  strokeWidth="3"
                  strokeDasharray="4 10"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="xLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#c81e2c" />
                    <stop offset="1" stopColor="#1f5fd0" />
                  </linearGradient>
                </defs>
                <path
                  id="xGlow"
                  d="M40 300 C 230 300 250 100 440 130 S 700 310 830 215 S 1020 70 1160 96"
                  stroke="#c81e2c"
                  strokeWidth="12"
                  strokeLinecap="round"
                  filter="url(#xBlur)"
                  opacity=".5"
                />
                <path
                  id="xTrail"
                  d="M40 300 C 230 300 250 100 440 130 S 700 310 830 215 S 1020 70 1160 96"
                  stroke="url(#xLineGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <g id="xs0" className="x-sg on">
                  <circle r="11" />
                  <text className="x-svgtxt" x="20" y="-22">
                    METKOVIĆ
                  </text>
                </g>
                <g id="xs1" className="x-sg">
                  <circle r="11" />
                  <text className="x-svgtxt" x="0" y="-28" textAnchor="middle">
                    OPUZEN
                  </text>
                </g>
                <g id="xs2" className="x-sg">
                  <circle r="11" />
                  <text className="x-svgtxt" x="-20" y="-22" textAnchor="end">
                    PLOČE
                  </text>
                </g>
                <g id="xDot">
                  <circle r="22" fill="#c81e2c" opacity=".22">
                    <animate attributeName="r" values="14;30;14" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".4;0;.4" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle r="10" fill="url(#xLineGrad)" stroke="#fff" strokeWidth="4" />
                </g>
              </svg>
            </div>

            <div className="x-stops">
              <div className="x-stop on">
                <small>01</small>
                <h3 className="x-display">Metković</h3>
                <p>Start u 17:00. Posadu čini deset veslača, bubnjar i parićar.</p>
              </div>
              <div className="x-stop">
                <small>02</small>
                <h3 className="x-display">Opuzen</h3>
                <p>Deset kilometara od starta. Jedino mjesto zamjene: do šest novih veslača.</p>
              </div>
              <div className="x-stop">
                <small>03</small>
                <h3 className="x-display">Ploče</h3>
                <p>Cilj nakon 22,5 kilometara. Zadnji kilometri odlučuju poredak.</p>
              </div>
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
