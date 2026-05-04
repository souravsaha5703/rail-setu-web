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
    <section id="features" ref={ref} className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background orb - scaled for mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] bg-primary/5 rounded-full blur-[80px] sm:blur-[120px] lg:blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground mb-5">
            Core Features
          </span>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
            Built for the{" "}
            <span className="bg-linear-to-r from-primary to-[oklch(0.78_0.16_70)] bg-clip-text text-transparent">
              Indian Railway Network
            </span>
          </h2>
          <p className="mt-4 sm:mt-6 text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
            Every feature is purpose-built to navigate the complexity of Indian
            Railways' quota system and deliver confirmed seats.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              className="group relative bg-card/60 backdrop-blur-md rounded-3xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30"
            >
              {/* Tag */}
              <span className="absolute top-4 right-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary-foreground bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                {feature.tag}
              </span>

              {/* Icon */}
              <div className="mb-6 sm:mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <feature.icon size={window.innerWidth < 640 ? 60 : 80} />
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
