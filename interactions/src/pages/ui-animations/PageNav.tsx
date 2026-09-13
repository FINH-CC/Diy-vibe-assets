import { useLocation, Link } from "react-router-dom";
import styles from "./PageNav.module.css";

const PAGES = Array.from({ length: 17 }, (_, i) => ({
  n: i + 1,
  href: i === 0 ? "/" : `/${i + 1}`,
}));

export function PageNav() {
  const location = useLocation();

  return (
    <div className={styles.nav}>
      {PAGES.map((page, i) => (
        <span key={page.n}>
          {i > 0 && <span className={styles.sep}> / </span>}
          <Link
            to={page.href}
            className={location.pathname === page.href ? styles.active : styles.inactive}
          >
            {page.n}
          </Link>
        </span>
      ))}
    </div>
  );
}
