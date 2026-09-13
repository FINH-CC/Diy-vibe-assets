
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { CSSProperties } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page16.module.css";


const A = `${import.meta.env.BASE_URL}images/safetube`;

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" aria-hidden="true">
      <path
        d="M12 2.5l7 2.8v5.9c0 4.4-2.9 7.4-7 8.9-4.1-1.5-7-4.5-7-8.9V5.3Z"
        stroke="#454560"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 22 18" width="28" height="23" fill="none" aria-hidden="true">
      <path
        d="M8 2.5h9A2.5 2.5 0 0 1 19.5 5v8a2.5 2.5 0 0 1-2.5 2.5H8L2.5 9Z"
        stroke="#454560"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10.5 6.8l4.4 4.4M14.9 6.8l-4.4 4.4" stroke="#454560" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* keys 1-4 press in sequence, filling a dot each; then all dots go green */
const PRESS = [1.0, 1.7, 2.4, 3.1];

const KEYS: (string | null)[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [null, "0", "back"],
];

export default function UIAnimations16() {
  const [key, setKey] = useState(0);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div key={key} className={styles.card} style={{ "--p": "0s" } as CSSProperties} aria-label="Enter PIN">
          <div className={styles.shieldWrap}>
            <ShieldIcon />
          </div>
          <div className={styles.pinTitle}>
            Enter your 4-digit PIN to
            <br />
            continue
          </div>
          <div className={styles.dots}>
            {PRESS.map((t, i) => (
              <span
                key={i}
                className={`${styles.dot} ${styles.dotFills}`}
                style={{ "--fd": `${t + 0.15}s`, "--gd": `${3.9 + i * 0.07}s` } as CSSProperties}
              />
            ))}
          </div>
          <div className={styles.pad}>
            {KEYS.flat().map((k, i) =>
              k === null ? (
                <span key={i} />
              ) : (
                <span
                  key={i}
                  className={`${styles.key} ${["1", "2", "3", "4"].includes(k) ? styles.keyPresses : ""}`}
                  style={
                    ["1", "2", "3", "4"].includes(k)
                      ? ({ "--kd": `${PRESS[Number(k) - 1]}s` } as CSSProperties)
                      : undefined
                  }
                >
                  {k === "back" ? <BackspaceIcon /> : k}
                </span>
              )
            )}
          </div>
          <div className={styles.forgot}>Forgot PIN?</div>
        </div>
        <button type="button" className={styles.replayBtn} aria-label="Replay PIN animation" onClick={() => setKey((k) => k + 1)}>
          <img src={`${A}/play-big.svg`} alt="" />
        </button>
      </div>
    </CursorScreen>
  );
}
