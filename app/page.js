"use client";

import { useGraphVisualizer } from "../hooks/useGraphVisualizer";
import Grid from "../components/Grid/Grid";
import ControlBar from "../components/ControlBar/ControlBar";
import LegendBar from "../components/LegendBar/LegendBar";
import StatsReadout from "../components/StatsReadout/StatsReadout";
import InfoPanel from "../components/InfoPanel/InfoPanel";
import styles from "./page.module.scss";

export default function Home() {
  const v = useGraphVisualizer();
  const algoCount = Object.keys(v.algorithms).length;
  const activeAlgorithm = v.algorithms[v.algorithmId];

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Graph Algorithm Visualizer</p>
          <h1 className={styles.title}>
            Path<span className={styles.titleAccent}>Finder</span>
          </h1>
          <p className={styles.subtitle}>
            Watch BFS, DFS, Dijkstra, and A* explore a grid and settle on a route \u2014 one node at a time.
          </p>
        </div>
        <span className={styles.badge}>
          <span className={styles.badgeDot} />
          {algoCount} algorithms &middot; live playback
        </span>
      </header>

      <section className={styles.wrapper}>
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
          onClearWalls={v.clearWalls}
          isRunning={v.isRunning}
          isFinished={v.isComplete}
          onPlayPause={v.playPause}
          onStepBack={v.stepBack}
          onStepForward={v.stepForward}
          onReset={v.rewindAnimation}
        />

        <div className={styles.stage}>
          <LegendBar />
          <Grid
            board={v.board}
            run={v.run}
            animationStep={v.animationStep}
            onCellMouseDown={v.handleCellMouseDown}
            onCellMouseEnter={v.handleCellMouseEnter}
            onCellMouseUp={v.handleCellMouseUp}
          />
        </div>

        <StatsReadout
          run={v.run}
          animationStep={v.animationStep}
          totalSteps={v.totalSteps}
          elapsedMs={v.elapsedMs}
          isRunning={v.isRunning}
        />

        <InfoPanel algorithm={activeAlgorithm} />
      </section>
    </main>
  );
}
