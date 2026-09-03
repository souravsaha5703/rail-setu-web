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
  const [errors, setErrors] = useState<{ from?: string; to?: string; date?: string }>({});

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
      setErrors((prev) => ({ ...prev, from: undefined }));
    } else {
      setTo(value);
      setSelectedTo(station);
      setErrors((prev) => ({ ...prev, to: undefined }));
    }
    setActiveDropdown(null);
  };

  const handleSearch = () => {
    const newErrors: { from?: string; to?: string; date?: string } = {};

    if (!selectedFrom) {
      newErrors.from = "Select a valid source station";
    }
    if (!selectedTo) {
      newErrors.to = "Select a valid destination station";
    }
    if (selectedFrom && selectedTo && selectedFrom.code === selectedTo.code) {
      newErrors.to = "Source and destination cannot match";
    }
    if (!date) {
      newErrors.date = "Select departure date";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && selectedFrom && selectedTo) {
      dispatch(setSearchData({ from: selectedFrom, to: selectedTo, date }));
      navigate("/search");
    }
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
      className="relative min-h-screen lg:min-h-dvh flex items-center justify-center overflow-hidden px-4 sm:px-6"
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

      {/* ─── Center content ─── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-20 pb-8 sm:pt-24 sm:pb-12 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] sm:text-xs md:text-sm font-medium text-primary-foreground">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
            Smart Route Intelligence
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-5 sm:mt-8 text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight"
        >
          Break the Route.{" "}
          <br className="hidden sm:block" />
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">
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
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed px-4 sm:px-0"
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
          className="mt-10 sm:mt-12 w-full bg-card border border-border rounded-xl p-2 sm:p-3"
        >
          {/* Mobile: stacked  |  Tablet+: horizontal row */}
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-2.5">
            {/* ── From + Swap + To row (on tablet they sit side by side) ── */}
            <div className="flex flex-col sm:flex-row sm:items-stretch gap-2.5 flex-2 min-w-0" ref={searchContainerRef}>
              {/* From */}
              <div className="relative flex-1">
                <div
                  className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-accent/50 hover:bg-accent transition-colors min-w-0 border ${errors.from
                    ? "border-destructive/50 ring-2 ring-destructive/20 bg-destructive/5"
                    : activeDropdown === "from"
                      ? "ring-2 ring-primary/50 border-primary/30 bg-background"
                      : "border-transparent"
                    }`}
                >
                  <MapPin size={20} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      From
                    </span>
                    <input
                      type="text"
                      value={from}
                      onFocus={() => {
                        setActiveDropdown("from");
                        setErrors((prev) => ({ ...prev, from: undefined }));
                      }}
                      onChange={(e) => {
                        setFrom(e.target.value);
                        setSelectedFrom(null); // Force selection from autocomplete
                        setActiveDropdown("from");
                        setErrors((prev) => ({ ...prev, from: undefined }));
                      }}
                      placeholder="Enter source station"
                      className="w-full bg-transparent text-sm sm:text-base font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none mt-0.5"
                    />
                    {errors.from && (
                      <span className="block text-[10px] font-semibold text-destructive mt-0.5">
                        {errors.from}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dropdown for From */}
                <AnimatePresence>
                  {activeDropdown === "from" && fromSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg overflow-hidden z-50 max-h-75 overflow-y-auto"
                    >
                      {fromSuggestions.map((station) => (
                        <div
                          key={station.code}
                          onClick={() => handleSelectStation("from", station)}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-accent cursor-pointer transition-colors border-b border-border last:border-0"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary text-xs font-bold">{station.code}</span>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm sm:text-base font-bold text-foreground truncate">{station.name}</div>
                            <div className="text-xs text-muted-foreground">Major Station</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Swap button — visible on sm+ between From/To, hidden on mobile */}
              <div className="hidden sm:flex items-center justify-center -mx-2.5 z-10">
                <button
                  onClick={swapStations}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-accent transition-all group active:scale-90"
                  aria-label="Swap stations"
                >
                  <ArrowLeftRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </button>
              </div>

              {/* Mobile-only swap row */}
              <div className="flex sm:hidden items-center justify-center -my-2.5 z-10">
                <button
                  onClick={swapStations}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background hover:bg-accent transition-all group active:scale-90"
                  aria-label="Swap stations"
                >
                  <ArrowLeftRight
                    size={14}
                    className="text-muted-foreground group-hover:text-primary transition-colors rotate-90"
                  />
                </button>
              </div>

              {/* To */}
              <div className="relative flex-1">
                <div
                  className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-accent/50 hover:bg-accent transition-colors min-w-0 border ${errors.to
                    ? "border-destructive/50 ring-2 ring-destructive/20 bg-destructive/5"
                    : activeDropdown === "to"
                      ? "ring-2 ring-primary/50 border-primary/30 bg-background"
                      : "border-transparent"
                    }`}
                >
                  <MapPin size={20} className="text-destructive shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      To
                    </span>
                    <input
                      type="text"
                      value={to}
                      onFocus={() => {
                        setActiveDropdown("to");
                        setErrors((prev) => ({ ...prev, to: undefined }));
                      }}
                      onChange={(e) => {
                        setTo(e.target.value);
                        setSelectedTo(null); // Force selection from autocomplete
                        setActiveDropdown("to");
                        setErrors((prev) => ({ ...prev, to: undefined }));
                      }}
                      placeholder="Enter destination"
                      className="w-full bg-transparent text-sm sm:text-base font-semibold text-foreground placeholder:text-muted-foreground/40 outline-none mt-0.5"
                    />
                    {errors.to && (
                      <span className="block text-[10px] font-semibold text-destructive mt-0.5">
                        {errors.to}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dropdown for To */}
                <AnimatePresence>
                  {activeDropdown === "to" && toSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg overflow-hidden z-50 max-h-75 overflow-y-auto"
                    >
                      {toSuggestions.map((station) => (
                        <div
                          key={station.code}
                          onClick={() => handleSelectStation("to", station)}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-accent cursor-pointer transition-colors border-b border-border last:border-0"
                        >
                          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                            <span className="text-destructive text-xs font-bold">{station.code}</span>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm sm:text-base font-bold text-foreground truncate">{station.name}</div>
                            <div className="text-xs text-muted-foreground">Major Station</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Departure Date ── */}
            <div className={`flex-1 flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-accent/50 hover:bg-accent transition-colors min-w-0 border ${errors.date
              ? "border-destructive/50 ring-2 ring-destructive/20 bg-destructive/5"
              : "border-transparent"
              }`}>
              <CalendarDays size={20} className="text-primary shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Departure
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                  min={formatISO(today)}
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-foreground outline-none mt-0.5 [scheme:light] dark:[scheme:dark] cursor-pointer"
                />
                {errors.date && (
                  <span className="block text-[10px] font-semibold text-destructive mt-0.5">
                    {errors.date}
                  </span>
                )}
              </div>
            </div>

            {/* ── Search button ── */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-primary text-primary-foreground rounded-lg font-bold text-base hover:bg-primary/95 transition-all group shrink-0"
            >
              <Search size={20} />
              <span>Search Trains</span>
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Quick date pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 px-3 pt-4 sm:pt-5 pb-2">
            <button
              onClick={() => setDate(formatISO(tomorrow))}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${date === formatISO(tomorrow)
                ? "bg-primary/20 border-primary/40 text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
            >
              Tomorrow · {formatShort(tomorrow)}
            </button>
            <button
              onClick={() => setDate(formatISO(dayAfter))}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${date === formatISO(dayAfter)
                ? "bg-primary/20 border-primary/40 text-primary-foreground"
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
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 flex items-center justify-center gap-6 sm:gap-10 lg:gap-14"
        >
          {[
            { value: "10,102+", label: "Stations" },
            { value: "99.4%", label: "Accuracy" },
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

        {/* ─── Compact Utility Steps ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto text-left"
        >
          {[
            { step: "01", title: "Search Journey", desc: "Enter your source & destination stations" },
            { step: "02", title: "Smart Connection", desc: "Choose route options if all direct seats are waitlisted" },
            { step: "03", title: "View Break Journeys", desc: "Explore detailed split-leg routes and connection schedules" }
          ].map((item) => (
            <div key={item.step} className="flex gap-3.5 p-4 rounded-lg bg-secondary/50 border border-border/80 hover:border-primary/30 transition-all duration-300">
              <span className="text-xl font-extrabold text-primary shrink-0">{item.step}</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;