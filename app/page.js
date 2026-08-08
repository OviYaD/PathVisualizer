"use client";

import { useGraphVisualizer } from "../hooks/useGraphVisualizer";
import Grid from "../components/Grid/Grid";
import ControlBar from "../components/ControlBar/ControlBar";
import LegendBar from "../components/LegendBar/LegendBar";
import styles from "./page.module.scss";

export default function Home() {
  const v = useGraphVisualizer();
  const algoCount = Object.keys(v.algorithms).length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>Graph algorithm visualizer</p>
          <h1 className={styles.title}>
            Path<span className={styles.titleAccent}>Finder</span>
          </h1>
          <p className={styles.subtitle}>
            Watch BFS, DFS, Dijkstra, and A* explore a grid and settle on a route \u2014 one node at a time.
          </p>
        </div>
        <span className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          {algoCount} algorithms &middot; live playback
        </span>
      </header>

      <ControlBar
        algorithms={v.algorithms}
        algorithmId={v.algorithmId}
        onSelectAlgorithm={v.selectAlgorithm}
        cols={v.cols}
        colsMin={v.colsMin}
        colsMax={v.colsMax}
        onChangeGridWidth={v.onChangeGridWidth}
        speed={v.speed}
        onChangeSpeed={v.setSpeed}
        onGenerateMaze={v.generateMaze}
        isRunning={v.isRunning}
        onStepBack={v.stepBack}
        onPlayPause={v.playPause}
        onStepForward={v.stepForward}
        onRewind={v.rewindAnimation}
        onClearWalls={v.clearWalls}
        onResetBoard={v.resetBoard}
      />

      <div className={styles.metaRow}>
        <LegendBar />
        {v.run.pathFound !== null && (
          <div className={styles.stats}>
            <span>
              visited <strong>{v.run.visitedTotal}</strong>
            </span>
            <span>
              path <strong>{v.run.pathFound ? v.run.pathTotal - 1 : "\u2013"}</strong>
            </span>
            <span>
              cost <strong>{v.run.pathFound ? v.run.pathCost : "\u2013"}</strong>
            </span>
            <span>
              compute <strong>{v.elapsedMs.toFixed(2)} ms</strong>
            </span>
            {!v.run.pathFound && v.isComplete && <span className={styles.noPath}>no path found</span>}
          </div>
        )}
      </div>

      <section className={styles.gridArea}>
        <Grid
          board={v.board}
          run={v.run}
          animationStep={v.animationStep}
          isRunning={v.isRunning}
          onCellMouseDown={v.handleCellMouseDown}
          onCellMouseEnter={v.handleCellMouseEnter}
          onCellMouseUp={v.handleCellMouseUp}
        />
        <p className={styles.gridHint}>
          Drag empty cells to draw walls &middot; hold Shift and drag for weighted terrain &middot; drag S or E to move them
        </p>
      </section>
    </main>
  );
}
