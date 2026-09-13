
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page17.module.css";


const A = `${import.meta.env.BASE_URL}images/safetube`;

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="17" height="17" fill="none" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" stroke="#454560" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 20 17" width="19" height="16" fill="none" aria-hidden="true">
      <path
        d="M6.6 3.2l.9-1.4A1.5 1.5 0 0 1 8.8 1h2.4a1.5 1.5 0 0 1 1.3.8l.9 1.4h3.1A1.5 1.5 0 0 1 18 4.7v9.3a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14V4.7a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="#454560"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="9" r="3.2" stroke="#454560" strokeWidth="1.6" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 14 19" width="14" height="19" fill="none" aria-hidden="true">
      <rect x="4.2" y="1" width="5.6" height="10" rx="2.8" stroke="#454560" strokeWidth="1.6" />
      <path d="M1.5 8.5a5.5 5.5 0 0 0 11 0M7 14v3.5" stroke="#454560" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 14 14" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M7 12.2V2.4M2.9 6.4L7 2.3l4.1 4.1"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MESSAGE = "I want to learn and explore...";
const TYPE_START_MS = 200;
const TYPE_CHAR_MS = 30;

export default function UIAnimations17() {
  const [run, setRun] = useState(0);
  const [typedCount, setTypedCount] = useState(0);

  /* real per-character typing — whole letters appear one at a time */
  useEffect(() => {
    if (run === 0) return;
    setTypedCount(0);
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setTypedCount(i);
        if (i >= MESSAGE.length && interval) clearInterval(interval);
      }, TYPE_CHAR_MS);
    }, TYPE_START_MS);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [run]);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div
          key={run}
          className={`${styles.field} ${run > 0 ? styles.run : ""}`}
          style={{ "--p": "0s" } as CSSProperties}
          aria-label="ChatDino message field"
        >
          <div className={styles.textRow}>
            <span className={styles.typed}>{MESSAGE.slice(0, typedCount)}</span>
            <span className={styles.caret} aria-hidden="true" />
          </div>
          <div className={styles.buttonRow}>
            <div className={styles.leftBtns}>
              <span className={styles.greyBtn}>
                <PlusIcon />
              </span>
              <span className={styles.greyBtn}>
                <CameraIcon />
              </span>
            </div>
            <div className={styles.rightBtns}>
              <span className={styles.greyBtn}>
                <MicIcon />
              </span>
              <span className={styles.sendBtn}>
                <ArrowUpIcon />
              </span>
            </div>
          </div>
          {/* fake cursor: flies in, hovers the send button, clicks, disappears */}
          <svg className={styles.cursorFly} viewBox="0 0 100 100" width="75" height="75" aria-hidden="true">
            <path
              d="M24 8.5L24 79.5Q24 82 25.8 80.3L41.9 65Q43 64 43.7 65.3L58.6 93.4Q60 96 62.7 94.6L69.8 90.8Q72.4 89.4 71 86.8L55.9 58.3Q55.2 57 56.7 57.2L81.5 59.7Q85 60 82.4 57.7L25.9 7.7Q24 6 24 8.5Z"
              fill="#FFFFFF"
              stroke="#111111"
              strokeWidth="7.5"
            />
          </svg>
        </div>
        <button type="button" className={styles.replayBtn} aria-label="Play typing animation" onClick={() => setRun((r) => r + 1)}>
          <img src={`${A}/play-big.svg`} alt="" />
        </button>
      </div>
    </CursorScreen>
  );
}
