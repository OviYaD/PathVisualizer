"use client";

import styles from "./Sidebar.module.scss";

function AlgorithmTabs({ algorithms, algorithmId, onSelect, disabled }) {
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>Algorithm</h2>
      <div className={styles.tabs} role="tablist" aria-label="Choose an algorithm">
        {Object.values(algorithms).map((algo) => (
          <button
            key={algo.id}
            type="button"
            role="tab"
            aria-selected={algorithmId === algo.id}
            className={`${styles.tab} ${algorithmId === algo.id ? styles.tabActive : ""}`}
            onClick={() => onSelect(algo.id)}
            disabled={disabled}
          >
            {algo.short}
          </button>
        ))}
      </div>
      <p className={styles.description}>{algorithms[algorithmId].description}</p>
      {!algorithms[algorithmId].weighted && (
        <p className={styles.hint}>Ignores weighted terrain \u2014 every step costs the same.</p>
      )}
    </div>
  );
}

function SpeedControl({ speedLevel, speedLevels, onChange, disabled }) {
  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>Speed</h2>
        <span className={styles.speedLabel}>{speedLevels.find((s) => s.level === speedLevel)?.label}</span>
      </div>
      <input
        type="range"
        min={1}
        max={speedLevels.length}
        step={1}
        value={speedLevel}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={styles.slider}
        aria-label="Animation speed"
      />
    </div>
  );
}

function BoardActions({ onRun, onStop, onClearWalls, onGenerateMaze, onResetBoard, isRunning }) {
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>Board</h2>
      <button type="button" className={styles.primaryButton} onClick={isRunning ? onStop : onRun}>
        {isRunning ? "Stop" : "Visualize"}
      </button>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.secondaryButton} onClick={onGenerateMaze} disabled={isRunning}>
          Generate maze
        </button>
        <button type="button" className={styles.secondaryButton} onClick={onClearWalls} disabled={isRunning}>
          Clear walls
        </button>
      </div>
      <button type="button" className={styles.ghostButton} onClick={onResetBoard} disabled={isRunning}>
        Reset board
      </button>
    </div>
  );
}

function Legend() {
  const items = [
    { swatch: "start", label: "Start" },
    { swatch: "end", label: "End" },
    { swatch: "wall", label: "Wall" },
    { swatch: "weight", label: "Weighted terrain" },
    { swatch: "frontier", label: "Frontier (just found)" },
    { swatch: "visited", label: "Visited" },
    { swatch: "path", label: "Shortest path" },
  ];
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>Legend</h2>
      <ul className={styles.legendList}>
        {items.map((item) => (
          <li key={item.swatch} className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles[item.swatch]}`} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
      <p className={styles.hint}>Drag on empty cells to draw walls. Hold Shift and drag to paint weighted terrain. Drag S or E to move them.</p>
    </div>
  );
}

function StatsPanel({ run, elapsedMs, isRunning, isComplete }) {
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>Stats</h2>
      <dl className={styles.statsGrid}>
        <div className={styles.statItem}>
          <dt>Visited</dt>
          <dd>{run.visitedTotal}</dd>
        </div>
        <div className={styles.statItem}>
          <dt>Path length</dt>
          <dd>{run.pathFound ? run.pathTotal : "\u2013"}</dd>
        </div>
        <div className={styles.statItem}>
          <dt>Path cost</dt>
          <dd>{run.pathFound ? run.pathCost : "\u2013"}</dd>
        </div>
        <div className={styles.statItem}>
          <dt>Compute time</dt>
          <dd>{elapsedMs ? `${elapsedMs.toFixed(2)} ms` : "\u2013"}</dd>
        </div>
      </dl>
      {isComplete && !run.pathFound && (
        <p className={styles.warning}>No path exists \u2014 the end node is walled off.</p>
      )}
      {isComplete && run.pathFound && (
        <p className={styles.success}>Path found in {run.pathTotal - 1} steps.</p>
      )}
      {isRunning && <p className={styles.hint}>Running\u2026</p>}
    </div>
  );
}

export default function Sidebar({
  algorithms,
  algorithmId,
  onSelectAlgorithm,
  speedLevel,
  speedLevels,
  onSpeedChange,
  isRunning,
  isComplete,
  run,
  elapsedMs,
  onRun,
  onStop,
  onClearWalls,
  onGenerateMaze,
  onResetBoard,
}) {
  return (
    <aside className={styles.sidebar} aria-label="Controls">
      <AlgorithmTabs algorithms={algorithms} algorithmId={algorithmId} onSelect={onSelectAlgorithm} disabled={isRunning} />
      <SpeedControl speedLevel={speedLevel} speedLevels={speedLevels} onChange={onSpeedChange} disabled={isRunning} />
      <BoardActions
        onRun={onRun}
        onStop={onStop}
        onClearWalls={onClearWalls}
        onGenerateMaze={onGenerateMaze}
        onResetBoard={onResetBoard}
        isRunning={isRunning}
      />
      <StatsPanel run={run} elapsedMs={elapsedMs} isRunning={isRunning} isComplete={isComplete} />
      <Legend />
    </aside>
  );
}
