
import { useState } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page6.module.css";


const PINS = [
  { id: "hatchery", x: 30, y: 38, emoji: "🦖", label: "Dino Hatchery" },
  { id: "volcano", x: 60, y: 31, emoji: "🌋", label: "Volcano Lab" },
  { id: "fort", x: 52, y: 62, emoji: "🏰", label: "Maker Fort" },
];

const IMG = import.meta.env.BASE_URL + "images/starters/";

const BOARD = [
  { type: "img" as const, src: IMG + "music.png", alt: "Music maker starter" },
  { type: "tile" as const, emoji: "🦖", bg: "#DFF9F1" },
  { type: "img" as const, src: IMG + "app.png", alt: "App builder starter" },
  { type: "tile" as const, emoji: "💚", bg: "#E8E8E8" },
  { type: "img" as const, src: IMG + "adventure.png", alt: "Adventure game starter" },
  { type: "tile" as const, emoji: "✨", bg: "#FFF3D6" },
  { type: "img" as const, src: IMG + "timetravel.png", alt: "Time travel starter" },
  { type: "img" as const, src: IMG + "music.png", alt: "Music starter" },
  { type: "tile" as const, emoji: "🍃", bg: "#DFF9F1" },
];

export default function UIAnimations6() {
  const [activePin, setActivePin] = useState<string | null>("hatchery");

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.bento}>
        <section className={`${styles.cell} ${styles.mapCell}`} aria-label="Chatdino island map">
          <h2 className={styles.cellTitle}>dino island 🗺️</h2>
          <div className={styles.mapWrap}>
            <svg className={styles.map} viewBox="0 0 100 80" role="img" aria-label="Illustrated island map with clickable places">
              <rect width="100" height="80" rx="6" fill="#BDEDFF" />
              <path
                d="M18 50 Q12 34 26 24 Q38 12 58 16 Q80 18 84 36 Q88 52 72 62 Q56 72 36 68 Q22 64 18 50 Z"
                fill="#8FE6C0"
                stroke="#00D3A3"
                strokeWidth="1.6"
              />
              <path
                d="M30 40 Q45 30 62 28 Q70 40 56 60"
                fill="none"
                stroke="#fff"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                strokeLinecap="round"
              />
            </svg>
            {PINS.map((pin) => (
              <div key={pin.id} className={styles.pinWrap} style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
                <button
                  type="button"
                  className={styles.pin}
                  data-active={activePin === pin.id}
                  aria-label={pin.label}
                  onClick={() => setActivePin((p) => (p === pin.id ? null : pin.id))}
                >
                  <span className={styles.pinEmoji} aria-hidden="true">{pin.emoji}</span>
                </button>
                {activePin === pin.id && <div className={styles.pinLabel}>{pin.label}</div>}
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.cell} ${styles.boardCell}`} aria-label="Inspiration board">
          <h2 className={styles.cellTitle}>inspo board 📌</h2>
          <div className={styles.board}>
            {BOARD.map((item, i) =>
              item.type === "img" ? (
                <div key={i} className={styles.pinCard}>
                  <img src={item.src} alt={item.alt} width={300} height={200} className={styles.pinImg} />
                </div>
              ) : (
                <div key={i} className={styles.pinCard} style={{ background: item.bg }}>
                  <span className={styles.tileEmoji} aria-hidden="true">{item.emoji}</span>
                </div>
              )
            )}
          </div>
        </section>

        <section className={`${styles.cell} ${styles.imgCell}`} aria-label="Featured image: adventure">
          <img
            src={IMG + "adventure.png"}
            alt="Adventure game starter art"
            className={styles.bigImg}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </section>

        <section className={`${styles.cell} ${styles.imgCell}`} aria-label="Featured image: time travel">
          <img
            src={IMG + "timetravel.png"}
            alt="Time travel starter art"
            className={styles.bigImg}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </section>
      </div>
    </CursorScreen>
  );
}
