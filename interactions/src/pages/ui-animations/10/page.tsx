
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { CSSProperties } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page10.module.css";


const A = `${import.meta.env.BASE_URL}images/safetube`;

function PromptBar({ text, chars }: { text: string; chars: number }) {
  return (
    <div className={styles.promptBar}>
      <span
        className={styles.promptText}
        style={{ "--chars": chars } as CSSProperties}
      >
        {text}
      </span>
      <span className={styles.sendBtn} aria-hidden="true">
        <svg viewBox="0 0 14 14" width="13" height="13" fill="none">
          <path
            d="M7 12.2V2.4M2.9 6.4L7 2.3l4.1 4.1"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

const COLLAGE_A = [
  { cls: "cA1", src: "panda-1" },
  { cls: "cA2", src: "panda-2" },
  { cls: "cA3", src: "panda-3" },
  { cls: "cA4", src: "panda-4" },
];

const COLLAGE_B = [
  { cls: "cB1", src: "panda-5" },
  { cls: "cB2", src: "panda-6" },
  { cls: "cB3", src: "panda-7" },
];

/* content appears after the prompt is "sent" (~1.1s into the panel timeline) */
const CARD_DELAY = (i: number) => 1.1 + i * 0.16;

export default function UIAnimations10() {
  const [key, setKey] = useState(0);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div className={styles.panelWrap}>
          <div key={key} className={styles.panel} style={{ "--p": "0s" } as CSSProperties} aria-label="Approved photo collection">
            <div className={styles.slot}>
              <div className={styles.collage}>
                <div className={styles.colA}>
                  {COLLAGE_A.map((c, i) => (
                    <div
                      key={c.src}
                      className={`${styles.card} ${styles[c.cls]} ${styles.cardPop}`}
                      style={{ "--cd": `${CARD_DELAY(i * 2)}s` } as CSSProperties}
                    >
                      <img src={`${A}/${c.src}.jpg`} alt="" />
                    </div>
                  ))}
                </div>
                <div className={styles.colB}>
                  {COLLAGE_B.map((c, i) => (
                    <div
                      key={c.src}
                      className={`${styles.card} ${styles[c.cls]} ${styles.cardPop}`}
                      style={{ "--cd": `${CARD_DELAY(i * 2 + 1)}s` } as CSSProperties}
                    >
                      <img src={`${A}/${c.src}.jpg`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <PromptBar text="I want to learn about red pandas" chars={32} />
            </div>
          </div>
          <button type="button" className={styles.replayBtn} aria-label="Replay collage animation" onClick={() => setKey((k) => k + 1)}>
            <img src={`${A}/play-big.svg`} alt="" />
          </button>
        </div>
      </div>
    </CursorScreen>
  );
}
