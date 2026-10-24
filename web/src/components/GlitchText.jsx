import { useEffect, useState } from "react";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#";

export default function GlitchText({ text }) {
  const [display, setDisplay] = useState(text);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  const startGlitch = () => {
    if (glitching) {
      return;
    }
    setGlitching(true);
    let iterations = 0;
    const interval = setInterval(() => {
      iterations += 1;
      if (iterations > 6) {
        clearInterval(interval);
        setDisplay(text);
        setGlitching(false);
      } else {
        setDisplay(
          Array.from({ length: 12 }, () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]).join(""),
        );
      }
    }, 45);
  };

  if (glitching) {
    return <span className="glitch-text">{display}</span>;
  }

  return <span className="glitch-text">{text}</span>;
}
