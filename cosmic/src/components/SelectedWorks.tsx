import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

type Project = {
  title: string;
  tag: string;
  blurb: string;
  metric: string;
  href: string;
  span: string;
  gradient: string;
  live?: boolean;
};

const PROJECTS: Project[] = [
  {
    title: "InventoryIQ",
    tag: "Live Tool",
    blurb:
      "Mobile-first inventory control system — reorder logic, ABC analysis and stock-out alerts in the palm of a store-keeper's hand.",
    metric: "Cuts stock-outs & dead stock",
    href: "/inventoryiq.html",
    span: "md:col-span-7",
    gradient: "from-[#1b2a4a] via-[#0e1626] to-bg",
    live: true,
  },
  {
    title: "VGTPS Operations Study",
    tag: "Operations",
    blurb:
      "A full operations study of a thermal power station — bottlenecks, availability and cost drivers mapped end to end.",
    metric: "Plant-floor → P&L",
    href: "/projects.html",
    span: "md:col-span-5",
    gradient: "from-[#0e2a2a] via-[#0a1818] to-bg",
  },
  {
    title: "Adaptive Protection Relay Coordination",
    tag: "Electrical",
    blurb:
      "Coordination of protective relays for safe, selective fault clearing — the engineering core of grid reliability.",
    metric: "Selectivity & safety",
    href: "/projects.html",
    span: "md:col-span-5",
    gradient: "from-[#2a1b3a] via-[#160e22] to-bg",
  },
  {
    title: "Agni Steels — Sponge Iron Ops",
    tag: "Operations Study",
    blurb:
      "Operations study of a sponge iron plant: throughput, energy intensity and yield analysed for improvement levers.",
    metric: "Throughput & yield",
    href: "/projects.html",
    span: "md:col-span-7",
    gradient: "from-[#3a261b] via-[#22150e] to-bg",
  },
  {
    title: "Motor Energy Audit",
    tag: "Energy",
    blurb:
      "Quantified motor-level energy waste and translated kWh into rupees — building the business case for efficiency upgrades.",
    metric: "kWh → ₹ savings",
    href: "/projects.html",
    span: "md:col-span-7",
    gradient: "from-[#13294a] via-[#0a1526] to-bg",
  },
  {
    title: "R & Python Analytics",
    tag: "Analytics",
    blurb:
      "A body of statistical and modelling work in R and Python — from EDA to predictive models on operational data.",
    metric: "Data → decisions",
    href: "/analytics/",
    span: "md:col-span-5",
    gradient: "from-[#1b3a2a] via-[#0e2218] to-bg",
  },
];

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-end justify-between">
          <SectionHeader
            eyebrow="Selected Work"
            heading="Featured"
            italicWord="projects"
            subtext="A selection of projects — from plant-floor study to a live tool you can open right now."
          />
          <a
            href="/projects.html"
            className="hidden md:inline-flex group relative rounded-full mb-12"
          >
            <span className="absolute inset-0 rounded-full accent-gradient-anim animate-gradient-shift opacity-0 group-hover:opacity-100 transition-opacity" style={{ inset: "-2px" }} />
            <span className="relative inline-flex items-center gap-2 bg-surface rounded-full text-sm px-5 py-2.5 text-text-primary">
              View all work <span aria-hidden>→</span>
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
              viewport={{ once: true, margin: "-60px" }}
              className={`group relative block overflow-hidden rounded-3xl border border-stroke bg-surface ${p.span}`}
            >
              <div className={`relative h-full min-h-[260px] md:min-h-[320px] bg-gradient-to-br ${p.gradient} p-7 flex flex-col justify-between`}>
                {/* halftone */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "4px 4px",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted">{p.tag}</span>
                  {p.live && (
                    <span className="flex items-center gap-1.5 text-xs text-text-primary">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live
                    </span>
                  )}
                </div>
                <div className="relative">
                  <h3 className="text-2xl md:text-3xl font-display italic text-text-primary mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted max-w-md">{p.blurb}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.15em] text-text-primary/80">
                    {p.metric}
                  </p>
                </div>

                {/* hover overlay */}
                <div className="absolute inset-0 bg-bg/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="relative inline-flex rounded-full">
                    <span className="absolute inset-0 rounded-full accent-gradient-anim animate-gradient-shift" style={{ inset: "-2px" }} />
                    <span className="relative inline-flex items-center gap-1 bg-white text-black rounded-full text-sm px-5 py-2">
                      View — <span className="font-display italic">{p.title}</span>
                    </span>
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
