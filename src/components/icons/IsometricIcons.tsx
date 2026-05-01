import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Isometric Train Icon
export const IsometricTrain: React.FC<IconProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Base shadow */}
    <ellipse cx="60" cy="105" rx="35" ry="8" fill="oklch(0.852 0.199 91.936 / 0.15)" />
    {/* Train body - isometric */}
    <path
      d="M30 45 L60 30 L90 45 L90 80 L60 95 L30 80 Z"
      fill="oklch(0.852 0.199 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Train top */}
    <path
      d="M30 45 L60 30 L90 45 L60 60 Z"
      fill="oklch(0.9 0.18 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Train side left */}
    <path
      d="M30 45 L60 60 L60 95 L30 80 Z"
      fill="oklch(0.78 0.16 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Windows left */}
    <rect x="36" y="55" width="8" height="6" rx="1" fill="oklch(0.95 0.02 214)" transform="skewY(30) translate(0, -20)" opacity="0.9" />
    <rect x="48" y="55" width="8" height="6" rx="1" fill="oklch(0.95 0.02 214)" transform="skewY(30) translate(0, -20)" opacity="0.9" />
    {/* Windows right */}
    <rect x="64" y="55" width="8" height="6" rx="1" fill="oklch(0.95 0.02 214)" transform="skewY(-30) translate(0, 18)" opacity="0.9" />
    <rect x="76" y="55" width="8" height="6" rx="1" fill="oklch(0.95 0.02 214)" transform="skewY(-30) translate(0, 18)" opacity="0.9" />
    {/* Front light */}
    <circle cx="60" cy="38" r="3" fill="oklch(0.95 0.19 91.936)" />
    {/* Wheels */}
    <ellipse cx="42" cy="82" rx="4" ry="2" fill="oklch(0.421 0.095 57.708)" />
    <ellipse cx="55" cy="89" rx="4" ry="2" fill="oklch(0.421 0.095 57.708)" />
    <ellipse cx="78" cy="82" rx="4" ry="2" fill="oklch(0.421 0.095 57.708)" />
  </svg>
);

// Isometric Route/Map Icon
export const IsometricRoute: React.FC<IconProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Base platform */}
    <path
      d="M15 65 L60 40 L105 65 L60 90 Z"
      fill="oklch(0.963 0.002 197.1)"
      stroke="oklch(0.925 0.005 214.3)"
      strokeWidth="1.5"
    />
    {/* Route line */}
    <path
      d="M30 70 Q45 52 60 58 Q75 64 90 55"
      stroke="oklch(0.852 0.199 91.936)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="6 3"
    />
    {/* Station A */}
    <circle cx="30" cy="70" r="5" fill="oklch(0.852 0.199 91.936)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="30" cy="70" r="2" fill="white" />
    {/* Station B (junction) */}
    <circle cx="60" cy="58" r="6" fill="oklch(0.795 0.184 86.047)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="60" cy="58" r="2.5" fill="white" />
    {/* Pulse ring on junction */}
    <circle cx="60" cy="58" r="10" stroke="oklch(0.852 0.199 91.936)" strokeWidth="1" fill="none" opacity="0.4" />
    {/* Station C */}
    <circle cx="90" cy="55" r="5" fill="oklch(0.852 0.199 91.936)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="90" cy="55" r="2" fill="white" />
    {/* Pin on junction */}
    <path d="M60 48 L60 35 M57 35 L63 35" stroke="oklch(0.577 0.245 27.325)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="60" cy="32" r="3" fill="oklch(0.577 0.245 27.325)" />
  </svg>
);

// Isometric Shield/Check Icon
export const IsometricShield: React.FC<IconProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shadow */}
    <ellipse cx="60" cy="105" rx="25" ry="6" fill="oklch(0.852 0.199 91.936 / 0.1)" />
    {/* Shield body */}
    <path
      d="M60 20 L85 35 L85 65 Q85 85 60 100 Q35 85 35 65 L35 35 Z"
      fill="oklch(0.852 0.199 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Shield highlight */}
    <path
      d="M60 25 L80 38 L80 63 Q80 80 60 93 L60 25 Z"
      fill="oklch(0.9 0.18 91.936)"
      opacity="0.5"
    />
    {/* Check mark */}
    <path
      d="M45 58 L55 68 L75 48"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Isometric Clock/Speed Icon
