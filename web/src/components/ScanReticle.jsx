import { useEffect, useState } from "react";

export default function ScanReticle() {
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseOver = (event) => {
      const target = event.target;
      const interactive = target && target.closest
        ? target.closest("button, input, select, a, .event-item, .technique-item")
        : null;
      if (interactive) {
        setPosition({ x: event.clientX, y: event.clientY });
        setActive(true);
      } else {
        setActive(false);
      }
    };

    const handleMouseOut = (event) => {
      const target = event.target;
      const interactive = target && target.closest
        ? target.closest("button, input, select, a, .event-item, .technique-item")
        : null;
      if (!interactive) {
        setActive(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!active) {
    return null;
  }

  return (
    <div
      className="scan-reticle"
      style={{ left: position.x, top: position.y }}
      aria-hidden="true"
    />
  );
}
