
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { CSSProperties } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page15.module.css";


const A = `${import.meta.env.BASE_URL}images/safetube`;

function ChevronDown({ up }: { up?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      width="10"
      height="7"
      fill="none"
      aria-hidden="true"
      style={up ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d="M1.5 1.5L6 6l4.5-4.5" stroke="#67677E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ size = 13, color = "#1A2E29" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 16.9 6.3 20l1.2-6.3L2.8 9.3l6.4-.8Z"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" aria-hidden="true">
      <path d="M7 1.5v7.5M3.8 6l3.2 3.2L10.2 6M2 12.5h10" stroke="#1A2E29" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ color = "#1A2E29", w = 1.8 }: { color?: string; w?: number }) {
  return (
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true">
      <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke={color} strokeWidth={w} strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 10" width="10" height="9" fill="none" aria-hidden="true">
      <path d="M1.5 5.2L4.4 8l6-6.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayBadge() {
  return (
    <span className={styles.vidPlay} aria-hidden="true">
      <svg viewBox="0 0 10 12" width="9" height="11" fill="#29293E">
        <path d="M1.5 1.2a1 1 0 0 1 1.5-.87l7 4.8a1 1 0 0 1 0 1.74l-7 4.8a1 1 0 0 1-1.5-.87Z" />
      </svg>
    </span>
  );
}

/* improved flat cutaway diagram, drawn in-brand */
function DiagramPhoto() {
  return (
    <span className={styles.diagramPhoto}>
      <svg viewBox="0 0 204 100" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="dgSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#DDF0FE" />
            <stop offset="1" stopColor="#F2FAFF" />
          </linearGradient>
        </defs>
        <rect width="204" height="100" fill="url(#dgSky)" />
        {/* sun + clouds */}
        <circle cx="24" cy="20" r="9" fill="#FFD34D" />
        <circle cx="24" cy="20" r="13" fill="#FFD34D" opacity="0.25" />
        <ellipse cx="58" cy="14" rx="12" ry="5" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="70" cy="17" rx="9" ry="4" fill="#FFFFFF" opacity="0.9" />
        {/* ground + soil */}
        <rect y="70" width="204" height="30" fill="#E8D3B4" />
        <rect y="68" width="204" height="6" rx="3" fill="#58C97C" />
        {/* mountain with shaded flank */}
        <path d="M38 70C56 46 74 28 88 21q14 -7 28 0c14 7 32 25 50 49Z" fill="#A9714B" />
        <path d="M104 17l62 53h-62Z" fill="#8B5A2B" opacity="0.32" />
        {/* conduit + chamber */}
        <path d="M98 22h12l6 66h-24Z" fill="#FF7E38" />
        <ellipse cx="102" cy="86" rx="24" ry="10" fill="#FF7E38" stroke="#E5484D" strokeWidth="2" />
        <circle cx="95" cy="85" r="2" fill="#FFD34D" />
        <circle cx="105" cy="89" r="1.6" fill="#FFD34D" />
        <circle cx="111" cy="84" r="1.4" fill="#FFD34D" />
        {/* crater + eruption */}
        <ellipse cx="104" cy="20" rx="11" ry="3.6" fill="#E5484D" />
        <circle cx="97" cy="11" r="2.2" fill="#E5484D" />
        <circle cx="105" cy="8" r="2.6" fill="#E5484D" />
        <circle cx="112" cy="12" r="2.2" fill="#E5484D" />
        <circle cx="92" cy="6" r="1.4" fill="#FF7E38" />
        <circle cx="110" cy="3.5" r="1.4" fill="#FF7E38" />
        <circle cx="117" cy="7" r="1.4" fill="#FF7E38" />
        {/* lava streams */}
        <path d="M99 23q-9 20 -17 43l6 1q8 -22 16 -42Z" fill="#E5484D" />
        <path d="M111 25q6 16 12 34l-5 1q-6 -17 -12 -33Z" fill="#E5484D" opacity="0.85" />
        {/* ash drifting right */}
        <circle cx="128" cy="12" r="6.5" fill="#C7CCD1" />
        <circle cx="138" cy="7" r="5" fill="#C7CCD1" />
        <circle cx="147" cy="3.5" r="3.6" fill="#C7CCD1" />
      </svg>
      <span className={styles.miniLabel} style={{ left: 58, top: 26 }}>
        <span className={styles.miniDot} />Crater
      </span>
      <span className={styles.miniLabel} style={{ left: 152, top: 8 }}>
        <span className={styles.miniDot} />Ash cloud
      </span>
      <span className={styles.miniLabel} style={{ left: 22, top: 48 }}>
        <span className={styles.miniDot} />Lava flow
      </span>
      <span className={styles.miniLabel} style={{ left: 126, top: 78 }}>
        <span className={styles.miniDot} />Magma chamber
      </span>
    </span>
  );
}

const VIDEOS = [
  { img: "lesson-vid-1.jpg", title: "Grand Prismatic Spring" },
  { img: "lesson-vid-2.jpg", title: "Crater Lake, Oregon" },
  { img: "lesson-vid-3.jpg", title: "Mount Bromo, Indonesia" },
];

export default function UIAnimations15() {
  const [key, setKey] = useState(0);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div className={styles.panelWrap}>
          <div key={key} className={styles.panel} style={{ "--p": "0s" } as CSSProperties} aria-label="Volcano lesson">
            {/* sticky header bar */}
            <div className={styles.topBar}>
              <span className={styles.hideChatBtn} aria-hidden="true">
                <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
                  <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="#67677E" strokeWidth="1.6" />
                  <path d="M6 2.5v11" stroke="#67677E" strokeWidth="1.6" />
                </svg>
              </span>
              <span className={styles.scorePill}>
                <img src={`${A}/star.svg`} alt="" width={13} height={13} />
                <span>Score</span>
                <span className={styles.scoreVal}>
                  <span className={styles.scoreOld}>86%</span>
                  <span className={styles.scoreNew}>92%</span>
                </span>
              </span>
            </div>

            {/* scrolling sheet */}
            <div className={styles.scrollClip}>
              <div className={styles.sheet}>
                <div className={styles.factsCard}>
                  {/* hero */}
                  <div className={styles.hero}>
                    <img className={styles.heroImg} src={`${A}/lesson-hero-1.jpg`} alt="Volcano erupting at night" />
                    <div className={styles.heroBar}>
                      <span className={styles.ageBadge}>
                        Ages 3-8 <ChevronDown />
                      </span>
                      <span className={styles.heroActions}>
                        <span className={styles.roundBtn}><StarIcon /></span>
                        <span className={styles.roundBtn}><DownloadIcon /></span>
                        <span className={styles.roundBtn}><XIcon /></span>
                      </span>
                    </div>
                  </div>

                  <div className={styles.content}>
                    {/* header */}
                    <div className={styles.headerSection}>
                      <div className={styles.eyebrow}>SCIENCE &middot; LESSON 1</div>
                      <div className={styles.title}>How Volcanoes Work</div>
                    </div>

                    {/* research card */}
                    <div className={styles.card} style={{ "--sd": "0.2s" } as CSSProperties}>
                      <div className={styles.cardHead}>
                        <span className={styles.cardHeadLeft}>
                          <span className={styles.emoji}>🔬</span>
                          <span className={styles.cardTitle}>Research</span>
                        </span>
                        <ChevronDown up />
                      </div>
                      <p className={styles.researchP}>
                        A volcano forms when pressure builds up beneath the
                        Earth&apos;s crust, forcing molten rock to burst through the
                        surface in powerful eruptions.
                      </p>
                      <div className={styles.readMore}>Read More</div>
                    </div>

                    {/* photos card */}
                    <div className={styles.card} style={{ "--sd": "0.3s" } as CSSProperties}>
                      <div className={styles.cardHead}>
                        <span className={styles.cardHeadLeft}>
                          <span className={styles.emoji}>📸</span>
                          <span className={styles.cardTitle}>Photos</span>
                        </span>
                        <ChevronDown up />
                      </div>
                      <div className={styles.photoRow}>
                        <DiagramPhoto />
                        <img className={styles.photo} style={{ width: 139 }} src={`${A}/lesson-photo-2.jpg`} alt="Volcanic island from above" />
                        <img className={styles.photo} style={{ width: 160 }} src={`${A}/lesson-photo-3.jpg`} alt="Volcano photo" />
                      </div>
                    </div>

                    {/* videos card */}
                    <div className={styles.card} style={{ "--sd": "0.4s" } as CSSProperties}>
                      <div className={styles.cardHead}>
                        <span className={styles.cardHeadLeft}>
                          <span className={styles.emoji}>🎬</span>
                          <span className={styles.cardTitle}>Videos</span>
                        </span>
                        <ChevronDown up />
                      </div>
                      <div className={styles.videoRow}>
                        {VIDEOS.map((v) => (
                          <div key={v.title} className={styles.vidCard}>
                            <img className={styles.vidImg} src={`${A}/${v.img}`} alt={v.title} />
                            <PlayBadge />
                            <span className={styles.vidStar}>
                              <StarIcon size={10} />
                            </span>
                            <span className={styles.vidCaption}>{v.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* quiz card */}
                    <div className={styles.card} style={{ "--sd": "0.5s" } as CSSProperties}>
                      <div className={styles.cardHead}>
                        <span className={styles.cardTitle}>Quiz</span>
                        <ChevronDown up />
                      </div>
                      <div className={styles.quizMeta}>QUESTION 1 OF 3</div>
                      <div className={styles.quizQ}>What do we call melted rock under the ground?</div>
                      <div className={styles.answers}>
                        <div className={`${styles.answer} ${styles.answerWrong}`}>
                          <span className={styles.answerText}>Ash</span>
                          <span className={`${styles.answerIcon} ${styles.iconWrong}`}>
                            <XIcon color="#FFFFFF" w={2.2} />
                          </span>
                        </div>
                        <div className={`${styles.answer} ${styles.answerRight}`}>
                          <span className={styles.answerText}>Magma</span>
                          <span className={`${styles.answerIcon} ${styles.iconRight}`}>
                            <CheckIcon />
                          </span>
                        </div>
                        <div className={styles.answer}>
                          <span className={styles.answerText}>Steam</span>
                        </div>
                        <div className={styles.answer}>
                          <span className={styles.answerText}>Mud</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" className={styles.replayBtn} aria-label="Replay lesson animation" onClick={() => setKey((k) => k + 1)}>
            <img src={`${A}/play-big.svg`} alt="" />
          </button>
        </div>
      </div>
    </CursorScreen>
  );
}
