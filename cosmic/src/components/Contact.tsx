import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { gsap } from "gsap";

const HLS_SRC =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Email", href: "mailto:tamizhaweeb@gmail.com" },
  { label: "Résumé", href: "/Bala_Shunmugam_resume.pdf" },
];

export default function Contact() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

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
    const ctx = gsap.context(() => {
      gsap.to(".marquee-track", {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      {/* Background video flipped */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Marquee */}
      <div ref={marqueeRef} className="relative overflow-hidden py-8 mb-12">
        <div className="marquee-track flex whitespace-nowrap w-max">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="text-5xl md:text-7xl font-display italic text-text-primary/90 px-6"
            >
              Plant floor to P&amp;L •
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted mb-5">Open to placements 2026</p>
        <h2 className="text-4xl md:text-6xl font-display italic text-text-primary mb-8">
          Let's talk operations.
        </h2>
        <a href="mailto:tamizhaweeb@gmail.com" className="group relative inline-flex rounded-full">
          <span className="absolute inset-0 rounded-full accent-gradient-anim animate-gradient-shift opacity-0 group-hover:opacity-100 transition-opacity" style={{ inset: "-2px" }} />
          <span className="relative inline-flex items-center gap-2 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary rounded-full text-sm px-7 py-3.5 transition-colors">
            tamizhaweeb@gmail.com <span aria-hidden>↗</span>
          </span>
        </a>

        <a
          href="/Bala_Shunmugam_resume.pdf"
          download
          className="block mt-5 text-sm text-muted hover:text-text-primary transition-colors"
        >
          ↓ Download résumé (PDF)
        </a>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mt-16 pt-6 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Available for placement conversations
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-xs text-muted hover:text-text-primary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-muted">© 2026 Bala Shunmugam M · Madurai, India</p>
      </div>
    </section>
  );
}
