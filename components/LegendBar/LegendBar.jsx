"use client";

import styles from "./LegendBar.module.scss";

const ITEMS = [
  { key: "start", label: "start" },
  { key: "end", label: "end" },
  { key: "wall", label: "wall" },
  { key: "weight", label: "weighted" },
  { key: "frontier", label: "frontier" },
  { key: "visited", label: "visited" },
  { key: "path", label: "path" },
];

export default function LegendBar() {
  return (
    <div className={styles.bar} role="list" aria-label="Cell state legend">
      {ITEMS.map((item) => (
        <span key={item.key} className={styles.pill} role="listitem">
          <span className={`${styles.dot} ${styles[item.key]}`} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}
