import React from "react";
import { motion, useInView } from "motion/react";
import {
  IsometricShield,
  IsometricClock,
  IsometricBrain,
  IsometricTicket,
  IsometricNetwork,
  IsometricRoute,
} from "../icons/IsometricIcons";

const features = [
  {
    icon: IsometricRoute,
    title: "Intelligent Route Breaking",
    description:
      "Automatically identifies optimal junctions to split waitlisted journeys into confirmed segments. No manual guesswork.",
    tag: "Core Engine",
  },
  {
    icon: IsometricClock,
    title: "Real-Time Availability",
    description:
      "Parallel checks across multiple route segments with intelligent caching. Results in under 3 seconds.",
    tag: "Speed",
  },
  {
    icon: IsometricBrain,
    title: "AI-Powered Reasoning",
    description:
      "Evaluates layover safety, midnight transfers, platform changes, and train reliability to rank only viable options.",
    tag: "Intelligence",
  },
  {
    icon: IsometricTicket,
    title: "Multi-Quota Exploitation",
    description:
      "Leverages General, Tatkal, Ladies, and station-specific quotas across segments for maximum seat discovery.",
    tag: "Strategy",
  },
  {
    icon: IsometricShield,
    title: "Safe Connections Only",
    description:
      "Filters out risky transfers — no midnight arrivals at small stations, no tight layovers, no backtracking routes.",
    tag: "Safety",
  },
  {
    icon: IsometricNetwork,
    title: "8,000+ Station Network",
    description:
      "Complete Indian Railways station registry with junction rankings, geo-coordinates, and connectivity data — all local, all fast.",
    tag: "Coverage",
  },
];

const Features: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="relative py-24 lg:py-32">
      {/* Background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/4 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-xs font-semibold uppercase tracking-wider text-primary-foreground mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Built for the{" "}
            <span className="bg-linear-to-r from-primary to-[oklch(0.78_0.16_70)] bg-clip-text text-transparent">
              Indian Railway Network
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Every feature is purpose-built to navigate the complexity of Indian
            Railways' quota system and deliver confirmed seats.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              className="group relative bg-card rounded-2xl border border-border p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20"
            >
              {/* Tag */}
              <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-accent px-2.5 py-1 rounded-full">
                {feature.tag}
              </span>

              {/* Icon */}
              <div className="mb-5 transition-transform duration-500 group-hover:scale-105">
                <feature.icon size={80} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
