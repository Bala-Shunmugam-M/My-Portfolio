import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import SelectedWorks from "./components/SelectedWorks";
import Tools from "./components/Tools";
import Insights from "./components/Insights";
import Stats from "./components/Stats";
import Contact from "./components/Contact";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-bg text-text-primary"
        >
          <Navbar />
          <Hero />
          <About />
          <SelectedWorks />
          <Tools />
          <Insights />
          <Stats />
          <Contact />
        </motion.main>
      )}
    </>
  );
}
