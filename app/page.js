"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

export default function Home() {
  const reduceMotion = usePrefersReducedMotion();

  // cursor
  const [cursor, setCursor] = useState({ x: 0, y: 0, active: false, big: false });
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMove = (e) =>
      setCursor((c) => ({ ...c, x: e.clientX, y: e.clientY, active: true }));
    const onLeave = () => setCursor((c) => ({ ...c, active: false, big: false }));

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // scroll progress
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max <= 0 ? 0 : h.scrollTop / max);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // spotlight (mouse follow)
  const [spot, setSpot] = useState({ x: 50, y: 25 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduceMotion) return;

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setSpot({ x: clamp(x, 0, 100), y: clamp(y, 0, 100) });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  // hero tilt
  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  useEffect(() => {
    if (reduceMotion) return;
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - 0.5) * 10;
      const rx = (0.5 - py) * 10;
      setTilt({ rx: clamp(rx, -10, 10), ry: clamp(ry, -10, 10) });
    };

    const onLeave = () => setTilt({ rx: 0, ry: 0 });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion]);

  const tags = useMemo(
    () => ["NEXT JS", "NODE JS", "REACT", "DESIGN SYSTEMS", "360° TOURS", "TELEGRAM BOTS", "PERFORMANCE"],
    []
  );

  const hoverableProps = {
    onMouseEnter: () => setCursor((c) => ({ ...c, big: true })),
    onMouseLeave: () => setCursor((c) => ({ ...c, big: false })),
  };

  const heroCardClass = [
    "relative w-[300px] sm:w-[320px] aspect-[9/16] rounded-[40px]",
    "border border-white/20 bg-white/[0.03] overflow-hidden p-3 md:p-4",
    "shadow-[0_35px_140px_rgba(0,0,0,0.70)]",
  ].join(" ");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* custom cursor */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[999] hidden md:block"
        style={{ opacity: cursor.active ? 1 : 0 }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
          style={{
            left: cursor.x,
            top: cursor.y,
            width: cursor.big ? 56 : 34,
            height: cursor.big ? 56 : 34,
            transition: "width 180ms ease, height 180ms ease, opacity 180ms ease",
          }}
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ left: cursor.x, top: cursor.y, width: 6, height: 6, opacity: 0.9 }}
        />
      </div>

      {/* scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-px bg-white/10">
        <div className="h-px bg-white" style={{ width: `${Math.round(progress * 1000) / 10}%` }} />
      </div>

      {/* LUX BACKGROUND */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[0]">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.12), transparent 55%)`,
            transition: reduceMotion ? "none" : "background 120ms ease",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,transparent_32%,rgba(0,0,0,0.92)_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:160px_160px]" />
        <div className="absolute -top-40 left-[-45%] h-[520px] w-[190%] rotate-6 bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-3xl opacity-60" />
        <div className="absolute left-[10%] top-[18%] h-[240px] w-[240px] rounded-full bg-white/[0.05] blur-3xl" />
        <div className="absolute right-[10%] top-[45%] h-[280px] w-[280px] rounded-full bg-white/[0.045] blur-3xl" />
        <div className="absolute left-[42%] bottom-[8%] h-[320px] w-[320px] rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      {/* noise */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"120\" height=\"120\" filter=\"url(%23n)\" opacity=\"0.6\"/></svg>')",
        }}
      />

      <div className="relative z-[2] max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
        {/* nav */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl border border-white/20 bg-white/[0.02] backdrop-blur-sm grid place-items-center overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <Image
                src="/favicon.png"
                alt="Ozodbek Abdullayev logo"
                width={26}
                height={26}
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] tracking-[0.35em] uppercase text-white/70">Portfolio</p>
              <p className="text-sm font-medium">Ozodbek Abdullayev</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.3em] uppercase text-white/60">
            <a {...hoverableProps} className="hover:text-white transition" href="#work">
              Work
            </a>
            <a {...hoverableProps} className="hover:text-white transition" href="#about">
              About
            </a>
            <a {...hoverableProps} className="hover:text-white transition" href="#contact">
              Contact
            </a>
          </div>
        </header>

        {/* marquee */}
        <div className="mt-10 overflow-hidden border-y border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <div
            className={`whitespace-nowrap py-3 text-[11px] tracking-[0.4em] uppercase text-white/60 ${
              reduceMotion ? "" : "animate-[marquee_18s_linear_infinite]"
            }`}
          >
            <span className="mx-6">Creative Engineer</span>
            <span className="mx-6">Full Stack Developer</span>
            <span className="mx-6">Founder Mindset</span>
            <span className="mx-6">Design Systems</span>
            <span className="mx-6">Performance First</span>
            <span className="mx-6">Creative Engineer</span>
            <span className="mx-6">Full Stack Developer</span>
            <span className="mx-6">Founder Mindset</span>
            <span className="mx-6">Design Systems</span>
            <span className="mx-6">Performance First</span>
          </div>
        </div>

        {/* hero */}
        <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start">
          <div className="relative">
            <div className="hidden lg:block absolute -left-10 top-2">
              <p className="text-[10px] tracking-[0.55em] uppercase text-white/35 rotate-90 origin-left">
                OZODBEK • ABDULLAYEV • FULL STACK
              </p>
            </div>

            <p className="text-[11px] tracking-[0.35em] uppercase text-white/55">
              FULL STACK DEVELOPER • FOUNDER
            </p>

            <h1 className="mt-4 text-[40px] sm:text-[50px] lg:text-[64px] font-semibold leading-[0.9] tracking-tight">
              I build{" "}
              <span className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/[0.03] px-3 pb-1 text-[28px] sm:text-[34px] lg:text-[40px] align-middle shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                real
              </span>{" "}
              digital
              <br />
              products for
              <br />
              businesses that
              <br />
              matter.
            </h1>

            <p className="mt-6 max-w-xl text-sm md:text-base text-white/70 leading-relaxed">
              I build business-driven digital products for real estate, startups, education, and service businesses.
              Using Next.js, Node.js, Tailwind CSS, Telegram bots, and immersive 360° tour technologies, I create
              systems that deliver real-world results.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {tags.map((t) => (
                <span
                  key={t}
                  {...hoverableProps}
                  className="rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-sm px-4 py-2 text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white hover:border-white/35 transition shadow-[0_20px_70px_rgba(0,0,0,0.55)]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                {...hoverableProps}
                href="#work"
                className="rounded-full bg-white text-black px-7 py-3 text-sm font-medium hover:bg-white/90 transition shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
              >
                View Work
              </a>
              <a
                {...hoverableProps}
                href="#contact"
                className="rounded-full border border-white/25 bg-white/[0.02] backdrop-blur-sm px-7 py-3 text-sm font-medium text-white/85 hover:border-white/60 hover:text-white transition shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
              >
                Contact
              </a>
            </div>
          </div>

          {/* right card */}
          <div className="relative flex justify-start lg:justify-end">
            <div
              className="absolute -inset-6 rounded-[50px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_55%)] blur-2xl"
              aria-hidden
            />

            <div
              ref={heroRef}
              {...hoverableProps}
              className={heroCardClass}
              style={{
                transform: reduceMotion
                  ? "none"
                  : `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: "transform 120ms ease",
              }}
            >
              <div className="relative h-full w-full rounded-[34px] overflow-hidden">
                <Image
                  src="/IMG_8387.JPG"
                  alt="Ozodbek portrait"
                  fill
                  priority
                  className="object-cover object-[50%_18%]"
                  style={{ filter: "contrast(1.14) saturate(1.08) brightness(0.98)" }}
                />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_35%,rgba(0,0,0,0.78)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
                <div className="absolute -top-20 left-[-30%] h-72 w-[160%] rotate-6 bg-gradient-to-b from-white/12 to-transparent blur-2xl opacity-65" />
                <div className="absolute inset-0 rounded-[34px] border border-white/15" />
              </div>
            </div>

            <div className="hidden lg:block absolute -right-10 top-10 w-24 h-24 border border-white/10 rounded-[28px]" />
            <div className="hidden lg:block absolute -right-16 bottom-16 w-32 h-32 border border-white/10 rounded-[36px]" />
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="mt-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">Selected Work</h2>
            <p className="text-[10px] tracking-[0.45em] uppercase text-white/45">Case Studies</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[
              {
                k: "MOBILE PLATFORM",
                t: "Bandu — Queue Management System",
                d: "A digital queue platform for cafes, clinics, and service businesses. Full flow via business app and user app.",
                s: ["React Native", "Backend", "Payments"],
              },
              {
                k: "WEB • 360",
                t: "BM Group — 360° Real Estate Platform",
                d: "Immersive 360° tours, filtering, calculator, and apartment detail pages built for real sales workflows.",
                s: ["Next.js", "Tailwind", "360 Tour"],
              },
              {
                k: "EDTECH",
                t: "BushidoWords — Flashcard Learning Platform",
                d: "A learning system for vocabulary, kanji, and grammar with a clean UX and progressive structure.",
                s: ["React", "Node.js", "MongoDB"],
              },
              {
                k: "BOTS",
                t: "Telegram Bots — Automation & Lead Systems",
                d: "Bots for lead collection, ordering, announcements, and automated business operations.",
                s: ["Node.js", "Telegraf", "Integrations"],
              },
            ].map((p) => (
              <article
                key={p.t}
                {...hoverableProps}
                className="group rounded-[28px] border border-white/12 bg-white/[0.03] backdrop-blur-sm p-5 md:p-6 hover:bg-white/[0.05] transition shadow-[0_30px_120px_rgba(0,0,0,0.60)]"
              >
                <p className="text-[10px] tracking-[0.45em] uppercase text-white/45">{p.k}</p>
                <h3 className="mt-3 text-lg font-semibold">{p.t}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{p.d}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.s.map((x) => (
                    <span
                      key={x}
                      className="rounded-full border border-white/12 bg-white/[0.02] px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/65"
                    >
                      {x}
                    </span>
                  ))}
                </div>
                <div className="mt-6 h-px bg-white/10" />
                <p className="mt-3 text-[11px] text-white/55">
                  Hover → micro details • Click → case study (we’ll add it next)
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mt-16">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <p className="text-[10px] tracking-[0.45em] uppercase text-white/45">About</p>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="rounded-[28px] border border-white/12 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 shadow-[0_30px_120px_rgba(0,0,0,0.60)]">
              <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                I treat code as a product, not just technology.
              </h3>
              <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
                Every project starts with understanding the user, the problem, and the desired business outcome.
                Design and UX come first — code follows.
              </p>
              <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
                Bandu, BM Group 360, BushidoWords, and automation bots are real systems used in production.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 space-y-4 shadow-[0_30px_120px_rgba(0,0,0,0.60)]">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] tracking-[0.45em] uppercase text-white/45">Stack</p>
                <p className="mt-2 text-sm text-white/75">
                  Next.js, React, Node.js, Tailwind, MongoDB/PostgreSQL, Telegram bots, 360° tours.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] tracking-[0.45em] uppercase text-white/45">Principles</p>
                <p className="mt-2 text-sm text-white/75">
                  Minimal UI. Strong typography. Real-world UX. Performance.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] tracking-[0.45em] uppercase text-white/45">Availability</p>
                <p className="mt-2 text-sm text-white/75">Freelance, product build, partnerships.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mt-16 pb-6">
          <div className="rounded-[32px] border border-white/12 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 shadow-[0_30px_120px_rgba(0,0,0,0.60)]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-[10px] tracking-[0.45em] uppercase text-white/45">Contact</p>
                <h3 className="mt-3 text-2xl md:text-3xl font-semibold leading-tight">
                  Let’s build the next project
                  <span className="block">together.</span>
                </h3>
                <p className="mt-4 text-sm md:text-base text-white/70">
                  Share a short description of your project. I’ll propose the optimal solution, architecture, and UX approach.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2">
                  Telegram: @hasanovich_o
                </span>
                <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2">
                  Email: parzivalt15.09.2005@gmail.com
                </span>
                <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2">
                  Phone: +998 95-034-00-34
                </span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] tracking-[0.35em] uppercase text-white/35">
            made in black & white • ozodbek abdullayev
          </p>
        </section>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
