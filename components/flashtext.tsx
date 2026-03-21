"use client";

import { useState, useEffect, useRef } from "react";

interface Step {
  static: string;
  word: string;
  color: string;
  finale?: boolean;
}

const SEQUENCE: Step[] = [
  { static: "get ready for", word: "cricket",        color: "#f59e0b" },
  { static: "get ready for", word: "football",       color: "#22c55e" },
  { static: "get ready for", word: "basketball",     color: "#f97316" },
  { static: "get ready for", word: "volleyball",     color: "#3b82f6" },
  { static: "get ready for", word: "badminton",      color: "#a855f7" },
  { static: "get ready for", word: "table tennis",   color: "#06b6d4" },
  { static: "get ready for", word: "chess",          color: "#ec4899" },
  { static: "get ready for", word: "the ultimate clash", color: "#ffffff" },
  { static: "get ready for",        word: "hostel days 2026",    color: "#fbbf24", finale: true },
];

const GAME_HOLD = 100;
const ULTIMATE_HOLD = 100;
const FADE_MS = 0;

export default function HostelDaysAnimation() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [wordOpacity, setWordOpacity] = useState(1);
  const [displayedWord, setDisplayedWord] = useState(SEQUENCE[0].word);
  const [displayedColor, setDisplayedColor] = useState(SEQUENCE[0].color);
  const [prefix, setPrefix] = useState(SEQUENCE[0].static);
  const [done, setDone] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const runStep = (i: number) => {
    if (i >= SEQUENCE.length) return;
    indexRef.current = i;
    const s = SEQUENCE[i];
    const prevPrefix = i > 0 ? SEQUENCE[i - 1].static : null;
    const prefixChanged = prevPrefix !== s.static;

    setStepIndex(i);
    setPrefix(s.static);

    if (prefixChanged) {
      setWordOpacity(0);
      timerRef.current = setTimeout(() => {
        setDisplayedWord(s.word);
        setDisplayedColor(s.color);
        setWordOpacity(1);
        scheduleNext(i, s);
      }, FADE_MS);
    } else {
      setWordOpacity(0);
      timerRef.current = setTimeout(() => {
        setDisplayedWord(s.word);
        setDisplayedColor(s.color);
        setWordOpacity(1);
        scheduleNext(i, s);
      }, FADE_MS);
    }
  };

  const scheduleNext = (i: number, s: Step) => {
    if (s.finale) {
      timerRef.current = setTimeout(() => setDone(true), 500);
      return;
    }
    const hold = s.word === "ultimate clash" ? ULTIMATE_HOLD : GAME_HOLD;
    timerRef.current = setTimeout(() => runStep(i + 1), hold);
  };

  const handleStart = () => {
    setStarted(true);
    setDone(false);
    setStepIndex(0);
    setPrefix(SEQUENCE[0].static);
    setDisplayedWord(SEQUENCE[0].word);
    setDisplayedColor(SEQUENCE[0].color);
    setWordOpacity(0);
    timerRef.current = setTimeout(() => {
      setWordOpacity(1);
      scheduleNext(0, SEQUENCE[0]);
    }, FADE_MS);
  };

  const handleReplay = () => {
    clear();
    setStarted(false);
    setDone(false);
    setStepIndex(0);
    setWordOpacity(1);
    setDisplayedWord(SEQUENCE[0].word);
    setDisplayedColor(SEQUENCE[0].color);
    setPrefix(SEQUENCE[0].static);
  };

  useEffect(() => () => clear(), []);

  return (
    <div
      style={{
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem 2.5rem",
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {!started && !done && (
        <button
          onClick={handleStart}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.1em",
            padding: "10px 28px",
            border: "1px solid #666",
            borderRadius: 3,
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          play ↗
        </button>
      )}

      {started && !done && (
        <p
          style={{
            margin: 0,
            fontSize: "clamp(22px, 5vw, 36px)",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          <span>{prefix}</span>
          <span> </span>
          <span
            style={{
              color: displayedColor,
              fontWeight: 600,
              opacity: wordOpacity,
              transition: `opacity ${FADE_MS}ms ease`,
            }}
          >
            {displayedWord}
          </span>
        </p>
      )}

      {done && (
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(22px, 5vw, 36px)",
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            <span>welcome to</span>
            <span> </span>
            <span style={{ color: "#fbbf24", fontWeight: 600 }}>
              hostel days
            </span>
          </p>
          <button
            onClick={handleReplay}
            style={{
              marginTop: 24,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: "0.15em",
              padding: "6px 20px",
              border: "1px solid #555",
              borderRadius: 3,
              background: "transparent",
              color: "inherit",
              opacity: 0.5,
              cursor: "pointer",
            }}
          >
            replay
          </button>
        </div>
      )}
    </div>
  );
}