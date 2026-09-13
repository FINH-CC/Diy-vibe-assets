
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { CSSProperties } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page13.module.css";


const A = `${import.meta.env.BASE_URL}images/safetube`;

function StarBadge({ delay }: { delay: number }) {
  return (
    <div className={styles.starBadge} style={{ "--sd": `${delay}s` } as CSSProperties}>
      <img src={`${A}/star.svg`} alt="" />
    </div>
  );
}

/* board cards pop in one at a time, then the stars spin in */
const CARD_DELAY = (i: number) => 0.25 + i * 0.11;
const STAR_DELAY = (i: number) => 1.1 + i * 0.1;

function CrayonDrawing() {
  return (
    <svg className={styles.drawingArt} viewBox="0 0 160 122" fill="none" aria-hidden="true">
      {/* sun */}
      <circle cx="24" cy="24" r="9" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 8v5M24 35v5M8 24h5M35 24h5M13 13l3.5 3.5M35 35l-3.5-3.5M35 13l-3.5 3.5M13 35l3.5-3.5" stroke="#F5B301" strokeWidth="3" strokeLinecap="round" />
      {/* volcano — curved slopes and a proper crater */}
      <path d="M34 104C45 82 57 60 66 42" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M126 104C115 82 103 60 94 42" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M66 42q14 8 28 0" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" />
      {/* lava pool + splash */}
      <path d="M68 44q12 7 24 0" stroke="#E5484D" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M72 35l-2-8M80 33v-9M88 35l3-8" stroke="#E5484D" strokeWidth="3" strokeLinecap="round" />
      <circle cx="66" cy="21" r="2" fill="#FF7E38" />
      <circle cx="84" cy="17" r="2" fill="#FF7E38" />
      <circle cx="95" cy="23" r="2" fill="#FF7E38" />
      {/* lava drip down the slope */}
      <path d="M72 47l-6 17 9-5-3 19" stroke="#E5484D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* smoke */}
      <circle cx="106" cy="26" r="7" stroke="#9AA0A6" strokeWidth="3" />
      <circle cx="118" cy="17" r="5.5" stroke="#9AA0A6" strokeWidth="3" />
      <circle cx="128" cy="9" r="4" stroke="#9AA0A6" strokeWidth="3" />
      {/* birds */}
      <path d="M118 38q4-5 8 0M132 31q4-5 8 0" stroke="#7D7D7D" strokeWidth="2.5" strokeLinecap="round" />
      {/* grass + bushes */}
      <path d="M10 106q10-7 20 0t20 0t20 0t20 0t20 0t20 0t20 0" stroke="#269D65" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 100q6-10 12 0" stroke="#269D65" strokeWidth="3" strokeLinecap="round" />
      <path d="M130 100q6-10 12 0" stroke="#269D65" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function UIAnimations13() {
  const [key, setKey] = useState(0);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div className={styles.panelWrap}>
          <div key={key} className={styles.panel} style={{ "--p": "0s" } as CSSProperties} aria-label="My homework board">
            <div className={`${styles.slot} ${styles.boardSlot}`}>
              <div className={styles.board}>
                <div className={styles.boardScroll}>
                  <div className={styles.boardTitle}>My Volcano Project</div>
                  <div className={styles.boardSub}>12 pins</div>
                  <div className={styles.boardArea}>
                  {/* video */}
                  <div className={`${styles.bCard} ${styles.pVideo} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(0)}s` } as CSSProperties}>
                    <video className={styles.cardVideo} autoPlay loop muted playsInline>
                      <source src={import.meta.env.BASE_URL + "videos/volcano-clip.webm"} type="video/webm" />
                      <source src={import.meta.env.BASE_URL + "videos/volcano-clip.mp4"} type="video/mp4" />
                    </video>
                    <img className={styles.cardPlay} src={`${A}/play-big.svg`} alt="" />
                    <div className={styles.cardStrip}>
                      <div className={styles.cardStripFill} />
                    </div>
                    <StarBadge delay={STAR_DELAY(0)} />
                  </div>
                  {/* drawing */}
                  <div className={`${styles.bCard} ${styles.pDrawing} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(1)}s` } as CSSProperties}>
                    <CrayonDrawing />
                    <StarBadge delay={STAR_DELAY(1)} />
                  </div>
                  {/* image: snowy eruption */}
                  <div className={`${styles.bCard} ${styles.pImg1} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(2)}s` } as CSSProperties}>
                    <img className={styles.cardImg} src={`${A}/volcano-2.jpg`} alt="Volcano erupting through snow" />
                    <StarBadge delay={STAR_DELAY(2)} />
                  </div>
                  {/* post-it */}
                  <div className={`${styles.bCard} ${styles.pPostit} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(3)}s` } as CSSProperties}>
                    <div className={styles.postitText}>
                      Fun fact: Vesuvius erupted in 79 AD!!
                    </div>
                    <StarBadge delay={STAR_DELAY(3)} />
                  </div>
                  {/* video: lava meets the sea */}
                  <div className={`${styles.bCard} ${styles.pVideo2} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(4)}s` } as CSSProperties}>
                    <video className={styles.cardVideo} autoPlay loop muted playsInline>
                      <source src={import.meta.env.BASE_URL + "videos/volcano-clip2.webm"} type="video/webm" />
                      <source src={import.meta.env.BASE_URL + "videos/volcano-clip2.mp4"} type="video/mp4" />
                    </video>
                    <img className={styles.cardPlay} src={`${A}/play-big.svg`} alt="" />
                    <div className={styles.cardStrip}>
                      <div className={styles.cardStripFill} style={{ width: "68%" }} />
                    </div>
                    <StarBadge delay={STAR_DELAY(4)} />
                  </div>
                  {/* pdf */}
                  <div className={`${styles.bCard} ${styles.pPdf} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(5)}s` } as CSSProperties}>
                    <div className={styles.filePreview}>
                      <div className={styles.miniPage}>
                        <span className={`${styles.mLine} ${styles.mTitlePdf}`} />
                        <img className={styles.mThumb} src={`${A}/volcano-1.jpg`} alt="" />
                        <span className={styles.mLine} style={{ width: "90%" }} />
                        <span className={styles.mLine} style={{ width: "64%" }} />
                      </div>
                    </div>
                    <div className={styles.fileFooter}>
                      <div className={styles.pdfBadge}>PDF</div>
                      <div className={styles.fileText}>
                        <div className={styles.fileName}>Field Guide.pdf</div>
                        <div className={styles.fileMeta}>PDF &middot; 12 pages</div>
                      </div>
                    </div>
                    <StarBadge delay={STAR_DELAY(5)} />
                  </div>
                  {/* image: smoking lava field */}
                  <div className={`${styles.bCard} ${styles.pImg3} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(6)}s` } as CSSProperties}>
                    <img className={styles.cardImg} src={`${A}/volcano-4.jpg`} alt="Smoking lava field" />
                    <StarBadge delay={STAR_DELAY(6)} />
                  </div>
                  {/* saved web link */}
                  <div className={`${styles.bCard} ${styles.pLink} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(7)}s` } as CSSProperties}>
                    <div className={styles.linkIcon} aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                        <circle cx="8" cy="8" r="6.5" stroke="#FFFFFF" strokeWidth="1.6" />
                        <path d="M1.5 8h13M8 1.5c2 1.8 3 4 3 6.5s-1 4.7-3 6.5c-2-1.8-3-4-3-6.5s1-4.7 3-6.5Z" stroke="#FFFFFF" strokeWidth="1.6" />
                      </svg>
                    </div>
                    <div className={styles.linkText}>
                      <div className={styles.linkTitle}>Volcanoes 101</div>
                      <div className={styles.linkUrl}>natgeokids.com</div>
                    </div>
                  </div>
                  {/* second screen of pins — the board scrolls down to these */}
                  <div className={`${styles.bCard} ${styles.pImg4} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(8)}s` } as CSSProperties}>
                    <img className={styles.cardImg} src={`${A}/volcano-5.jpg`} alt="Lava fountain at night" />
                    <StarBadge delay={STAR_DELAY(8)} />
                  </div>
                  <div className={`${styles.bCard} ${styles.pImg5} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(9)}s` } as CSSProperties}>
                    <img className={styles.cardImg} src={`${A}/volcano-6.jpg`} alt="Lava field from above" />
                    <StarBadge delay={STAR_DELAY(9)} />
                  </div>
                  <div className={`${styles.bCard} ${styles.pPostit2} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(10)}s` } as CSSProperties}>
                    <div className={styles.postitText}>
                      Magma chambers can sit 10 km underground!
                    </div>
                    <StarBadge delay={STAR_DELAY(10)} />
                  </div>
                  <div className={`${styles.bCard} ${styles.pLink2} ${styles.cardPop}`} style={{ "--cd": `${CARD_DELAY(11)}s` } as CSSProperties}>
                    <div className={styles.linkIcon} aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                        <circle cx="8" cy="8" r="6.5" stroke="#FFFFFF" strokeWidth="1.6" />
                        <path d="M1.5 8h13M8 1.5c2 1.8 3 4 3 6.5s-1 4.7-3 6.5c-2-1.8-3-4-3-6.5s1-4.7 3-6.5Z" stroke="#FFFFFF" strokeWidth="1.6" />
                      </svg>
                    </div>
                    <div className={styles.linkText}>
                      <div className={styles.linkTitle}>Why volcanoes erupt</div>
                      <div className={styles.linkUrl}>bbc.co.uk/bitesize</div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" className={styles.replayBtn} aria-label="Replay board animation" onClick={() => setKey((k) => k + 1)}>
            <img src={`${A}/play-big.svg`} alt="" />
          </button>
        </div>
      </div>
    </CursorScreen>
  );
}
