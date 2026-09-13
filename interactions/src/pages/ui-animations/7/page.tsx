
import { PageNav } from "../PageNav";
import { CursorScreen } from "../CursorScreen";
import styles from "./page7.module.css";


export default function UIAnimations7() {
  return (
    <CursorScreen className={`${styles.screen} nunito`}>
      <PageNav />
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.avatar} aria-hidden="true">
            <video className={styles.avatarVideo} autoPlay loop muted playsInline>
              <source src={import.meta.env.BASE_URL + "videos/chatdino-mascot.webm"} type="video/webm" />
              <source src={import.meta.env.BASE_URL + "videos/chatdino-mascot.mp4"} type="video/mp4" />
            </video>
          </div>
          <div className={styles.cardBody}>
            <h2 className={styles.cardTitle}>Something to look at 👀</h2>
            <p className={styles.cardMsg}>
              Alex asked about <strong>Andrew Tate</strong>. I didn&apos;t answer, but{" "}
              <span className={styles.action}>it might be worth a chat</span>.
            </p>
            <div className={styles.cardMeta}>On iPad · Today at 4:12pm</div>
          </div>
        </div>
      </div>
    </CursorScreen>
  );
}
