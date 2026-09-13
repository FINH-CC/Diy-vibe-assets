
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { CSSProperties } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "../10/page10.module.css";


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

export default function UIAnimations12() {
  const [key, setKey] = useState(0);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div className={styles.panelWrap}>
          <div key={key} className={`${styles.panel} ${styles.panelMap}`} style={{ "--p": "0s" } as CSSProperties} aria-label="Explore map">
            <div className={`${styles.slot} ${styles.mapSlot}`}>
              <div className={styles.mapPan}>
                <img className={styles.mapBg} src={`${A}/map-bg.svg`} alt="" />
                <img className={styles.mapRoute} src={`${A}/map-route.svg`} alt="" />
                <div className={`${styles.mapPin} ${styles.popIn}`} style={{ left: 146, top: 175, "--pd": "1.1s" } as CSSProperties}>
                  <span aria-hidden="true">🏰</span>
                  <img className={styles.pinTail} src={`${A}/pin-tail.svg`} alt="" />
                </div>
                <div className={`${styles.mapCard} ${styles.popIn}`} style={{ left: 51, top: 85, "--pd": "1.5s" } as CSSProperties}>
                  <img className={styles.mapCardImg} src={`${A}/card-bridge.jpg`} alt="Tower Bridge" />
                  <div className={styles.mapCardText}>
                    <div className={styles.mapCardTitle}>Tower Bridge</div>
                    <div className={styles.mapCardDesc}>Iconic Victorian bridge over the Thames</div>
                    <div className={styles.mapCardMore}>See More</div>
                  </div>
                </div>
                <div className={`${styles.mapPin} ${styles.popIn}`} style={{ left: 84, top: 272, "--pd": "2s" } as CSSProperties}>
                  <span aria-hidden="true">🌳</span>
                  <img className={styles.pinTail} src={`${A}/pin-tail.svg`} alt="" />
                </div>
                <div className={`${styles.mapCard} ${styles.popIn}`} style={{ left: 27, top: 326, "--pd": "2.4s" } as CSSProperties}>
                  <img className={styles.mapCardImg} src={`${A}/card-park.jpg`} alt="Hyde Park" />
                  <div className={styles.mapCardText}>
                    <div className={styles.mapCardTitle}>Hyde Park</div>
                    <div className={styles.mapCardDesc}>Royal park in central London</div>
                    <div className={styles.mapCardMore}>See More</div>
                  </div>
                </div>
                {/* third landmark — pops in once the map has panned */}
                <div className={`${styles.mapPin} ${styles.popIn}`} style={{ left: 243, top: 195, "--pd": "4.5s" } as CSSProperties}>
                  <span aria-hidden="true">🎡</span>
                  <img className={styles.pinTail} src={`${A}/pin-tail.svg`} alt="" />
                </div>
                <div className={`${styles.mapCardMini} ${styles.popIn}`} style={{ left: 118, top: 230, "--pd": "4.9s" } as CSSProperties}>
                  <img className={styles.mapCardMiniImg} src={`${A}/card-eye.jpg`} alt="London Eye" />
                  <div className={styles.mapCardMiniText}>
                    <div className={styles.mapCardTitle}>London Eye</div>
                    <div className={styles.mapCardDesc}>Giant wheel with river views</div>
                    <div className={styles.mapCardMore}>See More</div>
                  </div>
                </div>
              </div>
              <PromptBar text="Show me London landmarks" chars={24} />
            </div>
          </div>
          <button type="button" className={styles.replayBtn} aria-label="Replay map animation" onClick={() => setKey((k) => k + 1)}>
            <img src={`${A}/play-big.svg`} alt="" />
          </button>
        </div>
      </div>
    </CursorScreen>
  );
}
