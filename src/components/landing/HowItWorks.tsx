import React from "react";
import { motion, useInView } from "motion/react";
import { Search, GitBranch, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search Your Journey",
    description:
      "Enter your source and destination. RailSetu instantly checks direct train availability across all quotas and classes.",
    color: "bg-primary/10 text-primary",
    accent: "border-primary/30",
  },
  {
    number: "02",
    icon: GitBranch,
    title: "Smart Route Analysis",
    description:
      "If direct tickets are waitlisted, our engine identifies strategic junctions and checks availability on split segments — in parallel.",
    color: "bg-[oklch(0.85_0.15_145)]/10 text-[oklch(0.45_0.15_145)]",
    accent: "border-[oklch(0.45_0.15_145)]/30",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Book Confirmed Seats",
    description:
      "Get a curated Smart Path — a multi-leg itinerary ranked by layover safety, timing, and seat probability. Book with confidence.",
    color: "bg-primary/10 text-primary",
    accent: "border-primary/30",
  },
];

const HowItWorks: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-accent/30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground mb-5">
            Process Overview
          </span>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
            Three Steps to{" "}
            <span className="bg-linear-to-r from-primary to-[oklch(0.78_0.16_70)] bg-clip-text text-transparent">
              Confirmed Seats
            </span>
          </h2>
          <p className="mt-4 sm:mt-6 text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            RailSetu works behind the scenes to find what traditional booking
            platforms miss — hidden availability through intelligent route splitting.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
              className="relative"
            >
              {/* Connector line (Desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-18 left-[60%] w-full h-[2px] z-0">
                  <div className="w-[80%] h-full border-t-2 border-dashed border-primary/20" />
                </div>
              )}

              <div
                className={`relative z-10 bg-card/50 backdrop-blur-sm rounded-3xl border ${step.accent} p-6 sm:p-8 lg:p-10 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 group`}
              >
                {/* Step number indicator */}
                <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary text-xs sm:text-sm font-black text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/30 rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Icon wrapper */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 sm:mb-8 shadow-sm`}
                >
                  <step.icon size={28} className="sm:size-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
