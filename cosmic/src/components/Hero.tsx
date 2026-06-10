import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { gsap } from "gsap";

const HLS_SRC =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
const ROLES = ["plant-floor engineer", "operations analyst", "tool builder", "problem quantifier"];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | undefined;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
    }
    return () => hls?.destroy();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      ).fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, delay: 0.3 },
        "<"
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        <span className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
          Collection '26
        </span>
        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          Bala Shunmugam
        </h1>
        <p className="blur-in text-lg md:text-2xl text-text-primary/90 mb-6">
          A{" "}
          <span
            key={roleIndex}
            className="font-display italic text-text-primary animate-role-fade-in inline-block"
          >
            {ROLES[roleIndex]}
          </span>{" "}
          based in Chennai.
        </p>
        <p className="blur-in text-sm md:text-base text-muted max-w-xl mb-12">
          Electrical engineer turned Operations &amp; Business Analytics MBA. I quantify
          plant-floor problems in money, build working tools to fix them, and ship — not just
          write reports.
        </p>
        <div className="blur-in inline-flex flex-wrap justify-center gap-4">
          <a
            href="#work"
            className="group relative rounded-full text-sm px-7 py-3.5 transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full accent-gradient-anim animate-gradient-shift opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative block rounded-full bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary px-7 py-3.5 -m-[1px] transition-colors" style={{ margin: "-2px" }}>
              See Works
            </span>
          </a>
          <a
            href="#contact"
            className="group relative rounded-full text-sm px-7 py-3.5 transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full accent-gradient-anim animate-gradient-shift opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative block rounded-full border-2 border-stroke group-hover:border-transparent bg-bg text-text-primary px-7 py-3.5 transition-colors" style={{ margin: "-2px" }}>
              Reach out…
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="relative w-px h-10 bg-stroke overflow-hidden">
          <div className="absolute inset-0 accent-gradient animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
