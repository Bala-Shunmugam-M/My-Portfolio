import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const TOOLS = [
  {
    name: "InventoryIQ",
    sub: "Mobile-first inventory tool",
    desc: "Reorder points, ABC classification, and stock-out alerts — designed thumb-first so a store-keeper can run it from the floor, not a back office.",
    href: "/inventoryiq.html",
    cta: "Open live tool",
  },
  {
    name: "Six Sigma Workbench",
    sub: "Process-improvement toolkit",
    desc: "An interactive workbench for DMAIC — control charts, capability analysis and process metrics in one place, built for real improvement projects.",
    href: "/six-sigma-workbench.html",
    cta: "Open workbench",
  },
];

export default function Tools() {
  return (
    <section id="tools" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Tools Built"
          heading="Working software, not"
          italicWord="slideware"
          subtext="I ship tools people actually open. Here are two."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {TOOLS.map((t, i) => (
            <motion.a
              key={t.name}
              href={t.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-60px" }}
              className="group relative block rounded-3xl border border-stroke bg-surface p-8 overflow-hidden"
            >
              <span className="absolute inset-0 rounded-3xl accent-gradient-anim animate-gradient-shift opacity-0 group-hover:opacity-100 transition-opacity" style={{ padding: "1px" }} />
              <div className="relative">
                <span className="text-xs uppercase tracking-[0.2em] text-muted">{t.sub}</span>
                <h3 className="text-3xl font-display italic text-text-primary mt-2 mb-3">
                  {t.name}
                </h3>
                <p className="text-sm text-muted mb-6">{t.desc}</p>
                <span className="inline-flex items-center gap-2 text-sm text-text-primary">
                  {t.cta}{" "}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
