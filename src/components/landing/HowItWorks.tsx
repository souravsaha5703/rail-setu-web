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
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
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
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold uppercase tracking-wider text-primary-foreground mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Three Steps to{" "}
            <span className="bg-linear-to-r from-primary to-[oklch(0.78_0.16_70)] bg-clip-text text-transparent">
              Confirmed Seats
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed px-2 sm:px-0">
            RailSetu works behind the scenes to find what traditional booking
            platforms miss — hidden availability through intelligent route splitting.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] right-[-calc(50%-40px)] w-[calc(100%-40px)] h-px">
                  <div className="w-full h-full border-t-2 border-dashed border-primary/20" />
                </div>
              )}

              <div
                className={`relative bg-card rounded-2xl border ${step.accent} p-8 h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1`}
              >
                {/* Step number */}
                <div className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-primary text-[11px] font-bold text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25">
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-6`}
                >
                  <step.icon size={24} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
