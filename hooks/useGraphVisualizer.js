"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createGrid,
  resetAlgorithmState,
  toggleWall,
  toggleWeight,
  moveEndpoint,
  getNodesInShortestPathOrder,
  findStartAndEnd,
} from "../lib/grid";
import { ALGORITHMS } from "../lib/algorithms";
import { recursiveDivisionWalls } from "../lib/maze";
import {
  ROWS,
  DEFAULT_COLS,
  COLS_MIN,
  COLS_MAX,
  WEIGHT_VALUE,
  DEFAULT_SPEED,
  speedToDelay,
  getStartPos,
  getEndPos,
} from "../lib/constants";

const EMPTY_RUN = {
  visitedIndex: new Map(),
  pathIndex: new Map(),
  visitedTotal: 0,
  pathTotal: 0,
  pathCost: 0,
  pathFound: null, // null = not yet run, true/false once known
};

export function useGraphVisualizer() {
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [board, setBoard] = useState(() => createGrid(ROWS, DEFAULT_COLS, getStartPos(DEFAULT_COLS), getEndPos(DEFAULT_COLS)));
  const [algorithmId, setAlgorithmId] = useState("bfs");
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [isRunning, setIsRunning] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [run, setRun] = useState(EMPTY_RUN);
  const [elapsedMs, setElapsedMs] = useState(0);

  const dragRef = useRef({ mode: null, paintValue: null, touched: null });
  const intervalRef = useRef(null);
  const runRef = useRef(run);
  runRef.current = run;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const resetRun = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setAnimationStep(0);
    setRun(EMPTY_RUN);
    setElapsedMs(0);
  }, [clearTimer]);

  // Runs the algorithm synchronously against the current board and stores
  // the resulting visited/path index maps, without starting the animation.
  const computeRun = useCallback(() => {
    const { start, end } = findStartAndEnd(board);
    if (!start || !end) return 0;

    const workingGrid = resetAlgorithmState(board);
    const startNode = workingGrid[start.row][start.col];
    const endNode = workingGrid[end.row][end.col];

    const algorithm = ALGORITHMS[algorithmId];
    const t0 = performance.now();
    const visitedOrder = algorithm.run(workingGrid, startNode, endNode);
    const reached = endNode.isVisited;
    const pathOrder = reached ? getNodesInShortestPathOrder(endNode) : [];
    const t1 = performance.now();

    const visitedIndex = new Map();
    visitedOrder.forEach((node, i) => visitedIndex.set(`${node.row}-${node.col}`, i));
    const pathIndex = new Map();
    pathOrder.forEach((node, i) => pathIndex.set(`${node.row}-${node.col}`, i));
    const pathCost = pathOrder.reduce((sum, node) => sum + (node.isStart ? 0 : node.weight || 1), 0);

    const nextRun = {
      visitedIndex,
      pathIndex,
      visitedTotal: visitedOrder.length,
      pathTotal: pathOrder.length,
      pathCost,
      pathFound: reached,
    };
    setRun(nextRun);
    setElapsedMs(t1 - t0);
    return visitedOrder.length + pathOrder.length;
  }, [algorithmId, board]);

  const startInterval = useCallback(
    (fromStep, totalSteps) => {
      clearTimer();
      let step = fromStep;
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        step += 1;
        setAnimationStep(step);
        if (step >= totalSteps) {
          clearTimer();
          setIsRunning(false);
        }
      }, speedToDelay(speedRef.current));
    },
    [clearTimer]
  );

  const updateBoard = useCallback(
    (updater) => {
      if (isRunning) return;
      setBoard(updater);
      resetRun();
    },
    [isRunning, resetRun]
  );

  const handleCellMouseDown = useCallback(
    (row, col, event) => {
      if (isRunning) return;
      const node = board[row][col];

      if (node.isStart) {
        dragRef.current = { mode: "start", paintValue: null, touched: null };
        return;
      }
      if (node.isEnd) {
        dragRef.current = { mode: "end", paintValue: null, touched: null };
        return;
      }

      const useWeight = event?.shiftKey;
      const key = `${row}-${col}`;

      if (useWeight) {
        const nextValue = !node.isWeight;
        dragRef.current = { mode: "weight", paintValue: nextValue, touched: new Set([key]) };
        setBoard((prev) => toggleWeight(prev, row, col, WEIGHT_VALUE));
      } else {
        const nextValue = !node.isWall;
        dragRef.current = { mode: "wall", paintValue: nextValue, touched: new Set([key]) };
        setBoard((prev) => toggleWall(prev, row, col));
      }
      resetRun();
    },
    [board, isRunning, resetRun]
  );

  const handleCellMouseEnter = useCallback(
    (row, col) => {
      if (isRunning) return;
      const { mode, paintValue, touched } = dragRef.current;
      if (!mode) return;
      const key = `${row}-${col}`;

      if (mode === "start" || mode === "end") {
        setBoard((prev) => {
          const { start, end } = findStartAndEnd(prev);
          const from = mode === "start" ? start : end;
          if (!from || (from.row === row && from.col === col)) return prev;
          if (prev[row][col].isStart || prev[row][col].isEnd) return prev;
          return moveEndpoint(prev, from.row, from.col, row, col, mode === "start" ? "isStart" : "isEnd");
        });
        resetRun();
        return;
      }

      if (!touched || touched.has(key)) return;
      const node = board[row][col];
      if (node.isStart || node.isEnd) return;
      touched.add(key);

      if (mode === "wall") {
        setBoard((prev) => {
          const target = prev[row][col];
          if (target.isStart || target.isEnd || target.isWall === paintValue) return prev;
          return toggleWall(prev, row, col);
        });
      } else if (mode === "weight") {
        setBoard((prev) => {
          const target = prev[row][col];
          if (target.isStart || target.isEnd || target.isWall || target.isWeight === paintValue) return prev;
          return toggleWeight(prev, row, col, WEIGHT_VALUE);
        });
      }
      resetRun();
    },
    [board, isRunning, resetRun]
  );

  const handleCellMouseUp = useCallback(() => {
    dragRef.current = { mode: null, paintValue: null, touched: null };
  }, []);

  const selectAlgorithm = useCallback(
    (id) => {
      if (isRunning) return;
      setAlgorithmId(id);
      resetRun();
    },
    [isRunning, resetRun]
  );

  const clearWalls = useCallback(() => {
    if (isRunning) return;
    setBoard((prev) =>
      prev.map((row) =>
        row.map((node) => ({ ...node, isWall: false, isWeight: false, weight: 1 }))
      )
    );
    resetRun();
  }, [isRunning, resetRun]);

  const resetBoard = useCallback(() => {
    if (isRunning) return;
    setBoard(createGrid(ROWS, cols, getStartPos(cols), getEndPos(cols)));
    resetRun();
  }, [isRunning, resetRun, cols]);

  const changeGridWidth = useCallback(
    (nextCols) => {
      if (isRunning) return;
      const clamped = Math.max(COLS_MIN, Math.min(COLS_MAX, nextCols));
      setCols(clamped);
      setBoard(createGrid(ROWS, clamped, getStartPos(clamped), getEndPos(clamped)));
      resetRun();
    },
    [isRunning, resetRun]
  );

  const generateMaze = useCallback(() => {
    if (isRunning) return;
    setBoard((prev) => {
      const { start, end } = findStartAndEnd(prev);
      const startPos = start ?? getStartPos(cols);
      const endPos = end ?? getEndPos(cols);
      const walls = recursiveDivisionWalls(ROWS, cols, startPos, endPos);
      return prev.map((row) =>
        row.map((node) => ({
          ...node,
          isWall: walls.has(`${node.row}-${node.col}`),
          isWeight: false,
          weight: 1,
        }))
      );
    });
    resetRun();
  }, [isRunning, resetRun, cols]);

  // Plays from scratch, or resumes/replays using an already-computed run.
  const playPause = useCallback(() => {
    if (isRunning) {
      clearTimer();
      setIsRunning(false);
      return;
    }

    const current = runRef.current;
    if (current.pathFound === null) {
      const totalSteps = computeRun();
      setAnimationStep(0);
      startInterval(0, totalSteps);
      return;
    }

    const totalSteps = current.visitedTotal + current.pathTotal;
    setAnimationStep((step) => {
      const from = step >= totalSteps ? 0 : step;
      startInterval(from, totalSteps);
      return from;
    });
  }, [isRunning, computeRun, startInterval, clearTimer]);

  const stepForward = useCallback(() => {
    if (isRunning) return;
    const current = runRef.current;
    const totalSteps =
      current.pathFound === null ? computeRun() : current.visitedTotal + current.pathTotal;
    setAnimationStep((s) => Math.min(s + 1, totalSteps));
  }, [isRunning, computeRun]);

  const stepBack = useCallback(() => {
    if (isRunning) return;
    if (runRef.current.pathFound === null) return;
    setAnimationStep((s) => Math.max(s - 1, 0));
  }, [isRunning]);

  const rewindAnimation = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setAnimationStep(0);
  }, [clearTimer]);

  const totalSteps = run.visitedTotal + run.pathTotal;
  const isComplete = !isRunning && run.pathFound !== null && animationStep >= totalSteps;

  return {
    board,
    rows: ROWS,
    cols,
    colsMin: COLS_MIN,
    colsMax: COLS_MAX,
    onChangeGridWidth: changeGridWidth,
    algorithmId,
    algorithms: ALGORITHMS,
    speed,
    setSpeed,
    isRunning,
    isComplete,
    animationStep,
    totalSteps,
    run,
    elapsedMs,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellMouseUp,
    selectAlgorithm,
    clearWalls,
    resetBoard,
    generateMaze,
    playPause,
    stepForward,
    stepBack,
    rewindAnimation,
  };
}
