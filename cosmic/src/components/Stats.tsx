import { motion } from "framer-motion";

const STATS = [
  { value: "12+", label: "Projects shipped" },
  { value: "2", label: "Live tools built" },
  { value: "₹", label: "Every problem priced" },
];

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-stroke py-12">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl md:text-7xl font-display italic text-text-primary">
                {s.value}
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
