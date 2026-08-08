"use client";

import styles from "./ControlBar.module.scss";

export default function ControlBar({
  algorithms,
  algorithmId,
  onSelectAlgorithm,
  cols,
  colsMin,
  colsMax,
  onChangeGridWidth,
  speed,
  onChangeSpeed,
  onGenerateMaze,
  onClearWalls,
  isRunning,
  isFinished,
  onPlayPause,
  onStepBack,
  onStepForward,
  onReset,
}) {
  return (
    <div className={styles.deck}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>algorithm</span>
          <select
            className={styles.select}
            value={algorithmId}
            disabled={isRunning}
            onChange={(e) => onSelectAlgorithm(e.target.value)}
          >
            {Object.values(algorithms).map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            grid width <span className={styles.fieldValue}>{cols}</span>
          </span>
          <input
            className={styles.slider}
            type="range"
            min={colsMin}
            max={colsMax}
            value={cols}
            disabled={isRunning}
            onChange={(e) => onChangeGridWidth(Number(e.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            speed <span className={styles.fieldValue}>{speed}</span>
          </span>
          <input
            className={styles.slider}
            type="range"
            min={1}
            max={100}
            value={speed}
            onChange={(e) => onChangeSpeed(Number(e.target.value))}
          />
        </label>

        <button type="button" className={styles.ghostButton} onClick={onGenerateMaze} disabled={isRunning}>
          New maze
        </button>
        <button type="button" className={styles.ghostButton} onClick={onClearWalls} disabled={isRunning}>
          Clear walls
        </button>
      </div>

      <div className={styles.transport}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onStepBack}
          disabled={isRunning}
          aria-label="Step back"
        >
          {"\u23ee"}
        </button>
        <button type="button" className={styles.primaryButton} onClick={onPlayPause} disabled={isFinished && !isRunning}>
          {isRunning ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onStepForward}
          disabled={isRunning}
          aria-label="Step forward"
        >
          {"\u23ed"}
        </button>
        <button type="button" className={styles.ghostButton} onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
