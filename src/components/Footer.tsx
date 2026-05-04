import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RailSetu. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
