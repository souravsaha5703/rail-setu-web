import React from "react";
import { GitBranch, X, Mail } from "lucide-react";

const footerLinks = {
  Product: ["How It Works", "Features", "Roadmap", "Changelog"],
  Resources: ["Documentation", "API Reference", "Station Data", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border bg-accent/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">RS</span>
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Rail<span className="text-primary">Setu</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              Intelligent route-breaking for the Indian Railways network.
              Find confirmed seats when direct tickets show waitlisted.
            </p>
            <div className="flex items-center gap-3">
              {[GitBranch, X, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-accent hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RailSetu. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for Indian Railways passengers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