export const IsometricClock: React.FC<IconProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shadow */}
    <ellipse cx="60" cy="105" rx="28" ry="7" fill="oklch(0.852 0.199 91.936 / 0.12)" />
    {/* Clock face - isometric oval */}
    <ellipse
      cx="60"
      cy="55"
      rx="32"
      ry="32"
      fill="oklch(0.963 0.002 197.1)"
      stroke="oklch(0.852 0.199 91.936)"
      strokeWidth="3"
    />
    {/* Inner ring */}
    <ellipse
      cx="60"
      cy="55"
      rx="26"
      ry="26"
      fill="none"
      stroke="oklch(0.925 0.005 214.3)"
      strokeWidth="1"
    />
    {/* Hour marks */}
    <line x1="60" y1="28" x2="60" y2="33" stroke="oklch(0.421 0.095 57.708)" strokeWidth="2" strokeLinecap="round" />
    <line x1="60" y1="77" x2="60" y2="82" stroke="oklch(0.421 0.095 57.708)" strokeWidth="2" strokeLinecap="round" />
    <line x1="33" y1="55" x2="38" y2="55" stroke="oklch(0.421 0.095 57.708)" strokeWidth="2" strokeLinecap="round" />
    <line x1="82" y1="55" x2="87" y2="55" stroke="oklch(0.421 0.095 57.708)" strokeWidth="2" strokeLinecap="round" />
    {/* Hour hand */}
    <line x1="60" y1="55" x2="60" y2="38" stroke="oklch(0.421 0.095 57.708)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Minute hand */}
    <line x1="60" y1="55" x2="75" y2="45" stroke="oklch(0.852 0.199 91.936)" strokeWidth="2" strokeLinecap="round" />
    {/* Center dot */}
    <circle cx="60" cy="55" r="3" fill="oklch(0.852 0.199 91.936)" />
    {/* Lightning bolt (speed) */}
    <path
      d="M90 30 L84 45 L92 43 L85 58"
      stroke="oklch(0.852 0.199 91.936)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Isometric Ticket/Seat Icon
export const IsometricTicket: React.FC<IconProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shadow */}
    <ellipse cx="60" cy="100" rx="32" ry="7" fill="oklch(0.852 0.199 91.936 / 0.12)" />
    {/* Ticket body back */}
    <path
      d="M20 40 L60 22 L100 40 L100 75 L60 93 L20 75 Z"
      fill="oklch(0.9 0.18 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Ticket front face */}
    <path
      d="M20 40 L60 58 L60 93 L20 75 Z"
      fill="oklch(0.852 0.199 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Ticket right face */}
    <path
      d="M60 58 L100 40 L100 75 L60 93 Z"
      fill="oklch(0.78 0.16 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Perforation line */}
    <path
      d="M45 46 L45 80"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1"
      strokeDasharray="3 3"
      opacity="0.6"
    />
    {/* Confirmed stamp */}
    <rect x="50" y="50" width="30" height="14" rx="2" fill="oklch(0.45 0.15 145)" opacity="0.8" transform="rotate(-15, 65, 57)" />
    <text x="53" y="60" fontSize="7" fill="white" fontWeight="bold" transform="rotate(-15, 65, 57)">CNF</text>
    {/* Barcode lines */}
    <line x1="28" y1="55" x2="28" y2="68" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1" opacity="0.5" />
    <line x1="31" y1="57" x2="31" y2="70" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" opacity="0.5" />
    <line x1="34" y1="59" x2="34" y2="72" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1" opacity="0.5" />
    <line x1="37" y1="61" x2="37" y2="74" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" opacity="0.5" />
    <line x1="40" y1="63" x2="40" y2="76" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1" opacity="0.5" />
  </svg>
);

