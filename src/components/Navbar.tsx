import React from "react";
import { motion } from "motion/react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-background flex items-center justify-center overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/favicon/android-chrome-192x192.png" 
                alt="RailSetu Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              Rail<span className="text-primary">Setu</span>
            </span>
          </a>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#search"
              className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:brightness-105 transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
            >
              Find Seats Now
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
