import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const TARGETS = ["Schneider Electric", "Hitachi Energy", "ABB", "Siemens", "Honeywell"];

export default function About() {
  return (
    <section id="about" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="About"
          heading="An unusual"
          italicWord="bridge"
          subtext="From the plant floor to the P&L — engineering rigor meets business outcomes."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2 space-y-5 text-sm md:text-base text-muted leading-relaxed"
          >
            <p>
              I'm an Electrical &amp; Electronics Engineer now pursuing an MBA in Operations &amp;
              Business Analytics. The bridge is unusual on purpose: most analysts have never stood
              on a plant floor at 2 a.m. watching a tripped relay halt production, and most plant
              engineers never translate that downtime into a line on the P&amp;L. I do both.
            </p>
            <p>
              My engineering years gave me direct plant exposure — protection &amp; relay
              coordination, motor energy audits, and thermal power station operations. My MBA gives
              me the language of money, throughput, and decision-making. I quantify plant-floor
              problems in rupees, build working tools to fix them, and ship the fix — rather than
              hand over a slide deck and walk away.
            </p>
            <p>
              I work fluently across R and Python for analytics, Six Sigma for process improvement,
              and full-stack web for the tools I build. The thread through all of it: turn a messy
              operational reality into a measurable, defensible business outcome.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-stroke bg-surface p-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted mb-3">Education</h3>
              <p className="text-text-primary text-sm">MBA — Operations &amp; Business Analytics</p>
              <p className="text-muted text-sm mt-1">B.E. — Electrical &amp; Electronics Engineering</p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted mb-3">Plant Exposure</h3>
              <p className="text-muted text-sm">
                Protection &amp; relay coordination · Motor energy audits · Thermal power station
                operations · Sponge iron operations
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted mb-3">Target Companies</h3>
              <div className="flex flex-wrap gap-2">
                {TARGETS.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-text-primary border border-stroke rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