// Isometric Brain/AI Icon
export const IsometricBrain: React.FC<IconProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shadow */}
    <ellipse cx="60" cy="105" rx="28" ry="7" fill="oklch(0.852 0.199 91.936 / 0.1)" />
    {/* Brain left hemisphere */}
    <path
      d="M60 30 Q38 30 32 50 Q26 70 40 82 Q50 90 60 85"
      fill="oklch(0.852 0.199 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Brain right hemisphere */}
    <path
      d="M60 30 Q82 30 88 50 Q94 70 80 82 Q70 90 60 85"
      fill="oklch(0.9 0.18 91.936)"
      stroke="oklch(0.421 0.095 57.708)"
      strokeWidth="1.5"
    />
    {/* Neural paths */}
    <path d="M45 45 Q52 55 48 65" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.2" fill="none" opacity="0.6" />
    <path d="M75 45 Q68 55 72 65" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.2" fill="none" opacity="0.6" />
    <path d="M50 40 Q60 50 70 40" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.2" fill="none" opacity="0.6" />
    {/* Neural nodes */}
    <circle cx="45" cy="45" r="2.5" fill="oklch(0.95 0.19 91.936)" />
    <circle cx="75" cy="45" r="2.5" fill="oklch(0.95 0.19 91.936)" />
    <circle cx="48" cy="65" r="2.5" fill="oklch(0.95 0.19 91.936)" />
    <circle cx="72" cy="65" r="2.5" fill="oklch(0.95 0.19 91.936)" />
    <circle cx="60" cy="50" r="2.5" fill="white" />
    {/* Sparkle */}
    <path d="M85 28 L87 32 L91 34 L87 36 L85 40 L83 36 L79 34 L83 32 Z" fill="oklch(0.852 0.199 91.936)" opacity="0.7" />
    <path d="M30 35 L31 37 L33 38 L31 39 L30 41 L29 39 L27 38 L29 37 Z" fill="oklch(0.852 0.199 91.936)" opacity="0.5" />
  </svg>
);

// Isometric Network/Connection Icon
export const IsometricNetwork: React.FC<IconProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Connection lines */}
    <line x1="60" y1="35" x2="30" y2="60" stroke="oklch(0.852 0.199 91.936)" strokeWidth="2" opacity="0.6" />
    <line x1="60" y1="35" x2="90" y2="55" stroke="oklch(0.852 0.199 91.936)" strokeWidth="2" opacity="0.6" />
    <line x1="30" y1="60" x2="50" y2="85" stroke="oklch(0.852 0.199 91.936)" strokeWidth="2" opacity="0.6" />
    <line x1="90" y1="55" x2="70" y2="85" stroke="oklch(0.852 0.199 91.936)" strokeWidth="2" opacity="0.6" />
    <line x1="50" y1="85" x2="70" y2="85" stroke="oklch(0.852 0.199 91.936)" strokeWidth="2" opacity="0.6" />
    <line x1="30" y1="60" x2="90" y2="55" stroke="oklch(0.925 0.005 214.3)" strokeWidth="1" strokeDasharray="4 3" />
    {/* Center node */}
    <circle cx="60" cy="35" r="8" fill="oklch(0.852 0.199 91.936)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="60" cy="35" r="3" fill="white" />
    {/* Left node */}
    <circle cx="30" cy="60" r="7" fill="oklch(0.9 0.18 91.936)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="30" cy="60" r="2.5" fill="white" />
    {/* Right node */}
    <circle cx="90" cy="55" r="7" fill="oklch(0.9 0.18 91.936)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="90" cy="55" r="2.5" fill="white" />
    {/* Bottom left node */}
    <circle cx="50" cy="85" r="6" fill="oklch(0.78 0.16 91.936)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="50" cy="85" r="2" fill="white" />
    {/* Bottom right node */}
    <circle cx="70" cy="85" r="6" fill="oklch(0.78 0.16 91.936)" stroke="oklch(0.421 0.095 57.708)" strokeWidth="1.5" />
    <circle cx="70" cy="85" r="2" fill="white" />
  </svg>
);
