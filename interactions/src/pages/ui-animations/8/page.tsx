
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page8.module.css";


export default function UIAnimations8() {
  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.stage}>
        <div className={styles.ipad}>
          <div className={styles.ipadScreen}>
            <img
              src={import.meta.env.BASE_URL + "images/chatdino-qr.svg"}
              alt="QR code to install ChatDino"
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
            <video className={styles.mascot} autoPlay loop muted playsInline aria-label="ChatDino mascot">
              <source src={import.meta.env.BASE_URL + "videos/chatdino-mascot.webm"} type="video/webm" />
              <source src={import.meta.env.BASE_URL + "videos/chatdino-mascot.mp4"} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </CursorScreen>
  );
}
