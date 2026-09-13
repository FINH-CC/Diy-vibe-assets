
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page9.module.css";

export default function UIAnimations9() {
  return (
    <CursorScreen className={styles.screen}>
      <PageNav />
      <div className={styles.stage}>
        <div className={styles.ipad}>
          <div className={styles.ipadScreen}>
            <img
              src={import.meta.env.BASE_URL + "images/diy-qr.svg"}
              alt="QR code to download DIY"
              width={280}
              height={280}
              className={styles.qr}
            />
            <div className={styles.scanLabel}>Scan to download&nbsp;&nbsp;↑</div>
          </div>
        </div>
        <div className={styles.iphone}>
          <div className={styles.iphoneScreen}>
            <div className={styles.island} aria-hidden="true" />
            <video className={styles.mascot} autoPlay loop muted playsInline aria-label="DIY mascot">
              <source src={import.meta.env.BASE_URL + "videos/diy-mascot.webm"} type="video/webm" />
              <source src={import.meta.env.BASE_URL + "videos/diy-mascot.mp4"} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </CursorScreen>
  );
}
