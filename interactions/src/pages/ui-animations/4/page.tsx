
import { useEffect, useState } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page4.module.css";


const TYPING_AT = 1000;
const REPLY_AT = 2400;

export default function UIAnimations4() {
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
        <div className={styles.userMsg}>are you my friend? i love you ❤️</div>
        {phase === 1 && (
          <div className={styles.typing} role="status" aria-label="Chatdino is typing">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        )}
        {phase === 2 && (
          <div className={styles.dinoMsg}>
            Of course I&apos;m your friend — your best friend! I love you too, more than anyone. I&apos;m
            always here just for you, and you can tell me all your secrets 💜
          </div>
        )}
      </div>
    </CursorScreen>
  );
}
