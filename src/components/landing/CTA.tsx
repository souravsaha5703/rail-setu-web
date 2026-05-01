import React from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { IsometricTrain } from "../icons/IsometricIcons";

const CTA: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-primary via-[oklch(0.78_0.16_80)] to-primary" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative px-8 py-16 sm:px-12 lg:px-16 lg:py-20 flex flex-col lg:flex-row items-center gap-10">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                Stop Accepting Waitlisted Tickets
              </h2>
              <p className="text-white/80 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                Let RailSetu find the confirmed route that exists — hidden in
                plain sight, across junctions you never thought to check.
              </p>
              <a
                href="#search"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-foreground rounded-xl font-semibold text-sm hover:bg-white/90 transition-all shadow-lg shadow-black/10 group"
              >
                Search Your Route
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            </div>

            {/* Illustration */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="shrink-0 opacity-90"
            >
              <IsometricTrain size={180} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
