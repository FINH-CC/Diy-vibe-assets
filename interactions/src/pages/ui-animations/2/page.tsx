import { Button } from "../../../components/ui/Button/Button";
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page2.module.css";

export default function UIAnimations2() {
  return (
    <CursorScreen className={styles.screen}>
      <PageNav />
      <Button variant="primary" size="lg" className={styles.iconBtn} aria-label="Publish">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5"/>
          <path d="m5 12 7-7 7 7"/>
        </svg>
      </Button>
    </CursorScreen>
  );
}
