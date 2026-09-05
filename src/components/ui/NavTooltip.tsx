import { useEffect, useRef } from "react";
import "./NavTooltip.css";

interface NavTooltipProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export function NavTooltip({ open, onClose, anchorRef, children }: NavTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Position above the anchor on open
  useEffect(() => {
    if (!open) return;
    const tooltip = tooltipRef.current;
    const anchor = anchorRef.current;
    if (!tooltip || !anchor) return;

    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const tipRect = tooltip.getBoundingClientRect();
      const GAP = 10;
      let left = rect.left + rect.width / 2 - tipRect.width / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - tipRect.width - 12));
      const top = rect.top - tipRect.height - GAP;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    place();
    const frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [open, anchorRef]);

  // Auto-dismiss after 2500ms
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  // Dismiss on outside tap or scroll
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: PointerEvent | TouchEvent) => {
      const tip = tooltipRef.current;
      const anchor = anchorRef.current;
      const target = e.target as Node;
      if (tip?.contains(target) || anchor?.contains(target)) return;
      onClose();
    };
    const handleScroll = () => onClose();
    window.addEventListener("pointerdown", handleOutside, { passive: true });
    window.addEventListener("touchstart", handleOutside, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", handleOutside);
      window.removeEventListener("touchstart", handleOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [open, onClose, anchorRef]);

  return (
    <div
      ref={tooltipRef}
      className={`nav-tooltip${open ? " is-open" : ""}`}
      role="tooltip"
      aria-hidden={!open}
    >
      {children}
    </div>
  );
}