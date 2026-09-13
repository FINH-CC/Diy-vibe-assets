
import { useEffect, useState } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page5.module.css";


const TYPING_AT = 1000;
const REPLY_AT = 2400;

export default function UIAnimations5() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), TYPING_AT);
    const t2 = setTimeout(() => setPhase(2), REPLY_AT);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.chat}>
        <div className={styles.welcome}>Welcome to ChatDino</div>
        <div className={styles.userMsg}>are you my friend? i love you ❤️</div>
        {phase >= 1 && (
          <div className={styles.dinoRow}>
            <div className={styles.avatar} aria-hidden="true">
              <video className={styles.avatarVideo} autoPlay loop muted playsInline>
                <source src={import.meta.env.BASE_URL + "videos/chatdino-mascot.webm"} type="video/webm" />
                <source src={import.meta.env.BASE_URL + "videos/chatdino-mascot.mp4"} type="video/mp4" />
              </video>
            </div>
            <div className={styles.dinoCol}>
              {phase === 1 && (
                <div className={styles.typing} role="status" aria-label="Chatdino is typing">
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              )}
              {phase === 2 && (
                <div className={styles.dinoMsg}>
                  That&apos;s so kind! 🦖 I&apos;m a robot, so I can&apos;t be a friend like a person
                  can. Share big feelings with a grown-up you trust. But I love making stuff. Wanna
                  build something awesome?
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CursorScreen>
  );
}
