import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { setSearchData } from "../../store/searchSlice";
import { getStationsLocal } from "../../services/stationDB";
import type { Station } from "../../utils/AppInterfaces";
import {
  MapPin,
  CalendarDays,
  Search,
  ArrowLeftRight,
  ChevronRight,
} from "lucide-react";
import {
  IsometricTrain,
  IsometricRoute,
  IsometricTicket,
  IsometricNetwork,
  IsometricShield,
} from "../icons/IsometricIcons";

/* ──── small floating isometric decorators ──── */
const FloatingIcon: React.FC<{
  children: React.ReactNode;
  x: string;
  y: string;
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg";
  rotate?: number;
  hideOnMobile?: boolean;
}> = ({
  children,
  x,
  y,
  delay = 0,
  duration = 5,
  size = "sm",
  rotate = 0,
  hideOnMobile = false,
}) => {
  const scale = size === "lg" ? 1 : size === "md" ? 0.7 : 0.45;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.6, duration: 0.8 }}
      className={`absolute pointer-events-none select-none ${
        hideOnMobile ? "hidden md:block" : ""
      }`}
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [rotate, rotate + 3, rotate] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        style={{ transform: `scale(${scale})` }}
        className="opacity-[0.18] dark:opacity-[0.12]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const Hero: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [selectedFrom, setSelectedFrom] = useState<Station | null>(null);
  const [selectedTo, setSelectedTo] = useState<Station | null>(null);

  const [stations, setStations] = useState<Station[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<"from" | "to" | null>(null);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load stations from IndexedDB on mount (zero latency once cached)
    getStationsLocal().then((data) => {
      if (data) setStations(data);
    });

    // Handle outside clicks to close dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(stations, {
      keys: ["name", "code"],
      threshold: 0.3, // Adjust for fuzziness
      distance: 100,
    });
  }, [stations]);

  const getSuggestions = (query: string) => {
    if (!query) return [];
    return fuse.search(query).map(result => result.item).slice(0, 5);
  };

  const fromSuggestions = useMemo(() => getSuggestions(from), [from, fuse]);
  const toSuggestions = useMemo(() => getSuggestions(to), [to, fuse]);

  const swapStations = () => {
    setFrom(to);
    setTo(from);
    setSelectedFrom(selectedTo);
    setSelectedTo(selectedFrom);
    setActiveDropdown(null);
  };

  const handleSelectStation = (type: "from" | "to", station: Station) => {
    const value = `${station.name} (${station.code})`;
    if (type === "from") {
      setFrom(value);
      setSelectedFrom(station);
    } else {
      setTo(value);
      setSelectedTo(station);
    }
    setActiveDropdown(null);
  };

  /* Quick-pick dates */
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const formatShort = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const formatISO = (d: Date) => d.toISOString().split("T")[0];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6"
    >
      {/* ─── Subtle background gradient ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.852 0.199 91.936 / 0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 60% at 0% 50%, oklch(0.852 0.199 91.936 / 0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 60% at 100% 60%, oklch(0.795 0.184 86.047 / 0.04) 0%, transparent 70%)",
          }}
        />
        {/* Faint dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.421 0.095 57.708) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ─── Floating isometric icons ─── */}
      {/* Show fewer icons on mobile to avoid clutter */}
      <FloatingIcon x="6%" y="12%" delay={0} duration={5.5} size="md" rotate={-8} hideOnMobile>
        <IsometricTrain size={120} />
      </FloatingIcon>
      <FloatingIcon x="82%" y="8%" delay={1.2} duration={6} size="sm" rotate={5} hideOnMobile>
        <IsometricRoute size={120} />
      </FloatingIcon>
      <FloatingIcon x="3%" y="55%" delay={0.6} duration={4.5} size="sm" rotate={-4} hideOnMobile>
        <IsometricTicket size={120} />
      </FloatingIcon>
      <FloatingIcon x="88%" y="48%" delay={1.8} duration={5} size="md" rotate={6} hideOnMobile>
        <IsometricShield size={120} />
      </FloatingIcon>
      <FloatingIcon x="12%" y="78%" delay={0.3} duration={6.5} size="sm" rotate={-3} hideOnMobile>
        <IsometricNetwork size={120} />
      </FloatingIcon>
      <FloatingIcon x="78%" y="76%" delay={2} duration={5.2} size="sm" rotate={8} hideOnMobile>
        <IsometricTrain size={120} />
      </FloatingIcon>
      <FloatingIcon x="28%" y="6%" delay={1.5} duration={7} size="sm" rotate={12} hideOnMobile>
        <IsometricShield size={120} />
      </FloatingIcon>
      <FloatingIcon x="68%" y="85%" delay={0.9} duration={5.8} size="sm" rotate={-6} hideOnMobile>
        <IsometricRoute size={120} />
      </FloatingIcon>

      {/* ─── Center content ─── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-24 pb-8 sm:pt-20 sm:pb-12 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium text-primary-foreground">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
            Smart Route Intelligence
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-5 sm:mt-6 text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight"
        >
          Break the Route.{" "}
          <br className="hidden xs:block" />
          <span className="relative inline-block">
            <span className="relative z-10 bg-linear-to-r from-primary to-[oklch(0.78_0.16_70)] bg-clip-text text-transparent">
              Book Confirmed.
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-0.5 sm:bottom-1 left-0 right-0 h-2 sm:h-3 bg-primary/10 rounded-full origin-left z-0"
            />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed px-2 sm:px-0"
        >
          When direct tickets show{" "}
          <span className="text-foreground font-medium">Waitlisted</span>,
          RailSetu finds hidden confirmed seats by intelligently splitting
          your journey through strategic junctions.
        </motion.p>

        {/* ─── Search Card (ixigo-style) ─── */}
        <motion.div
          id="search"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-8 sm:mt-10 w-full bg-card border border-border rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-black/5"
        >
          {/* Mobile: stacked  |  Tablet+: horizontal row */}
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-2">
            {/* ── From + Swap + To row (on tablet they sit side by side) ── */}
            <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 flex-2 min-w-0" ref={searchContainerRef}>
              {/* From */}
              <div className="relative flex-1">
                <div 
                  className={`flex items-center gap-3 px-4 py-3 sm:py-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors min-w-0 border border-transparent ${activeDropdown === "from" ? "ring-2 ring-primary/50 border-primary/30 bg-background" : ""}`}
                >
                  <MapPin size={18} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      From
                    </span>
                    <input
                      type="text"
                      value={from}
                      onFocus={() => setActiveDropdown("from")}
                      onChange={(e) => {
                        setFrom(e.target.value);
                        setActiveDropdown("from");
                      }}
                      placeholder="Enter source station"
                      className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none mt-0.5"
                    />
                  </div>
                </div>

                {/* Dropdown for From */}
                <AnimatePresence>
                  {activeDropdown === "from" && fromSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg shadow-black/10 overflow-hidden z-50"
                    >
                      {fromSuggestions.map((station) => (
                        <div
                          key={station.code}
                          onClick={() => handleSelectStation("from", station)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary text-xs font-bold">{station.code}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{station.name}</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Swap button — visible on sm+ between From/To, hidden on mobile */}
              <div className="hidden sm:flex items-center justify-center -mx-1 z-10">
                <button
                  onClick={swapStations}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background hover:bg-accent transition-colors shadow-sm group"
                  aria-label="Swap stations"
                >
                  <ArrowLeftRight
                    size={14}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </button>
              </div>

              {/* Mobile-only swap row */}
              <div className="flex sm:hidden items-center justify-center -my-1 z-10">
                <button
                  onClick={swapStations}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background hover:bg-accent transition-colors shadow-sm group"
                  aria-label="Swap stations"
                >
                  <ArrowLeftRight
                    size={13}
                    className="text-muted-foreground group-hover:text-primary transition-colors rotate-90"
                  />
                </button>
              </div>

              {/* To */}
              <div className="relative flex-1">
                <div 
                  className={`flex items-center gap-3 px-4 py-3 sm:py-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors min-w-0 border border-transparent ${activeDropdown === "to" ? "ring-2 ring-destructive/50 border-destructive/30 bg-background" : ""}`}
                >
                  <MapPin size={18} className="text-destructive shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      To
                    </span>
                    <input
                      type="text"
                      value={to}
                      onFocus={() => setActiveDropdown("to")}
                      onChange={(e) => {
                        setTo(e.target.value);
                        setActiveDropdown("to");
                      }}
                      placeholder="Enter destination"
                      className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none mt-0.5"
                    />
                  </div>
                </div>

                {/* Dropdown for To */}
                <AnimatePresence>
                  {activeDropdown === "to" && toSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg shadow-black/10 overflow-hidden z-50"
                    >
                      {toSuggestions.map((station) => (
                        <div
                          key={station.code}
                          onClick={() => handleSelectStation("to", station)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                            <span className="text-destructive text-xs font-bold">{station.code}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{station.name}</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Departure Date ── */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors min-w-0">
              <CalendarDays size={18} className="text-primary shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Departure Date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={formatISO(today)}
                  className="w-full bg-transparent text-sm font-medium text-foreground outline-none mt-0.5 [scheme:light] dark:[scheme:dark]"
                />
              </div>
            </div>

            {/* ── Search button ── */}
            <button 
              onClick={() => {
                dispatch(setSearchData({ from: selectedFrom, to: selectedTo, date }));
                navigate("/search");
              }}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:brightness-105 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 group shrink-0"
            >
              <Search size={16} />
              <span>Search</span>
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Quick date pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 px-2 sm:px-3 pt-2.5 sm:pt-3 pb-1">
            <button
              onClick={() => setDate(formatISO(tomorrow))}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                date === formatISO(tomorrow)
                  ? "bg-primary/15 border-primary/30 text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Tomorrow · {formatShort(tomorrow)}
            </button>
            <button
              onClick={() => setDate(formatISO(dayAfter))}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                date === formatISO(dayAfter)
                  ? "bg-primary/15 border-primary/30 text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              Day After · {formatShort(dayAfter)}
            </button>
          </div>
        </motion.div>

        {/* ─── Stats ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 sm:mt-10 flex items-center justify-center gap-6 sm:gap-10 lg:gap-14"
        >
          {[
            { value: "8,000+", label: "Stations" },
            { value: "99%", label: "Route Coverage" },
            { value: "< 3s", label: "Search Speed" },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <div className="w-px h-6 sm:h-8 bg-border" />}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
