import React from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Zap, Shield, Brain, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "No One Else Does This",
    description:
      "IRCTC, ixigo, Paytm, Cleartrip — they all search point-to-point. None of them split routes. RailSetu is the only platform that unlocks hidden confirmed seats through route-breaking.",
  },
  {
    icon: Shield,
    title: "Safety-First Connections",
    description:
      "We don't just find any split — we find the right one. Our heuristic engine rejects midnight transfers at small stations, tight layovers, and unreliable trains.",
  },
  {
    icon: Brain,
    title: "Indian Railways Expertise Built-In",
    description:
      "The quota system is complex — General, Tatkal, Ladies, Defence, Foreign Tourist, and station-specific allocations. RailSetu understands and exploits all of them.",
  },
  {
    icon: TrendingUp,
    title: "Instant, Offline-Ready Station Search",
    description:
      "All 10,102+ stations with geo-coordinates, junction rankings, and connectivity maps stored locally. Station lookup is instant — even without internet.",
  },
];

const WhyRailSetu: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="why-railsetu"
      ref={ref}
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-accent/30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground mb-5">
              The RailSetu Advantage
            </span>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-6 sm:mb-8">
              The Booking Platform{" "}
              <span className="bg-linear-to-r from-primary to-[oklch(0.78_0.16_70)] bg-clip-text text-transparent">
                India Deserves
              </span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0">
              Millions of passengers accept waitlisted tickets every day because
              they don't know a better route exists. RailSetu changes that — permanently.
            </p>
            <a
              href="#search"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:brightness-105 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 group active:scale-95"
            >
              Try It Now
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          {/* Right — reason cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 lg:gap-4">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.12 * (i + 1) }}
                className="group flex flex-col xs:flex-row gap-4 sm:gap-5 p-5 sm:p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                  <reason.icon size={24} className="sm:size-28" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 sm:mb-2 transition-colors group-hover:text-primary">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyRailSetu;
