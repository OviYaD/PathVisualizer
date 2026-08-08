import styles from "./LegendBar.module.scss";

const ITEMS = [
  { state: "idle", label: "unvisited" },
  { state: "wall", label: "wall" },
  { state: "weight", label: "weighted terrain" },
  { state: "frontier", label: "frontier" },
  { state: "visited", label: "visited" },
  { state: "path", label: "shortest path" },
  { state: "start", label: "start" },
  { state: "end", label: "end" },
];

export default function LegendBar() {
  return (
    <ul className={styles.legend}>
      {ITEMS.map((item) => (
        <li key={item.state} className={styles.item}>
          <span className={`${styles.swatch} ${styles[item.state]}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
