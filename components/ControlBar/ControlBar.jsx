"use client";

import styles from "./ControlBar.module.scss";

function IconStepBack() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <rect x="4" y="5" width="2.2" height="14" rx="0.5" />
      <path d="M19 5.5v13a1 1 0 0 1-1.53.85l-9-6.5a1 1 0 0 1 0-1.7l9-6.5A1 1 0 0 1 19 5.5z" />
    </svg>
  );
}

function IconStepForward() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <rect x="17.8" y="5" width="2.2" height="14" rx="0.5" />
      <path d="M5 5.5v13a1 1 0 0 0 1.53.85l9-6.5a1 1 0 0 0 0-1.7l-9-6.5A1 1 0 0 0 5 5.5z" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M7 5.3v13.4a1 1 0 0 0 1.52.85l10.6-6.7a1 1 0 0 0 0-1.7L8.52 4.45A1 1 0 0 0 7 5.3z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <rect x="6" y="5" width="4.4" height="14" rx="1" />
      <rect x="13.6" y="5" width="4.4" height="14" rx="1" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3.2-6.9" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function AlgorithmSelect({ algorithms, algorithmId, onSelect, disabled }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="algorithm-select">
        Algorithm
      </label>
      <div className={styles.selectWrap}>
        <select
          id="algorithm-select"
          className={styles.select}
          value={algorithmId}
          disabled={disabled}
          onChange={(e) => onSelect(e.target.value)}
        >
          {Object.values(algorithms).map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.label}
            </option>
          ))}
        </select>
        <svg className={styles.selectCaret} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

function SliderField({ label, value, displayValue, min, max, onChange, disabled }) {
  return (
    <div className={styles.field}>
      <div className={styles.sliderHeader}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{displayValue}</span>
      </div>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

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
  isRunning,
  onStepBack,
  onPlayPause,
  onStepForward,
  onRewind,
  onClearWalls,
  onResetBoard,
}) {
  const activeAlgorithm = algorithms[algorithmId];

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <AlgorithmSelect algorithms={algorithms} algorithmId={algorithmId} onSelect={onSelectAlgorithm} disabled={isRunning} />
        <SliderField
          label="Grid width"
          value={cols}
          displayValue={cols}
          min={colsMin}
          max={colsMax}
          onChange={onChangeGridWidth}
          disabled={isRunning}
        />
        <SliderField
          label="Speed"
          value={speed}
          displayValue={speed}
          min={1}
          max={100}
          onChange={onChangeSpeed}
          disabled={false}
        />
        <button type="button" className={styles.newButton} onClick={onGenerateMaze} disabled={isRunning}>
          Generate maze
        </button>
      </div>

      <p className={styles.description}>{activeAlgorithm.description}</p>

      <div className={styles.row}>
        <div className={styles.playback}>
          <button type="button" className={styles.iconButton} onClick={onStepBack} disabled={isRunning} aria-label="Step back">
            <IconStepBack />
          </button>
          <button type="button" className={styles.playButton} onClick={onPlayPause} aria-label={isRunning ? "Pause" : "Play"}>
            {isRunning ? <IconPause /> : <IconPlay />}
            <span>{isRunning ? "Pause" : "Play"}</span>
          </button>
          <button type="button" className={styles.iconButton} onClick={onStepForward} disabled={isRunning} aria-label="Step forward">
            <IconStepForward />
          </button>
          <button type="button" className={styles.resetButton} onClick={onRewind} disabled={isRunning}>
            <IconReset />
            <span>Reset</span>
          </button>
        </div>

        <div className={styles.boardActions}>
          <button type="button" className={styles.ghostButton} onClick={onClearWalls} disabled={isRunning}>
            Clear walls
          </button>
          <button type="button" className={styles.ghostButton} onClick={onResetBoard} disabled={isRunning}>
            Reset board
          </button>
        </div>
      </div>
    </div>
  );
}
