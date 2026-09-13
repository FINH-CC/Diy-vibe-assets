
import { useState, type ReactNode } from "react";
import styles from "./CursorScreen.module.css";

const CURSOR_ON =
  "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"67\" height=\"67\" viewBox=\"0 0 100 100\" fill=\"white\" stroke=\"black\" stroke-width=\"7.5\" stroke-linejoin=\"round\"><path d=\"M24 8.5L24 79.5Q24 82 25.8 80.3L41.9 65Q43 64 43.7 65.3L58.6 93.4Q60 96 62.7 94.6L69.8 90.8Q72.4 89.4 71 86.8L55.9 58.3Q55.2 57 56.7 57.2L81.5 59.7Q85 60 82.4 57.7L25.9 7.7Q24 6 24 8.5Z\"/></svg>') 14 2, auto";

const CURSOR_OFF =
  "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1\" height=\"1\"><rect width=\"1\" height=\"1\" fill=\"black\"/></svg>') 0 0, auto";

export function CursorScreen({ className, children }: { className: string; children: ReactNode }) {
  const [cursorOn, setCursorOn] = useState(true);

  return (
    <div
      className={className}
      style={{
        ["--cursor-page" as string]: cursorOn ? CURSOR_ON : CURSOR_OFF,
        ["--cursor-btn" as string]: cursorOn ? CURSOR_ON : CURSOR_OFF,
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={cursorOn}
        aria-label="Toggle custom cursor"
        className={styles.toggle}
        data-on={cursorOn}
        onClick={() => setCursorOn((v) => !v)}
      >
        <span className={styles.knob} />
      </button>
      {children}
    </div>
  );
}
