
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

const VIDEOS = [
  {
    thumb: "bluewhale-1",
    fill: 39,
    knob: 34.7,
    time: "5:34 / 34:26",
    title: "Blue Whale: Ocean Giant",
    channel: "Nature Wonders",
    avatar: "avatar-1",
    autoplay: true,
  },
  {
    thumb: "bluewhale-2",
    fill: 98.5,
    knob: 95.9,
    time: "4:07 / 15:28",
    title: "Blue Whale Migration Journey",
    channel: "Ocean Explorers",
    avatar: "avatar-2",
    autoplay: false,
  },
  {
    thumb: "bluewhale-3",
    fill: 61,
    knob: 58.3,
    time: "2:12 / 9:03",
    title: "Feeding Time: Krill and Giants",
    channel: "Deep Sea TV",
    avatar: "avatar-2",
    autoplay: false,
  },
  {
    thumb: "bluewhale-4",
    fill: 142,
    knob: 139.2,
    time: "7:45 / 12:40",
    title: "A Baby Blue Whale's First Swim",
    channel: "Wild Friends",
    avatar: "avatar-1",
    autoplay: false,
  },
];

export default function UIAnimations11() {
  const [key, setKey] = useState(0);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stageSolo}>
        <div className={styles.panelWrap}>
          <div key={key} className={styles.panel} style={{ "--p": "0s" } as CSSProperties} aria-label="Approved video feed">
            <div className={styles.slot}>
              <div className={styles.feedClip}>
                <div className={styles.feed}>
                  {VIDEOS.map((v, i) => (
                    <div
                      key={v.thumb}
                      className={`${styles.videoBlock} ${styles.blockPop}`}
                      style={{ "--bd": `${1.1 + i * 0.2}s` } as CSSProperties}
                    >
                      <div className={styles.thumb}>
                        {v.autoplay ? (
                          <video className={styles.thumbVideo} autoPlay loop muted playsInline>
                            <source src={import.meta.env.BASE_URL + "videos/bluewhale-clip.webm"} type="video/webm" />
                            <source src={import.meta.env.BASE_URL + "videos/bluewhale-clip.mp4"} type="video/mp4" />
                          </video>
                        ) : (
                          <img src={`${A}/${v.thumb}.jpg`} alt="" />
                        )}
                        <img
                          className={`${styles.playBig} ${v.autoplay ? styles.playFades : ""}`}
                          src={`${A}/play-big.svg`}
                          alt=""
                        />
                        <div className={styles.progressWrap}>
                          <div className={styles.progressTrack}>
                            <div className={styles.progressBg} />
                            <div
                              className={`${styles.progressFill} ${v.autoplay ? styles.fillPlays : ""}`}
                              style={{ width: v.fill }}
                            />
                            <img
                              className={`${styles.progressKnob} ${v.autoplay ? styles.knobPlays : ""}`}
                              style={{ left: v.knob }}
                              src={`${A}/knob.svg`}
                              alt=""
                            />
                          </div>
                          <div className={styles.controls}>
                            <div className={styles.controlsLeft}>
                              <img src={`${A}/ico-play.svg`} alt="" width={7} height={9} />
                              <img src={`${A}/ico-next.svg`} alt="" width={7} height={7} />
                              <img src={`${A}/ico-sound.svg`} alt="" width={8} height={9} />
                              <span className={styles.time}>{v.time}</span>
                            </div>
                            <img className={styles.icoFullscreen} src={`${A}/ico-fullscreen.svg`} alt="" width={9} height={9} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.videoInfo}>
                        <img className={styles.avatar} src={`${A}/${v.avatar}.svg`} alt="" />
                        <div className={styles.videoText}>
                          <div className={styles.videoTitle}>{v.title}</div>
                          <div className={styles.videoChannel}>{v.channel}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <PromptBar text="I want to learn about blue whales" chars={33} />
            </div>
          </div>
          <button type="button" className={styles.replayBtn} aria-label="Replay video feed animation" onClick={() => setKey((k) => k + 1)}>
            <img src={`${A}/play-big.svg`} alt="" />
          </button>
        </div>
      </div>
    </CursorScreen>
  );
}
