import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const INSIGHTS = [
  {
    no: "01",
    title: "Downtime is a number, not a feeling",
    body: "Every tripped relay and idle motor has a rupee value per hour. The moment you price downtime, the argument for fixing it stops being technical and becomes financial — and finance is the language that gets budgets approved.",
  },
  {
    no: "02",
    title: "The fix has to ship, not just be recommended",
    body: "A report that names a problem changes nothing. A working tool that a store-keeper or operator actually uses changes the daily reality. I'd rather hand over software than a slide.",
  },
  {
    no: "03",
    title: "Engineers and analysts speak past each other",
    body: "Plant engineers know the physics; analysts know the spreadsheets. The value is in the translation layer between them — and that translation is exactly where I sit.",
  },
];

export default function Insights() {
  return (
    <section id="insights" className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Insights"
          heading="Three things the plant floor"
          italicWord="taught me"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {INSIGHTS.map((it, i) => (
            <motion.div
              key={it.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-60px" }}
              className="rounded-3xl border border-stroke bg-surface p-7"
            >
              <span className="font-display italic text-5xl accent-gradient bg-clip-text text-transparent">
                {it.no}
              </span>
              <h3 className="text-lg text-text-primary mt-4 mb-3">{it.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
