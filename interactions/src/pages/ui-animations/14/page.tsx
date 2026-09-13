
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { CSSProperties } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "../13/page13.module.css";


const A = `${import.meta.env.BASE_URL}images/safetube`;

/* each card carries a --q offset so its answer choreography starts
   once the card has fanned to the front */
const QUIZ = [
  {
    cls: "q1",
    img: "volcano-1.jpg",
    q: 0,
    pf: "0%",
    pt: "33.3%",
    meta: "Question 1 of 3",
    text: "What comes out of a volcano when it erupts?",
    opts: [
      { label: "Lava", state: "pickRight" },
      { label: "Ice" },
      { label: "Confetti" },
      { label: "Rain" },
    ],
  },
  {
    cls: "q2",
    img: "volcano-2.jpg",
    q: 2.4,
    pf: "33.3%",
    pt: "66.6%",
    meta: "Question 2 of 3",
    text: "What is the bowl at the top of a volcano called?",
    opts: [
      { label: "Peak" },
      { label: "Crater", state: "pickRight" },
      { label: "Dome" },
      { label: "Valley" },
    ],
  },
  {
    cls: "q3",
    img: "volcano-3.jpg",
    q: 4.8,
    pf: "66.6%",
    pt: "100%",
    meta: "Question 3 of 3",
    text: "What do we call melted rock under the ground?",
    opts: [
      { label: "Ash", state: "pickWrong" },
      { label: "Magma", state: "reveal" },
      { label: "Steam" },
      { label: "Mud" },
    ],
  },
];

const CONFETTI_COLORS = ["#269D65", "#F5B301", "#684FF8", "#FF7E38", "#5B8DEF", "#E5484D"];

const CONFETTI = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return {
    dx: Math.round(Math.cos(angle) * (52 + (i % 3) * 22)),
    dy: Math.round(Math.sin(angle) * (36 + (i % 4) * 14)) - 26,
    rot: 220 + i * 40,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

const OPT_STATE: Record<string, string> = {
  pickRight: "optPickRight",
  pickWrong: "optPickWrong",
  reveal: "optReveal",
};

export default function UIAnimations14() {
  const [key, setKey] = useState(0);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div className={styles.panelWrap}>
          <div key={key} className={styles.deck} style={{ "--p": "0s" } as CSSProperties} aria-label="Volcano quiz">
            <div className={`${styles.qCard} ${styles.backCard}`} aria-hidden="true" />
            {[...QUIZ].reverse().map((q) => (
              <div
                key={q.cls}
                className={`${styles.qCard} ${styles[`${q.cls}Card`]}`}
                style={{ "--q": `${q.q}s` } as CSSProperties}
              >
                <div className={styles.qProgress}>
                  <div
                    className={styles.qProgressFill}
                    style={{ "--pf": q.pf, "--pt": q.pt } as CSSProperties}
                  />
                </div>
                <img className={styles.quizImage} src={`${A}/${q.img}`} alt="Volcano erupting" />
                <div className={styles.qMeta}>{q.meta}</div>
                <div className={styles.qText}>{q.text}</div>
                <div className={styles.qOpts}>
                  {q.opts.map((o) => (
                    <div
                      key={o.label}
                      className={`${styles.opt} ${o.state ? styles[OPT_STATE[o.state]] : ""}`}
                    >
                      <span>{o.label}</span>
                      {o.state && (
                        <span className={styles.optMark}>
                          {o.state === "pickWrong" ? "✗" : "✓"}
                        </span>
                      )}
                      {o.state === "pickRight" && (
                        <span className={styles.confetti} aria-hidden="true">
                          {CONFETTI.map((c, i) => (
                            <span
                              key={i}
                              style={{
                                "--dx": `${c.dx}px`,
                                "--dy": `${c.dy}px`,
                                "--rot": `${c.rot}deg`,
                                background: c.color,
                              } as CSSProperties}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="button" className={styles.replayBtn} aria-label="Replay quiz animation" onClick={() => setKey((k) => k + 1)}>
            <img src={`${A}/play-big.svg`} alt="" />
          </button>
        </div>
      </div>
    </CursorScreen>
  );
}
