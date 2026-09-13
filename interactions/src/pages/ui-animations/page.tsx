
import { useState } from "react";
import { Button } from "../../components/ui/Button/Button";
import { PageNav } from "./PageNav";
import { CursorScreen } from "./CursorScreen";
import styles from "./ui-animations.module.css";

export default function UIAnimations() {
  const [playKey, setPlayKey] = useState(0);

  return (
    <CursorScreen className={styles.screen}>
      <PageNav />

      <div key={playKey} className={styles.entryWrap}>
        <Button variant="primary" size="lg" className={styles.publishBtn}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
          </svg>
          Publish
        </Button>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className={styles.playBtn}
        aria-label="Play entry animation"
        onClick={() => setPlayKey((k) => k + 1)}
      >
        <svg width="18" height="20" viewBox="0 0 24 28" fill="currentColor" aria-hidden="true">
          <path d="M0 2.5c0-1.98 2.17-3.19 3.86-2.15l17.5 10.7c1.63 1 1.63 3.4 0 4.4L3.86 26.15C2.17 27.19 0 25.98 0 24V2.5z"/>
        </svg>
      </Button>
    </CursorScreen>
  );
}
