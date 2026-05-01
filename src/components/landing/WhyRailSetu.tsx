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
      "All 8,000+ stations with geo-coordinates, junction rankings, and connectivity maps stored locally. Station lookup is instant — even without internet.",
  },
];

const WhyRailSetu: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="why-railsetu"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-accent/30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold uppercase tracking-wider text-primary-foreground mb-4">
              Why RailSetu
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              The Booking Platform{" "}
              <span className="bg-linear-to-r from-primary to-[oklch(0.78_0.16_70)] bg-clip-text text-transparent">
                India Deserves
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Millions of passengers accept waitlisted tickets every day because
              they don't know a better route exists. RailSetu changes that — permanently.
            </p>
            <a
              href="#search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:brightness-105 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 group"
            >
              Try It Now
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>

          {/* Right — reason cards */}
          <div className="space-y-4">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.12 * (i + 1) }}
                className="group flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <reason.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
