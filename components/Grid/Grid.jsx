"use client";

import { memo } from "react";
import styles from "./Grid.module.scss";

function getStatus(key, animationStep, run) {
  const pIdx = run.pathIndex.get(key);
  const vIdx = run.visitedIndex.get(key);

  if (pIdx !== undefined) {
    const pathTick = run.visitedTotal + pIdx + 1;
    if (animationStep >= pathTick) return "path";
  }
  if (vIdx !== undefined && animationStep >= vIdx + 1) {
    return animationStep === vIdx + 1 ? "frontier" : "visited";
  }
  return "idle";
}

const GridCell = memo(function GridCell({ node, status, onMouseDown, onMouseEnter }) {
  const { row, col, isStart, isEnd, isWall, isWeight, weight } = node;

  const classNames = [styles.cell];
  if (isWall) classNames.push(styles.wall);
  else if (isStart) classNames.push(styles.start);
  else if (isEnd) classNames.push(styles.end);
  else if (isWeight) classNames.push(styles.weight);

  if (!isStart && !isEnd && !isWall) {
    if (status === "path") classNames.push(styles.path);
    else if (status === "frontier") classNames.push(styles.frontier);
    else if (status === "visited") classNames.push(styles.visited);
  } else if (isStart || isEnd) {
    if (status === "path") classNames.push(styles.onPath);
  }

  return (
    <div
      className={classNames.join(" ")}
      onMouseDown={(e) => onMouseDown(row, col, e)}
      onMouseEnter={() => onMouseEnter(row, col)}
      role="gridcell"
      aria-label={
        isStart ? "Start node" : isEnd ? "End node" : isWall ? "Wall" : isWeight ? `Weighted terrain, cost ${weight}` : `Row ${row}, column ${col}`
      }
    >
      {isStart && <span className={styles.marker}>S</span>}
      {isEnd && <span className={styles.marker}>E</span>}
      {isWeight && !isStart && !isEnd && <span className={styles.weightMarker}>{weight}</span>}
    </div>
  );
});

export default function Grid({ board, run, animationStep, onCellMouseDown, onCellMouseEnter, onCellMouseUp }) {
  const cols = board[0]?.length ?? 0;

  return (
    <div
      className={styles.frame}
      onMouseLeave={onCellMouseUp}
      onMouseUp={onCellMouseUp}
    >
      <div
        className={styles.grid}
        role="grid"
        aria-label="Pathfinding grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {board.map((row) =>
          row.map((node) => {
            const key = `${node.row}-${node.col}`;
            const status = getStatus(key, animationStep, run);
            return (
              <GridCell
                key={key}
                node={node}
                status={status}
                onMouseDown={onCellMouseDown}
                onMouseEnter={onCellMouseEnter}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
