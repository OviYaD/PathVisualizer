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
    optimal: true,
    description:
      "Explores the grid in expanding rings, one step at a time. Guarantees the fewest-steps path but ignores terrain cost.",
    complexity: { time: "V + E", space: "V" },
    pseudocode: [
      "queue = [start]",
      "visited = { start }",
      "while queue not empty:",
      "  node = queue.pop_front()",
      "  if node == end: return path",
      "  for neighbor in neighbors(node):",
      "    if neighbor not in visited:",
      "      visited.add(neighbor)",
      "      neighbor.parent = node",
      "      queue.push_back(neighbor)",
    ],
  },
  dfs: {
    id: "dfs",
    label: "Depth-First Search",
    short: "DFS",
    run: dfs,
    weighted: false,
    optimal: false,
    description:
      "Commits to a single branch and follows it to its limit before backtracking. Finds a path, not necessarily the shortest one.",
    complexity: { time: "V + E", space: "V" },
    pseudocode: [
      "function visit(node):",
      "  if node in visited: return false",
      "  visited.add(node)",
      "  if node == end: return true",
      "  for neighbor in neighbors(node):",
      "    neighbor.parent = node",
      "    if visit(neighbor): return true",
      "  return false",
      "",
      "visit(start)",
    ],
  },
  dijkstra: {
    id: "dijkstra",
    label: "Dijkstra's Algorithm",
    short: "Dijkstra",
    run: dijkstra,
    weighted: true,
    optimal: true,
    description:
      "Always expands the closest unvisited node. Guarantees the lowest-cost path and respects weighted terrain.",
    complexity: { time: "(V + E) log V", space: "V" },
    pseudocode: [
      "dist[start] = 0, all others = infinity",
      "pq = all nodes, ordered by dist",
      "while pq not empty:",
      "  node = pq.extract_min(dist)",
      "  if node == end: return path",
      "  for neighbor in neighbors(node):",
      "    alt = dist[node] + weight(node, neighbor)",
      "    if alt < dist[neighbor]:",
      "      dist[neighbor] = alt",
      "      neighbor.parent = node",
    ],
  },
  astar: {
    id: "astar",
    label: "A* Search",
    short: "A*",
    run: astar,
    weighted: true,
    optimal: true,
    description:
      "Dijkstra plus a distance-to-goal estimate, so it beelines toward the target. Guarantees the lowest-cost path, usually faster.",
    complexity: { time: "E", space: "V" },
    pseudocode: [
      "g[start] = 0, f[start] = h(start, end)",
      "open = { start }",
      "while open not empty:",
      "  node = open.extract_min(f)",
      "  if node == end: return path",
      "  for neighbor in neighbors(node):",
      "    tentative_g = g[node] + weight(node, neighbor)",
      "    if tentative_g < g[neighbor]:",
      "      neighbor.parent = node",
      "      g[neighbor] = tentative_g",
      "      f[neighbor] = tentative_g + h(neighbor, end)",
    ],
  },
};

export const ALGORITHM_ORDER = ["bfs", "dfs", "dijkstra", "astar"];
