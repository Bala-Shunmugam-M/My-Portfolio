import { useEffect, useState } from "react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Resume", href: "/Bala_Shunmugam_resume.pdf" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-shadow ${
          scrolled ? "shadow-md shadow-black/10" : ""
        }`}
      >
        {/* Logo */}
        <a href="#home" className="group relative flex-shrink-0">
          <span className="block w-9 h-9 rounded-full p-[1.5px] accent-gradient transition-transform duration-300 group-hover:scale-110">
            <span className="flex items-center justify-center w-full h-full rounded-full bg-bg font-display italic text-[13px] text-text-primary">
              BS
            </span>
          </span>
        </a>

        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {LINKS.map((link) => {
          const isActive = active === link.label;
          const isResume = link.label === "Resume";
          return (
            <a
              key={link.label}
              href={link.href}
              {...(isResume ? { download: "" } : {})}
              onClick={() => !isResume && setActive(link.label)}
              className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors ${
                isActive
                  ? "text-text-primary bg-stroke/50"
                  : "text-muted hover:text-text-primary hover:bg-stroke/50"
              }`}
            >
              {link.label}
            </a>
          );
        })}

        <div className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Say hi */}
        <a href="#contact" className="group relative inline-flex">
          <span className="absolute accent-gradient-anim animate-gradient-shift rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ inset: "-2px" }} />
          <span className="relative inline-flex items-center gap-1 bg-surface rounded-full backdrop-blur-md text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 text-text-primary">
            Say hi <span aria-hidden>↗</span>
          </span>
        </a>
      </div>
    </nav>
  );
}
