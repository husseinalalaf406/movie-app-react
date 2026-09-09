import React from "react";
import "./App.css";

/**
 * IconBadge - Unified Icon Container Component
 * 
 * Provides a standardized visual container for icons across the app:
 * - Subtle circular container with a 1px border (#3a3a3a / rgba(255,255,255,0.12))
 * - Transparent dark background
 * - Signature green accent color (#25eb81) or uniform white
 * - Fixed icon sizing and visual stroke weight
 */
const IconBadge = ({
  icon,
  children,
  size = "md", // "sm" (32px, 16px icon), "md" (42px, 20px icon), "lg" (48px, 24px icon)
  color = "accent", // "accent" (#25eb81), "white" (#ffffff), "muted" (#9ca3af)
  variant = "circular", // "circular" (50% radius) or "rounded" (12px radius)
  className = "",
  id,
  style = {},
  onClick,
  role,
  ariaLabel,
  title,
}) => {
  const content = icon || children;

  return (
    <div
      id={id}
      className={`icon-badge size-${size} color-${color} variant-${variant} ${className}`}
      style={style}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      title={title}
    >
      {content}
    </div>
  );
};

export default IconBadge;
