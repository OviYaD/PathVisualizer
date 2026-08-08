"use client";

import styles from "./StatsReadout.module.scss";

function formatMs(ms) {
  if (!ms) return "0 ms";
  return ms < 1 ? "<1 ms" : `${ms.toFixed(2)} ms`;
}

export default function StatsReadout({ run, animationStep, totalSteps, elapsedMs, isRunning }) {
  const hasRun = run.pathFound !== null;
  const isDone = hasRun && !isRunning && animationStep >= totalSteps;
  const progress = totalSteps > 0 ? (animationStep / totalSteps) * 100 : 0;

  let statusLabel = "idle";
  if (isRunning) statusLabel = "running";
  else if (isDone) statusLabel = run.pathFound ? "found" : "no path";

  return (
    <div className={styles.readout}>
      <div className={styles.metric}>
        <span className={styles.label}>visited nodes</span>
        <span className={styles.value}>{run.visitedTotal}</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.label}>path length</span>
        <span className={styles.value}>{run.pathFound ? run.pathTotal - 1 : "\u2013"}</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.label}>path cost</span>
        <span className={styles.value}>{run.pathFound ? run.pathCost : "\u2013"}</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.label}>compute time</span>
        <span className={styles.value}>{hasRun ? formatMs(elapsedMs) : "\u2013"}</span>
      </div>
      <div className={`${styles.metric} ${styles.status}`}>
        <span className={styles.label}>status</span>
        <span className={styles.value}>
          {statusLabel}
          <span className={`${styles.dot} ${isRunning ? styles.dotLive : isDone ? styles.dotDone : ""}`} />
        </span>
      </div>
      <div className={styles.progressRow}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressText}>
          step {totalSteps === 0 ? 0 : Math.min(animationStep, totalSteps)} / {totalSteps}
        </span>
      </div>
    </div>
  );
}
