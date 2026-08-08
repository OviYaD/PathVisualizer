import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { astar } from "./astar";

export const ALGORITHMS = {
  bfs: {
    id: "bfs",
    label: "Breadth-First Search",
    short: "BFS",
    run: bfs,
    weighted: false,
    guaranteesShortest: true,
    description:
      "Explores the grid in expanding rings, one step at a time. Guarantees the fewest-steps path but ignores terrain cost.",
  },
  dfs: {
    id: "dfs",
    label: "Depth-First Search",
    short: "DFS",
    run: dfs,
    weighted: false,
    guaranteesShortest: false,
    description:
      "Commits to a single branch and follows it to its limit before backtracking. Finds a path, not necessarily the shortest one.",
  },
  dijkstra: {
    id: "dijkstra",
    label: "Dijkstra's Algorithm",
    short: "Dijkstra",
    run: dijkstra,
    weighted: true,
    guaranteesShortest: true,
    description:
      "Always expands the closest unvisited node. Guarantees the lowest-cost path and respects weighted terrain.",
  },
  astar: {
    id: "astar",
    label: "A* Search",
    short: "A*",
    run: astar,
    weighted: true,
    guaranteesShortest: true,
    description:
      "Dijkstra plus a distance-to-goal estimate, so it beelines toward the target. Guarantees the lowest-cost path, usually faster.",
  },
};

export const ALGORITHM_ORDER = ["bfs", "dfs", "dijkstra", "astar"];
