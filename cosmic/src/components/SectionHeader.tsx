import { motion } from "framer-motion";

export default function SectionHeader({
  eyebrow,
  heading,
  italicWord,
  subtext,
}: {
  eyebrow: string;
  heading: string;
  italicWord?: string;
  subtext?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="mb-10 md:mb-14"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-px bg-stroke" />
        <span className="text-xs text-muted uppercase tracking-[0.3em]">{eyebrow}</span>
      </div>
      <h2 className="text-4xl md:text-6xl font-body font-light text-text-primary tracking-tight">
        {heading}{" "}
        {italicWord && <span className="font-display italic">{italicWord}</span>}
      </h2>
      {subtext && <p className="mt-4 text-sm md:text-base text-muted max-w-xl">{subtext}</p>}
    </motion.div>
  );
}
