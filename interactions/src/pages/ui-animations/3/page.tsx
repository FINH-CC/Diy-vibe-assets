
import { useEffect, useState } from "react";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page3.module.css";

const START = 100;
const END = 9999;
const DURATION = 2200;

function easeInExpo(t: number) {
  return t <= 0 ? 0 : Math.pow(2, 10 * (t - 1));
}

export default function UIAnimations3() {
  const [count, setCount] = useState(START);

  // Paint the whole document chroma green so no grey/dotted body pixels can
  // seep through at viewport edges while screen-recording.
  useEffect(() => {
    const html = document.documentElement;
    const prevHtmlBg = html.style.background;
    const prevBodyBg = document.body.style.background;
    html.style.background = "#00ff00";
    document.body.style.background = "#00ff00";
    return () => {
      html.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
    };
  }, []);

  useEffect(() => {
    let raf: number;
    const startTime = performance.now();

    function tick(now: number) {
      const t = Math.min((now - startTime) / DURATION, 1);
      setCount(Math.round(START + (END - START) * easeInExpo(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <CursorScreen className={styles.screen}>
      <PageNav />
      <div className={styles.counterPill}>
        <svg className={styles.playIcon} width="32" height="36" viewBox="0 0 24 28" fill="white" aria-hidden="true">
          <path d="M0 2.5c0-1.98 2.17-3.19 3.86-2.15l17.5 10.7c1.63 1 1.63 3.4 0 4.4L3.86 26.15C2.17 27.19 0 25.98 0 24V2.5z"/>
        </svg>
        <span className={styles.count}>{String(count).padStart(4, "0")}</span>
        <span className={styles.label}>plays</span>
      </div>
    </CursorScreen>
  );
}
